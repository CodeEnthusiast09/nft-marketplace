import ReactSkeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface SkeletonProps {
  height?: number | string;
  width?: number | string;
  className?: string;
  count?: number;
  borderRadius?: number;
}
export const Skeleton = ({
  height = 14,
  width,
  className = "",
  count = 1,
  borderRadius = 5,
}: SkeletonProps) => {
  return (
    <div>
      <SkeletonTheme highlightColor="#DDD6E4">
        <ReactSkeleton
          className={className}
          height={height}
          width={width ?? "100%"}
          count={count}
          baseColor="#f5f5f5"
          borderRadius={borderRadius}
        />
      </SkeletonTheme>
    </div>
  );
};
