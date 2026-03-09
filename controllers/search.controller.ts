import { Request, Response } from "express";
import Job from "../model/job.model";
import AccountCompany from "../model/account-company.model";
import City from "../model/city.model";

export const search = async (req: Request, res: Response) => {
  try {
    const dataFinal = [];

    if (Object.keys(req.query).length > 0) {
      const find: any = {};

      if (req.query.language) {
        find.technologies = req.query.language;
      }

      const jobs = await Job.find(find).sort({
        createdAt: "desc",
      });

      for (const item of jobs) {
        const itemFinal = {
          id: item.id,
          companyLogo: "",
          title: item.title,
          companyName: "",
          salaryMin: item.salaryMin,
          salaryMax: item.salaryMax,
          position: item.position,
          workingForm: item.workingForm,
          cityName: "",
          technologies: item.technologies,
        };

        if (item.companyId) {
          const companyInfo = await AccountCompany.findOne({
            _id: item.companyId,
          });

          itemFinal.companyLogo = `${companyInfo?.logo}`;
          itemFinal.companyName = `${companyInfo?.companyName}`;

          const city = await City.findOne({
            _id: companyInfo?.city,
          });

          itemFinal.cityName = `${city?.name}`;

          dataFinal.push(itemFinal);
        }
      }
    }

    res.json({
      code: "success",
      message: "Thành công!",
      jobs: dataFinal,
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Không lấy được dữ liệu!",
    });
  }
};
