import { z } from "zod";

export const entityIdSchema = z.object({
  id: z.number().int().positive(),
});

export const successSchema = z.object({
  success: z.literal(true),
});
