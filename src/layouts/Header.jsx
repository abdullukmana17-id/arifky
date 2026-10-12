import { forwardRef } from "react";
import { PrimaryOffcanvasButton } from ".";

const Header = forwardRef(({ title, children, className, navs, ...props }, ref) => {
    return (
        <header
            ref={ref}
            className={`bg-body position-sticky border-bottom top-0 ${className || 'py-2'} z-3`}
            {...props}
        >
            <div className="container-fluid">
                <div className="row justify-content-center mt-1">
                    <div className="col-12 d-flex align-items-center gap-2">
                        <PrimaryOffcanvasButton className="d-sm-none btn-light mt-1" />

                        {title && (
                            <>
                                <h1 className="mb-0 font-sans fw-normal fs-6 me-auto">
                                    <small>{title}</small>
                                </h1>
                                {navs}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {children}
        </header>
    );
});

Header.displayName = "Header";

export default Header;