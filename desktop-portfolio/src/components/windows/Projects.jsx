/*
  Projects Window Content

  I wanted this to feel like browsing through a file explorer, but
  instead of files you're looking at project cards. Each card has a
  screenshot area, title, description, the tech I used, and links
  to the live site and GitHub repo(s).

  The projects data is stored in a simple array at the top so it's
  easy to add or remove projects later. Just update the array and
  the grid handles the rest.

  Some projects have separate frontend and backend repos, so the
  githubUrls field is an array of objects with a label and url.
*/

// My actual projects - add more as I build them
const PROJECTS = [
  {
    id: 1,
    title: 'CardVault',
    description:
      'A full-stack TCG marketplace where users can browse, buy, and sell trading cards. Features card scanning via Google Cloud Vision API, image uploads with Cloudinary, and real-time card data from the PokemonTCG and TCGdex APIs. Includes user authentication with Auth0 and JWT.',
    tech: [
      'React',
      'Node.js',
      'Express',
      'MongoDB',
      'Auth0',
      'JWT',
      'Cloudinary',
      'Google Cloud Vision',
    ],
    image: '/cv_home.png',
    liveUrl: 'https://card-vault-teal.vercel.app/',
    githubUrls: [
      { label: 'Frontend', url: 'https://github.com/Vierbytes/card-vault' },
      { label: 'Backend', url: 'https://github.com/Vierbytes/card-vault-be' },
    ],
  },
];

function Projects() {
  return (
    <div className="projects">
      {/* Header area - like the address bar in a file explorer */}
      <div className="projects__header">
        <span className="projects__path">📁 /home/projects/</span>
        <span className="projects__count">
          {PROJECTS.length} {PROJECTS.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Project cards grid */}
      <div className="projects__grid">
        {PROJECTS.map((project) => (
          <div key={project.id} className="project-card">
            {/* Project screenshot */}
            <div className="project-card__image">
              {project.image ? (
                <img
                  src={project.image}
                  alt={`${project.title} screenshot`}
                  className="project-card__img"
                />
              ) : (
                <span className="project-card__image-placeholder">📷</span>
              )}
            </div>

            <div className="project-card__body">
              <h3 className="project-card__title">{project.title}</h3>
              <p className="project-card__description">{project.description}</p>

              {/* Tech tags */}
              <div className="project-card__tech">
                {project.tech.map((tech) => (
                  <span key={tech} className="project-card__tag">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links to live site and GitHub repos */}
              <div className="project-card__links">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card__link"
                >
                  🔗 Live Site
                </a>
                {project.githubUrls.map((repo) => (
                  <a
                    key={repo.label}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card__link"
                  >
                    💻 {repo.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
