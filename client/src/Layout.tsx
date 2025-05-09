import { Outlet } from "react-router";
import { ServicesProvider } from "./api/services/services.provider";
import { ThemeProvider } from "./components/common/ThemeProvider";
import Header from "./components/ui/HeaderBar";

export default function Layout() {
	return (
		<div>
			<main>
				<ThemeProvider>
					<ServicesProvider>
						<Header />
						<Outlet />
					</ServicesProvider>
				</ThemeProvider>
			</main>
		</div>
	);
}
