/*
  Skills Window Content

  I styled this to look like a system info panel, kind of like when
  you open "About This Mac" or the system properties on Windows.
  Skills are grouped by category so it's easy to scan.

  The data is in an array of objects, each with a category name and
  a list of skills. Easy to update as I learn new things.
*/

// Skills organized by category - pulled from my resume
const SKILL_CATEGORIES = [
  {
    category: 'Scripting & Programming',
    skills: [
      'Python',
      'JavaScript',
      'TypeScript',
      'React',
      'HTML',
      'CSS',
      'Bash',
      'SQL',
      'Node.js',
      'PowerShell',
    ],
  },
  {
    category: 'Frameworks & Libraries',
    skills: ['Bootstrap', 'Tailwind CSS', 'Express', 'REST API'],
  },
  {
    category: 'Databases',
    skills: ['PostgreSQL', 'MongoDB'],
  },
  {
    category: 'Systems & Infrastructure',
    skills: [
      'Linux (RHEL, Ubuntu)',
      'Windows Server',
      'macOS',
      'VMware',
      'Docker',
      'Active Directory',
      'DNS/DHCP',
    ],
  },
  {
    category: 'DevOps & Automation',
    skills: ['Git', 'Ansible', 'Puppet', 'Jenkins', 'SCCM'],
  },
  {
    category: 'Monitoring & Security',
    skills: [
      'Splunk',
      'Qualys',
      'SentinelOne',
      'BigPanda',
      'PagerDuty',
      'ServiceNow',
      'Jira',
    ],
  },
];

function Skills() {
  return (
    <div className="skills">
      {/* System info style header */}
      <div className="skills__header">
        <span className="skills__header-icon">⚡</span>
        <div>
          <h2 className="skills__header-title">System Capabilities</h2>
          <p className="skills__header-subtitle">Technologies & Tools</p>
        </div>
      </div>

      {/* Skill categories */}
      <div className="skills__categories">
        {SKILL_CATEGORIES.map((cat) => (
          <div key={cat.category} className="skills__category">
            <h3 className="skills__category-title">{cat.category}</h3>
            <div className="skills__list">
              {cat.skills.map((skill) => (
                <div key={skill} className="skills__item">
                  <span className="skills__item-dot" />
                  <span className="skills__item-name">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Fun little "system status" footer */}
      <div className="skills__footer">
        <span className="skills__status">
          ● Status: <span className="skills__status-text">Always Learning</span>
        </span>
      </div>
    </div>
  );
}

export default Skills;
