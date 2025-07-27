//import "./signup.css";
import { useRef, useState } from 'react';
import Header from "../../header/header";
import axios from "../../../interceptor";
import { toast, ToastContainer } from "react-toastify";
import { apiEndPoint } from "../../../webApi/webapi";
import { Link, useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Footer from "../../footer/footer";
import Loader from "../../Spinner/Loader";

function SignUp() {
    const [otpSent, setOtpSent] = useState(false);
    const name = useRef("");
    const email = useRef("");
    const password = useRef("");
    const contact = useRef("");
    const otpInput = useRef("");
    const [profileImage, setProfileImage] = useState(null);
    const [isSignupDisabled, setIsSignupDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    // const [generatedOtp, setGeneratedOtp] = useState(null);
    // const [otpExpiryTime, setOtpExpiryTime] = useState(null);

    const changeHome = () => {
        navigate("/signin");
    };

    const profileUpload = (event) => {
        setProfileImage(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post(apiEndPoint.USER_VERIFY, {
                name: name.current.value,
                email: email.current.value
            });
            setOtpSent(true);
            setModal(true); // Show modal for OTP entry
            toast.success("OTP sent to your email!");
            console.log("OTP sent successfully.");
        } catch (err) {
            console.error("Error during email verification:", err);
            setModal(false);
            toast.warning(err.response?.status === 400 ? "User already exists" : "Something went wrong.");
        }
    };
    const handleRegistration = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(apiEndPoint.USER_SIGNUP, {        //line 69
                name: name.current.value,
                email: email.current.value,
                contact: contact.current.value,
                password: password.current.value,
                profileImage,
                otp: otpInput.current.value,
            });
            if (response.data.status) {
                toast.success("Registration successful!");
                setModal(false);
                navigate("./signin");
            } else {
                //toast.error("Registration failed.");
                toast.error(response.data.message);
            }
        } catch (err) {
            console.log(otpInput.current.value)
            console.error("Error during registration:", err);
        toast.error(err.response?.data?.message || "Registration failed.");
        } finally {
            setIsLoading(false);
        }
    };


    // const registration = async () => {
    //     try {
    //         const enteredOtp = otpInput.current.value;
    //         if (enteredOtp !== generatedOtp) {
    //             toast.error("Invalid OTP");
    //             return;
    //         }

    //         const formData = new FormData();
    //         formData.append("profile", profileImage);
    //         formData.set("name", name.current.value);
    //         formData.set("email", email.current.value);
    //         formData.set("contact", contact.current.value);
    //         formData.set("password", password.current.value);

    //         setLoader(true);
    //         const response = await axios.post(apiEndPoint.USER_SIGNUP, formData);
    //         console.log("Registration Response:", response.data);
    //         toast.success("Registration successful");
    //         setLoader(false);
    //         navigate("/signin");
    //     } catch (err) {
    //         console.error("Error:", err);
    //         toast.error("Something went wrong");
    //     }
    // };

    const signupSubmitBtn = () => {
        const nameValue = name.current.value;
        const emailValue = email.current.value;
        const passwordValue = password.current.value;
        const contactValue = contact.current.value;
        setIsSignupDisabled(!(emailValue && passwordValue.length >= 8 && nameValue && contactValue.length === 10));
    };

    return (
        <>
            <Header />
            <ToastContainer />
            {loader && isLoading && <Loader />}
            <div className="breadcrumbs-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumbs-menu">
                                <ul>
                                    <li><a onClick={changeHome}>Home</a></li>
                                    <li><a href="#" className="active">SignUp</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="vh-100">
                <div className="container h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-lg-12 col-xl-11">
                            <div className="row justify-content-center">
                                <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-2 order-lg-1 mb-3">
                                    <img
                                        src="https://images.unsplash.com/photo-1608099269227-82de5da1e4a8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGJvb2tzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=400&q=60"
                                        className="img-fluid img-responsive signupimg"
                                        style={{ borderRadius: "0px 10% 0% 10%", boxShadow: "0px 0px 15px gray", height: "400px", width: "90%", backgroundSize: "contain" }}
                                        alt="Sample image"
                                    />
                                </div>

                                <div className="col-md-10 col-lg-6 col-xl-5 order-1 order-lg-2">
                                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4" style={{ color: "#f07c29", textShadow: "2px 2px 2px gray" }}>Sign up</p>
                                    <form onSubmit={otpSent ? handleRegistration : handleSubmit} id='registrationForm'>
                                    <div className="form-group">

                                        <input ref={name} type="text" onBlur={signupSubmitBtn} placeholder="Enter name" className="form-control" id="name" name="name" required />
                                    </div>
                                    <div className="form-group">
                                        <input ref={email} type="email" onBlur={signupSubmitBtn} placeholder="Enter email" className="form-control" id="email" name="email" required />
                                    </div>
                                    <div className="form-group">

                                        <input ref={password} type="password" onBlur={signupSubmitBtn} placeholder="Enter password" className="form-control" id="password" name="password" required />
                                    </div>
                                    <div className="form-group">
                                        <input ref={contact} type="text" onBlur={signupSubmitBtn} placeholder="Enter contact number" id="contact" className="form-control" required />
                                    </div>
                                    <div>
                                        <i className="fa fa-mars-stroke me-3" style={{ fontSize: "18px" }}></i>
                                        <input className="" type="radio" value="MALE" name="gender" defaultChecked /> Male
                                        <input className="mb-4 ms-4" type="radio" value="FEMALE" name="gender" /> Female
                                        <input className="mb-4 ms-4" type="radio" value="OTHER" name="gender" /> Other
                                    </div>
                                    <div>
                                        <i className="fa fa-user me-3"></i>
                                        <input onChange={profileUpload} className="mb-4" type="file" accept="image" required />
                                    </div>
                                    <div className="form-group text-center">
                                            {modal ?
                                                <button type="submit" className="btn submitbtn w-100">
                                            Sign Up
                                        </button> : <button type="submit" className="btn submitbtn w-100" data-toggle="modal" data-target="#exampleModalCenter">
                                            Sign Up
                                        </button>
                                            }
                                    </div>

                                    <div className="text-center">
                                        <Link to='/signin'>I Already Have an Account</Link>
                                    </div>

                                </form>
                            </div>
                                {/* OTP Modal */}
                                <div className={`modal ${modal ? 'show' : ''}`} style={{ display: modal ? 'block' : 'none' }}>
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header">Registration Page
                                                <button type="button" className="close" onClick={() => setModal(false)}>
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <h6>Enter the OTP sent to your email to verify your account</h6>
                                                <input ref={otpInput} type="text" className="form-control" placeholder="Enter OTP" maxLength="4" />
                                                <button onClick={handleRegistration} className="btn btn-warning mt-3" data-bs-dismiss="modal">Validate</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default SignUp;
