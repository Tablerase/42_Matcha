import { Request, Response } from "express";
import {
  handleErrorResponse,
  handleBadRequestResponse,
  handleForbiddenResponse,
  handleNotFoundResponse,
} from "@utils/errorHandler";
import { matchModel } from "@models/matchModel";
import { matchSchema } from "@interfaces/matchValidationSchema";

export const getUserMatches = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req?.user?.id;
    if (!userId) {
      handleForbiddenResponse(
        res,
        "You must be logged in to view your matches"
      );
      return;
    }
    const matches = await matchModel.getUserMatches(userId!);
    res.status(200).json({ status: 200, data: matches });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const deleteUserMatch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req?.user?.id;
    if (!userId) {
      handleForbiddenResponse(res, "You must be logged in to delete a match");
      return;
    }
    const result = matchSchema.safeParse(req.body);
    if (!result.success) {
      handleBadRequestResponse(res, "Invalid matched user ID format");
      return;
    }
    const { matchedUserId } = result.data;
    await matchModel.removeUserMatch(userId!, matchedUserId);
    res
      .status(200)
      .json({ status: 200, message: "Match deleted successfully" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
