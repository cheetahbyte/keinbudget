import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
const themes: Theme[] = ["light", "dark"];

interface ThemeContextType {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
	theme: "light",
	setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const [theme, setThemeState] = useState<Theme>("light");

	const setTheme = (newTheme: Theme) => {
		setThemeState(newTheme);
		localStorage.setItem("theme", newTheme);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: there is no right way to define this.
	useEffect(() => {
		const saved = localStorage.getItem("theme") as Theme | null;
		if (saved && themes.includes(saved)) {
			setTheme(saved);
		}
	}, []);

	useEffect(() => {
		document.documentElement.classList.remove(
			...themes.map((t) => `theme-${t}`),
		);
		document.documentElement.classList.add(`theme-${theme}`);
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
// eslint-ignore
export const useTheme = () => useContext(ThemeContext);
