import { Request, Response } from "express";
import Job from "../model/job.model";
import AccountCompany from "../model/account-company.model";
import CV from "../model/cv.model";

export const detail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const job = await Job.findOne({
      _id: id,
    });

    if (!job) {
      res.json({
        code: "error",
        message: "Lấy dữ liệu thất bại!",
      });
      return;
    }

    const infoCompany = await AccountCompany.findOne({
      _id: job.companyId,
    });

    if (!infoCompany) {
      res.json({
        code: "error",
        message: "Thất bại!",
      });
      return;
    }

    const jobDetail = {
      id: job.id,
      title: job.title,
      companyName: infoCompany.companyName,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      images: job.images,
      position: job.position,
      workingForm: job.workingForm,
      companyAddress: infoCompany.address,
      technologies: job.technologies,
      description: job.description,
      companyLogo: infoCompany.logo,
      companyId: infoCompany.id,
      companyModel: infoCompany.companyModel,
      companyEmployees: infoCompany.companyEmployees,
      workingTime: infoCompany.workingTime,
      workOvertime: infoCompany.workOvertime,
    };

    res.json({
      code: "success",
      message: "Thành công!",
      jobDetail: jobDetail,
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Không lấy được dữ liệu!",
    });
  }
};

export const applyPost = async (req: Request, res: Response) => {
  try {
    if (req.file) {
      req.body.fileCV = req.file.path;
    }

    const newRecord = new CV(req.body);
    await newRecord.save();

    res.json({
      code: "success",
      message: "Gửi CV thành công!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!",
    });
  }
};
