import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, CardContent, Typography, Box, Tabs, Tab, Snackbar } from "@mui/material";
import CourseCurriculum from "../courses/course-curriculum";
import CourseLanding from "../courses/course-landing";
import CourseSettings from "../courses/course-settings";
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "../../helper/helper";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "../config";
import { InstructorContext } from "../context";
import { AuthContext } from "../authContext";

function AddNewCoursePage() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === "" || value === null || value === undefined;
  }

  function validateFormData() {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }

    let hasFreePreview = false;

    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }

      if (item.freePreview) {
        hasFreePreview = true;
      }
    }

    return hasFreePreview;
  }

  async function handleCreateCourse() {
    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublished: true,
    };

    setLoading(true);

    try {
      const response =
        currentEditedCourseId !== null
          ? await updateCourseByIdService(currentEditedCourseId, courseFinalFormData)
          : await addNewCourseService(courseFinalFormData);

      if (response?.success) {
        setCourseLandingFormData(courseLandingInitialFormData);
        setCourseCurriculumFormData(courseCurriculumInitialFormData);
        setSuccess("Course saved successfully!");
        navigate(-1);
        setCurrentEditedCourseId(null);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      setError("Error saving course. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCurrentCourseDetails() {
    const response = await fetchInstructorCourseDetailsService(currentEditedCourseId);

    if (response?.success) {
      const setCourseFormData = Object.keys(courseLandingInitialFormData).reduce((acc, key) => {
        acc[key] = response?.data[key] || courseLandingInitialFormData[key];
        return acc;
      }, {});

      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(response?.data?.curriculum || courseCurriculumInitialFormData);
    } else {
      setError("Failed to fetch course details.");
    }
  }

  useEffect(() => {
    if (params?.courseId) {
      setCurrentEditedCourseId(params?.courseId);
    } else {
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
      setCurrentEditedCourseId(null); 
    }
  }, [params?.courseId]);

  useEffect(() => {
    if (currentEditedCourseId) {
      fetchCurrentCourseDetails();
    }
  }, [currentEditedCourseId]);

  return (
    <Box sx={{ padding: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          {currentEditedCourseId ? "Edit Course" : "Create New Course"}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          disabled={!validateFormData() || loading}
          onClick={handleCreateCourse}
          sx={{
            backgroundColor: "#001F3F",
            color: "white",
            "&:hover": { backgroundColor: "#001A36" },
          }}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Curriculum" />
            <Tab label="Course Landing Page" />
            <Tab label="Settings" />
          </Tabs>

          <Box sx={{ paddingTop: 2 }}>
            {activeTab === 0 && (
              <CourseCurriculum
                formData={courseCurriculumFormData}
                setFormData={setCourseCurriculumFormData}
              />
            )}
            {activeTab === 1 && (
              <CourseLanding
                formData={courseLandingFormData}
                setFormData={setCourseLandingFormData}
              />
            )}
            {activeTab === 2 && <CourseSettings />}
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={() => {
          setError(null);
          setSuccess(null);
        }}
        message={error || success}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}

export default AddNewCoursePage;
