import {
  getAllBooksService,
  getBookByIdService,
  createBookService,
  updateBookService,
  deleteBookService,
  searchBooksByKeywordService,
  getBooksByUserService,
  getDonatedBooksService,
  getTopDonorsService,
  getBooksByCategoryService,
  getPendingPermissionBooksService,
} from "../services";

export const getAllBooks = async (req, res, next) => {
  try {
    const books = await getAllBooksService(req.query);
    res.json(books);
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (req, res, next) => {
  try {
    const book = await getBookByIdService(req.params.id);
    res.json(book);
  } catch (error) {
    next(error);
  }
};

export const createBook = async (req, res, next) => {
  try {
    const book = await createBookService(req.body, req.user);
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const updated = await updateBookService(req.params.id, req.body, req.user);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const deleted = await deleteBookService(req.params.id, req.user);
    res.json(deleted);
  } catch (error) {
    next(error);
  }
};

export const searchBooksByKeyword = async (req, res, next) => {
  try {
    const result = await searchBooksByKeywordService(req.query.keyword);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getBooksByUser = async (req, res, next) => {
  try {
    const books = await getBooksByUserService(req.params.userId);
    res.json(books);
  } catch (error) {
    next(error);
  }
};

export const getDonatedBooks = async (req, res, next) => {
  try {
    const books = await getDonatedBooksService();
    res.json(books);
  } catch (error) {
    next(error);
  }
};

export const getTopDonors = async (req, res, next) => {
  try {
    const donors = await getTopDonorsService();
    res.json(donors);
  } catch (error) {
    next(error);
  }
};

export const getBooksByCategory = async (req, res, next) => {
  try {
    const books = await getBooksByCategoryService(req.params.categoryId);
    res.json(books);
  } catch (error) {
    next(error);
  }
};

export const getPendingPermissionBooks = async (req, res, next) => {
  try {
    const books = await getPendingPermissionBooksService();
    res.json(books);
  } catch (error) {
    next(error);
  }
};
