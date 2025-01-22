import React, { useState, useEffect, useRef, useContext } from "react";
import Swal from "sweetalert2"; 
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Box,
  Grid,
  LinearProgress,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import {
  mediaUploadService,
  mediaDeleteService,
} from "../../helper/helper";
import { courseCurriculumInitialFormData } from "../config";
import { InstructorContext } from "../context";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  useEffect(() => {
    const storedData = localStorage.getItem("courseCurriculumFormData");
    if (storedData) {
      setCourseCurriculumFormData(JSON.parse(storedData));
    }
  }, [setCourseCurriculumFormData]);

  useEffect(() => {
    localStorage.setItem(
      "courseCurriculumFormData",
      JSON.stringify(courseCurriculumFormData)
    );
  }, [courseCurriculumFormData]);

  const handleNewLecture = () => {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      { ...courseCurriculumInitialFormData[0] },
    ]);
  };

  const handleCourseTitleChange = (event, index) => {
    const updatedData = [...courseCurriculumFormData];
    updatedData[index] = { ...updatedData[index], title: event.target.value };
    setCourseCurriculumFormData(updatedData);
  };

  const handleFreePreviewChange = (event, index) => {
    const updatedData = [...courseCurriculumFormData];
    updatedData[index] = {
      ...updatedData[index],
      freePreview: event.target.checked,
    };
    setCourseCurriculumFormData(updatedData);
  };

  const handleSingleLectureUpload = async (event, index) => {
    const file = event.target.files[0];
    if (!file) return;

    setMediaUploadProgress(true);
    try {
      const videoFormData = new FormData();
      videoFormData.append("file", file);
      const response = await mediaUploadService(
        videoFormData,
        setMediaUploadProgressPercentage
      );
      if (response.success) {
        const updatedData = [...courseCurriculumFormData];
        updatedData[index] = {
          ...updatedData[index],
          videoUrl: response.data.url,
          public_id: response.data.public_id,
        };
        setCourseCurriculumFormData(updatedData);
      }
    } catch (error) {
      console.error("Upload Error:", error);
    } finally {
      setMediaUploadProgress(false);
    }
  };

  const handleReplaceVideo = async (index) => {
    const updatedData = [...courseCurriculumFormData];
    const publicId = updatedData[index]?.public_id;

    if (publicId) {
      const response = await mediaDeleteService(publicId);
      if (response.success) {
        updatedData[index] = { ...updatedData[index], videoUrl: "", public_id: "" };
        setCourseCurriculumFormData(updatedData);
      }
    }
  };
  

  const handleDeleteLecture = async (index) => {
   
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this lecture? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const updatedData = courseCurriculumFormData.filter((_, i) => i !== index);
      setCourseCurriculumFormData(updatedData);
      Swal.fire("Deleted!", "The lecture has been deleted.", "success");
    }
  };

  const isCourseCurriculumFormDataValid = () =>
    courseCurriculumFormData.every(
      (item) => item.title.trim() !== "" && item.videoUrl.trim() !== ""
    );

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
              Create Course Curriculum
            </Typography>
          }
        />
        <CardContent>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "navy",
              color: "white",
              "&:hover": { backgroundColor: "#003366" },
            }}
            disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
            onClick={handleNewLecture}
          >
            Add Lecture
          </Button>
          {mediaUploadProgress && (
            <Box mt={2}>
              <LinearProgress
                variant="determinate"
                value={mediaUploadProgressPercentage}
              />
            </Box>
          )}
          <Box mt={4}>
            {courseCurriculumFormData.map((item, index) => (
              <Box
                key={index}
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  padding: 2,
                  marginBottom: 2,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Lecture {index + 1}
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Lecture Title"
                      value={item.title}
                      onChange={(e) => handleCourseTitleChange(e, index)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={item.freePreview}
                          onChange={(e) => handleFreePreviewChange(e, index)}
                        />
                      }
                      label="Free Preview"
                    />
                  </Grid>
                </Grid>
                <Box mt={2}>
                  {item.videoUrl ? (
                    <Box display="flex" alignItems="center" gap={2}>
                      <video
                        src={item.videoUrl}
                        controls
                        style={{
                          width: "450px",
                          height: "200px",
                        }}
                      />
                      {/* <Button
                        variant="outlined"
                        onClick={() => handleReplaceVideo(index)}
                        sx={{
                          color: "navy",
                          borderColor: "navy",
                          fontSize: "70%",
                        }}
                      >
                        Replace Video
                      </Button> */}
                      <Button
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteLecture(index)}
                        sx={{
                          backgroundColor: "navy",
                          color: "white",
                          fontSize: "70%",
                        }}
                      >
                        Delete Lecture
                      </Button>
                    </Box>
                  ) : (
                    <TextField
                      type="file"
                      fullWidth
                      onChange={(e) => handleSingleLectureUpload(e, index)}
                      InputProps={{ inputProps: { accept: "video/*" } }}
                    />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CourseCurriculum;
