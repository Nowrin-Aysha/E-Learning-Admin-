import mentorModel from "../model/mentorModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
// import { response } from "express";
import Jwt from "jsonwebtoken";
// import multer from 'multer';

dotenv.config();

export async function registerMentor(req, res) {
  try {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    const { email, name, phone, password } = req.body;

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

    const existEmail = await mentorModel.findOne({ email });
    if (existEmail)
      return res
        .status(400)
        .send({ error: "Email already in use. Please use a unique email." });

    const existingMentorByPhone = await mentorModel.findOne({ phone });
    if (existingMentorByPhone)
      return res.status(400).send({
        error: "Phone number already in use. Please use a unique phone number.",
      });

    if (!specialCharRegex.test(password)) {
      return res.status(400).send({
        error: "Password should contain at least one special character",
      });
    }
    if (password.length < 6)
      return res
        .status(400)
        .send({ error: "Password should be at least 6 characters" });

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new mentorModel({
      email,
      password: hashPassword,
      name,
      phone,
    });

    await user.save();

    return res
      .status(201)
      .send({ error: false, msg: "Request sended successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message || "Internal Server Error" });
  }
}

export async function loginMentor(req, res) {
  try {
    const { email, password } = req.body;

    if (!email)
      return res.status(400).send({ error: "email should not be empty" });
    if (!password)
      return res.status(400).send({ error: "password should not be empty" });

    const user = await mentorModel.findOne({ email });
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
      role: "mentor",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
}

export async function addMentor(req, res) {
  try {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    const { name, email, phone, password } = req.body;

    if (!name) return res.status(400).send({ error: "Please enter the name." });
    if (!email) return res.status(400).send({ error: "Please enter email." });
    if (!emailRegex.test(email))
      return res.status(400).send({ error: "Please enter a valid email." });
    if (!phone)
      return res.status(400).send({ error: "Please enter phone number." });
    if (!phoneRegex.test(phone))
      return res.status(400).send({ error: "Phone number must be 10 digits." });
    if (!password)
      return res.status(400).send({ error: "Password is required." });

    const existingMentorByEmail = await mentorModel.findOne({ email });
    if (existingMentorByEmail)
      return res
        .status(400)
        .send({ error: "Email already in use. Please use a unique email." });

    const existingMentorByPhone = await mentorModel.findOne({ phone });
    if (existingMentorByPhone)
      return res.status(400).send({
        error: "Phone number already in use. Please use a unique phone number.",
      });

    if (!specialCharRegex.test(password)) {
      return res.status(400).send({
        error: "Password should contain at least one special character.",
      });
    }
    if (password.length < 6)
      return res
        .status(400)
        .send({ error: "Password should be at least 6 characters." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const filename = req.file ? req.file.path : null;

    const newMentor = new mentorModel({
      name,
      email,
      phone,
      password: hashedPassword,
      photo: filename,
      joinedDate: new Date(),
      status: "1",
    });

    await newMentor.save();

    return res
      .status(200)
      .send({ error: false, msg: "Mentor registered successfully" });
  } catch (error) {
    console.error("Error occurred during mentor registration:", error);
    res
      .status(500)
      .send({ error: true, msg: error.message || "Internal Server Error" });
  }
}

export async function getMentors(req, res) {
  try {
    const data = await mentorModel.find();
    console.log(data);

    res.status(200).json({
      error: false,
      message: "Mentor details retrieved successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error fetching mentor details:", error);
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
      data: null,
    });
  }
}
export async function getMentor(req, res) {
  try {
    const { mentorId } = req.params;

    const mentor = await mentorModel.findById(mentorId);

    if (!mentor) {
      return res.status(404).json({
        error: true,
        message: "Mentor not found",
        data: null,
      });
    }

    res.status(200).json({
      error: false,
      message: "Mentor details retrieved successfully",
      data: mentor,
    });
  } catch (error) {
    console.error("Error fetching mentor details:", error);

    res.status(500).json({
      error: true,
      message: "Internal Server Error",
      data: null,
    });
  }
}

export async function deleteMentor(req, res) {
  try {
    const id = req.params.id;
    const result = await mentorModel.findOneAndDelete({ _id: id });
    res
      .status(200)
      .send({ error: false, message: "Mentor deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message || "Internal Server Error" });
  }
}

export async function deleteMentors(req, res) {
  try {
    const { mentorIds } = req.body;

    if (!mentorIds || mentorIds.length === 0) {
      return res
        .status(400)
        .send({ error: true, message: "No mentor IDs provided" });
    }

    const result = await mentorModel.deleteMany({ _id: { $in: mentorIds } });

    if (result.deletedCount > 0) {
      return res
        .status(200)
        .send({ error: false, message: "Selected mentors have been deleted." });
    } else {
      return res
        .status(404)
        .send({ error: true, message: "No mentors found to delete." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: true, message: error.message || "Internal Server Error" });
  }
}

export async function blockMentor(req, res) {
  try {
    const id = req.params.id;

    const mentor = await mentorModel.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );

    if (!mentor) {
      return res.status(404).send({ error: "Mentor not found" });
    }

    res
      .status(200)
      .send({ error: false, message: "Mentor has been blocked", mentor });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message || "Internal Server Error" });
  }
}

export async function unblockMentor(req, res) {
  try {
    const id = req.params.id;

    const mentor = await mentorModel.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );

    if (!mentor) {
      return res.status(404).send({ error: "Mentor not found" });
    }

    res
      .status(200)
      .send({ error: false, message: "Mentor has been unblocked", mentor });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message || "Internal Server Error" });
  }
}

export async function updateMentor(req, res) {
  try {
    console.log(req.body);
    console.log(req.file);
    console.log(req.params.id);

    let data = req.body;
    if (req.file != undefined) {
      data.photo = req.file.path;
    } else {
    }

    const id = req.params.id;
    const result = await mentorModel.findByIdAndUpdate(id, data);
    res
      .status(200)
      .send({ error: false, message: "Mentor updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message || "Internal Server Error" });
  }
}

export async function updateMentorStatus(req, res) {
  try {
    let status = req.body.status;
    let id = req.params.id;
    const result = await mentorModel.findByIdAndUpdate(id, { status: status });
    console.log(result);

    if (!result)
      return res
        .status(404)
        .send({ error: true, message: " Mentor not found" });

    res.status(200).send({ error: false, message: " Successfully approved!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message || "Internal Server Error" });
  }
}
export async function pendingMentorsCount(req, res) {
  try {
    const pendingCount = await mentorModel.countDocuments({ status: "3" });
    res.status(200).json({ pendingMentors: pendingCount });
  } catch (error) {
    console.error("Error fetching pending mentors count:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
}
