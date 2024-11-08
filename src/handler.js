const books = []

 const addBook = (request, h) => {
  const {
    name, year, author, summary, publisher,
    pageCount, readPage, reading,
  } = request.payload;

  if (!name) {
      return h.response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
        status: "fail",
        message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    }).code(400);
  }

  const id = translator.new();
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id, name, year, author, summary, publisher,
    pageCount, readPage, finished, reading,
    insertedAt, updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.some((book) => book.id === id);

  if (isSuccess) {
    return h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    }).code(201);
  }

  return h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  }).code(500);
};

 const getAllBooks = (request, h) => {
  const {
    name, reading, finished,
  } = request.query;

  if (!name && !reading && !finished) {
    return h.response({
        status: "success",
        data: {
            books: books.map((book) => ({
                id: book.id, name: book.name, publisher: book.publisher,
            })),
        },
    }).code(200);
  }

  if (name) {
    const filteredBooksName = books.filter((book) => {
      const nameRegex = new RegExp(name, "gi");
      return nameRegex.test(book.name);
    });
    return h.response({
      status: "success",
      data: {
        books: filteredBooksName.map((book) => ({
            id: book.id, name: book.name, publisher: book.publisher,
        })),
      },
    }).code(200);
  }

  if (reading) {
    const filteredBooksReading = books.filter((book) => Number(book.reading) === Number(reading));
    return h.response({
        status: "success",
        data: {
          books: filteredBooksReading.map((book) => ({
            id: book.id, name: book.name, publisher: book.publisher,
          })),
        },
    }).code(200);
  }

  const filteredBooksFinished = books.filter((book) => Number(book.finished) === Number(finished));

  return h.response({
    status: "success",
    data: {
      books: filteredBooksFinished.map((book) => ({
        id: book.id, name: book.name, publisher: book.publisher,
      })),
    },
  }).code(200);
};

 const getBookById = (request, h) => {
  const { bookId } = request.params;
  const book = books.find((n) => n.id === bookId);
  
  if (book) {
    return h.response({
      status: "success",
      data: {
        book,
      },
    }).code(200);
  }
  
  return h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  }).code(404);
};

 const editBookById = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher,
    pageCount, readPage, reading,
  } = request.payload;
  
  if (!name) {
    return h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    }).code(400);
  }
  
  if (readPage > pageCount) {
    return h.response({
      status: "fail",
      message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    }).code(400);
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((note) => note.id === bookId);
  
  if (index !== -1) {
    books[index] = {
      ...books[index], name, year, author,
      summary, publisher, pageCount, readPage,
      reading, finished, updatedAt,
    };
    
    return h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    }).code(200);
  }
  
  return h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  }).code(404);
};

 const deleteBookById = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    }).code(200);
  }

  return h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  }).code(404);
};

module.exports = { getAllBooks, addBook, getBookById, editBookById, deleteBookById };
