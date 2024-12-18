import { User } from "@interfaces/userInterface";
import { user as userModel } from "@models/userModel";
import { Request, Response } from "express";

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
    // console.log(params);
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

// const getUserByEmail = async (email: string): Promise<User | null> => {
// 	  try {
// 	const user = await userModel.getUserByEmail(email);
// 	return user;
//   } catch (error) {
// 	throw new Error((error as Error).message);
//   }
// };

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const userData: Partial<User> = req.body;
    const user = await userModel.getUserById(id);
    if (!user) {
      res.status(404).json({
        status: 404,
        message: "User not found",
      });
      return;
    }
    const updatedUser = await userModel.updateUser(id, userData);
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
