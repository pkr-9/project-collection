import Book from "../models/book.model.js";
import User from "../models/user.model.js";

export const getAllBooksService = async (filters) => {
  const query = {};

  if (filters.title) query.title = new RegExp(filters.title, "i");
  if (filters.author) query.author = new RegExp(filters.author, "i");
  if (filters.category) query.category = filters.category;
  if (filters.priceMin || filters.priceMax) {
    query.price = {};
    if (filters.priceMin) query.price.$gte = Number(filters.priceMin);
    if (filters.priceMax) query.price.$lte = Number(filters.priceMax);
  }

  return await Book.find(query).populate("user", "name email");
};

export const getBookByIdService = async (id) => {
  const book = await Book.findById(id).populate("user", "name email");
  if (!book) {
    const error = new Error("Book not found");
    error.statusCode = 404;
    throw error;
  }
  return book;
};

export const createBookService = async (data, user) => {
  const {
    title,
    author,
    description,
    price,
    category,
    images,
    location,
    isDonated,
  } = data;

  if (!images || images.length === 0) {
    const error = new Error("At least one image is required");
    error.statusCode = 400;
    throw error;
  }

  const book = await Book.create({
    title,
    author,
    description,
    price: isDonated ? 0 : price,
    category,
    images,
    location,
    isDonated: !!isDonated,
    user: user._id,
  });

  return book;
};

export const updateBookService = async (id, data, user) => {
  const book = await Book.findById(id);
  if (!book) throw new Error("Book not found");

  const isOwner = book.user.toString() === user._id.toString();
  if (!isOwner && user.role !== "admin") {
    const error = new Error("Not authorized");
    error.statusCode = 403;
    throw error;
  }

  Object.assign(book, data);
  if (data.isDonated) book.price = 0;
  return await book.save();
};

export const deleteBookService = async (id, user) => {
  const book = await Book.findById(id);
  if (!book) throw new Error("Book not found");

  const isOwner = book.user.toString() === user._id.toString();
  if (!isOwner && user.role !== "admin") {
    const error = new Error("Not authorized");
    error.statusCode = 403;
    throw error;
  }

  await book.remove();
  return { message: "Book deleted successfully" };
};


export const searchBooksByKeywordService = async (keyword) => {
  return await Book.find({
    $or: [
      { title: { $regex: keyword, $options: "i" } },
      { author: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } }
    ]
  });
};

export const getBooksByUserService = async (userId) => {
  return await Book.find({ userId });
};

export const getDonatedBooksService = async () => {
  return await Book.find({ price: 0 });
};

export const getTopDonorsService = async () => {
  const donatedBooks = await Book.find({ price: 0 });
  const donorMap = {};
  for (const book of donatedBooks) {
    const userId = book.userId.toString();
    donorMap[userId] = (donorMap[userId] || 0) + 1;
  }

  const donorCounts = Object.entries(donorMap)
    .map(([userId, count]) => ({ userId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const topDonors = await Promise.all(
    donorCounts.map(async (d) => {
      const user = await User.findById(d.userId).select("name email");
      return { user, booksDonated: d.count };
    })
  );

  return topDonors;
};

export const getBooksByCategoryService = async (categoryId) => {
  return await Book.find({ categoryId });
};

export const getPendingPermissionBooksService = async () => {
  return await Book.find({ permission: false });
};
