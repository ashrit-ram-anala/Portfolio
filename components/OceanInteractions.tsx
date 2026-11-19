"use client";

import { useEffect, useRef } from "react";
import { sandCuriosity } from "@/lib/sand-curiosity";
import { waveEdge } from "@/lib/shoreline";

type Grain = { x: number; y: number; born: number; seed: number };

export function OceanInteractions() {
  const marker = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const ocean = marker.current?.parentElement;
    const beach = ocean?.querySelector<HTMLElement>(".seabed");
    const deep = ocean?.querySelector<HTMLElement>(".deep-water");
    if (!ocean || !beach || !deep) return;
    const sand = document.createElement("canvas");
    const wake = document.createElement("canvas");
    sand.className = "sand-drawing";
    wake.className = "bioluminescence";
    for (const canvas of [sand,wake]) {
      canvas.setAttribute("aria-hidden","true");
      canvas.style.pointerEvents="none";
    }
    beach.append(sand);
    deep.append(wake);
    const sandCtx=sand.getContext("2d"), wakeCtx=wake.getContext("2d");
    if(!sandCtx||!wakeCtx) {sand.remove();wake.remove();return;}
    let grains: Grain[]=[];
    let lights: Grain[]=[];
    let particles: Grain[]=[];
    let previous: {x:number;y:number}|undefined;
    let dragging=false,frame=0,last=0;
    let tide=0;
    const reduced=matchMedia("(prefers-reduced-motion: reduce)");
    const wash=(e:Event)=>{tide=(e as CustomEvent<number>).detail;};
    beach.addEventListener("shore-tide",wash);
    const blocked=(target:EventTarget|null)=>target instanceof Element&&!!target.closest("a,button,input,textarea,select,[data-wildlife-glass],.edu,.proj,.stack-group");
    const move=(e:PointerEvent)=>{
      if(blocked(e.target)){previous=undefined;return;}
      const b=beach.getBoundingClientRect();
      const shore=beach.querySelector(".shoreline")?.getBoundingClientRect();
      const x=e.clientX-b.left,y=e.clientY-b.top;
      if(dragging&&shore&&x>=0&&x<b.width&&y>=waveEdge(x,shore.height,tide)+5&&y<b.height){
        const start=previous??{x,y};
        const distance=Math.hypot(x-start.x,y-start.y);
        for(let s=0;s<=distance;s+=3){
          const p=distance?s/distance:0;
          grains.push({x:Math.round((start.x+(x-start.x)*p)/3)*3,y:Math.round((start.y+(y-start.y)*p)/3)*3,born:performance.now(),seed:0});
        }
        if (!reduced.matches) {
          const born = performance.now();
          for (let i=0;i<4;i++) particles.push({x,y,born,seed:Math.random()});
          if (particles.length>120) particles.splice(0,particles.length-120);
        }
        sandCuriosity.lastDraw=performance.now();
        previous={x,y};
        if(grains.length>6000)grains.splice(0,grains.length-6000);
      }else previous=undefined;
      const d=deep.getBoundingClientRect();
      if(!reduced.matches&&e.clientY>=d.top&&e.clientY<d.bottom){
        for(let i=0;i<3;i++)lights.push({x:e.clientX-d.left+(Math.random()-.5)*9,y:e.clientY-d.top+(Math.random()-.5)*9,born:performance.now(),seed:Math.random()});
        if(lights.length>240)lights.splice(0,lights.length-240);
      }
    };
    const down=(e:PointerEvent)=>{if(e.button===0&&!blocked(e.target)){dragging=true;previous=undefined;move(e);}};
    const up=()=>{dragging=false;previous=undefined;};
    const resize=()=>{
      sand.width=beach.clientWidth;sand.height=beach.clientHeight;
      wake.width=deep.clientWidth;wake.height=deep.clientHeight;
    };
    const size=new ResizeObserver(resize);size.observe(beach);size.observe(deep);resize();
    const draw=(now:number)=>{
      if(now-last>40){
        last=now;
        const shoreHeight=beach.querySelector(".shoreline")?.clientHeight??168;
        grains=grains.filter(g=>g.y>waveEdge(g.x,shoreHeight,tide)+2);
        sandCuriosity.marks=grains;
        sandCtx.clearRect(0,0,sand.width,sand.height);
        for(const g of grains){
          sandCtx.fillStyle="#ad895c";sandCtx.fillRect(g.x,g.y,3,3);
          sandCtx.fillStyle="#efd5aa";sandCtx.fillRect(g.x,g.y+3,3,1);
        }
        particles=particles.filter(p=>now-p.born<580);
        for(const p of particles){
          const age=(now-p.born)/1000;
          const angle=p.seed*Math.PI*2;
          const speed=16+p.seed*24;
          const x=Math.round(p.x+Math.cos(angle)*speed*age);
          const y=Math.round(p.y-Math.abs(Math.sin(angle))*speed*age+age*age*62);
          if(y<=waveEdge(x,shoreHeight,tide)+2)continue;
          sandCtx.globalAlpha=Math.max(0,1-age/.58);
          sandCtx.fillStyle=p.seed>.5?"#f5dfb6":"#b58c59";
          sandCtx.fillRect(x,y,p.seed>.7?2:1,2);
        }
        sandCtx.globalAlpha=1;
        wakeCtx.clearRect(0,0,wake.width,wake.height);
        lights=lights.filter(g=>now-g.born<1900);
        for(const g of lights){
          const age=(now-g.born)/1900;
          wakeCtx.globalAlpha=(1-age)**2*.65;
          const drift=age*12;
          const x=Math.round((g.x+Math.sin(g.seed*30)*drift)/2)*2;
          const y=Math.round((g.y-drift)/2)*2;
          wakeCtx.fillStyle=g.seed>.5?"#87f3e5":"#5baedd";
          wakeCtx.fillRect(x,y,age>.45?2:3,age>.45?2:3);
        }
      }
      frame=requestAnimationFrame(draw);
    };
    frame=requestAnimationFrame(draw);
    window.addEventListener("pointerdown",down);window.addEventListener("pointermove",move);
    window.addEventListener("pointerup",up);window.addEventListener("pointercancel",up);window.addEventListener("blur",up);
    return()=>{
      sandCuriosity.marks=[];sandCuriosity.owner=null;
      cancelAnimationFrame(frame);size.disconnect();sand.remove();wake.remove();
      beach.removeEventListener("shore-tide",wash);
      window.removeEventListener("pointerdown",down);window.removeEventListener("pointermove",move);
      window.removeEventListener("pointerup",up);window.removeEventListener("pointercancel",up);window.removeEventListener("blur",up);
    };
  },[]);
  return <span ref={marker} hidden/>;
}

export function LocalNight() {
  useEffect(()=>{
    const root=document.documentElement;
    const sync=()=>{
      const hour=new Date().getHours();
      root.dataset.oceanNight=String(hour>=18||hour<6);
    };
    sync();
    const timer=window.setInterval(sync,60000);
    document.addEventListener("visibilitychange",sync);
    return()=>{clearInterval(timer);document.removeEventListener("visibilitychange",sync);delete root.dataset.oceanNight;};
  },[]);
  return <div className="night-sky" aria-hidden="true"><div className="night-stars"/></div>;
}
