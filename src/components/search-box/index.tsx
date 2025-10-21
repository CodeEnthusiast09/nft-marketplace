import { DebouncedInput } from "../input/debounce-input";
import { FaSearch } from "react-icons/fa";

export const SearchBox = ({
  label,
  value,
  placeholder = "Search  Here",
  onChange,
  debounce,
}: {
  label?: string;
  value?: string | number;
  placeholder?: string;
  onChange: (value: string | number) => void;
  debounce?: number;
}) => {
  return (
    <form role="search" onSubmit={(e) => e.preventDefault()}>
      <div className="w-full">
        <div className="relative rounded-md">
          <DebouncedInput
            value={value ?? ""}
            label={label}
            aria-label={placeholder}
            placeholder={placeholder}
            onChange={(value: string | number) => {
              onChange?.(value);
            }}
            debounce={debounce}
            leftIcon={<FaSearch className="h-4 w-4 text-gray-400" />}
          />
        </div>
      </div>
    </form>
  );
};
