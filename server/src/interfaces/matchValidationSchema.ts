import { z } from "zod";

export const matchSchema = z.object({
  matchedUserId: z.coerce.number().int().positive(),
});
