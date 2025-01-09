import { createBrowserRouter, redirect } from "react-router-dom";
import RegisterPage from "../views/RegisterPage";
import LoginPage from "../views/LoginPage";
import DashboardPageSPV from "../views/DashboardPageSPV";
// import BaseLayout from "../views/BaseLayout";
import DashboardPage from "../views/DashboardPage";
import DashboardPageManager from "../views/DashboardPageManager";
import LeavePage from "../components/LeaveForm";
import Swal from "sweetalert2";

const url = "http://localhost:3000";
const router = createBrowserRouter([
  {
    path: "/register",
    element: <RegisterPage url={url} />,
  },
  {
    path: "/leave-page",
    element: <LeavePage url={url} />,
  },
  {
    path: "/login",
    element: <LoginPage url={url} />,
    loader: () => {
      if (localStorage.access_token) {
        Swal.fire({
          title: "You are Logged In",
          icon: "question",
        });
        return redirect("/");
      }
    },
  },
  {
    path: "/",
    element: <DashboardPage url={url} />,
    loader: () => {
      if (!localStorage.access_token) {
        Swal.fire({
          title: "Please login first",
          icon: "error",
        });
        return redirect("/login");
      }
      return null;
    },
  },
  {
    path: "/dashboard-page-spv",
    element: <DashboardPageSPV url={url} />,
    loader: () => {
      if (!localStorage.access_token) {
        Swal.fire({
          title: "Please login first",
          icon: "error",
        });
        return redirect("/login");
      }
      return null;
    },
  },
  {
    path: "/dashboard-page-manager",
    element: <DashboardPageManager url={url} />,
    loader: () => {
      if (!localStorage.access_token) {
        Swal.fire({
          title: "Please login first",
          icon: "error",
        });
        return redirect("/login");
      }
      return null;
    },
  },
]);

export default router;
