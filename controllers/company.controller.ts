import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import AccountCompany from "../model/account-company.model";
import jwt from "jsonwebtoken";
import { RequestAccount } from "../interface/request.interface";
import Job from "../model/job.model";
import City from "../model/city.model";

export const registerPost = async (req: Request, res: Response) => {
  try {
    const existAccount = await AccountCompany.findOne({
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
    const newAccount = new AccountCompany(req.body);
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
    const existAccount = await AccountCompany.findOne({
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

    const token = jwt.sign(
      {
        id: existAccount.id,
        email: existAccount.email,
      },
      `${process.env.JWT_SECRET}`,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // https để true, http để fasle
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

export const profilePatch = async (req: RequestAccount, res: Response) => {
  try {
    if (req.file) {
      req.body.logo = req.file.path;
    } else {
      delete req.body.logo;
    }

    await AccountCompany.updateOne(
      {
        _id: req.account.id,
      },
      req.body,
    );

    res.json({
      code: "success",
      message: "Cập nhập thành công!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!",
    });
  }
};

export const createJobPost = async (req: RequestAccount, res: Response) => {
  try {
    req.body.companyId = req.account.id;
    req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
    req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
    req.body.technologies = req.body.technologies
      ? req.body.technologies.split(", ")
      : [];
    req.body.images = [];

    // Xử lý mảng images
    if (req.files) {
      for (const file of req.files as any[]) {
        req.body.images.push(file.path);
      }
    }
    // Hết Xử lý mảng images

    const newRecord = new Job(req.body);
    await newRecord.save();

    res.json({
      code: "success",
      message: "Tạo công việc thành công!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!",
    });
  }
};

export const listJob = async (req: RequestAccount, res: Response) => {
  try {
    const companyId = req.account.id;
    const find = {
      companyId: companyId,
    };

    // Phân trang
    let page = 1;
    const limitItems = 3;
    if (req.query.page && parseInt(`${req.query.page}`) > 0) {
      page = parseInt(`${req.query.page}`);
    }
    const skip = (page - 1) * limitItems;
    const totalRecord = await Job.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limitItems);
    // Hết Phân trang

    const jobs = await Job.find(find)
      .sort({
        createdAt: "desc",
      })
      .limit(limitItems)
      .skip(skip);

    const dataFinal = [];

    for (const item of jobs) {
      dataFinal.push({
        id: item.id,
        companyLogo: req.account.logo,
        title: item.title,
        companyName: req.account.companyName,
        salaryMin: item.salaryMin,
        salaryMax: item.salaryMax,
        position: item.position,
        workingForm: item.workingForm,
        companyCity: req.account.companyCity,
        technologies: item.technologies,
      });
    }
    res.json({
      code: "success",
      message: "Thành công!",
      jobList: dataFinal,
      totalPage: totalPage,
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Lấy dữ liệu thất bại!",
    });
  }
};

export const editJob = async (req: RequestAccount, res: Response) => {
  try {
    const id = req.params.id;
    const companyId = req.account.id;

    const jobDetail = await Job.findOne({
      _id: id,
      companyId: companyId,
    });

    if (!jobDetail) {
      res.json({
        code: "error",
        message: "Id không hợp lệ!",
      });
      return;
    }

    res.json({
      code: "success",
      message: "Thành công!",
      jobDetail: jobDetail,
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Lấy dữ liệu thất bại!",
    });
  }
};

export const editJobPatch = async (req: RequestAccount, res: Response) => {
  try {
    const id = req.params.id;
    const companyId = req.account.id;

    const jobDetail = await Job.findOne({
      _id: id,
      companyId: companyId,
    });

    if (!jobDetail) {
      res.json({
        code: "error",
        message: "Id không hợp lệ!",
      });
      return;
    }

    req.body.companyId = req.account.id;
    req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
    req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
    req.body.technologies = req.body.technologies
      ? req.body.technologies.split(", ")
      : [];
    req.body.images = [];

    // Xử lý mảng images
    if (req.files) {
      for (const file of req.files as any[]) {
        req.body.images.push(file.path);
      }
    }
    // Hết Xử lý mảng images

    await Job.updateOne(
      {
        _id: id,
        companyId: companyId,
      },
      req.body,
    );

    res.json({
      code: "success",
      message: "Cập nhập thành công!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "success",
      message: "Cập nhập thất bại!",
    });
  }
};

export const deleteJobDel = async (req: RequestAccount, res: Response) => {
  try {
    const id = req.params.id;
    const companyId = req.account.id;

    const jobDetail = await Job.findOne({
      _id: id,
    });

    if (!jobDetail) {
      res.json({
        code: "error",
        message: "Không thể xóa công việc này!",
      });
      return;
    }

    await Job.deleteOne({
      _id: id,
      companyId: companyId,
    });

    res.json({
      code: "success",
      message: "Xóa công việc thành công!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Có lỗi khi xóa công việc!",
    });
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    let limitItems = 9;
    if (req.query.limitItems) {
      limitItems = parseInt(`${req.query.limitItems}`);
    }
    const companyList = await AccountCompany.find({}).limit(limitItems);
    const companyListFinal = [];

    for (const item of companyList) {
      const dataFinal = {
        id: item.id,
        logo: item.logo,
        companyName: item.companyName,
        cityName: "",
        totalJob: 0,
      };

      // Thành phố
      const city = await City.findOne({
        _id: item.city,
      });
      dataFinal.cityName = `${city ? city.name : ""}`;

      // Tổng số việc làm
      const totalJob = await Job.countDocuments({
        companyId: item.id,
      });
      dataFinal.totalJob = totalJob;

      companyListFinal.push(dataFinal);
    }

    res.json({
      code: "success",
      message: "Thành công!",
      companyList: companyListFinal,
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Lấy dữ liệu Thất bại!",
    });
  }
};
