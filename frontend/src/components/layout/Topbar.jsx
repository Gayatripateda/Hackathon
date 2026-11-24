import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Icon } from "../ui/Icon.jsx";

const viewTitles = {
  ai: "AI Playground",
  overview: "Overview",
};

function Topbar({
  activeView,
  backendStatus,
  isCompactNav,
  isDrawerOpen,
  isSidebarCollapsed,
  onToggleSidebar,
  onToggleTheme,
  sidebarToggleRef,
  theme,
}) {
  const statusVariant =
    backendStatus === "Connected"
      ? "success"
      : backendStatus === "Disconnected"
        ? "danger"
        : "warning";

  return (
    <header className="topbar">
      <div className="topbar-leading">
        <Button
          aria-controls="workspace-sidebar"
          aria-expanded={
            isCompactNav ? isDrawerOpen : !isSidebarCollapsed
          }
          aria-label={
            isCompactNav
              ? isDrawerOpen
                ? "Close navigation menu"
                : "Open navigation menu"
              : isSidebarCollapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
          }
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          ref={sidebarToggleRef}
          size="icon"
          variant="ghost"
        >
          <Icon name="menu" size={19} />
        </Button>
        <div className="breadcrumbs">
          <span>Workspace</span>
          <span className="breadcrumb-separator">/</span>
          <strong>{viewTitles[activeView]}</strong>
        </div>
      </div>

      <div className="topbar-actions">
        <div className="connection-indicator">
          <span className="connection-label">Backend</span>
          <Badge dot variant={statusVariant}>
            {backendStatus}
          </Badge>
        </div>
        <span className="topbar-divider" aria-hidden="true" />
        <Badge variant="neutral">Local</Badge>
        <Button
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          onClick={onToggleTheme}
          size="icon"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          variant="ghost"
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
        </Button>
      </div>
    </header>
  );
}

export default Topbar;
