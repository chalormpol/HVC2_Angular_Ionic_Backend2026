require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./configs/db");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/typebook", require("./routes/typebook.routes"));
app.use("/api/book", require("./routes/book.routes"));

const port = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI)
  .then(() =>
    app.listen(port, () => console.log(`ATM API on http://localhost:${port}`))
  )
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
