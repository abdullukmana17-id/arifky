import { useState, forwardRef } from "react";

const Input = forwardRef(({
    label,
    className = "",
    type = "text",
    placeholder = "",
    value,
    defaultValue = "",
    onChange,
    id,
    ...props
}, ref) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const inputValue = isControlled ? value : internalValue;

    const handleChange = (e) => {
        if (!isControlled) setInternalValue(e.target.value);
        onChange?.(e);
    };

    return (
        <div className={`form-floating ${className || "mb-3"}`}>
            <input
                ref={ref}
                {...props}
                type={type}
                onChange={handleChange}
                value={inputValue}
                className="form-control rounded-4 px-3"
                id={id}
                required
                placeholder={placeholder}
            />
            <label className="ms-1" htmlFor={id}>{label}</label>
        </div>
    );
});

Input.displayName = "Input";
export default Input;