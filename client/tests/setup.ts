import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";
import * as matchers from "vitest-dom/matchers";

expect.extend(matchers);

afterEach(() => {
	cleanup();
});
