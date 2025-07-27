import { apiEndPoint } from "../../webApi/webapi";
import Header from "../header/header";
//import Footer from "../footer/footer";
import "./freebooks.css";

import axios from "../../interceptor.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

function FreeBooks() {
  const [freeProduct, setFreeProduct] = useState([]); // List of free books
  const [freeError, setFreeError] = useState(null); // Error state for fetching books
  const { currentUser } = useSelector((state) => state.user); // Current logged-in user
  const navigate = useNavigate();

  // Function to load free books from the API
  const loadFreeProduct = async () => {
    try {
      const response = await axios.get(apiEndPoint.FREE_BOOK_API);
      if (response.data.status) {
        setFreeProduct(response.data.bookList);
      } else {
        setFreeError("No free books available.");
      }
    } catch (err) {
      setFreeError("Oops! Something went wrong.");
    }
  };

  // Navigate to the book description page
  const viewDescription = (book) => {
    navigate("/viewDescription", { state: { bookDetails: book } });
  };

  // Add book directly to the cart and navigate to the cart page
  const buyNow = async (book) => {
    const buyPayload = {
      Buybook: [{ bookId: book._id }],
      Buyflag: true,
    };

    try {
      if (currentUser) {
        navigate("/cart", { state: { Buybook: buyPayload } });
      } else {
        toast.warning("You need to log in first!");
      }
    } catch (err) {
      toast.error("Oops! Something went wrong.");
    }
  };

  // Add a book to the cart
  const addToCart = async (id) => {
    try {
      if (currentUser) {
        await axios.post(apiEndPoint.ADD_TO_CART, {
          bookId: id,
          userId: currentUser._id,
        });
        toast.success("Book added to your cart!");
      } else {
        toast.warning("You need to log in first!");
      }
    } catch (err) {
      if (err.response?.status === 400) {
        toast.warning("Book already exists in the cart!");
      } else {
        toast.error("Oops! Something went wrong.");
      } 
    }
  };

  // Fetch books on component mount
  useEffect(() => {
    loadFreeProduct();
  }, []);

  return (
    <>
      <Header />
      <ToastContainer />
      <section className="blog" id="blogid">
        <div className="container heading-design">
          <div className="row">
            {/* Display error if fetching books fails */}
            {freeError ? (
              <p className="text-center text-danger">{freeError}</p>
            ) : (
              freeProduct
                .filter(
                  (book) =>
                  book.price === 0

                )
                .map((book) => (
                  <div
                    key={book._id}
                    className="col-md-3 col-sm-6 mt-5"
                    data-aos="fade-up"
                    data-aos-duration="500"
                  >
                    <div className="card">
                      {/* Display book image */}

                      {book.photos ? (
                        <img
                          src={book.photos}
                          className="img-fluid cardimg"
                          alt={book.name}
                        />
                      ) : (
                        <img
                          src="https://via.placeholder.com/150"
                          className="img-fluid cardimg"
                          alt="Default placeholder"
                        />
                      )}

                      {/* Add to Cart button */}
                      <a className="cardcircle">
                        <i
                          className="fa fa-shopping-cart carticon mt-3"
                          style={{ cursor: "pointer", position: "sticky" }}
                          onClick={() => addToCart(book._id)}
                        ></i>
                      </a>

                      <div className="card-body">
                        <p className="card-text cardtitle">
                          {book.name.substring(0, 15)}
                        </p>
                        <p className="cardprice">
                          <span className="cardtitle">Author: </span>
                          {book.author.substring(0, 10)}
                        </p>
                        <b className="card-text cardprice">
                          <span className="cardtitle">Price: </span>₹ Free
                        </b>
                        <br />

                        {/* Buy Now button */}
                        <button
                          className="btn mt-2 buynowbutton"
                          onClick={() => buyNow(book)}
                        >
                          Get Now
                        </button>

                        {/* View Details button */}
                        <span
                          className="viewcircle ml-2"
                          onClick={() => viewDescription(book)}
                        >
                          <small className="viewicon p-2">
                            <i className="fa fa-eye" />
                          </small>
                        </span>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </section>
      {/* <Footer /> */}
    </>
  );
}

export default FreeBooks;
