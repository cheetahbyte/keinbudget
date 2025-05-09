import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "vitest-dom/matchers";

expect.extend(matchers);

afterEach(() => {
	cleanup();
});
