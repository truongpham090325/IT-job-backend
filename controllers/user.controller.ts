import { Request, Response } from "express";
import AccountUser from "../model/account-user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerPost = async (req: Request, res: Response) => {
  try {
    const existAccount = await AccountUser.findOne({
      email: req.body.email,
    });

    if (existAccount) {
      res.json({
        code: "error",
        message: "Email đã tồn tại trong hệ thống!",
      });
      return;
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    // Lưu vào CSDL
    const newAccount = new AccountUser(req.body);
    await newAccount.save();

    res.json({
      code: "success",
      message: "Đăng ký tài khoản thành công!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!",
    });
  }
};

export const loginPost = async (req: Request, res: Response) => {
  try {
    const existAccount = await AccountUser.findOne({
      email: req.body.email,
    });

    if (!existAccount) {
      res.json({
        code: "error",
        message: "Tài khoản không tồn tại trong hệ thống!",
      });
      return;
    }

    const isPassword = bcrypt.compareSync(
      req.body.password,
      `${existAccount.password}`,
    );

    if (!isPassword) {
      res.json({
        code: "error",
        message: "Mật khẩu không chính xác!",
      });
      return;
    }

    const tokenUser = jwt.sign(
      {
        id: existAccount.id,
        email: existAccount.email,
      },
      `${process.env.JWT_SECRET}`,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("tokenUser", tokenUser, {
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
      sameSite: "lax",
    });

    res.json({
      code: "success",
      message: "Đăng nhập thành công!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!",
    });
  }
};
