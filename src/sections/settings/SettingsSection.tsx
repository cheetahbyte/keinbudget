import type { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  children: ReactNode | ReactNode[];
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <section
      id={title.toLowerCase()}
      className="mt-6 rounded-2xl border border-[#e5d7c8] bg-white"
    >
      <h2 className="text-2xl font-semibold px-5 pt-5">{title}</h2>
      {children}
    </section>
  );
}
