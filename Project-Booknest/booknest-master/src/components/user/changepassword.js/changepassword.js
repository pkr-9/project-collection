import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../header/header';
import './changepassword.css'
import { useRef } from 'react';
import { apiEndPoint } from '../../../webApi/webapi';
import { ToastContainer, toast } from 'react-toastify';
import axios from '../../../interceptor.js';
function ChangePassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location?.state?.user; // Email passed from ForgetPassword
    const password = useRef(null);
    const confirmPassword = useRef(null);
  
    const handlePasswordUpdate = async (event) => {
      event.preventDefault();
      if (password.current.value === confirmPassword.current.value) {
        try {
          const response = await axios.post(apiEndPoint.FORGOT_PASSWORD, {
            email,
            password: password.current.value,
          });
          if (response.data.status) {
            toast.success("Password updated successfully.");
            navigate("/signin");
          } else {
            toast.error("Error updating password.");
          }
        } catch (error) {
          toast.error("An error occurred. Please try again.");
        }
      } else {
        toast.error("Passwords do not match.");
      }
    };
  
    return (
      <>
        <ToastContainer />
        <div className="container">
          <div className="row m-auto">
            <div className="col-md-4 col-md-offset-4 m-auto forgetpassword mt-5">
              <div className="panel panel-default">
                <div className="panel-body">
                  <div className="text-center">
                    <h3 className="mt-1">
                      <img
                        src="\img\changepassword.jpg"
                        alt="Image No Found"
                        className="changepasswordimg"
                      />
                    </h3>
                    <h2 className="text-center mt-2">Change Password?</h2>
  
                    <div className="panel-body">
                      <form onSubmit={handlePasswordUpdate}>
                        <div className="form-group">
                          <div className="input-group mt-3">
                            <span className="input-group-addon mt-2">
                              <i className="glyphicon glyphicon-envelope color-blue" />
                            </span>
                            <input
                              placeholder="Enter New Password "
                              ref={password}
                              className="form-control"
                              type="password"
                            />
                          </div>
                          <div className="input-group mt-3">
                            <span className="input-group-addon mt-2">
                              <i className="glyphicon glyphicon-envelope color-blue" />
                            </span>
                            <input
                              placeholder="Enter Confirm Password "
                              ref={confirmPassword}
                              className="form-control"
                              type="password"
                            />
                          </div>
                          <div className="form-group">
                            <input
                              name="recover-submit"
                              className="btn btn-lg changepasswordbutton btn-block"
                              defaultValue="Reset Password"
                              type="submit"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  export default ChangePassword;