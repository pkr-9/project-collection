import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "../header/header";
import Footer from "../footer/footer";
import { fetchState } from "../../router-config/stateSlice";
import { fetchCategory } from "../../router-config/categorySlice";
import { fetchCitiesByState } from "../../router-config/citySlice";
import { imageToBase64 } from "../../utils/imageToBase64";
import { addBook, resetAddBookState } from "../../router-config/addBookSlice";
import axios from "../../interceptor.js";
import { apiEndPoint } from "../../webApi/webapi.js";

function SellboooksForm() { 
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // State hooks for form fields
    const [bookName, setBookName] = useState("");
    const [description, setDescription] = useState("");
    const [author, setAuthor] = useState("");
    const [language, setLanguage] = useState("");
    const [edition, setEdition] = useState("");
    const [publicationDate, setPublicationDate] = useState("");
    const [pincode, setPincode] = useState("");
    const [cityId, setCityId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [photoBase64, setPhotoBase64] = useState("");
    const [price, setPrice] = useState(""); // Additional field for selling

    // Redux selectors
    const { categoryList = [] } = useSelector((state) => state.category || {});
    const { currentUser } = useSelector((state) => state.user || {});
    const { stateList = [] } = useSelector((state) => state.state || {});
    const { cityList = [] } = useSelector((state) => state.city || {});
    const { loading = false, success = false, error = null } = useSelector((state) => state.addBook);
    

    // Fetch initial states and categories
    useEffect(() => {
        dispatch(fetchState());
        dispatch(fetchCategory());
    }, [dispatch]);

    // Handle success/error on form submission
    useEffect(() => {
        if (success) {
            toast.success("Book listed for sale successfully!");
            navigate("/book");
            dispatch(resetAddBookState());
        } else if (error) {
            toast.error("Failed to list book for sale.");
        }
    }, [success, error, dispatch, navigate]);

    // Convert image file to Base64
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const base64String = await imageToBase64(file);
                setPhotoBase64(base64String);
            } catch (error) {
                console.error("Error converting image to base64:", error);
                toast.error("Failed to process image. Please try again.");
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.set("photos", photoBase64);
        formData.set("name", bookName);
        formData.set("description", description);
        formData.set("author", author);
        formData.set("language", language);
        formData.set("edition", edition);
        formData.set("publicationDate", publicationDate);
        formData.set("pincode", pincode);
        formData.set("cityId", cityId);
        formData.set("categoryId", categoryId);
        formData.set("userId", currentUser._id);
        formData.set("price", price); // Additional price field

        dispatch(addBook(formData));
    };

    // Fetch cities based on selected state
    const handleStateChange = (event) => {
        const selectedStateId = event.target.value;
        dispatch(fetchCitiesByState(selectedStateId));
        setCityId("");
    };

    return (
        <>
            <Header />
            <ToastContainer />
            <div className="container-fluid py-5 h-100 donateformContainer">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-lg-2 donateformimage">
                        <img src="/img/donar/form.jpg" alt="Form" style={{ height: '500px', width: '500px' }} />
                    </div>
                    <div className="col-lg-10 col-xl-6">
                        <div className="card rounded-3">
                            <div className="card-body donateformcontain p-4 p-md-5">
                                <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2 sty">Book Details</h3>
                                <form onSubmit={handleSubmit} className="px-md-2">
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
                                    <input type="number" placeholder="Enter Price" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control" required />
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
                                            <option>Marathi</option>
                                            <option>Hindi</option>
                                            <option>English</option>
                                        </select>                                    </div>
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
                                    <div className="row form-group"  >
                                        <div className="col-md-12">
                                        <input type="file" onChange={handleFileChange} placeholder="Images" className="form-control" required />
                                        </div>
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

export default SellboooksForm;

// function SellboooksForm() {
//      const navigate = useNavigate();
//     const { currentUser } = useSelector((state) => state.user);
//     //const [citys, setCitys] = useState([]);
//     const [name, setBookName] = useState(" ");
//     const [description, setDescription] = useState(" ");
//     const [author, setAuthorName] = useState(" ");
//     const [language, setLanguage] = useState("");
//     const [edition, setEdition] = useState(" ");
//     const [publicationDate, setPublicationDate] = useState(" ");
//     const [pincode, setPinCode] = useState(" ");
//     const [categoryId, setCategory] = useState(" ");
//     const [price, setPrice] = useState("");
//     const [cityId, setCity] = useState(" ");
//     const stateObject = useRef(" ");
//     const userId = currentUser;
//     let  photos = {};
//     const [formData, setFormData] = useState({
//         Name: "",
//         edition: "",
//         author: "",
//         price: "",
//         stateList: "",
//         selectedCity: "",
//         language: "",
//         publicationDate: "",
//         pincode: "",
//         categoryId: "",
//         photos: "",
//         description:""
    
//     });

//     const localStates = [
//         { _id: "1", name: "Uttar Pradesh" },
//         { _id: "2", name: "Maharashtra" },
//         { _id: "3", name: "Tamil Nadu" },
//         { _id: "4", name: "Karnataka" },
//         { _id: "5", name: "West Bengal" },
//         { _id: "6", name: "Gujarat" },
//         { _id: "7", name: "Rajasthan" },
//         { _id: "8", name: "Punjab" },
//         { _id: "9", name: "Bihar" },
//         { _id: "10", name: "Madhya Pradesh" },
//       ];
      
//       const localCities = {
//         "1": [
//             { _id: "1", name: "Lucknow" },
//             { _id: "2", name: "Kanpur" },
//             { _id: "3", name: "Varanasi" },
//             { _id: "4", name: "Agra" },
//             { _id: "5", name: "Allahabad" }
//         ],
//         "2": [
//             { _id: "6", name: "Mumbai" },
//             { _id: "7", name: "Pune" },
//             { _id: "8", name: "Nagpur" },
//             { _id: "9", name: "Nashik" },
//             { _id: "10", name: "Aurangabad" }
//         ],
//         "3": [
//             { _id: "11", name: "Chennai" },
//             { _id: "12", name: "Coimbatore" },
//             { _id: "13", name: "Madurai" },
//             { _id: "14", name: "Tiruchirappalli" },
//             { _id: "15", name: "Salem" }
//         ],
//         "4": [
//             { _id: "16", name: "Bengaluru" },
//             { _id: "17", name: "Mysuru" },
//             { _id: "18", name: "Mangalore" },
//             { _id: "19", name: "Hubli" },
//             { _id: "20", name: "Belgaum" }
//         ],
//         "5": [
//             { _id: "21", name: "Kolkata" },
//             { _id: "22", name: "Asansol" },
//             { _id: "23", name: "Siliguri" },
//             { _id: "24", name: "Durgapur" },
//             { _id: "25", name: "Haldia" }
//         ],
//         "6": [
//             { _id: "26", name: "Ahmedabad" },
//             { _id: "27", name: "Surat" },
//             { _id: "28", name: "Vadodara" },
//             { _id: "29", name: "Rajkot" },
//             { _id: "30", name: "Bhavnagar" }
//         ],
//         "7": [
//             { _id: "31", name: "Jaipur" },
//             { _id: "32", name: "Jodhpur" },
//             { _id: "33", name: "Udaipur" },
//             { _id: "34", name: "Kota" },
//             { _id: "35", name: "Ajmer" }
//         ],
//         "8": [
//             { _id: "36", name: "Ludhiana" },
//             { _id: "37", name: "Amritsar" },
//             { _id: "38", name: "Jalandhar" },
//             { _id: "39", name: "Patiala" },
//             { _id: "40", name: "Bathinda" }
//         ],
//         "9": [
//             { _id: "41", name: "Patna" },
//             { _id: "42", name: "Gaya" },
//             { _id: "43", name: "Bhagalpur" },
//             { _id: "44", name: "Muzaffarpur" },
//             { _id: "45", name: "Purnia" }
//         ],
//         "10": [
//             { _id: "46", name: "Bhopal" },
//             { _id: "47", name: "Indore" },
//             { _id: "48", name: "Gwalior" },
//             { _id: "49", name: "Jabalpur" },
//             { _id: "50", name: "Ujjain" }
//         ],
//       };
//       const [stateList, setStateList] = useState(localStates);
//       const [citys, setCitys] = useState([]);
//       const [selectedCity, setSelectedCity] = useState(""); // Selected city
 
//     const { categoryList, error} = useSelector((state) => state.category)
//     const dispatch = useDispatch();

//     const onFileChange = event => {
//         photos = (event.target.files[0]);
//     }

    
//     const handleSubmit = async (event) => {
//         try {
//           event.preventDefault();          
//           const userId = currentUser._id;
//           let formData = new FormData();
//             formData.append("photos", photos);      
//             formData.set("name", name);
//             formData.set("description", description);
//             formData.set("author", author);
//             formData.set("language", language);
//             formData.set("edition", edition);
//             formData.set("publicationDate", publicationDate);
//             formData.set("pincode", pincode);
//             formData.set("cityId", cityId);
//             formData.set("selectedCity:", selectedCity);
//             formData.set("categoryId", categoryId);
//             formData.set("userId", userId);
//             formData.set("price", price);
//             let response = await axios.post("https://jsonplaceholder.typicode.com/posts", formData,
//                 {
//                     headers: {
//                       'Content-Type': 'multipart/form-data'
//                       },
//                 });
//              if(response.data.state){
//                  toast.success("Book  added succesfully")
//              }
//         }
//          catch (err) {
//            toast.error("something went wrong");
//         }
//     }
//        const fetchCityById = async (stateId) => {
//         try {
//             let response = await axios.post(apiEndPoint.FETCH_CITY_BY_STATE, { stateId: stateId });
//             setCitys(response.data.city);
//         }
//        catch (err) {
//         }
//     }
//     useEffect(() => {
//         dispatch(fetchState());
//     }, [])
    
//     const handleStateChange = (e) => {
//         const selectedStateId = e.target.value;
//         setCitys(localCities[selectedStateId] || []);
//         setFormData ({...formData,[e.target.name]:[e.target.value]});
//     };
    
//     const handleCityChange = (e) => {
//       setSelectedCity(e.target.value);
//       setFormData ({...formData,[e.target.name]:[e.target.value]});
//     };
    
//     const handleChange = (e) => {
//       setFormData ({...formData,[e.target.name]:[e.target.value]});
//     };
    
//     const handleSubmit1 = (e) => {
//       e.preventDefault()
//       console.log(formData)
//     }
//     //const { stateList } = useSelector((item) => item.state);
    
//     return <>
//       <section>
//            <Header />
//             <ToastContainer/>
//             <div className="container-fluid py-5 h-100 donateformContainer">
//                 <div className="row d-flex justify-content-center align-items-center h-100">
//                     <div className="col-lg-2 donateformimage">
//                         <img src="\img\donar\form.jpg" style={{ height: '500px', width: '500px' }} />
//                     </div>
//                     <div className="col-lg-10 col-xl-6" >
//                         <div className="card rounded-3">

//                             <div className="card-body donateformcontain p-4 p-md-5">
//                                 <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2 sty">
//                                     Book Detail's
//                                 </h3>
//                                 <form onSubmit={handleSubmit1}  className="px-md-2">
//                                     <div className="row form-group"  >
//                                         <div className="">
//                                             <input onChange={(e) => handleChange(e)} placeholder="Enter Book Name" name="Name" type="text" className="form-control" required/>
//                                         </div>
//                                     </div>
//                                     <div className="row form-group"  >
//                                         <div className="">
//                                             <input onChange={(e) => handleChange(e)} placeholder="Enter Edition" type="text" name="edition" className="form-control"  required />
//                                         </div>
//                                     </div>

//                                     <div className="row form-group"  >
//                                         <div className=" col-md-6 mb-3">
//                                             <input onChange={(e) => handleChange(e)} placeholder="Enter Author Name" name="author" type="text" className="form-control" required/>
//                                         </div>
//                                         <div className=" col-md-6">
//                                             <input onChange={(e) => handleChange(e)} placeholder="Enter Price" type="number" name="price" className="form-control" required />
//                                         </div>
//                                     </div>
//                                     <div className="row form-group">
//                                         <div>
//                                             <select onChange={(e) => handleChange(e)} name="categoryId" className="form-control">Category
//                                                 <option>Select Book Category</option>
//                                                 {!error && categoryList.map((category, index) => <option   value={category._id}   key={index} required>{category.categoryName}</option>)}
//                                                 <option value="Other" defaultChecked>Other</option>
//                                             </select>
//                                         </div>
//                                     </div>

//                                     <div className="row">
//                                         <div>
//                                             <select onChange={(e) => handleChange(e)} name="language" className="form-control" required>language
//                                                 <option>Select Language</option>
//                                                 <option>Hindi</option>
//                                                 <option>English</option>

//                                             </select></div>

//                                     </div>
//                                     <div className="row form-group mt-2"  >
//                                         <div className=" col-md-6 mb-3">
//                                         <select onChange={(e)=> handleStateChange(e)} name="stateList"  className="form-control">
//                                                 <option >Select State</option>
//                                                 {stateList.map((state) =>(
//                                                     <option key={state._id} value={state._id}
//                                                     >{state.name}</option>
//                                                 ))}


//                                             </select>
//                                         </div>
//                                         <div className=" col-md-6">
//                                         <select onChange={handleCityChange} value={selectedCity} name="selectedCity" className="form-control">City
//                                                <option>Select City</option>
//                                                 {citys.map((city)=>(
//                                                  <option key={city._id} value={city._id}>
//                                                  {city.name}
//                                              </option>
//                                                 ))}
//                                         </select>
//                                         </div>
//                                     </div>
//                                     <div className="row form-group"  >

//                                         <div className=" col-md-6 mb-3">
//                                             <input onChange={(e) => handleChange(e)} type="number" placeholder=" Enter Pincode" name="pincode" className="form-control" maxLength="6" minLength="6"   required />
//                                         </div>

//                                         <div className="col-md-6">
//                                             <input onChange={(e) => handleChange(e)} placeholder="Enter Publication Date" type="date" name="publicationDate"  className="form-control" required/>
//                                         </div>
                                          
//                                        </div>

//                                     <div className="row form-group"  >
//                                         <div className="col-md-12">
//                                             <input onChange={(e) => handleChange(e)}  type="file" placeholder="Images" name="photos" className="form-control" required />
//                                         </div>
//                                     </div>
//                                     <div className="row form-group">
//                                         <div>
//                                             <textarea onChange={(e) => handleChange(e)} cols='60' rows='4' name="description" placeholder="Enter Book's Description..."  required/>
//                                         </div>
//                                     </div>
//                                     <div className="row form-group">
//                                         <div>
//                                             <button className="btn w-100 text-center submitbtn" type="submit">SUBMIT</button>
//                                     </div>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//         <Footer />

//     </>
// }

// export default SellboooksForm;