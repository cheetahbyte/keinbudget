import type { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  children: ReactNode | ReactNode[];
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <section id={title.toLowerCase()} className="mt-8">
      <h2 className="text-xl font-medium">{title}</h2>
      <div className="mt-4 rounded-md bg-card ring-1 ring-border">
        {children}
      </div>
    </section>
  );
}
