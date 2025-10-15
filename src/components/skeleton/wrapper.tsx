import { Fragment } from "react";
import { Skeleton } from "./index";

type SkeletonWrapperProps = {
  children: React.ReactNode | string | number;
  isLoading?: boolean;
  className?: string;
  height?: number;
  width?: number;
};
export const SkeletonWrapper = ({
  children,
  isLoading = false,
  className = "my-4 rounded w-full",
  height = 50,
  width,
}: SkeletonWrapperProps) => {
  return (
    <Fragment>
      {isLoading ? (
        <Skeleton className={className} width={width} height={height} />
      ) : (
        children
      )}
    </Fragment>
  );
};
