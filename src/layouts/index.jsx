import {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
} from "react";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

const KEY_PRIMARY = "layout:primarySidebarHidden";
const KEY_SECONDARY = "layout:secondarySidebarHidden";

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded atau private browsing — diam saja */
  }
}

const SidebarLayoutContext = createContext(null);
export function useSidebarLayout() {
  const ctx = useContext(SidebarLayoutContext);
  if (!ctx) {
    throw new Error("useSidebarLayout harus digunakan di dalam <SidebarLayout>.");
  }
  return ctx;
}

export function PrimaryToggleButton({ children, className = "", ...props }) {
  const { togglePrimary, primaryHidden } = useSidebarLayout();
  return (
    <button
      type="button"
      className={`btn ${className}`}
      onClick={togglePrimary}
      aria-label="Toggle sidebar kiri"
      aria-expanded={!primaryHidden}
      {...props}
    >
      {children ?? <i className="bi bi-layout-sidebar" />}
    </button>
  );
}

export function SecondaryToggleButton({ children, className = "", ...props }) {
  const { toggleSecondary, secondaryHidden } = useSidebarLayout();
  return (
    <button
      type="button"
      className={`btn ${className}`}
      onClick={toggleSecondary}
      aria-label="Toggle sidebar kanan"
      aria-expanded={!secondaryHidden}
      {...props}
    >
      {children ?? <i className="bi bi-layout-sidebar-reverse" />}
    </button>
  );
}

export function PrimaryOffcanvasButton({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`btn ${className}`}
      data-bs-toggle="offcanvas"
      data-bs-target="#sl-primarySidebar"
      aria-controls="sl-primarySidebar"
      aria-expanded="false"
      aria-label="Buka sidebar kiri"
      {...props}
    >
      {children ?? <i className="bi bi-layout-sidebar-inset" />}
    </button>
  );
}

export function SecondaryOffcanvasButton({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`btn ${className}`}
      data-bs-toggle="offcanvas"
      data-bs-target="#sl-secondarySidebar"
      aria-controls="sl-secondarySidebar"
      aria-expanded="false"
      aria-label="Buka sidebar kanan"
      {...props}
    >
      {children ?? <i className="bi bi-layout-sidebar-inset-reverse" />}
    </button>
  );
}

export default function Layout({
  navbarContent,
  primarySidebarContent,
  mainContent,
  secondarySidebarContent,
  footerContent,
  primaryMinWidth = "48px",
  secondaryMinWidth = "48px",
}) {
  const hasPrimary = primarySidebarContent !== undefined;
  const hasSecondary = secondarySidebarContent !== undefined;

  const [primaryHidden, _setPrimaryHidden] = useState(() =>
    readStorage(KEY_PRIMARY, false)
  );
  const [secondaryHidden, _setSecondaryHidden] = useState(() =>
    readStorage(KEY_SECONDARY, false)
  );

  const setPrimaryHidden = useCallback((value) => {
    writeStorage(KEY_PRIMARY, value);
    _setPrimaryHidden(value);
  }, []);

  const setSecondaryHidden = useCallback((value) => {
    writeStorage(KEY_SECONDARY, value);
    _setSecondaryHidden(value);
  }, []);

  const togglePrimary = useCallback(() => {
    _setPrimaryHidden((prev) => {
      const next = !prev;
      writeStorage(KEY_PRIMARY, next);
      return next;
    });
  }, []);

  const toggleSecondary = useCallback(() => {
    _setSecondaryHidden((prev) => {
      const next = !prev;
      writeStorage(KEY_SECONDARY, next);
      return next;
    });
  }, []);

  const headerRef = useRef(null);
  const [sidebarVars, setSidebarVars] = useState({});

  const recalcDimensions = useCallback(() => {
    const h = headerRef.current?.offsetHeight ?? 0;
    setSidebarVars({
      "--sl-sidebar-height": `${window.innerHeight - h}px`,
      "--sl-sidebar-top": `${h}px`,
    });
  }, []);

  useEffect(() => {
    recalcDimensions();
    window.addEventListener("resize", recalcDimensions);
    return () => window.removeEventListener("resize", recalcDimensions);
  }, [recalcDimensions]);

  useEffect(() => {
    const offcanvasElements = document.querySelectorAll(".offcanvas.show");

    offcanvasElements.forEach((el) => {
      const instance = bootstrap.Offcanvas.getInstance(el);
      if (instance) {
        instance.hide();
      }
    });

    document.body.style.overflow = "";
    document.body.style.paddingRight = "";

  }, [location]);

  const ctx = {
    primaryHidden,
    secondaryHidden,
    togglePrimary,
    toggleSecondary,
    setPrimaryHidden,
    setSecondaryHidden,
  };

  const rootVars = {
    "--sl-primary-min-width": primaryMinWidth,
    "--sl-secondary-min-width": secondaryMinWidth,
  };
  
  return (
    <SidebarLayoutContext.Provider value={ctx}>
      <div style={rootVars}>

        {navbarContent !== undefined && (
          <header
            ref={headerRef}
            className="sl-header position-sticky top-0 bg-body"
          >
            <nav className="navbar">
              <div className="container-fluid gap-1 gap-sm-2 gap-md-3">

                {navbarContent}

                {hasPrimary && <PrimaryToggleButton className="d-none d-sm-block" />}
                {hasSecondary && <SecondaryToggleButton className="d-none d-xl-block" />}

                {hasPrimary && <PrimaryOffcanvasButton className="d-sm-none" />}
                {hasSecondary && <SecondaryOffcanvasButton className="d-xl-none" />}

              </div>
            </nav>
          </header>
        )}

        <div className="container-fluid sl-primary-layout p-0">
          {hasPrimary && (
            <div
              id="sl-primarySidebar"
              className={[
                "sl-sidebar sl-sidebar--primary",
                "offcanvas-sm offcanvas-start border-end border-secondary-subtle",
                primaryHidden ? "hide" : "",
              ].filter(Boolean).join(" ")}
              style={sidebarVars}
              tabIndex={-1}
            >
              <div className="offcanvas-header border-bottom d-none">
                <button
                  type="button"
                  className="btn-close shadow-none ms-auto"
                  data-bs-target="#sl-primarySidebar"
                  data-bs-dismiss="offcanvas"
                  aria-label="Tutup"
                />
              </div>
              <div className="offcanvas-body p-0 h-100">
                {primarySidebarContent}
              </div>
            </div>
          )}

          <div className="sl-main-content sl-secondary-layout">
            <main>
              {mainContent ?? <Outlet />}
            </main>

            {hasSecondary && (
              <aside
                id="sl-secondarySidebar"
                className={[
                  "sl-sidebar sl-sidebar--secondary",
                  "border-start offcanvas-end offcanvas-xl border-secondary-subtle",
                  secondaryHidden ? "hide" : "",
                ].filter(Boolean).join(" ")}
                style={sidebarVars}
                tabIndex={-1}
              >
                <div className="offcanvas-header border-bottom d-none">
                  <button
                    type="button"
                    className="btn-close shadow-none ms-auto"
                    data-bs-target="#sl-secondarySidebar"
                    data-bs-dismiss="offcanvas"
                    aria-label="Tutup"
                  />
                </div>
                <div className="offcanvas-body p-0 h-100">
                  {secondarySidebarContent}
                </div>
              </aside>
            )}
          </div>

        </div>

        {footerContent && (
          <footer className="bg-body border-top border-secondary-subtle p-3 py-5">
            <div className="container">
              <div className="row g-2">{footerContent}</div>
            </div>
          </footer>
        )}

      </div>
    </SidebarLayoutContext.Provider>
  );
}