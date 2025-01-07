import { uploadMediaToCloudinary, deleteMediaFromCloudinary } from "../controller/cloudinary.js";
import mediaRouter from "../router/mediaRoutes.js";





export const lUpload=  async (req, res) => {
    try {
      
      const result = await uploadMediaToCloudinary(req.file.path);
  
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (e) {
      console.log(e);
  
      res.status(500).json({ success: false, message: "Error uploading file" });
    }
  }

  export const lDelete =  async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Assest Id is required",
        });
      }
  
      await deleteMediaFromCloudinary(id);
  
      res.status(200).json({
        success: true,
        message: "Assest deleted successfully from cloudinary",
      });
    } catch (e) {
      console.log(e);
  
      res.status(500).json({ success: false, message: "Error deleting file" });
    }
  }

   export const lBulkUpload = async (req, res) => {
    try {
      const uploadPromises = req.files.map((fileItem) =>
        uploadMediaToCloudinary(fileItem.path)
      );
  
      const results = await Promise.all(uploadPromises);
  
      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (event) {
      console.log(event);
  
      res
        .status(500)
        .json({ success: false, message: "Error in bulk uploading files" });
    }
  }
  
  