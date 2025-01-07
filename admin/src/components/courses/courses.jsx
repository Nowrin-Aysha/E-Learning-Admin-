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
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fetchInstructorCourseListService, deleteCourseService } from "../../helper/helper";

function Courses() {
  const navigate = useNavigate();
  const [listOfCourses, setListOfCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setError(null);
        const response = await fetchInstructorCourseListService();
        if (response?.success) {
          setListOfCourses(response?.data);
        } else {
          throw new Error("Failed to fetch courses");
        }
      } catch (error) {
        setError(error.message || "An error occurred while fetching courses");
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  const handleDeleteCourse = async () => {
    if (courseToDelete) {
      try {
        await deleteCourseService(courseToDelete);
        setListOfCourses(listOfCourses.filter(course => course._id !== courseToDelete));
        setOpenDeleteDialog(false);
        setCourseToDelete(null);
      } catch (error) {
        setError("Error deleting course");
      }
    }
  };

  return (
    <div
      style={{
        padding: "10px",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f4f4f4",
      }}
    >
      <Card style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <CardHeader
          title={
            <Typography variant="h4" component="div" style={{ fontWeight: "bold" }}>
              All Courses
            </Typography>
          }
          action={
            <Button
              variant="contained"
              style={{
                backgroundColor: "#001f54",
                color: "#fff",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
              onClick={() => navigate("/create-new-course")}
            >
              Create New Course
            </Button>
          }
        />
        <CardContent>
          <TableContainer component={Paper} style={{ borderRadius: "8px", overflow: "hidden" }}>
            {loading ? (
              <Typography align="center" style={{ padding: "20px" }}>
                Loading courses...
              </Typography>
            ) : error ? (
              <Typography align="center" style={{ padding: "20px", color: "red" }}>
                {error}
              </Typography>
            ) : (
              <Table>
                <TableHead style={{ backgroundColor: "#e0e0e0" }}>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Course</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Students</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Revenue</TableCell>
                    <TableCell align="right" style={{ fontWeight: "bold" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listOfCourses && listOfCourses.length > 0 ? (
                    listOfCourses.map((course) => (
                      <TableRow key={course._id}>
                        <TableCell>{course?.title}</TableCell>
                        <TableCell>{course?.students?.length || 0}</TableCell>
                        <TableCell>
                          ${((course?.students?.length || 0) * (course?.pricing || 0)).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit" arrow>
                            <IconButton
                              color="primary"
                              onClick={() => {
                                navigate(`/add-new-course/${course?._id}`);
                              }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete" arrow>
                            <IconButton
                              color="error"
                              onClick={() => {
                                setCourseToDelete(course._id);
                                setOpenDeleteDialog(true);
                              }}
                            >
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

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this course?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteCourse} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Courses;
