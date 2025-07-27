import "./books.css";
import { useEffect, useState } from "react";
import axios from "../../../interceptor.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiEndPoint } from "../../../webApi/webapi";
import Header from "../../header/header";
import Footer from "../../footer/footer";
import { ToastContainer, toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";

function Books() {
    const { currentUser } = useSelector((state) => state.user);
    const { categoryList, error } = useSelector((state) => state.category);
    const navigate = useNavigate();
    const location = useLocation();
    const keyword = location.state?.books;

    const [bookData, setBookData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const loadBooks = async () => {
        try {
            const response = await axios.get(`${apiEndPoint.TOTAL_BOOKS}?page=${page}`);
            if (response.data.status) {
                const newBooks = response.data.bookList;

                const uniqueBooks = newBooks.filter(
                    newBook => !bookData.some(existingBook => existingBook._id === newBook._id)
                );

                setBookData(prevData => [...prevData, ...uniqueBooks]);
                setPage(prevPage => prevPage + 1);

                if (newBooks.length < 10) setHasMore(false);
            }
        } catch (error) {
            toast.error("Error loading books.");
        }
    };

    const viewBookByCategory = async (categoryId) => {
        setSelectedCategory(categoryId);
        setBookData([]);
        setPage(1);
        setHasMore(true);

        try {
            const response = await axios.post(apiEndPoint.BOOK_BY_CATEGORY, { categoryId });
            if (response.data.status) {
                setBookData(response.data.result);
            } else {
                toast.error("Error loading category.");
            }
        } catch (error) {
            toast.error("Error loading category.");
        }
    };

    const BuyNow = async (bookId) => {
        const buy = { Buybook: [{ bookId }], Buyflag: true };
        if (currentUser) {
            navigate("/cart", { state: { Buybook: buy } });
        } else {
            toast.warning("You have to login first.");
        }
    };

    const viewDescription = (book) => {
        navigate("/viewDescription", { state: { bookDetails: book } });
    };

    const addToCart = async (id) => {
        try {
            if (currentUser) {
                await axios.post(apiEndPoint.ADD_TO_CART, { bookId: id, userId: currentUser._id });
                toast.success("Book added to your cart.");
            } else {
                toast.warning("You have to login first.");
            }
        } catch (err) {
            toast.error("Error adding to cart.");
        }
    };

    useEffect(() => {
        if (!selectedCategory) loadBooks();
    }, [selectedCategory]);

    return (
        <>
            <Header />
            <ToastContainer />
            <div className="container-fluid">
                <div className="FilterMainDiv">
                    <div className="RightPart">
                        {/* <button className="SearchButton">Search</button> */}
                        <div className="rightpartHeading">
                            <p className="Heading">Categories</p>
                        </div>
                        <ul className="CategoryList">
                            <li className="listhover" style={{fontSize:"18px",fontFamily:"serif", color:"black", lineHeight:"30px", textTransform:"capitalize"}} onClick={() => setSelectedCategory(null)}>
                                All
                            </li>
                            {!error && categoryList.map((category) =>
                                <li key={category._id} className="listhover" style={{ fontSize:"18px",fontFamily:"serif", color:"black", lineHeight:"30px", textTransform:"capitalize"}} onClick={() => viewBookByCategory(category._id)}>
                                    {category.categoryName}
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="LeftPart">
                        <div className="mainImage">
                            <img src="../../img/banner/9.jpg" alt="" />
                        </div>
                        <div className="headingbook">
                            <p className="heading">BOOKS</p>
                        </div>
                        <InfiniteScroll
                            dataLength={bookData.length}
                            next={loadBooks}
                            hasMore={hasMore && !selectedCategory}
                            endMessage={<p>No more books available</p>}
                        >
                            <div className="row m-auto">
                                {bookData.map((book) => (
                                    <div key={book._id} className="col-md-4 col-sm-6 mt-5">
                                        <div className="card">
                                            <img src={book.photos} className="img-fluid cardimg" alt={book.name} />
                                            {/* <button href="" className="card-action"><i className="fa fa-shopping-cart carticon mt-3" style={{ cursor: "pointer" }} onClick={() => addToCart(book._id)}></i></button> */}
                                            <a className="cardcircle">
                                                <i
                                                    className="fa fa-shopping-cart carticon mt-3"
                                                    style={{ cursor: "pointer", position: "sticky" }}
                                                    onClick={() => addToCart(book._id)}
                                                ></i>
                                            </a>
                                            <div className="card-body">
                                                <p className="card-text cardtitle">{book.name.substring(0, 15)}</p>
                                                <p className="cardprice"><span className="cardtitle">Author: </span>{book.author.substring(0, 10)}</p>
                                                <b className="card-text cardprice"><span className="cardtitle">Price: </span>₹{book.price}</b>
                                                <br />
                                                <button className="btn mt-2  bookbuynowbutton" onClick={() => BuyNow(book, true)} >Get Now</button><span className="viewcircle ml-2 " onClick={() => viewDescription(book)}><small className="viewicon p-2 " ><i className="fa fa-eye" /></small></span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Books;
