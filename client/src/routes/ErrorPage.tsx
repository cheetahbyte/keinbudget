import { AlertCircle } from "lucide-react";
import { Link, isRouteErrorResponse, useRouteError } from "react-router";

export function ErrorPage() {
	const error = useRouteError();
	const is404 = isRouteErrorResponse(error) && error.status === 404;

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<div className="max-w-md w-full space-y-6 text-center">
				<div className="flex justify-center">
					<div className="bg-red-100 text-red-600 rounded-full p-4">
						<AlertCircle className="w-8 h-8" />
					</div>
				</div>
				<h1 className="text-2xl font-semibold text-gray-900">
					{is404 ? "Site not found" : "Something went wrong"}
				</h1>
				<p className="text-gray-600">
					{is404
						? "The site you're look for does not exist."
						: "An unknown error happend, please try again later."}
				</p>
				<Link
					to="/"
					className="inline-block mt-4 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
				>
					Back to Dashboard
				</Link>
			</div>
		</div>
	);
}
