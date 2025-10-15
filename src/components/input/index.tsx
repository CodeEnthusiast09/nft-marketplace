import { forwardRef, useId } from "react";
import { InputProps } from "./type";
import clsx from "clsx";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      error,
      label,
      className,
      labelClassName,
      type = "text",
      readOnly = false,
      placeholder,
      defaultValue,
      value,
      onChange,
      radius = "rounded-md",
      leftIcon,
      showRequiredAsterik = false,
      parentPy = "py-3",
      ...rest
    },
    ref,
  ) => {
    const id = useId();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value;

      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: { ...e.target, value: inputValue },
        };
        onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
      }
    };

    return (
      <div className={parentPy}>
        {label && (
          <label
            htmlFor={id}
            className={`flex items-center text-xs font-medium gap-1  ${
              labelClassName ? labelClassName : "text-black/70"
            }`}
          >
            {label}

            {showRequiredAsterik && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className={clsx("relative mt-1", radius)}>
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">{leftIcon}</span>
            </div>
          )}
          <input
            aria-invalid={error ? "true" : "false"}
            type={type}
            id={id}
            readOnly={readOnly}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            // onChange={handleChange}
            className={clsx(
              "mt-2 outline-0 placeholder-gray-300 block w-full h-12  text-sm py-2 border border-slate-300 focus:outline-1 focus:outline-primary-500 ",
              className ? className : "text-gray-600",
              leftIcon ? "pl-10" : "px-4",
              radius,
            )}
            ref={ref}
            {...rest}
          />
        </div>
        <p className="text-red-500 text-xs">{error?.message}</p>
      </div>
    );
  },
);

Input.displayName = "Input";
