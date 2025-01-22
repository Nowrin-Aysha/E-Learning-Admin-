import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';

const MentorDetailsPage = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [courses, setCourses] = useState([]);

  
  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        
        const mentorResponse = await axios.get(`http://localhost:5001/api/mentor/getMentor/${mentorId}`);
        setMentor(mentorResponse.data);

      
        const coursesResponse = await axios.get(`http://localhost:5001/api/mentor/getCoursesByMentor/${mentorId}`);
        setCourses(coursesResponse.data);
      } catch (error) {
        console.error('Error fetching mentor or courses details:', error);
      }
    };

    fetchMentorDetails();
  }, [mentorId]);

  
  const handleDeleteMentor = async () => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:5001/api/mentor/deleteMentor/${mentorId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });

          if (response.data.error === false) {
            Swal.fire('Deleted!', 'Your mentor profile has been deleted.', 'success');
            navigate('/mentors'); 
          }
        } catch (error) {
          console.error('Error deleting mentor:', error);
          Swal.fire('Error!', 'There was an error deleting the mentor.', 'error');
        }
      }
    });
  };

  
  const handleDeleteCourse = async (courseId) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:5001/api/course/deleteCourse/${courseId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });

          if (response.data.error === false) {
            Swal.fire('Deleted!', 'The course has been deleted.', 'success');
            setCourses(courses.filter(course => course._id !== courseId));  t
          }
        } catch (error) {
          console.error('Error deleting course:', error);
          Swal.fire('Error!', 'There was an error deleting the course.', 'error');
        }
      }
    });
  };

  
  const handleEditMentor = () => {
    navigate(`/edit-mentor/${mentorId}`);  
  };

  if (!mentor) return null;  

  return (
    <div>
      <h1>Mentor Details</h1>
      <div>
        <p><strong>Name:</strong> {mentor.name}</p>
        <p><strong>Email:</strong> {mentor.email}</p>
        <p><strong>Phone:</strong> {mentor.phone}</p>
        <p><strong>Status:</strong> {mentor.status}</p>
        <p><strong>Joined Date:</strong> {new Date(mentor.joinedDate).toLocaleDateString('en-GB')}</p>
        <img src={`http://localhost:5001/${mentor.photo}`} alt={mentor.name} style={{ width: '120px', borderRadius: '50%' }} />

        <div className="mt-4">
          <Button variant="primary" onClick={handleEditMentor}>Edit Mentor</Button>
          <Button variant="danger" onClick={handleDeleteMentor} className="ml-2">Delete Mentor</Button>
        </div>
      </div>

      <h2 className="mt-5">Courses by {mentor.name}</h2>

      <Row className="mt-4">
        {courses.length > 0 ? (
          courses.map((course) => (
            <Col md={4} key={course._id} className="mb-3">
              <Card>
                <Card.Img variant="top" src={`http://localhost:5001/${course.image}`} />
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Text>{course.description}</Card.Text>
                  <Button variant="primary" onClick={() => navigate(`/course-details/${course._id}`)}>View Course</Button>
                  <Button variant="danger" onClick={() => handleDeleteCourse(course._id)} className="ml-2">Delete Course</Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No courses added yet.</p>
        )}
      </Row>
    </div>
  );
};

export default MentorDetailsPage;
