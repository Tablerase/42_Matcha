import { Request, Response } from "express";
import {
  handleErrorResponse,
  handleBadRequestResponse,
  handleForbiddenResponse,
  handleNotFoundResponse,
} from "@utils/errorHandler";
import { viewModel } from "@models/viewModel";

export const getUserViewes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    if (!userId) {
      handleBadRequestResponse(res, "userId is required");
      return;
    }
    if (req?.user?.id !== userId) {
      handleForbiddenResponse(
        res,
        "You are not authorized to view this user's views"
      );
      return;
    }

    const views = await viewModel.getUserViews(userId!);
    res.status(200).json({ status: 200, data: views });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
