const TypeBook = require("../models/typebook.model");

exports.listTypeBooks = async (_req, res) => {
  const items = await TypeBook.find().sort({ createdAt: -1 }).lean();

  res.json(
    items.map((a) => ({
      id: a._id.toString(),
      name: a.name,
      description: a.description,
      status: a.status,
    }))
  );
};

exports.createTypeBook = async (req, res) => {
  try {
    const { name, description, status } = req.body || {};

    const typeBook = new TypeBook({
      name,
      description,
      status,
    });

    await typeBook.save();

    res.json({
      ok: true,
      typeBook: {
        id: typeBook._id.toString(),
        name: typeBook.name,
        description: typeBook.description,
        status: typeBook.status,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: { message: "เกิดข้อผิดพลาดในการสร้างประเภทหนังสือ" } });
  }
};

exports.updateTypeBook = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const { typeBookId } = req.params;
    const { name, description, status } = req.body || {};

    const typeBook = await TypeBook.findById(typeBookId);
    if (!typeBook) {
      return res.status(404).json({ error: { message: "ไม่พบประเภทหนังสือ" } });
    }

    if (!name && !description && !status) {
      return res
        .status(400)
        .json({ error: { message: "ไม่มีข้อมูลให้อัปเดต" } });
    }

    if (name) typeBook.name = name;
    if (description) typeBook.description = description;
    if (status) typeBook.status = status;

    await typeBook.save();

    res.json({
      ok: true,
      typeBook: {
        id: typeBook._id.toString(),
        name: typeBook.name,
        description: typeBook.description,
        status: typeBook.status,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: { message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" } });
  }
};

exports.deleteTypeBook = async (req, res) => {
  try {
    const { typeBookId } = req.params;
    const typeBook = await TypeBook.findByIdAndDelete(typeBookId);

    if (!typeBook) {
      return res.status(404).json({ error: { message: "ไม่พบประเภทหนังสือ" } });
    }

    res.json({ ok: true });
  } catch (err) {
    res
      .status(500)
      .json({ error: { message: "เกิดข้อผิดพลาดในการลบประเภทหนังสือ" } });
  }
};
