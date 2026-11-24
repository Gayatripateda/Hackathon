import { Icon } from "../ui/Icon.jsx";
import { Button } from "../ui/Button.jsx";

const navigationItems = [
  { id: "overview", label: "Overview", icon: "grid" },
  { id: "ai", label: "AI Playground", icon: "sparkles" },
];

function Sidebar({
  activeView,
  isCollapsed,
  isInert,
  navigationRef,
  onClose,
  onNavigate,
}) {
  return (
    <aside
      aria-hidden={isInert}
      aria-label="Workspace navigation"
      className="sidebar"
      id="workspace-sidebar"
      inert={isInert}
    >
      <Button
        aria-label="Close navigation menu"
        className="drawer-close"
        onClick={onClose}
        size="small"
        variant="ghost"
      >
        Close
      </Button>
      <a
        aria-current={activeView === "overview" ? "page" : undefined}
        aria-label="Hackathon Starter Kit overview"
        className="brand"
        href="#overview"
        onClick={(event) => {
          event.preventDefault();
          onNavigate("overview");
        }}
      >
        <span className="brand-mark">
          <Icon name="sparkles" size={20} />
        </span>
        <span className="brand-copy">
          <strong>Hackathon Kit</strong>
          <span>Developer workspace</span>
        </span>
      </a>

      <div className="workspace-context">
        <span className="workspace-avatar">H</span>
        <span className="workspace-copy">
          <strong>Hackathon Starter Kit</strong>
          <span>Reusable foundation</span>
        </span>
      </div>

      <nav
        aria-label="Main menu"
        className="sidebar-navigation"
        ref={navigationRef}
      >
        <p className="sidebar-label">Workspace</p>
        {navigationItems.map((item) => (
          <button
            aria-label={item.label}
            aria-current={activeView === item.id ? "page" : undefined}
            className={`nav-item ${activeView === item.id ? "is-active" : ""}`}
            key={item.id}
            onClick={() => onNavigate(item.id)}
            title={isCollapsed ? item.label : undefined}
            type="button"
          >
            <Icon name={item.icon} size={18} />
            <span className="nav-item-label">{item.label}</span>
            {item.id === "ai" && (
              <span className="nav-item-indicator" aria-label="Integrated">
                <span className="sr-only">Integrated</span>
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-local-note">
          <span className="help-mark">
            <Icon name="activity" size={17} />
          </span>
          <span className="help-copy">
            <strong>Built for hackathons</strong>
            <span>Keep the foundation flexible</span>
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
