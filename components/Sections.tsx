import { education, experience, profile, projects, stack } from "./data";
import { ExperienceRow } from "./ExperienceRow";
import { Logo } from "./Logo";
import { ProjectRow } from "./ProjectRow";
import { Socials } from "./Socials";

function SectionHead({ title }: { title: string }) {
  return (
    <header className="sec-head">
      <h2>{title}</h2>
    </header>
  );
}

export function Intro() {
  return (
    <section className="sec sec-intro" aria-label="Introduction">
      <div className="wrap">
        <h1 className="name">{profile.name}</h1>
        <p className="lede">{profile.tagline}</p>
        <Socials />
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section className="sec" id="experience" aria-label="Experience">
      <div className="wrap">
        <SectionHead title="Experience" />
        <ol className="xp-list">
          {experience.map((e) => (
            <ExperienceRow key={`${e.company}-${e.year}`} e={e} />
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Projects() {
  return (
    <section className="sec" id="projects" aria-label="Projects">
      <div className="wrap">
        <SectionHead title="Projects" />
        <ul className="proj">
          {projects.map((p) => (
            <ProjectRow key={p.name} p={p} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section className="sec" id="education" aria-label="Education">
      <div className="wrap">
        <SectionHead title="Education" />
        <div className="edu water-glass" data-wildlife-glass>
          <header className="edu-identity">
            <span className="edu-seal" aria-hidden="true" />
            <div>
              <h3 className="edu-school">{education.school}</h3>
              <p className="edu-degree">{education.degree} · {education.honors}</p>
              <p className="edu-college">{education.college}</p>
            </div>
          </header>
          <div className="edu-details">
            <div className="edu-entry">
              <h4 className="edu-label">Coursework</h4>
              <ul className="edu-courses">
                {education.coursework.map((course) => <li key={course}>{course}</li>)}
              </ul>
            </div>
            <div className="edu-entry">
              <h4 className="edu-label">Involved in</h4>
              <ul className="edu-orgs">
                {education.organizations.map((organization) => <li key={organization}>{organization}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Stack() {
  return (
    <section className="sec" id="stack" aria-label="Stack">
      <div className="wrap">
        <SectionHead title="Stack" />
        <div className="stack">
          {stack.map((g) => (
            <div className="stack-group water-glass" key={g.group} data-wildlife-glass>
              <h3 className="stack-label">{g.group}</h3>
              <ul className="stack-grid">
                {g.items.map((it) => (
                  <li key={it.name}>
                    <Logo name={it.logo} layer="base" className="stack-logo" />
                    <span className="stack-name">{it.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="sec" id="contact" aria-label="Contact">
      <div className="wrap">
        <SectionHead title="Let’s talk." />
        <p className="contact-links">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
      </div>
    </section>
  );
}
