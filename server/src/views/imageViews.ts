import { Image } from "@interfaces/imageInterface";
import { image as imageModel } from "@models/imageModel";
import { Request, Response } from "express";

export const createUserImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const imageData: Partial<Image> = req.body;
    const newImage = await imageModel.createImage(imageData);

    res.status(201).json({
      status: 201,
      message: "Image created successfully",
      data: newImage,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: (error as Error).message,
    });
  }
};

export const getUserImages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId: number = parseInt(req.query.userId as string);
    const images = await imageModel.getImagesByUserId(userId);

    res.status(200).json({
      status: 200,
      data: images,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: (error as Error).message,
    });
  }
};

export const deleteUserImage = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const imageId: number = parseInt(req.query.imageId as string);
        const deletedImage = await imageModel.deleteImageById(imageId);

        res.status(200).json({
            status: 200,
            message: "Image deleted successfully",
            data: deletedImage,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: (error as Error).message,
        });
    }
}

export const updateUserImageStatus = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const imageId: number = parseInt(req.body.imageId);
        const isProfilePic: boolean = req.body.isProfile;
        const updatedImage = await imageModel.updateImageStatus(imageId, isProfilePic);

        res.status(200).json({
            status: 200,
            message: "Image status updated successfully",
            data: updatedImage,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: (error as Error).message,
        });
    }
}