import { createContext, type ReactNode, useContext } from "react";

import type { Preferences } from "#/lib/locale";
import { DEFAULT_PREFERENCES } from "#/lib/locale";
import { createFormatters, type Formatters } from "#/lib/money";

const PreferencesContext = createContext<Preferences>(DEFAULT_PREFERENCES);

export function PreferencesProvider({
  preferences,
  children,
}: {
  preferences: Preferences;
  children: ReactNode;
}) {
  return (
    <PreferencesContext.Provider value={preferences}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): Preferences {
  return useContext(PreferencesContext);
}

export function useFormatters(): Formatters {
  return createFormatters(useContext(PreferencesContext));
}
