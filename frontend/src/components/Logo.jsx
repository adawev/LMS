function Logo({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6636" />
          <stop offset="100%" stopColor="#FF8856" />
        </linearGradient>
      </defs>

      {/* Graduation cap base */}
      <path
        d="M50 20 L85 35 L50 50 L15 35 Z"
        fill="url(#logoGradient)"
      />

      {/* Cap top */}
      <path
        d="M50 20 L50 15 L55 15 L55 30 L50 30 Z"
        fill="url(#logoGradient)"
      />

      {/* Book pages */}
      <rect x="30" y="55" width="40" height="25" rx="2" fill="#1F2937" />
      <path d="M35 60 L65 60" stroke="#FF6636" strokeWidth="2" />
      <path d="M35 65 L60 65" stroke="#FF6636" strokeWidth="2" />
      <path d="M35 70 L65 70" stroke="#FF6636" strokeWidth="2" />
      <path d="M35 75 L55 75" stroke="#FF6636" strokeWidth="2" />
    </svg>
  )
}

export default Logo
