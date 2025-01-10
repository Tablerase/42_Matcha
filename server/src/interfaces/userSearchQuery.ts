import { z } from "zod";
import { validTags } from "./tagInterface";
import { Gender } from "./userInterface";

export interface UserSearchQuery {
  minAge?: number;
  maxAge?: number;
  gender?: Gender;
  sexualPreferences?: Gender[];
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

export const userSearchQuerySchema = z
  .object({
    minAge: z.coerce.number().int().positive().optional(),
    maxAge: z.coerce.number().int().positive().optional(),
    gender: z
      .enum([Gender.Male, Gender.Female, Gender.Other], {
        message: "Invalid gender provided",
      })
      .optional(),
    sexualPreferences: z
      .preprocess(
        (preferences) => {
          if (typeof preferences === "string") {
            return preferences.split(",");
          }
          return preferences;
        },
        z.array(z.enum([Gender.Male, Gender.Female, Gender.Other]), {
          message: "Invalid sexual preference provided",
        })
      )
      .optional(),
    distance: z.coerce.number().int().positive().optional(),
    latitude: z.coerce.number().min(-90).max(90).optional(),
    longitude: z.coerce.number().min(-180).max(180).optional(),
    tags: z
      .preprocess(
        (tags) => {
          if (typeof tags === "string") {
            return tags.split(",");
          }
          return tags;
        },
        z.array(
          z
            .string()
            .refine((tag) => validTags.map((t) => t.tag).includes(tag), {
              message: "Invalid tag provided",
            })
        )
      )
      .optional(),
    minFameRating: z.coerce.number().optional(),
    maxFameRating: z.coerce.number().optional(),
    sortBy: z.enum(["distance", "age", "fameRating"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    limit: z.coerce.number().int().positive().optional(),
    offset: z.coerce.number().int().optional(),
  })
  .refine(
    (data) => {
      if (data.minAge !== undefined && data.maxAge !== undefined) {
        return data.minAge <= data.maxAge;
      }
      return true;
    },
    {
      message: "minAge must be less than or equal to maxAge",
      path: ["minAge", "maxAge"],
    }
  )
  .refine(
    (data) => {
      if (
        data.minFameRating !== undefined &&
        data.maxFameRating !== undefined
      ) {
        return data.minFameRating <= data.maxFameRating;
      }
      return true;
    },
    {
      message: "minFameRating must be less than or equal to maxFameRating",
      path: ["minFameRating", "maxFameRating"],
    }
  );
