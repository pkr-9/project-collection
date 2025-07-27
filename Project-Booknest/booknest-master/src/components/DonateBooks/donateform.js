import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "../header/header";
import Footer from "../footer/footer";
import { fetchState } from "../../router-config/stateSlice";
import { fetchCategory } from "../../router-config/categorySlice";
import { fetchCitiesByState } from "../../router-config/citySlice";
import { imageToBase64 } from "../../utils/imageToBase64"; // Added for image conversion
import { addBook, resetAddBookState } from "../../router-config/addBookSlice"; // Import addBook actions
import axios from "../../interceptor.js"; // Updated to use interceptor

function DonateForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form state variables
  const [bookName, setBookName] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [language, setLanguage] = useState("");
  const [edition, setEdition] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [pincode, setPincode] = useState("");
  const [cityId, setCityId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stateId, setStateId] = useState(""); // Track selected state ID
  const [photoBase64, setPhotoBase64] = useState(""); // Modified for Base64 image
  const [price, setPrice] = useState(""); // Optional price field
  //const [selectedFile, setSelectedFile] = useState(null);

  // Redux selectors
  const { categoryList = [] } = useSelector((state) => state.category || {});
  const { currentUser } = useSelector((state) => state.user || {});
  const { stateList = [] } = useSelector((state) => state.state || {});
  const { cityList = [] } = useSelector((state) => state.city || {});
  const { loading = false, success = false, error = null } = useSelector((state) => state.addBook);

  useEffect(() => {
    dispatch(fetchState());
    dispatch(fetchCategory());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Book donated successfully!");
      navigate("/book");
      dispatch(resetAddBookState()); // Reset addBook state after successful donation
    } else if (error) {
      toast.error("Failed to donate book.");
    }
  }, [success, error, dispatch, navigate]);

  // Convert image file to Base64
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    //setSelectedFile(file); // Store it in state
    if (file) {
      try {
        const base64String = await imageToBase64(file); // Convert image to Base64
        setPhotoBase64(base64String);
      } catch (error) {
        console.error("Error converting image to base64:", error);
        toast.error("Failed to process image. Please try again.");
      }
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.set("photos", photoBase64); // Changed to Base64 for consistency
    //formData.append("photos", selectedFile); // selectedFile is the file selected by the user
    formData.set("name", bookName);
    formData.set("description", description);
    formData.set("author", author);
    formData.set("language", language);
    formData.set("edition", edition);
    formData.set("publicationDate", publicationDate);
    formData.set("pincode", pincode);
    formData.set("stateId", stateId);
    formData.set("cityId", cityId);
    formData.set("categoryId", categoryId);
    formData.set("userId", currentUser._id);
    formData.set("price", price); // Include price field

    dispatch(addBook(formData)); // Use Redux dispatch to submit form
  };

  const handleStateChange = (event) => {
    const stateId = event.target.value;
    dispatch(fetchCitiesByState(stateId));
    setCityId(""); // Reset city selection when state changes
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="container-fluid py-5 h-100 donateformContainer">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-2 donateformimage">
            <img src="\img\donates\donateimg.jpg" style={{ height: '500px', width: '500px' }} />
          </div>
          <div className="col-lg-10 col-xl-6">
            <div className="card rounded-3">
              <div className="card-body donateformcontain p-4 p-md-5">
                <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2 sty">Book Donation Form</h3>
                <form onSubmit={handleSubmit} className="px-md-2" action="/book/add" method="POST" enctype="multipart/form-data">
                  <div className="form-group">
                    <input type="text" placeholder="Enter Book Name" value={bookName} onChange={(e) => setBookName(e.target.value)} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <input type="text" placeholder="Enter Edition" value={edition} onChange={(e) => setEdition(e.target.value)} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <input type="text" placeholder="Enter Author Name" value={author} onChange={(e) => setAuthor(e.target.value)} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <input type="text" placeholder="Enter Price (Optional)" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control" />
                  </div>
                  <div className="form-group">
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="form-control" required>
                      <option>Select Book Category</option>
                      {categoryList.map((category) => (
                        <option key={category._id} value={category._id}>{category.categoryName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="form-control" required>
                      <option>Select Language</option>
                      <option>Hindi</option>
                      <option>English</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <select onChange={handleStateChange} className="form-control mb-2" required>
                      <option>Select State</option>
                      {stateList.map((state) => (
                        <option key={state._id} value={state._id}>{state.stateName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <select value={cityId} onChange={(e) => setCityId(e.target.value)} className="form-control mb-2" required>
                      <option>Select City</option>
                      {cityList.map((city) => (
                        <option key={city._id} value={city._id}>{city.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <input type="number" placeholder="Enter Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <input type="date" placeholder="Enter Publication Date" value={publicationDate} onChange={(e) => setPublicationDate(e.target.value)} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <input type="file" onChange={handleFileChange} placeholder="Images" className="form-control" required />
                  </div>
                  <div className="form-group">
                    <textarea placeholder="Enter Description" value={description} onChange={(e) => setDescription(e.target.value)} cols="70" rows="4" className="form-control" required />
                  </div>
                  <div className="form-group">
                    <button className="btn w-100 text-center submitbtn" style={{ outline: "none" }} type="submit">SUBMIT</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DonateForm;
