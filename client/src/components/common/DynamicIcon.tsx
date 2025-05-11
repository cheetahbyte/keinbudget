import dynamicIconImports from "lucide-react/dynamicIconImports";
import type { LucideProps } from "lucide-react";
import { lazy, Suspense, useMemo } from "react";

export interface IconProps extends Omit<LucideProps, "ref"> {
  name: keyof typeof dynamicIconImports;
}

export const DynamicIcon = ({ name, ...props }: IconProps) => {
  const LazyIcon = useMemo(() => lazy(dynamicIconImports[name]), [name]);

  return (
    <Suspense fallback={<span className="inline-block w-4 h-4" />}>
      <LazyIcon {...props} />
    </Suspense>
  );
};