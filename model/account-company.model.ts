import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    companyName: String,
    city: String,
    address: String,
    companyModel: String,
    companyEmployees: String,
    workingTime: String,
    workOvertime: String,
    email: String,
    phone: String,
    logo: String,
    description: String,
    password: String,
  },
  {
    timestamps: true, // Tự động sinh ra trường createdAt và updatedAt
  },
);

const AccountCompany = mongoose.model(
  "AccountCompany",
  schema,
  "accounts-company",
);

export default AccountCompany;
