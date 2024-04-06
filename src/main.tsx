import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login.tsx";
import ForgetPassword from "./pages/ForgetPassword.tsx";
import UserProfile from "./pages/UserProfile.tsx";
import EditProfile from "./pages/EditProfile.tsx";
import ViewSessions from "./pages/ViewSessions.tsx";
import Register from "./pages/Register.tsx";
import NotFoundUser from "./pages/NotFoundUser.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import CreateSession from "./pages/CreateSession.tsx";
import RequestsPage from "./pages/RequestsPage.tsx";
import SingleSession from "./pages/SingleSession.tsx";
import ViewHostedSessions from "./pages/ViewHostedSessions.tsx";
import ViewJoinedSessions from "./pages/ViewJoinedSessions.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import EditSession from "./pages/EditSession.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/Register",
    element: <Register />,
  },
  {
    path: "/ForgetPassword",
    element: <ForgetPassword />,
  },
  {
    path: "/UserProfile/:username",
    element: <UserProfile />,
  },
  {
    path: "/NotFoundUser/:username",
    element: <NotFoundUser />,
  },
  {
    path: "/UserProfile/EditProfile/:username",
    element: <EditProfile />,
  },
  {
    path: "/ViewSessions",
    element: <ViewSessions />,
  },
  {
    path: "/ViewJoinedSessions",
    element: <ViewJoinedSessions />,
  },
  {
    path: "/ViewHostedSessions",
    element: <ViewHostedSessions />,
  },
  {
    path: "/CreateSession",
    element: <CreateSession />,
  },
  {
    path: "/SingleSession/:sessionID",
    element: <SingleSession />,
  },
  {
    path: "/RequestsPage",
    element: <RequestsPage />,
  },
  {
    path: "/ResetPassword/:emailToken",
    element: <ResetPassword />,
  },
  {
    path: "/EditSession/:sessionID",
    element: <EditSession />,
  },
  {
    path: "/NotFoundPage",
    element: <NotFoundPage />
  }
]);


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);
