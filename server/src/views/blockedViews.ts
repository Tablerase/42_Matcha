import { Request, Response } from "express";
import { blocked as blockedUserModel } from "@models/blockedModel";

export const blockUser = async (req: Request, res: Response): Promise<void> => {    
    try {
        const userId = parseInt(req.params.id);
        const blockedUserId = parseInt(req.body.blockedUserId);
        const blockedUser = await blockedUserModel.blockUser(userId, blockedUserId);
        res.status(201).json({
        status: 201,
        data: blockedUser,
        });
    } catch (error) {
        res.status(500).json({
        status: 500,
        message: (error as Error).message,
        });
    }
    };

export const unblockUser = async (req: Request, res: Response): Promise<void> => {  
    try {
        const userId = parseInt(req.params.id);
        const blockedUserId = parseInt(req.body.blockedUserId);
        const blockedUser = await blockedUserModel.unblockUser(userId, blockedUserId);
        res.status(200).json({
        status: 200,
        data: blockedUser,
        });
    } catch (error) {
        res.status(500).json({
        status: 500,
        message: (error as Error).message,
        });
    }
};

export const getUserBlockedUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    const blockedUsers = await blockedUserModel.getBlockedUsers(userId);
    res.status(200).json({
      status: 200,
      data: blockedUsers,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: (error as Error).message,
    });
  }
};
