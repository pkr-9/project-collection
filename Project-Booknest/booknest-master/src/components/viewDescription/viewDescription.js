import "./viewDescription.css"
import axios from "../../interceptor.js";
import { apiEndPoint } from "../../webApi/webapi";
import Header from '../header/header';
import Footer from '../footer/footer';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';  // Import useLocation for accessing location state
import { useDispatch } from "react-redux";
import { addItemInToCart } from "../../router-config/CartSlice";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux"; // For accessing currentUser state


function ViewDescription() {
  const location = useLocation();  // Access location data
  const [book, setBook] = useState(null);  // Initialize book state as null
  const [imageUrl, setImageUrl] = useState('');  // Initialize imageUrl state
  const { currentUser } = useSelector((state) => state.user); // Access currentUser from Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    // Check if location state and bookDetails exist
    if (location.state && location.state.bookDetails) {
      const bookDetails = location.state.bookDetails;  // Extract book details from location state
      setBook(bookDetails);  // Set book details to the state

      // If book.photos contains base64 string, set it to imageUrl
      if (bookDetails.photos) {
        setImageUrl(bookDetails.photos);  // Assuming `book.photos` is a full base64 string
      }
    }
  }, [location.state]);  // Dependency on location.state to re-run the effect when it changes

  // If book details are not available yet, show loading state
  if (!book) {
    return <div>Loading...</div>;  // Display loading message while book is being fetched
  }

  const handleAddToCart = async () => {
    try {
      if (currentUser) {
        // Use the API endpoint and axios from your interceptor
        await axios.post(apiEndPoint.ADD_TO_CART, {
          bookId: book._id,
          userId: currentUser._id, // Assuming you are using Redux to fetch currentUser
        });
        toast.success("Book added to your cart.");
        navigate("/cart"); // Redirect to the cart page after success
      } else {
        toast.warning("You have to login first.");
        navigate("/login"); // Redirect to login if the user is not logged in
      }
    } catch (err) {
      toast.error("Error adding to cart.");
    }
  };
  return (
    <>
      <Header />  {/* Include the Header component */}
      <div className="mt-5" id="layoutSidenav">
        <div id="layoutSidenav_nav">
          {/* Sidebar content can go here, if needed */}
        </div>
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <div className="container-fluid" id="main_wrapper">
                <div className="container" id="container_wrapper">
                  <div className="mid_wrapper">
                    <div id="div1">
                      <div id="main_image" className="image">
                        {/* Conditionally render the image if imageUrl exists */}
                        {imageUrl ? (
                          <img
                            src={imageUrl}  // Set image source to base64 image
                            alt={book.name}  // Use book name as alt text
                            id="mainDescriptionImage"
                            loading="lazy"  // Lazy load the image
                          />
                        ) : (
                          <div>Loading image...</div>  // Display a loading text while image is being fetched
                        )}
                      </div>
                    </div>
                    <div id="div2">
                      {/* Book details */}
                      <p className="dectitel">{book.name}</p>
                      <p className="desprice">
                        &#8377; {book.price === 0 ? 'Free' : book.price}  {/* Display price, or "Free" if price is 0 */}
                      </p>
                      <span className="decauther">
                        By: <span className="authername">{book.author}</span> (Author)
                      </span>
                      <p className="bookdescription">
                        {book.description.substring(0, 120)}  {/* Show a truncated description */}
                      </p>
                      <p className="decauther">
                        Publication Date: <span className="bookdescription ml-2">{book.publicationDate}</span>
                      </p>
                      <p className="decauther">
                        Edition: <span className="bookdescription ml-3">{book.edition}</span>
                      </p>
                    </div>
                    <div className="discriptionbuttons">
                      {/* Add to cart button */}
                      <a>
                        <button className="discriptionbtn2"onClick={handleAddToCart} >Add to cart</button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />  {/* Include the Footer component */}
    </>
  );
}

export default ViewDescription;
