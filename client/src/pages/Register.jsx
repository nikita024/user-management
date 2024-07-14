import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { registerUser, setRegisterFormInput } from "../redux/slices/userSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registerForm = useSelector((state) => state.users.registerForm);

  const handleChange = (e) => {
    dispatch(setRegisterFormInput({ name: e.target.name, value: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser());
    if (result.success) {
      alert("Register Successfully!");
      toast.success("Register Successfully!");
      navigate("/login");
    } else {
      console.log(result.error);
      toast.error(result.error.response.data);
    }
  };


  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Register</h1>
        <form>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              required
              type="text"
              id="username"
              placeholder="Enter your username"
              name="username"
              value={registerForm.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              required
              type="email"
              id="email"
              placeholder="Enter your email"
              name="email"
              value={registerForm.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              required
              type="password"
              id="password"
              placeholder="Enter your password"
              name="password"
              value={registerForm.password}
              onChange={handleChange}
            />
          </div>
          <button onClick={handleSubmit}>Register</button>
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
        
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;