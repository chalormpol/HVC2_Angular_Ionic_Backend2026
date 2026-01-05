const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const ctrl = require("../controllers/user.controller");

router.get("/users", auth, requireRole(["admin"]), ctrl.listUsers);
router.put("/users/:userId", auth, requireRole(["admin"]), ctrl.updateUser);
router.delete("/users/:userId", auth, requireRole(["admin"]), ctrl.deleteUser);
module.exports = router;
