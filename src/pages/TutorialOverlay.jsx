import { useState, useEffect, useCallback } from "react";

const PADDING = 10;

/**
 * TutorialOverlay
 *
 * Coachmark-style tutorial overlay: darkens the screen, "spotlights" a
 * target element (via CSS selector), and shows a small tooltip card with
 * a title, description, pagination dots, and next/back/close controls.
 *
 * Usage:
 *   const steps = [
 *     { target: '[data-tutorial="cta-tajwid"]', title: "...", description: "..." },
 *     ...
 *   ];
 *
 *   <TutorialOverlay steps={steps} open={showTutorial} onClose={() => setShowTutorial(false)} />
 *
 * Each step's `target` must match exactly one element on the page
 * (an id selector or a `[data-tutorial="..."]` attribute selector works well).
 */
export default function TutorialOverlay({ steps, open, onClose, onStepChange }) {
    const [stepIndex, setStepIndex] = useState(0);
    const [rect, setRect] = useState(null);

    // Reset to first step whenever the tutorial is (re)opened
    useEffect(() => {
        if (open) setStepIndex(0);
    }, [open]);

    // Let the parent page react to step changes (e.g. switch a mobile
    // input/result toggle so the right panel is visible before we measure it)
    useEffect(() => {
        if (open && steps[stepIndex]) {
            onStepChange?.(stepIndex, steps[stepIndex]);
        }
    }, [open, stepIndex, steps, onStepChange]);

    const measure = useCallback(() => {
        const step = steps[stepIndex];
        if (!step) return;
        const el = document.querySelector(step.target);
        // getClientRects().length === 0 means the element is display:none
        // (e.g. hidden on the current breakpoint) — treat it as absent
        // rather than drawing a zero-size spotlight in the corner.
        if (el && el.getClientRects().length > 0) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            // wait a tick for the smooth scroll to settle before measuring
            requestAnimationFrame(() => {
                const r = el.getBoundingClientRect();
                setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
            });
        } else {
            setRect(null);
        }
    }, [stepIndex, steps]);

    useEffect(() => {
        if (!open) return;
        const t = setTimeout(measure, 300); // give scrollIntoView time to finish
        window.addEventListener("resize", measure);
        window.addEventListener("scroll", measure, true);
        return () => {
            clearTimeout(t);
            window.removeEventListener("resize", measure);
            window.removeEventListener("scroll", measure, true);
        };
    }, [open, stepIndex, measure]);

    if (!open || !steps?.length) return null;

    const step = steps[stepIndex];
    const isLast = stepIndex === steps.length - 1;

    const next = () => {
        if (isLast) {
            onClose?.();
        } else {
            setStepIndex((i) => i + 1);
        }
    };

    const prev = () => setStepIndex((i) => Math.max(0, i - 1));

    const spotlightStyle = rect
        ? {
              position: "fixed",
              top: rect.top - PADDING,
              left: rect.left - PADDING,
              width: rect.width + PADDING * 2,
              height: rect.height + PADDING * 2,
              borderRadius: "14px",
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.75)",
              border: "2px solid #fff",
              zIndex: 2001,
              pointerEvents: "none",
              transition: "all 0.35s ease",
          }
        : {
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              zIndex: 2001,
              transition: "all 0.35s ease",
          };

    // Position tooltip below the target when there's room, otherwise above it.
    const viewportH = typeof window !== "undefined" ? window.innerHeight : 800;
    const viewportW = typeof window !== "undefined" ? window.innerWidth : 400;
    const tooltipWidth = Math.min(340, viewportW - 32);

    let tooltipTop;
    if (rect) {
        const spaceBelow = viewportH - (rect.top + rect.height);
        tooltipTop =
            spaceBelow > 180
                ? rect.top + rect.height + PADDING * 2 + 12
                : Math.max(16, rect.top - 12 - 160);
    } else {
        tooltipTop = viewportH / 2 - 90;
    }

    const tooltipLeft = rect
        ? Math.min(Math.max(16, rect.left), viewportW - tooltipWidth - 16)
        : (viewportW - tooltipWidth) / 2;

    return (
        <>
            {/* Dark backdrop + spotlight hole around the target */}
            <div style={spotlightStyle} onClick={onClose} />

            {/* Tooltip card */}
            <div
                className="p-3 bg-white rounded-3 shadow-lg"
                style={{
                    position: "fixed",
                    top: tooltipTop,
                    left: tooltipLeft,
                    width: tooltipWidth,
                    zIndex: 2002,
                    transition: "all 0.35s ease",
                }}
            >
                <h5 className="mb-2">{step.title}</h5>
                <p className="mb-3 small text-secondary">{step.description}</p>

                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-1">
                        {steps.map((_, i) => (
                            <span
                                key={i}
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    background: i === stepIndex ? "#212529" : "#dee2e6",
                                    display: "inline-block",
                                }}
                            />
                        ))}
                    </div>

                    <div className="d-flex gap-2">
                        {stepIndex > 0 && (
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={prev}>
                                Kembali
                            </button>
                        )}
                        <button type="button" className="btn btn-sm btn-dark" onClick={next}>
                            {isLast ? "Selesai" : "Berikutnya"}
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-sm btn-link text-secondary p-0 mt-2"
                >
                    Lewati tutorial
                </button>
            </div>
        </>
    );
}