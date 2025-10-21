import { CardHeaderProps } from "./type";

export const CardHeader = ({ title, description }: CardHeaderProps) => {
  return (
    <div className="mb-2">
      {title && <h3 className="font-bold text-lg">{title}</h3>}
      {description && (
        <div className="text-sm font-light text-primary-500/60">
          {description}
        </div>
      )}
    </div>
  );
};
