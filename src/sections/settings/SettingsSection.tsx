import type { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  children: ReactNode | ReactNode[];
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <section id={title.toLowerCase()} className="flex flex-col gap-5">
      <h2 className="text-lg font-medium">{title}</h2>
      {children}
    </section>
  );
}
