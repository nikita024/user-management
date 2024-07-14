import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./style.css"
import Sidebar from "./components/Sidebar";
import Profile from "./pages/Profile";
// import Home from "./pages/Home";
import Reports from "./pages/Reports";
import CreateProfile from "./pages/CreateProfile";
import PageNotFound from "./pages/PageNotFound";
import ContactPage from "./pages/ContactPage";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <Outlet />
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/profile/create",
        element: <CreateProfile />,
      },
      {
        path: "/profile/:profileId",
        element: <Profile />,
      },
      {
        path: "/reports",
        element: <Reports />,
      },
      {
        
        path: "*",
        element: <PageNotFound />,
      },

      {
        path: "/contact",
        element: <ContactPage />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  
]);

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
       </div>
    </div>
  );
}

export default App;