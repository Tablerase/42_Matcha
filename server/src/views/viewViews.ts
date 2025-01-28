import { Request, Response } from "express";
import {
  handleErrorResponse,
  handleBadRequestResponse,
  handleForbiddenResponse,
  handleNotFoundResponse,
} from "@utils/errorHandler";
import { viewModel } from "@models/viewModel";

export const getUserViews = async (
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

export const addUserView = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const viewedUserId = parseInt(req.params.id);
    const userId = req?.user?.id;
    if (!viewedUserId) {
      handleBadRequestResponse(res, "userId is required");
      return;
    }
    if (userId === viewedUserId) {
      handleForbiddenResponse(
        res,
        "You are not authorized to view your own profile"
      );
      return;
    }

    await viewModel.addUserView(userId!, viewedUserId!);
    res.status(201).json({ status: 201, message: "View added successfully" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
