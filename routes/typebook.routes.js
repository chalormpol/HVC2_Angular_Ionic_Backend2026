const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const ctrl = require("../controllers/typeBook.controller");

router.get("/typebooks", auth, ctrl.listTypeBooks);
router.post("/typebooks", auth, requireRole(["admin"]), ctrl.createTypeBook);
router.put(
  "/typebooks/:typeBookId",
  auth,
  requireRole(["admin"]),
  ctrl.updateTypeBook
);
router.delete(
  "/typebooks/:typeBookId",
  auth,
  requireRole(["admin"]),
  ctrl.deleteTypeBook
);
module.exports = router;
