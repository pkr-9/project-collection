
import { useSelector } from "react-redux";
import "./top.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../interceptor.js";
import { apiEndPoint } from "../../webApi/webapi.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BooksCard from "../BooksCard/BooksCard.js";

function TopInteresting() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [productByCategory, setProductByCategory] = useState([]);
  const [isError, setIsError] = useState(null);
  const { TopProductList } = useSelector((state) => state.topProduct);
  const { categoryList, error, isLoading } = useSelector(
    (state) => state.category
  );
  const viewDescription = (book) => {
    navigate("/viewDescription", { state: { bookDetails: book } });
  };

  const loadProductByCategory = async (categoryId) => {
    try {
      let response = await axios.post(apiEndPoint.BOOK_BY_CATEGORY, {
        categoryId,
      });
      if (response.data.status) {
        setProductByCategory(response.data.result);
      }
    } catch (err) {
      setIsError("Oops, something went wrong");
    }
  };

  const addToCart = async (id) => {
    try {
      if (currentUser) {
        let response = await axios.post(apiEndPoint.ADD_TO_CART, {
          bookId: id,
          userId: currentUser._id,
        });
        toast.success("Book added to your cart");
      } else {
        toast.warning("You have to log in first");
      }
    } catch (err) {
      if (err.response && err.response.status === 400)
        toast.warning("Book already exists in cart");
      else if (err.response && err.response.status === 500)
        toast.error("Oops, something went wrong");
    }
  };

  const BuyNow = async (book) => {
    const buy = {
      Buybook: [{ bookId: book }],
      Buyflag: true,
    };
    try {
      if (currentUser) {
        navigate("/cart", { state: { Buybook: buy } });
      } else {
        toast.warning("You have to log in first");
      }
    } catch (err) {
      if (err.response && err.response.status === 500)
        toast.error("Oops, something went wrong");
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="our-project" id="projectid">
        <div className="container heading-design">
          <div data-aos="fade-up" data-aos-duration="400">
            <h1>
              <span>Top Books</span>
            </h1>
            <p className="sub-heading container">
              <span>
                Browse the collection of our best selling and top interesting
                products. <br /> You'll definitely find what you're looking for.
              </span>
            </p>
          </div>
          <div
            className="container topinteresting"
            data-aos="fade-up"
            data-aos-duration={400}
          >
            <nav>
              <div
                className="nav nav-tabs row"
                style={{ paddingLeft: "18%" }}
                id="nav-tab"
                role="tablist"
              >
                <button  className=" nav-link active col-2" id="nav-all-tab" data-bs-toggle="tab" data-bs-target="#nav-all" type="button" role="tab" aria-controls="nav-all" aria-selected="true"  >  All</button>
              {!error && categoryList?.filter((category) => category.categoryName == "Classics").map((category, index) =>
                <button key={index} onClick={() => loadProductByCategory(category._id)} className=" nav-link col-2" id="nav-Remodeling-tab" data-bs-toggle="tab" data-bs-target="#nav-Remodeling" type="button" role="tab" aria-controls="nav-Remodeling" aria-selected="false" >{category.categoryName}</button>)}

              {!error && categoryList?.filter((category) => category.categoryName == "Horror").map((category, index) =>
                <button key={index} onClick={() => loadProductByCategory(category._id)} className="nav-link col-2" id="nav-Construction-tab" data-bs-toggle="tab" data-bs-target="#nav-Construction" type="button" role="tab" aria-controls="nav-Construction" aria-selected="false" >{category.categoryName}</button>)}

              {!error && categoryList?.filter((category) => category.categoryName == "History").map((category, index) =>
                <button key={index} onClick={() => loadProductByCategory(category._id)} className="nav-link col-2" id="nav-Repair-tab" data-bs-toggle="tab" data-bs-target="#nav-Repair" type="button" role="tab" aria-controls="nav-Repair" aria-selected="false" >
                  {category.categoryName}
                </button>
              )}
              </div>
            </nav>
          </div>
          <div
            className="tab-content"
            id="nav-tabContent"
            data-aos="fade-up"
            data-aos-duration={500}
          >
            <div
              className="tab-pane fade show active container"
              id="nav-all"
              role="tabpanel"
              aria-labelledby="nav-all-tab"
              tabIndex={0}
            >
              <div className="row m-auto">
                {TopProductList?.length > 0 ? (
                  TopProductList?.map((book, index) => (
                    <div key={index} className="col-md-3 col-sm-6 mt-5" data-aos="fade-up" data-aos-duration="500">
                      <div className="card">
                        <img
                          src={book.photos.startsWith("data:image") ? book.photos : `data:image/jpeg;base64,${book.photos}`}
                          className="img-fluid cardimg"
                          alt={book.name}
                        />
                        <a className="cardcircle">
                          <i
                            className="fa fa-shopping-cart carticon mt-3"
                            style={{ cursor: "pointer",position:"sticky" }}
                            onClick={() => addToCart(book._id)}
                          ></i>
                        </a>
                        <div className="card-body">
                          <p className="card-text cardtitle">
                            {book?.name.substring(0, 20)}
                          </p>
                          <p className="cardprice">
                            <span className="cardtitle">Author: </span>
                            {book.author.substring(0, 15)}
                          </p>
                          <b className="card-text cardprice">
                            <span className="cardtitle">Price: </span>₹
                            {book?.price === 0 ? "Free" : book.price}
                          </b>
                          <br />
                          <button
                            className="btn mt-2 buttonhover"
                            onClick={() => BuyNow(book)}
                          >
                            Get Now
                          </button>
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
                ) : (
                  <p>No products available.</p>
                )}
              </div>
            </div>
            {/* Filtered products by category */}
            <div className="row m-auto">
              {productByCategory
                .map((book, index) => (
                  <div key={book._id} className="col-md-3 col-sm-6 mt-5">
                    <div className="card">
                      <img
                        src={book.photos.startsWith("data:image") ? book.photos : `data:image/jpeg;base64,${book.photos}`}
                        className="img-fluid cardimg"
                        alt={book.name}
                      />
                      <a className="cardcircle">
                        <i
                          className="fa fa-shopping-cart carticon mt-3"
                          style={{ cursor: "pointer", position: "sticky" }}
                          onClick={() => addToCart(book._id)}
                        ></i>
                      </a>
                      <div className="card-body">
                        <p className="card-text cardtitle">
                          {book.name.substring(0, 20)}
                        </p>
                        <p className="cardprice">
                          <span className="cardtitle">Author: </span>
                          {book.author.substring(0, 15)}
                        </p>
                        <b className="card-text cardprice">
                          <span className="cardtitle">Price: </span>₹
                          {book.price}
                        </b>
                        <br />
                        <button className="btn mt-2 buttonhover">
                          Get Now
                        </button>
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
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default TopInteresting;
