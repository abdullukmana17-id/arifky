import { useId, useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSidebarLayout } from "./index.jsx";

function closeOffcanvas(event) {
    const offcanvasEl = event.currentTarget.closest(".offcanvas-start");

    if (!offcanvasEl) return;

    const instance = window.bootstrap.Offcanvas.getInstance(offcanvasEl);

    if (instance) {
        instance.hide();
    }
}

function hasCategory(obj) {
    return obj.hasOwnProperty("category");
}

function useIsWide(breakpoint = 576) {
    const [isWide, setIsWide] = useState(() => window.innerWidth > breakpoint);

    useEffect(() => {
        const handler = () => setIsWide(window.innerWidth > breakpoint);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, [breakpoint]);

    return isWide;
}

export default function Nav({menus}) {
    const { primaryHidden } = useSidebarLayout();
    const isWide = useIsWide(576);
    const navRef = useRef(null);

    const showTooltips = primaryHidden && isWide;

    useEffect(() => {
        if (!window.bootstrap || !navRef.current) return;
        const els = navRef.current.querySelectorAll(".has-tooltip");
        const instances = Array.from(els).map((el) =>
            window.bootstrap.Tooltip.getOrCreateInstance(el, {
                html: false,
                placement: el.dataset.bsPlacement || "right",
            })
        );
        return () => instances.forEach((i) => i.dispose());
    });

    return (
        <div ref={navRef}>
            {menus && (
                <Accordion>
                    <AccordionItem menus={menus} showTooltips={showTooltips} />
                </Accordion>
            )}
        </div>
    );
}

function Accordion({ children }) {
    const accordionId = useId();

    return (
        <div className="accordion" id={`accordion-${accordionId}`}>
            {children}
        </div>
    );
}

function AccordionItem({ menus, depth = 0, showTooltips }) {
    return (
        <>
            {menus.map((menu, index) => {
                if (hasCategory(menu)) {
                    return (
                        <AccordionCategory
                            depth={depth}
                            key={index}
                            menu={menu}
                            showTooltips={showTooltips}
                        />
                    );
                }

                const baseClassName = [
                    "text-decoration-none btn rounded-0 font-sans mb-1 w-100 text-start p-2 py-0 d-flex align-items-center",
                    showTooltips ? "has-tooltip" : "",
                ]
                    .filter(Boolean)
                    .join(" ");

                const commonProps = {
                    style: { "--depth": depth },
                    "data-bs-title": showTooltips ? menu.title : undefined,
                    "data-bs-placement": "right",
                };

                return (
                    <div key={index} className="accordion-item p-0">
                        {menu.to ? (
                            <NavLink
                                {...commonProps}
                                to={menu.to}
                                end
                                onClick={closeOffcanvas}
                                className={({ isActive }) =>
                                    [baseClassName, isActive ? "btn-primary active text-nowrap" : "btn-light text-nowrap"]
                                        .join(" ")
                                }
                            >
                                {menu.label}
                            </NavLink>
                        ) : (
                            <a onClick={closeOffcanvas} {...commonProps} className={`${baseClassName} btn-light text-nowrap`} href={menu.href}>
                                {menu.label}
                            </a>
                        )}
                    </div>
                );
            })}
        </>
    );
}

function hasActiveChild(menu, pathname) {
    if (!hasCategory(menu)) {
        return menu.to && pathname === menu.to;
    }
    return menu.menus?.some((child) => hasActiveChild(child, pathname));
}

function AccordionCategory({ menu, depth, showTooltips }) {
    const collapseId = useId();
    const headerId = useId();
    const safeCollapseId = `collapse-${collapseId.replace(/:/g, "")}`;
    const safeHeaderId = `header-${headerId.replace(/:/g, "")}`;

    const { pathname } = useLocation();
    const isOpen = hasActiveChild(menu, pathname);

    return (
        <div className="accordion-item">
            <h2 className="accordion-header" id={safeHeaderId}>
                <button
                    className={[
                        "accordion-button border btn btn-light p-2 py-0 rounded-2 mb-1 font-sans",
                        isOpen ? "" : "collapsed",
                        showTooltips ? "has-tooltip" : "",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    type="button"
                    style={{ "--depth": depth }}
                    data-bs-toggle="collapse"
                    data-bs-target={`#${safeCollapseId}`}
                    aria-expanded={isOpen ? "true" : "false"}
                    aria-controls={safeCollapseId}
                    data-bs-title={showTooltips ? menu.title : undefined}
                    data-bs-placement="right"
                >
                    {menu.category}
                </button>
            </h2>
            <div
                id={safeCollapseId}
                className={["accordion-collapse collapse", isOpen ? "show" : ""].join(" ")}
                aria-labelledby={safeHeaderId}
            >
                <div className="accordion-body p-0">
                    <Accordion>
                        <AccordionItem
                            depth={depth + 1}
                            menus={menu.menus}
                            showTooltips={showTooltips}
                        />
                    </Accordion>
                </div>
            </div>
        </div>
    );
}