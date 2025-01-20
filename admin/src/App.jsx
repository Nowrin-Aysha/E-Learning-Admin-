import { createBrowserRouter, RouterProvider } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Dashboard from "./components/signin/dashboard/Dashboard";
import AddAdminPage from "./components/admin/AddAdminPage";
import AddMentorPage from "./components/mentor/AddMentorPage";
import MentorsPage from "./components/mentor/MentorsPage";
import MentorDetailsPage from "./components/mentor/mentorDetails";
import AdminsPage from "./components/admin/AdminsPage";
import Login from "./components/signin/AdminLogin";
import Register from "./components/signin/MentorRegister";
import MentorLogin from "./components/signin/MentorLogin";
import MentorRegister from "./components/signin/MentorRegister";
import Profile from "./components/signin/dashboard/profile";
import Courses from "./components/courses/courses";
import CourseCurriculum from "./components/courses/course-curriculum";
import CourseLanding from "./components/courses/course-landing";
import CourseSettings from "./components/courses/course-settings";
import AddNewCoursePage from "./components/courses/add-new-course";
import OtpValidation from "./components/signin/otpValidation"  

function App() {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/mentorLogin",
        element: <MentorLogin />,
      },
      {
        path: "/mentorRegister",
        element: <MentorRegister />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/add-admin",
        element: <AddAdminPage />,
      },
      {
        path: "/add-mentor",
        element: <AddMentorPage />,
      },
      {
        path: "/courses",
        element: <Courses />,
      },
      {
        path: "/create-new-course",
        element: <AddNewCoursePage />,
      },
      {
        path: "/add-new-course/:courseId",
        element: <AddNewCoursePage />,
      },
      {
        path : "/course-curriculum",
        element:<CourseCurriculum/>
      },
      {
        path : "/course-landing",
        element:<CourseLanding/>
      },
      {
        path : "/course-settings",
        element:<CourseSettings/>
      },
      {
        path: "/mentors",
        element: <MentorsPage />,
      },
      {
        path: "/mentor-details/:mentorId",
        element: <MentorDetailsPage />,
      },
      {
        path: "/admins",
        element: <AdminsPage />,
      },
      {
        path: "/validate-otp", 
        element: <OtpValidation />,
      },
      {
        path: "*",
        element: <div>Page Not Found</div>,
      },
    ]
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
