import { User } from "@interfaces/userInterface";
import { user as userModel } from "@models/userModel";
import { image } from "@src/models/imageModel";
import { likeModel } from "@src/models/likeModel";
import { matchModel } from "@src/models/matchModel";
import { Request, Response } from "express";
import { jwtDecode } from "jwt-decode";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userData: Partial<User> = req.body;
    const existingUserEmail = await userModel.getUserByEmail(userData.email);
    const existingUserName = await userModel.getUserByUsername(
      userData.username
    );
    if (existingUserName) {
      res.status(400).json({
        status: 400,
        message: "Username already in use",
      });
      return;
    } else if (existingUserEmail) {
      res.status(400).json({
        status: 400,
        message: "Email already in use",
      });
      return;
    }

    const newUser = await userModel.createUser(userData);

    res.status(201).json({
      status: 201,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: (error as Error).message,
    });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const params = req.query;
    const users = await userModel.getUsers(params);
    res.status(200).json({
      status: 200,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: (error as Error).message,
    });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const user = await userModel.getUserById(id);
    if (!user) {
      res.status(404).json({
        status: 404,
        message: "User not found",
      });
      return;
    }
    res.status(200).json({
      status: 200,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: (error as Error).message,
    });
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authHeader = req.headers.cookie;
    const token = authHeader?.split("=")[1];
    if (token) {
      const decoded = jwtDecode(token);
      const userId = (decoded as { id: number }).id;
      const user = await userModel.getUserById(userId);
      // const user = await userModel.getClientUserById(userId);
      if (!user) {
        res.status(404).json({
          status: 404,
          message: "User not found",
        });
        return;
      }
      res.status(200).json({
        status: 200,
        data: user,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: (error as Error).message,
    });
  }
};

export const getCurrentId = async (
  req: Request,
  res: Response
): Promise<number> => {
  try {
    const authHeader = req.headers.cookie;
    const token = authHeader?.split("=")[1];
    if (token) {
      const decoded = jwtDecode(token);
      const userId = (decoded as { id: number }).id;
      return userId;
    }
    return -1;
  } catch (error) {
    return -1;
  }
};

export const updateFameRate = async (userId: number): Promise<number> => {
  const userData = await userModel.getUserById(userId);
  if (!userData) {
    return -1;
  }

  let fameRate = 0;
  // Points for user profile completion (1 point per field -> 10 points)
  for (const key in userData) {
    if (
      userData[key as keyof User] &&
      !["id", "fame_rate", "created", "updated", "last_seen", "tags"].includes(
        key
      )
    ) {
      fameRate += 1;
    }
  }
  // Points for pictures (5 points per picture -> 25 points)
  const pictures = await image.getImagesByUserId(userData.id);
  fameRate += pictures.length * 5;

  // Points for likes (1 point per like)
  const likes = await likeModel.getUserLikes(userData.id);
  fameRate += likes.length > 35 ? 35 : likes.length;

  // Points for matches (2 points per match)
  const matches = await matchModel.getUserMatches(userData.id);
  fameRate += matches.length * 2 > 30 ? 30 : matches.length * 2;

  fameRate = fameRate > 100 ? 100 : fameRate;
  fameRate = fameRate < 0 ? 0 : fameRate;
  userModel.updateUserFameRate(userData.id, fameRate);
  return fameRate;
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    let userData: Partial<User> = req.body;
    const userId = await getCurrentId(req, res);
    if (userId === -1 || userId !== id) {
      res.status(401).json({
        status: 401,
        message: "Unauthorized",
      });
      return;
    }
    // Update the user
    const updatedUser = await userModel.updateUser(id, userData);
    // Calculate new fame
    userData.fameRate = await updateFameRate(userId);
    res.status(200).json({
      status: 200,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: (error as Error).message,
    });
  }
};
