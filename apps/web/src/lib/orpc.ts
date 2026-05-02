import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { api } from "./api";

export const orpc = createTanstackQueryUtils(api);
