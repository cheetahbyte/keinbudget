import dynamicIconImports from "lucide-react/dynamicIconImports";
import type { LucideProps } from "lucide-react";
import { Suspense, lazy } from "react";

interface IconProps extends Omit<LucideProps, "ref"> {
  name: keyof typeof dynamicIconImports;
}

export const DynamicIcon = ({ name, ...props }: IconProps) => {
  const LazyIcon = lazy(dynamicIconImports[name]);
  return (
    <Suspense fallback={<span className="inline-block w-4 h-4" />}>
      <LazyIcon {...props} />
    </Suspense>
  );
};
