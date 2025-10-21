import { CardProps } from "./type";
import { CardHeader } from "./card-header";
import clsx from "clsx";

export const Card = ({
  title,
  description,
  className,
  children,
  py = "py-8",
}: CardProps) => {
  return (
    <div
      className={clsx(
        "bg-white rounded-lg border border-slate-200 px-5",
        className,
        py,
      )}
    >
      {title && <CardHeader title={title} description={description} />}
      {children}
    </div>
  );
};
