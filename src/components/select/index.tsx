import { forwardRef, useId } from "react";
import { Option, SelectProps } from "./select.type";

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      error,
      label,
      labelClassName,
      className,
      placeholder,
      defaultValue,
      onChange,
      showRequiredAsterik = false,
      options,
      ...rest
    },
    ref,
  ) => {
    const id = useId();
    return (
      <div className="py-3">
        {label && (
          <label
            htmlFor={id}
            className={`flex items-center gap-1 text-xs font-medium  ${labelClassName}`}
          >
            {label}

            {showRequiredAsterik && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative mt-1 rounded-md">
          <select
            id={id}
            aria-invalid={error ? "true" : "false"}
            onChange={onChange ? onChange : undefined}
            defaultValue={defaultValue}
            className={`mt-2 outline-0 placeholder-[#515151] text-gray-600 block w-full h-12  text-sm rounded p-2 border border-slate-300 focus:outline-2  ${className}`}
            ref={ref}
            {...rest}
          >
            <option value="">{placeholder ? placeholder : "Select"}</option>

            {options &&
              options.map((option: Option, index: number) => {
                return (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                );
              })}
          </select>
        </div>
        <p className="text-red-500 text-xs">{error?.message}</p>
      </div>
    );
  },
);

Select.displayName = "Select";
