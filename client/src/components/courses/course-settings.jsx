import React, { useState, useContext } from "react";
import { Card, CardContent, CardHeader, Typography, Box, Input } from "@mui/material";
import MediaProgressbar from "../courses/MediaProgressbar"; 
import { InstructorContext } from "../context"; 
import { mediaUploadService } from "../../helper/helper"; 

function CourseSettings() {
  const { courseLandingFormData, setCourseLandingFormData } = useContext(InstructorContext);
  const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] = useState(0);


  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);

        const response = await mediaUploadService(imageFormData, setMediaUploadProgressPercentage);

        if (response.success) {
          setCourseLandingFormData((prev) => ({
            ...prev,
            image: response.data.url, 
          }));
        }
      } catch (e) {
        console.error("Error during image upload:", e);
      } finally {
        setMediaUploadProgress(false);
      }
    }
  }

  return (
    <Box
      sx={{
        padding: "10px",
        minHeight: "100vh",
        width: "90vw",
        backgroundColor: "#f4f4f4",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card sx={{ padding: 3, width: "90%", maxWidth: "1000px", boxShadow: 4 }}>
        <CardHeader
          title={
            <Typography variant="h5" fontWeight="bold">
              Course Image
            </Typography>
          }
        />
        <CardContent>
          <Box sx={{ padding: 2 }}>
            {mediaUploadProgress && (
              <MediaProgressbar
                isMediaUploading={mediaUploadProgress}
                progress={mediaUploadProgressPercentage}
              />
            )}
          </Box>

          {courseLandingFormData?.image ? (
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
              <img
                src={courseLandingFormData.image}
                alt="Course"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
              <Typography variant="body1">Upload Course Image</Typography>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUploadChange}
                sx={{
                  padding: 1,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  cursor: "pointer",
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default CourseSettings;
