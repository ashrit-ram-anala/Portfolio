import { Contact, Education, Experience, Intro, Projects, Stack } from "@/components/Sections";
import { CraneDrop } from "@/components/CraneDrop";
import { Lighthouse } from "@/components/Lighthouse";
import { MountainRange } from "@/components/MountainRange";
import { DuskLighting, RisingBubbles } from "@/components/OceanAtmosphere";
import { Shoreline } from "@/components/Shoreline";
import { Wildlife } from "@/components/OceanMotion";

export default function Home() {
  return (
    <main id="top" className="ocean">
      <DuskLighting />
      <div className="surface-world">
        <CraneDrop />
        <div className="habitat sky">
          <div className="sky-clouds" aria-hidden="true"><span /><span /><span /></div>
          <Wildlife animal="cranes" />
          <Wildlife animal="butterflies" />
          <Intro />
        </div>
        <div className="habitat lake">
          <MountainRange />
          <Lighthouse />
          <Wildlife animal="ducks" />
          <Experience />
        </div>
      </div>
      <div className="below-surface">
        <RisingBubbles />
        <div className="habitat open-water">
          <div className="rays" aria-hidden="true" />
          <Wildlife animal="koi" />
          <Projects />
        </div>
        <div className="habitat deep-water">
          <Wildlife animal="jellyfish" />
          <Education />
          <Stack />
        </div>
      </div>
      <div className="habitat seabed">
        <Shoreline />
        <Wildlife animal="crabs" />
        <Contact />
      </div>
    </main>
  );
}
