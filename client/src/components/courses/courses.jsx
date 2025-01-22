import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  fetchInstructorCourseListService,
  deleteCourseService,
} from "../../helper/helper";

function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      try {
        const response = await fetchInstructorCourseListService();
        if (response?.success) {
          setCourses(response.data);
        } else {
          setError("Failed to load courses.");
        }
      } catch {
        setError("An error occurred while fetching courses.");
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  const handleDeleteCourse = async () => {
    try {
      await deleteCourseService(selectedCourseId);
      setCourses(courses.filter(course => course._id !== selectedCourseId));
      setDeleteDialogOpen(false);
      setSelectedCourseId(null);
    } catch {
      setError("Failed to delete course.");
    }
  };

  const handleViewCourse = (courseId) => {
    navigate(`/add-new-course/${courseId}?mode=view`);
  };

  return (
    <div style={{ padding: "10px", height: "100vh", width: "100vw", backgroundColor: "#f4f4f4" }}>
      <Card style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <CardHeader
          title={<Typography variant="h4" fontWeight="bold">All Courses</Typography>}
          action={
            <Button
              variant="contained"
              style={{ backgroundColor: "#001f54", color: "#fff", fontWeight: "bold", padding: "10px 20px" }}
              onClick={() => navigate("/create-new-course")}
            >
              Create New Course
            </Button>
          }
        />
        <CardContent>
          <TableContainer component={Paper} style={{ borderRadius: "8px", overflow: "hidden" }}>
            {loading ? (
              <Typography align="center" style={{ padding: "20px" }}>Loading courses...</Typography>
            ) : error ? (
              <Typography align="center" style={{ padding: "20px", color: "red" }}>{error}</Typography>
            ) : (
              <Table>
                <TableHead style={{ backgroundColor: "#e0e0e0" }}>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Course</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Students</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Revenue</TableCell>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.length > 0 ? (
                    courses.map((course) => (
                      <TableRow key={course._id}>
                        <TableCell>{course.title}</TableCell>
                        <TableCell>{course.students?.length || 0}</TableCell>
                        <TableCell>${((course.students?.length || 0) * (course.pricing || 0)).toFixed(2)}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="View" arrow>
                            <IconButton color="primary" onClick={() => handleViewCourse(course._id)}>
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit" arrow>
                            <IconButton color="primary" onClick={() => navigate(`/add-new-course/${course._id}`)}>
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete" arrow>
                            <IconButton color="error" onClick={() => { setSelectedCourseId(course._id); setDeleteDialogOpen(true); }}>
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography>No courses available</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this course?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleDeleteCourse} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Courses;
