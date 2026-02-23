import mongoose from "mongoose";

const schema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  avatar: String,
  phone: String,
});

const AccountUser = mongoose.model("AccountUser", schema, "accounts-user");

export default AccountUser;
