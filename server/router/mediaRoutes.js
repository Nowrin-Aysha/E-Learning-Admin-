import express from "express";
import multer from "multer";


import { lBulkUpload, lDelete, lUpload } from "../controller/mediaController.js";


const mediaRouter = express.Router();

const upload = multer({ dest: "public/uploads/" });
 


mediaRouter.post("/upload",upload.single("file"),lUpload);
mediaRouter.delete("/delete/:id",lDelete);
mediaRouter.post("/bulk-upload", upload.array("files", 10),lBulkUpload);


export default mediaRouter;