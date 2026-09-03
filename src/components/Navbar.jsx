function Navbar({
  activeSection,
  onNavigate,
  favoritesCount,
}) {
  const links = [
    { id: "home", label: "Home" },
    { id: "destinations", label: "Destinations" },
    { id: "weather", label: "Weather" },
    { id: "planner", label: "Planner" },
    { id: "assistant", label: "AI Assistant" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button
          className="brand"
          onClick={() => onNavigate("home")}
        >
          <span className="brand-icon">✈</span>
          <span>Roam</span>
        </button>

        <nav className="nav-links">
          {links.map((link) => (
            <button
              key={link.id}
              className={`nav-link ${
                activeSection === link.id ? "active" : ""
              }`}
              onClick={() => onNavigate(link.id)}
            >
              {link.label}
            </button>
          ))}

          <button
            className={`nav-link favorites-link ${
              activeSection === "favorites" ? "active" : ""
            }`}
            onClick={() => onNavigate("favorites")}
          >
            ♥ Favorites

            {favoritesCount > 0 && (
              <span className="favorites-count">
                {favoritesCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;