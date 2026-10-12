import { useEffect, useRef } from "react";
import autosize from "autosize";

export default function Textarea({
    id,
    label,
    placeholder = "",
    value,
    defaultValue = "",
    onChange,
    className,
    ...props
}) {
    const taRef = useRef(null);

    useEffect(() => {
        autosize(taRef.current);
        return () => autosize.destroy(taRef.current);
    }, []);

    useEffect(() => {
        if (taRef.current) {
            autosize.update(taRef.current);
        }
    }, [value]);

    const isControlled = value !== undefined;

    return (
        <textarea
            ref={taRef}
            className="form-control rounded-0 p-3 font-lpmq fs-4 border-0 shadow-none text-end"
            dir="rtl"
            placeholder={placeholder}
            id={id}
            {...(isControlled
                ? { value, onChange }
                : { defaultValue, onChange }
            )}
            {...props}
        />
    );
}