import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

const COMPACT_NAV_QUERY = "(max-width: 900px)";

function getCompactNavSnapshot() {
  return window.matchMedia(COMPACT_NAV_QUERY).matches;
}

function AppShell({
  activeView,
  backendStatus,
  children,
  onNavigate,
  onToggleTheme,
  theme,
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const sidebarToggleRef = useRef(null);
  const sidebarNavigationRef = useRef(null);

  const subscribeToCompactNav = useCallback(
    (onChange) => {
      const mediaQuery = window.matchMedia(COMPACT_NAV_QUERY);
      const handleChange = () => {
        if (!mediaQuery.matches) {
          setIsDrawerOpen(false);
        }
        onChange();
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    },
    [],
  );
  const isCompactNav = useSyncExternalStore(
    subscribeToCompactNav,
    getCompactNavSnapshot,
    () => false,
  );

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    sidebarToggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isCompactNav && isDrawerOpen) {
      sidebarNavigationRef.current?.querySelector("button")?.focus();
    }
  }, [isCompactNav, isDrawerOpen]);

  useEffect(() => {
    if (!isCompactNav || !isDrawerOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawer();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeDrawer, isCompactNav, isDrawerOpen]);

  function handleToggleSidebar() {
    if (isCompactNav) {
      if (isDrawerOpen) {
        closeDrawer();
      } else {
        setIsDrawerOpen(true);
      }
      return;
    }

    setIsSidebarCollapsed((isCollapsed) => !isCollapsed);
  }

  function handleNavigate(view) {
    onNavigate(view);
    if (isCompactNav) {
      closeDrawer();
    }
  }

  return (
    <div
      className={`app-shell ${isSidebarCollapsed ? "sidebar-collapsed" : ""} ${
        isDrawerOpen ? "drawer-open" : ""
      }`}
    >
      <Sidebar
        activeView={activeView}
        isCollapsed={isSidebarCollapsed}
        isInert={isCompactNav && !isDrawerOpen}
        navigationRef={sidebarNavigationRef}
        onClose={closeDrawer}
        onNavigate={handleNavigate}
      />
      {isCompactNav && isDrawerOpen && (
        <button
          aria-label="Close navigation menu"
          className="navigation-scrim"
          onClick={closeDrawer}
          type="button"
        />
      )}
      <div className="workspace">
        <Topbar
          activeView={activeView}
          backendStatus={backendStatus}
          isCompactNav={isCompactNav}
          isDrawerOpen={isDrawerOpen}
          isSidebarCollapsed={isSidebarCollapsed}
          sidebarToggleRef={sidebarToggleRef}
          onToggleSidebar={handleToggleSidebar}
          onToggleTheme={onToggleTheme}
          theme={theme}
        />
        <main className="workspace-main">{children}</main>
      </div>
    </div>
  );
}

export default AppShell;
