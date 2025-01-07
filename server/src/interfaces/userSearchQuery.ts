import { z } from "zod";
import { validTags } from "./tagInterface";

export interface UserSearchQuery {
  minAge?: number;
  maxAge?: number;
  distance?: number;
  latitude?: number;
  longitude?: number;
  tags?: string[];
  minFameRating?: number;
  maxFameRating?: number;
  sortBy?: "distance" | "age" | "fameRating";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export const userSearchQuerySchema = z.object({
  minAge: z.coerce.number().int().positive().optional(),
  maxAge: z.coerce.number().int().positive().optional(),
  distance: z.coerce.number().int().positive().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  tags: z
    .array(
      z.string().refine((tag) => validTags.map((t) => t.tag).includes(tag), {
        message: "Invalid tag provided",
      })
    )
    .optional(),
  minFameRating: z.coerce.number().positive().optional(),
  maxFameRating: z.coerce.number().positive().optional(),
  sortBy: z.enum(["distance", "age", "fameRating"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  limit: z.coerce.number().int().positive().optional(),
  offset: z.coerce.number().int().positive().optional(),
});
