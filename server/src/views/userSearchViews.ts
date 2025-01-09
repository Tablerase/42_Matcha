import { UserSearchQuery } from "@interfaces/userSearchQuery";
import { Request, Response } from "express";
import { user as userModel } from "@models/userModel";

export const searchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const searchParams: UserSearchQuery = req.body;

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
