import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Suspense, lazy } from "react";

import SignupPage from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import MainDashboard from './pages/MainDashboard'
import Navigation from "./pages/Navigation";
import AdminRoute from "./pages/admin/AdminRoute";
import UserRoute from "./pages/User/UserRoute";
import Footer from "./pages/Footer";
import Contact from "./pages/Contact";
import NotFound from './pages/NotFound'

// Lazy loaded pages for code splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/User/Profile"));
const ProjectList = lazy(() => import("./pages/admin/ProjectList"));
const UserList = lazy(() => import("./pages/admin/UserList"));
const TeamList = lazy(() => import("./pages/admin/TeamList"));
const ProjectDetail = lazy(() => import("./pages/admin/ProjectDetail"));
const ModuleDetail = lazy(() => import("./pages/admin/ModuleDetail"));
const TaskDetails = lazy(() => import("./pages/User/TaskDetails"));

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Navigation />
        <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>}>
          <Routes>
            {/* Routes for EveryOne */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<MainDashboard />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />

            {/* User Dashboard Routes */}
            <Route path="/user" element={<UserRoute />}>
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="dashboard/:projectId" element={<UserDashboard />} />
              <Route path="dashboard/:projectId/:moduleId" element={<UserDashboard />} />
              <Route path="dashboard/:projectId/:moduleId/:taskId" element={<UserDashboard />} />
              <Route path="projectsList/:projectId/:moduleId" element={<ModuleDetail />} />
              <Route path="projectsList/:projectId/:moduleId/:taskId" element={<TaskDetails />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="usersList" element={<UserList />} />
              <Route path="teamList" element={<TeamList />} />
              <Route path="projectsList" element={<ProjectList />} />
              <Route path="projectsList/:projectId" element={<ProjectDetail />} />
              <Route path="projectsList/:projectId/:moduleId" element={<ModuleDetail />} />
              <Route path="projectsList/:projectId/:moduleId/:taskId" element={<TaskDetails />} />
            </Route>
          </Routes>
          <Footer />
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
