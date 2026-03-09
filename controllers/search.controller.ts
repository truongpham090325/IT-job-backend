import { Request, Response } from "express";
import Job from "../model/job.model";
import AccountCompany from "../model/account-company.model";
import City from "../model/city.model";

export const search = async (req: Request, res: Response) => {
  try {
    const dataFinal = [];
    let totalRecord = 0;
    let totalPage = 0;

    if (Object.keys(req.query).length > 0) {
      const find: any = {};

      if (req.query.language) {
        find.technologies = req.query.language;
      }

      if (req.query.city) {
        const city = await City.findOne({
          name: req.query.city,
        });
        if (city) {
          const listCompanyInCity = await AccountCompany.find({
            city: city.id,
          });
          const listIdCompanyInCity = listCompanyInCity.map((item) => item.id);
          find.companyId = { $in: listIdCompanyInCity };
        }
      }

      if (req.query.company) {
        const company = await AccountCompany.findOne({
          companyName: req.query.company,
        });
        find.companyId = company?.id;
      }

      if (req.query.keyword) {
        const keywordRegex = new RegExp(`${req.query.keyword}`, "i");
        find.title = keywordRegex;
      }

      if (req.query.position) {
        find.position = req.query.position;
      }

      if (req.query.workingForm) {
        find.workingForm = req.query.workingForm;
      }

      // Phân trang
      const limitsItem = 3;
      let page = 1;
      if (req.query.page && parseInt(`${req.query.page}`) > 0) {
        page = parseInt(`${req.query.page}`);
      }
      const skip = (page - 1) * limitsItem;
      totalRecord = await Job.countDocuments(find);
      totalPage = Math.ceil(totalRecord / limitsItem);
      // Hết phân trang

      const jobs = await Job.find(find)
        .sort({
          createdAt: "desc",
        })
        .limit(limitsItem)
        .skip(skip);

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
      totalPage: totalPage,
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Không lấy được dữ liệu!",
    });
  }
};
