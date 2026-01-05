const Book = require("../models/book.model");

exports.listBooks = async (_req, res) => {
  const items = await Book.find()
    .populate("typeBookId", "name description status")
    .sort({ createdAt: -1 })
    .lean();

  res.json(
    items.map((a) => ({
      id: a._id.toString(),
      name: a.name,
      description: a.description,
      status: a.status,
      typebookId: a.typeBookId?._id.toString(),
      typebookName: a.typeBookId?.name,
    }))
  );
};

exports.createBook = async (req, res) => {
  try {
    const { name, description, status, typebookId } = req.body || {};

    const book = new Book({
      name,
      description,
      status,
      typeBookId: typebookId,
    });

    await book.save();

    res.json({
      ok: true,
      book: {
        id: book._id.toString(),
        name: book.name,
        description: book.description,
        status: book.status,
        typebookId: book.typeBookId.toString(),
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: { message: "เกิดข้อผิดพลาดในการสร้างหนังสือ" } });
  }
};

exports.updateBook = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const { bookId } = req.params;
    const { name, description, status, typebookId } = req.body || {};

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: { message: "ไม่พบหนังสือ" } });
    }

    // รวม typebookId ตรวจด้วย
    if (!name && !description && !status && !typebookId) {
      return res
        .status(400)
        .json({ error: { message: "ไม่มีข้อมูลให้อัปเดต" } });
    }

    if (name) book.name = name;
    if (description) book.description = description;
    if (status) book.status = status;
    if (typebookId) book.typeBookId = typebookId;

    console.log("UPDATE BOOK:", book);
    await book.save();

    res.json({
      ok: true,
      book: {
        id: book._id.toString(),
        name: book.name,
        description: book.description,
        status: book.status,
        typebookId: book.typeBookId?.toString(),
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: { message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" } });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findByIdAndDelete(bookId);

    if (!book) {
      return res.status(404).json({ error: { message: "ไม่พบหนังสือ" } });
    }

    res.json({ ok: true });
  } catch (err) {
    res
      .status(500)
      .json({ error: { message: "เกิดข้อผิดพลาดในการลบประเภทหนังสือ" } });
  }
};
