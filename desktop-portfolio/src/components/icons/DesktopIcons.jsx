/*
  Desktop App Icons

  Windows-style SVG icons for each desktop application. These render
  as inline SVGs so they scale to whatever container they're in and
  pick up color from CSS.

  Each icon is a simple functional component that accepts optional
  size and className props. They default to 100% width/height so
  they fill their parent container.

  I drew these to look like classic Windows icons - simple, flat,
  with a recognizable shape for each app type.
*/

// About Me - person silhouette icon (like Windows user profile)
export function AboutMeIcon({ size, className = '' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size || '100%'}
      height={size || '100%'}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head circle */}
      <circle cx="24" cy="16" r="9" fill="#5B9BD5" />
      {/* Body/shoulders arc */}
      <path
        d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16"
        fill="#5B9BD5"
      />
      {/* Subtle highlight on the head to give it some depth */}
      <circle cx="24" cy="16" r="7" fill="#7CB9E8" opacity="0.4" />
    </svg>
  );
}

// Projects - folder icon (like Windows File Explorer)
export function ProjectsIcon({ size, className = '' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size || '100%'}
      height={size || '100%'}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Folder back */}
      <path
        d="M4 10h14l4 4h22a2 2 0 012 2v24a2 2 0 01-2 2H4a2 2 0 01-2-2V12a2 2 0 012-2z"
        fill="#FFC54D"
      />
      {/* Folder front flap - slightly lighter for depth */}
      <path
        d="M2 18h44v22a2 2 0 01-2 2H4a2 2 0 01-2-2V18z"
        fill="#FFD97D"
      />
      {/* Tab highlight */}
      <path
        d="M4 10h14l4 4H4V10z"
        fill="#F0A830"
      />
    </svg>
  );
}

// Skills - lightning bolt icon (like system info / power)
export function SkillsIcon({ size, className = '' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size || '100%'}
      height={size || '100%'}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Monitor/screen body */}
      <rect x="6" y="4" width="36" height="28" rx="2" fill="#4A90D9" />
      {/* Screen inner area */}
      <rect x="9" y="7" width="30" height="22" rx="1" fill="#1E1E1E" />
      {/* Monitor stand */}
      <path d="M18 32h12v4H18z" fill="#6E6E6E" />
      <path d="M14 36h20v2H14z" fill="#6E6E6E" />
      {/* Lightning bolt on screen */}
      <path
        d="M26 11l-7 10h5l-2 8 7-10h-5l2-8z"
        fill="#FFD700"
      />
    </svg>
  );
}

// Contact - envelope icon (like Windows Mail)
export function ContactIcon({ size, className = '' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size || '100%'}
      height={size || '100%'}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Envelope body */}
      <rect x="2" y="10" width="44" height="28" rx="2" fill="#5B9BD5" />
      {/* Envelope flap (the V shape on top) */}
      <path
        d="M2 10l22 16 22-16"
        stroke="#3A7BBF"
        strokeWidth="2"
        fill="none"
      />
      {/* Inner lighter area to give depth */}
      <path
        d="M2 12l22 14 22-14v24a2 2 0 01-2 2H4a2 2 0 01-2-2V12z"
        fill="#7CB9E8"
        opacity="0.3"
      />
    </svg>
  );
}

// Settings - gear icon (like Windows Settings)
export function SettingsIcon({ size, className = '' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size || '100%'}
      height={size || '100%'}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer gear shape */}
      <path
        d="M24 4l3.5 2.5L31 5l2 3.5 3.5.5.5 3.5L40.5 15 42 18.5l-2 3L42 25l-2.5 3 1 3.5-3 2-.5 3.5-3.5.5-2 3.5-3.5-1L24 44l-3.5-2.5L17 43l-2-3.5-3.5-.5-.5-3.5L7.5 33 6 29.5l2-3L6 23l2.5-3-1-3.5 3-2 .5-3.5 3.5-.5 2-3.5 3.5 1L24 4z"
        fill="#6E6E6E"
      />
      {/* Inner circle of the gear */}
      <circle cx="24" cy="24" r="8" fill="#4A90D9" />
      {/* Center dot */}
      <circle cx="24" cy="24" r="4" fill="#1E1E1E" />
    </svg>
  );
}

// Resume - document/page icon (like a text file)
export function ResumeIcon({ size, className = '' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size || '100%'}
      height={size || '100%'}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Page body */}
      <path
        d="M10 2h20l10 10v32a2 2 0 01-2 2H10a2 2 0 01-2-2V4a2 2 0 012-2z"
        fill="#E8E8E8"
      />
      {/* Folded corner */}
      <path
        d="M30 2v10h10"
        fill="#C8C8C8"
      />
      <path
        d="M30 2l10 10H30V2z"
        fill="#D0D0D0"
      />
      {/* Text lines to make it look like a document */}
      <rect x="14" y="18" width="20" height="2" rx="1" fill="#999" />
      <rect x="14" y="24" width="16" height="2" rx="1" fill="#999" />
      <rect x="14" y="30" width="18" height="2" rx="1" fill="#999" />
      <rect x="14" y="36" width="12" height="2" rx="1" fill="#999" />
    </svg>
  );
}

// Music - vinyl/disc icon
export function MusicIcon({ size, className = '' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size || '100%'}
      height={size || '100%'}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="20" fill="#1DB954" />
      <circle cx="24" cy="24" r="6" fill="#0f172a" />
      <circle cx="24" cy="24" r="2" fill="#93c5fd" />
      <path
        d="M31 10a1.5 1.5 0 013 0v16.5a4.5 4.5 0 11-3-4.243V10z"
        fill="#0f172a"
      />
    </svg>
  );
}
