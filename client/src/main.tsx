import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "~/routes/index";

import "./index.css";

const root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
