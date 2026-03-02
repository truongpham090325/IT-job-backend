import { Request, Response } from "express";

export const imagePost = async (req: Request, res: Response) => {
  try {
    res.json({
      location: req.file?.path,
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!",
    });
  }
};
