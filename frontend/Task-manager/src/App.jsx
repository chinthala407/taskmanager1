import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";

import Users from "./components/admin/Users";
import Tasks from "./components/admin/Tasks";
import Reports from "./components/admin/Reports";
import Settings from "./components/admin/Settings";
import Notifications from "./components/admin/Notifications";

import MyTasks from "./components/user/MyTasks";
import CompletedTasks from "./components/user/CompletedTasks";
import Profile from "./components/user/Profile";
import UserSettings from "./components/user/UserSettings";
import UserReports from "./components/user/UserReports";
import UserNotifications from "./components/user/UserNotifications";
import TaskCalendar from "./components/user/TaskCalendar";

import ProtectedRoute from "./components/ProtectedRoute";

import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* PUBLIC ROUTES */}

                <Route
                    path="/"
                    element={<LandingPage />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/verify-otp"
                    element={<VerifyOTP />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />



                {/* ADMIN ROUTES */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        index
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="users"
                        element={<Users />}
                    />

                    <Route
                        path="tasks"
                        element={<Tasks />}
                    />

                    <Route
                        path="reports"
                        element={<Reports />}
                    />

                    <Route
                        path="notifications"
                        element={<Notifications />}
                    />

                    <Route
                        path="settings"
                        element={<Settings />}
                    />

                </Route>



                {/* USER ROUTES */}

                <Route
                    path="/user"
                    element={
                        <ProtectedRoute role="user">
                            <UserLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        index
                        element={<UserDashboard />}
                    />

                    <Route
                        path="tasks"
                        element={<MyTasks />}
                    />

                    <Route
                        path="calendar"
                        element={<TaskCalendar />}
                    />

                    <Route
                        path="completed"
                        element={<CompletedTasks />}
                    />

                    <Route
                        path="reports"
                        element={<UserReports />}
                    />

                    <Route
                        path="notifications"
                        element={<UserNotifications />}
                    />

                    <Route
                        path="profile"
                        element={<Profile />}
                    />

                    <Route
                        path="settings"
                        element={<UserSettings />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>

    );

}

export default App;
