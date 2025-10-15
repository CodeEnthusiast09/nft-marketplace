import React from "react";

export type Option = {
  label: string;
  value: string | number;
};

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: {
    message?: string;
  };
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  options?: Option[];
  showRequiredAsterik?: boolean;
}
