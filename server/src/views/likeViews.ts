import { Request, Response } from "express";
import {
  handleErrorResponse,
  handleBadRequestResponse,
  handleForbiddenResponse,
  handleNotFoundResponse,
} from "@utils/errorHandler";
import { likeModel } from "@models/likeModel";
import { matchModel } from "@models/matchModel";
import { NotificationPayload, SOCKET_EVENTS } from "@interfaces/socketEvents";
import { io } from "@src/server";

export const checkUserLiked = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const likerUserId = req?.user?.id;
    const likedUserId = parseInt(req.params.id);
    if (!likedUserId) {
      handleBadRequestResponse(res, "likedUserId is required");
      return;
    }
    if (likerUserId === likedUserId) {
      handleBadRequestResponse(res, "You cannot like yourself");
      return;
    }
    const response = await likeModel.checkUserLiked(likerUserId!, likedUserId);
    if (response.length > 0) {
      res.status(200).json({ status: 200, data: { isLiked: true } });
    } else {
      res.status(200).json({ status: 200, data: { isLiked: false } });
    }
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const getUserLikes = async (
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
        "You are not authorized to view this user's likes"
      );
      return;
    }

    const likes = await likeModel.getUserLikes(userId!);
    res.status(200).json({ status: 200, data: likes });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const addUserLike = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const likerUserId = req?.user?.id;
    const likedUserId = parseInt(req.params.id);
    if (!likedUserId) {
      handleBadRequestResponse(res, "likedUserId is required");
      return;
    }
    if (likerUserId === likedUserId) {
      handleBadRequestResponse(res, "You cannot like yourself");
      return;
    }

    await likeModel.addUserLike(likerUserId!, likedUserId);
    const match = await matchModel.checkForMatch(likerUserId!, likedUserId);
    let notification: NotificationPayload;
    if (match) {
      notification = {
        type: "MATCH_NEW",
        ui_variant: "success",
        message: "You have a new match!",
        fromUserId: likerUserId!,
        toUserId: likedUserId,
        createAt: new Date(),
      };
    } else {
      notification = {
        type: "LIKE_NEW",
        ui_variant: "info",
        message: "You have a new like!",
        fromUserId: likerUserId!,
        toUserId: likedUserId,
        createAt: new Date(),
      };
    }
    io.to(`user_${likedUserId}`).emit(SOCKET_EVENTS.NOTIFICATION, notification);

    res.status(201).json({ status: 201, message: "Like added" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const deleteUserLike = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const likerUserId = req?.user?.id;
    const likedUserId = parseInt(req.params.id);
    if (!likedUserId) {
      handleBadRequestResponse(res, "likedUserId is required");
      return;
    }

    await likeModel.deleteUserLike(likerUserId!, likedUserId);
    res.status(200).json({ status: 200, message: "Like deleted" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
