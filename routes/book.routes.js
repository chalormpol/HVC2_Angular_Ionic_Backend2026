const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const ctrl = require("../controllers/book.controller");

router.get("/books", auth, requireRole(["admin", "user"]), ctrl.listBooks);
router.post("/books", auth, requireRole(["admin"]), ctrl.createBook);
router.put("/books/:bookId", auth, requireRole(["admin"]), ctrl.updateBook);
router.delete("/books/:bookId", auth, requireRole(["admin"]), ctrl.deleteBook);

module.exports = router;
