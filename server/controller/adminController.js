import adminModel from "../model/adminModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Jwt from "jsonwebtoken";
import multer from 'multer';

dotenv.config();


export async function register(req, res) {
    try {
      const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10}$/;
  
      const { email, name, phone, password, role, gender, isSuperAdmin } =
        req.body;
  
      if (!email) return res.status(400).send({ error: "Please enter email" });
      if (!emailRegex.test(email))
        return res.status(400).send({ error: "Please enter a valid email" });
      if (!name) return res.status(400).send({ error: "Please enter name" });
      if (!phone)
        return res.status(400).send({ error: "Please enter phone number" });
      if (!phoneRegex.test(phone))
        return res.status(400).send({ error: "Phone number must be 10 digits" });
      if (!password)
        return res.status(400).send({ error: "Password is required" });
      if (!gender) return res.status(400).send({ error: "Gender is required" });
  
      const existEmail = await adminModel.findOne({ email });
      if (existEmail)
        return res
          .status(400)
          .send({ error: "Email already in use. Please use a unique email." });
  
      if (!specialCharRegex.test(password)) {
        return res
          .status(400)
          .send({
            error: "Password should contain at least one special character",
          });
      }
      if (password.length < 6)
        return res
          .status(400)
          .send({ error: "Password should be at least 6 characters" });
  
      const hashPassword = await bcrypt.hash(password, 10);
  
      const user = new adminModel({
        email,
        password: hashPassword,
        name,
        phone,
        role,
        gender,
        isSuperAdmin: isSuperAdmin !== undefined ? isSuperAdmin : false,
      });
  
      await user.save();
  
      return res
        .status(201)
        .send({ error: false, msg: "Super Admin registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message || "Internal Server Error" });
    }
  }



  export async function login(req, res) {
    try {
      const { email, password } = req.body;
  
      if (!email)
        return res.status(400).send({ error: "email should not be empty" });
      if (!password)
        return res.status(400).send({ error: "password should not be empty" });
  
      const user = await adminModel.findOne({ email });
      console.log(user);
  
      if (!user) return res.status(404).send({ error: "email not found" });
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch)
        return res.status(400).send({ error: "Password does not match" });
  
      const token = Jwt.sign(
        { userid: user._id, email: user.email },
        process.env.JWTS,
        { expiresIn: "30d" }
      );
  
      return res.status(200).send({
        msg: "Logged in successfully...",
        email: user.email,
        token,
        data: user,
        role: "admin",
        isSuperAdmin: user.isSuperAdmin,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }
  
  

  export async function addAdmin(req, res) {
    console.log("Adding new admin...");
  
    try {
      const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10}$/;
  
      const { name, email, phone, password } = req.body;
      console.log(req.body);
      console.log(req.file);
      console.log(req.file?.path);
  
      if (!email) return res.status(400).send({ error: "Please enter email" });
      if (!emailRegex.test(email))
        return res.status(400).send({ error: "Please enter a valid email" });
      if (!name) return res.status(400).send({ error: "Please enter name" });
      if (!phone)
        return res.status(400).send({ error: "Please enter phone number" });
      if (!phoneRegex.test(phone))
        return res.status(400).send({ error: "Phone number must be 10 digits" });
      if (!password)
        return res.status(400).send({ error: "Password is required" });
  
      const existingAdmin = await adminModel.findOne({ email });
      if (existingAdmin)
        return res
          .status(400)
          .send({ error: "Email already in use. Please use a unique email." });
  
      if (!specialCharRegex.test(password)) {
        return res
          .status(400)
          .send({
            error: "Password should contain at least one special character",
          });
      }
      if (password.length < 6)
        return res
          .status(400)
          .send({ error: "Password should be at least 6 characters" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const filename = req.file?.path || "";
  
      const newAdmin = new adminModel({
        name,
        email,
        phone,
        password: hashedPassword,
        photo: filename,
        joinedDate: new Date(),
      });
  
      await newAdmin.save();
  
      return res
        .status(200)
        .send({ error: false, msg: "Admin registered successfully" });
    } catch (error) {
      console.error("Error occurred during admin registration:", error);
      res.status(500).send({ error: error.message || "Internal Server Error" });
    }
  }
  
  export async function getAdmins(req, res) {
    try {
      const data = await adminModel.find({ isSuperAdmin: false });
      console.log(data);
  
      res.status(200).json({
        error: false,
        message: "Admin details retrieved successfully",
        data: data,
      });
    } catch (error) {
      console.error("Error fetching admin details:", error);
      res.status(500).json({
        error: true,
        message: "Internal Server Error",
        data: null,
      });
    }
  }
  
  export async function deleteAdmin(req, res) {
    try {
      const id = req.params.id;
      const result = await adminModel.findOneAndDelete({ _id: id });
      if (!result)
        return res.status(404).send({ error: true, message: "Admin not found" });
  
      res
        .status(200)
        .send({ error: false, message: "Admin deleted successfully!" });
    } catch (error) {
      console.error(error);w
      res.status(500).send({ error: error.message || "Internal Server Error" });
    }
  }
  
  export async function deleteAdmins(req, res) {
    try {
      const { adminIds } = req.body;
  
      if (!adminIds || adminIds.length === 0) {
        return res
          .status(400)
          .send({ error: true, message: "No admin IDs provided" });
      }
  
      const result = await adminModel.deleteMany({ _id: { $in: adminIds } });
  
      if (result.deletedCount > 0) {
        return res
          .status(200)
          .send({ error: false, message: "Selected admins have been deleted." });
      } else {
        return res
          .status(404)
          .send({ error: true, message: "No admins found to delete." });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ error: true, message: error.message || "Internal Server Error" });
    }
  }
  
  export async function blockAdmin(req, res) {
    try {
      const id = req.params.id;
  
      const admin = await adminModel.findByIdAndUpdate(
        id,
        { isBlocked: true },
        { new: true }
      );
  
      if (!admin) {
        return res.status(404).send({ error: "Admin not found" });
      }
  
      res
        .status(200)
        .send({ error: false, message: "Admin has been blocked", admin });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message || "Internal Server Error" });
    }
  }
  
  export async function unblockAdmin(req, res) {
    try {
      const id = req.params.id;
  
      const admin = await adminModel.findByIdAndUpdate(
        id,
        { isBlocked: false },
        { new: true }
      );
  
      if (!admin) {
        return res.status(404).send({ error: "Admin not found" });
      }
  
      res
        .status(200)
        .send({ error: false, message: "Admin has been unblocked", admin });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message || "Internal Server Error" });
    }
  }
  
  export async function updateAdmin(req, res) {
    try {
      console.log(req.body);
      console.log(req.file);
      console.log(req.params.id);
  
      let data = req.body;
      if (req.file !== undefined) {
        data.photo = req.file.path;
      }
  
      const id = req.params.id;
      const result = await adminModel.findByIdAndUpdate(id, data, { new: true });
      if (!result)
        return res.status(404).send({ error: true, message: "Admin not found" });
  
      res
        .status(200)
        .send({ error: false, message: "Admin updated successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message || "Internal Server Error" });
    }
  }
  