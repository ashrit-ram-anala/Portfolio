import { Contact, Education, Experience, Intro, Projects, Stack } from "@/components/Sections";
import { MountainRange } from "@/components/MountainRange";
import { Shoreline } from "@/components/Shoreline";
import { Wildlife } from "@/components/OceanMotion";

export default function Home() {
  return (
    <main id="top" className="ocean">
      <div className="habitat sky">
        <div className="sky-clouds" aria-hidden="true"><span /><span /><span /></div>
        <Wildlife animal="cranes" />
        <Wildlife animal="butterflies" />
        <Intro />
      </div>
      <div className="habitat lake">
        <MountainRange />
        <Wildlife animal="ducks" />
        <Experience />
      </div>
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
      <div className="habitat seabed">
        <Shoreline />
        <Wildlife animal="crabs" />
        <Contact />
      </div>
    </main>
  );
}
