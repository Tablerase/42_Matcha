import { UserSearchQuery } from "@interfaces/userSearchQuery";
import { Request, Response } from "express";
import { user as userModel } from "@models/userModel";
import { validTags } from "@interfaces/tagInterface";

export const searchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const searchParams: UserSearchQuery = {
      minAge: parseInt(req.query.minAge as string),
      maxAge: parseInt(req.query.maxAge as string),
      distance: parseInt(req.query.distance as string),
      latitude: parseFloat(req.query.latitude as string),
      longitude: parseFloat(req.query.longitude as string),
      tags: req.query.tags
        ? (req.query.tags as string)
            .split(",")
            .filter((tag) => validTags.map((t) => t.tag).includes(tag))
        : [],
      minFameRating: parseInt(req.query.minFameRating as string),
      maxFameRating: parseInt(req.query.maxFameRating as string),
      sortBy: (req.query.sortBy as UserSearchQuery["sortBy"]) || "distance",
      order: (req.query.order as UserSearchQuery["order"]) || "asc",
      limit: parseInt(req.query.limit as string) || 20,
      offset: parseInt(req.query.offset as string) || 0,
    };

    const users = await userModel.searchUsers(searchParams);

    res.status(200).json({
      status: 200,
      data: users,
      metadata: {
        limit: searchParams.limit,
        offset: searchParams.offset,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: (error as Error).message,
    });
  }
};
