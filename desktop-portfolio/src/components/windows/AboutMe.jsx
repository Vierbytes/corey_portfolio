/*
  About Me Window Content

  This is the first thing people will probably open, so I want it to
  feel personal and welcoming. It's set up like a little profile card
  with my photo, name, bio, and links to my socials.

  I went with a simple layout - photo on the left, text on the right.
  On smaller windows it should still look okay since the content flows
  naturally.
*/

function AboutMe() {
  return (
    <div className="about-me">
      {/* Profile section - photo and basic info */}
      <div className="about-me__profile">
        <div className="about-me__photo">
          {/* Looping video instead of a static headshot - adds some personality */}
          <video
            className="about-me__video"
            src="/smile.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        <div className="about-me__info">
          <h1 className="about-me__name">Corey Lindsey</h1>
          <p className="about-me__title">Software Engineer</p>

          {/* Quick links to socials */}
          <div className="about-me__links">
            <a
              href="https://github.com/vierbytes"
              target="_blank"
              rel="noopener noreferrer"
              className="about-me__link"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/coreyrlindsey/"
              target="_blank"
              rel="noopener noreferrer"
              className="about-me__link"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Bio section */}
      <div className="about-me__bio">
        <h2 className="about-me__section-title">About Me</h2>
        <p>
          Entry-level Software Engineer with 8+ years of hands-on systems
          engineering experience, transitioning from enterprise IT to software
          development. I have a strong foundation in computer science
          fundamentals, Python development, and automation.
        </p>
        <p>
          I've spent years building reliable tools and services that improve
          developer productivity and system performance at scale; managing
          60,000+ servers and maintaining 99.99% uptime in mission-critical
          financial environments. Now I'm channeling that experience into
          full-stack web development.
        </p>
        <p>
          Currently a student at Per Scholas, focused on building modern web
          applications with JavaScript, React, and Node.js. Based in Atlanta, GA.
        </p>
      </div>

      {/* Quick stats */}
      <div className="about-me__highlights">
        <div className="about-me__highlight">
          <span className="about-me__highlight-value">8+</span>
          <span className="about-me__highlight-label">Years in Tech</span>
        </div>
        <div className="about-me__highlight">
          <span className="about-me__highlight-value">60K+</span>
          <span className="about-me__highlight-label">Servers Managed</span>
        </div>
        <div className="about-me__highlight">
          <span className="about-me__highlight-value">99.99%</span>
          <span className="about-me__highlight-label">Uptime Record</span>
        </div>
      </div>
    </div>
  );
}

export default AboutMe;
