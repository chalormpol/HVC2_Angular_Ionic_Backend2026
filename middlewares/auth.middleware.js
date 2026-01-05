const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports = async function (req, res, next) {
  const auth = req.headers.authorization || "";
  const [type, token] = auth.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  try {
    const p = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(p.sub).select("role status");

    if (!user) {
      return res.status(401).json({ error: { message: "User not found" } });
    }

    if (user.status !== "active") {
      return res.status(403).json({ error: { message: "บัญชีถูกระงับ" } });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: { message: "Token invalid/expired" } });
  }
};
