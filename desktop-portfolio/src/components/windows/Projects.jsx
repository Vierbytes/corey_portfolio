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

// Portfolio projects with concise impact-focused summaries
const PROJECTS = [
  {
    id: 1,
    title: 'CardVault',
    description:
      'Full-stack TCG marketplace where users can browse, buy, and sell trading cards.',
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
    highlights: [
      'Designed and shipped an end-to-end marketplace workflow from listing to checkout.',
      'Integrated third-party APIs and media processing for richer card data and uploads.',
    ],
    liveUrl: 'https://card-vault-teal.vercel.app/',
    githubUrls: [
      { label: 'Frontend', url: 'https://github.com/Vierbytes/card-vault' },
      { label: 'Backend', url: 'https://github.com/Vierbytes/card-vault-be' },
    ],
  },
  {
    id: 2,
    title: 'Desktop Portfolio OS',
    description:
      'Interactive desktop-style portfolio with draggable windows, taskbar workflows, and theme personalization.',
    tech: ['React', 'Vite', 'Context API', 'CSS', 'react-draggable'],
    image: '/projects/desktop-portfolio-os.png',
    highlights: [
      'Built reusable window management patterns for open, focus, minimize, maximize, and resize.',
      'Implemented mobile-specific UX behavior while preserving desktop interaction patterns.',
    ],
    liveUrl: 'https://corey-portfolio-henna.vercel.app/',
    githubUrls: [
      { label: 'Repository', url: 'https://github.com/Vierbytes/corey_portfolio' },
    ],
  },
  {
    id: 3,
    title: 'React Taskboard',
    description:
      'Dashboard-style taskboard focused on organizing workflow state in a clean React UI.',
    tech: ['React', 'TypeScript', 'CSS'],
    image: '/projects/react-taskboard.png',
    highlights: [
      'Practiced component composition for dashboard views and reusable task elements.',
      'Strengthened TypeScript fundamentals for safer state and props management.',
    ],
    liveUrl: 'https://react-taskboard.netlify.app/',
    githubUrls: [
      { label: 'Repository', url: 'https://github.com/Vierbytes/react-taskboard' },
    ],
  },
  {
    id: 4,
    title: 'IP Address Tracker',
    description:
      'Web app project centered on looking up and displaying IP address information.',
    tech: ['JavaScript', 'HTML', 'CSS'],
    image: '/projects/ip-address-tracker.png',
    highlights: [
      'Built practical data-display UI patterns around user input and lookup results.',
      'Focused on building a responsive interface and clear information layout.',
    ],
    liveUrl: 'https://ip-pin.netlify.app/',
    githubUrls: [
      { label: 'Repository', url: 'https://github.com/Vierbytes/ip-address-tracker' },
    ],
  },
  {
    id: 5,
    title: 'Personal Blog Platform',
    description:
      'Interactive client-side blog platform with full CRUD flows and local data persistence.',
    tech: ['JavaScript', 'HTML', 'CSS', 'LocalStorage'],
    image: '/projects/personal-blog-platform.png',
    highlights: [
      'Implemented create, edit, and delete workflows with client-side state management.',
      'Added validation, persistence, and responsive UI patterns for a complete UX flow.',
    ],
    liveUrl: 'https://vierbytes.github.io/personal-blog-sba/',
    githubUrls: [
      { label: 'Repository', url: 'https://github.com/Vierbytes/personal-blog-sba' },
    ],
  },
  {
    id: 6,
    title: 'PokeDem',
    description:
      'Digital Pokedex app for searching and browsing Pokemon with filtering and sorting controls.',
    tech: ['JavaScript', 'HTML', 'CSS', 'PokeAPI'],
    image: '/projects/pokedem.png',
    highlights: [
      'Implemented search, type filtering, and sorting to quickly find specific Pokemon entries.',
      'Built responsive card-based UI for readable stats, types, and move summaries.',
    ],
    liveUrl: 'https://pokedem.vercel.app/',
    githubUrls: [
      { label: 'Repository', url: 'https://github.com/Vierbytes/pokedem' },
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
              {project.highlights?.length > 0 && (
                <ul className="project-card__highlights">
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              )}

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
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card__link"
                  >
                    🔗 Live Site
                  </a>
                )}
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
