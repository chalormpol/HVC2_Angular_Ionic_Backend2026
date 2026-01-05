const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES || "1d",
    }
  );
}

exports.register = async (req, res) => {
  const { email, firstName, lastName, password } = req.body || {};
  if (!email || !firstName || !lastName || !password)
    return res.status(400).json({ error: { message: "ข้อมูลไม่ครบ" } });

  const dup = await User.findOne({ email: email.toLowerCase() });
  if (dup)
    return res.status(409).json({ error: { message: "อีเมลถูกใช้แล้ว" } });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    email: email.toLowerCase(),
    firstName,
    lastName,
    passwordHash,
    role: "user",
    status: "active",
  });

  const token = signToken(user);
  return res.json({
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
    },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: { message: "ข้อมูลไม่ครบ" } });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user)
    return res
      .status(401)
      .json({ error: { message: "อีเมล/รหัสผ่านไม่ถูกต้อง" } });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok)
    return res
      .status(401)
      .json({ error: { message: "อีเมล/รหัสผ่านไม่ถูกต้อง" } });

  if (user.status !== "active")
    return res.status(403).json({ error: { message: "บัญชีถูกระงับ" } });

  const token = signToken(user);
  return res.json({
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
    },
  });
};
