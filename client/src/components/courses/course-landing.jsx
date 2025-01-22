import React, { useContext, useEffect } from "react";
import { Card, CardContent, CardHeader, Typography, Box } from "@mui/material";
import { courseLandingPageFormControls } from "../config";
import { InstructorContext } from "../context";
import FormControls from "../common-form/form-control";

function CourseLanding() {
  const { courseLandingFormData, setCourseLandingFormData } = useContext(InstructorContext);

  
  useEffect(() => {
    if (!courseLandingFormData || Object.keys(courseLandingFormData).length === 0) {
      const initialData = {};
      courseLandingPageFormControls.forEach((control) => {
        initialData[control.id] = "";
      });
      setCourseLandingFormData(initialData);
    }
  }, [courseLandingFormData, setCourseLandingFormData]);

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
            <Typography variant="h5" fontWeight="bold" align="center">
              Course Landing Page
            </Typography>
          }
        />
        <CardContent>
          <FormControls
            formControls={courseLandingPageFormControls}
            formData={courseLandingFormData}
            setFormData={setCourseLandingFormData}
          />
        </CardContent>
      </Card>
    </Box>
  );
}

export default CourseLanding;
