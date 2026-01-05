const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

exports.listUsers = async (_req, res) => {
  const items = await User.find().sort({ createdAt: -1 }).lean();

  res.json(
    items.map((a) => ({
      id: a._id.toString(),
      email: a.email,
      firstName: a.firstName,
      lastName: a.lastName,
      role: a.role,
      status: a.status,
    }))
  );
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, oldPassword, newPassword, role, status } =
      req.body || {};

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: { message: "ไม่พบบัญชี" } });
    }

    if (!firstName && !lastName && !newPassword && !status && !role) {
      return res
        .status(400)
        .json({ error: { message: "ไม่มีข้อมูลให้อัปเดต" } });
    }

    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ error: { message: "รหัสผ่านเดิมไม่ถูกต้อง" } });
      }
      const saltRounds = 10;
      user.password = await bcrypt.hash(newPassword, saltRounds);
    } else if (oldPassword || newPassword) {
      return res
        .status(400)
        .json({ error: { message: "กรุณากรอกรหัสผ่านทั้งสองช่อง" } });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();

    res.json({
      ok: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: { message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" } });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: { message: "ไม่พบบัญชี" } });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { message: "เกิดข้อผิดพลาดในการลบบัญชี" } });
  }
};
