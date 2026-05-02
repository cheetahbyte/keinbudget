import { oc } from "@orpc/contract";
import { z } from "zod";

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  icon: z.string(),
});

export const categoryContract = {
  all: oc.route({ method: "GET", path: "/categories" }).output(z.array(categorySchema)),
  create: oc
    .route({ method: "POST", path: "/categories" })
    .input(z.object({ name: z.string().min(1), icon: z.string().min(1) }))
    .output(categorySchema),
  remove: oc
    .route({ method: "DELETE", path: "/categories/{id}" })
    .input(z.object({ id: z.number().int().positive() }))
    .output(z.object({ success: z.literal(true) })),
};
