const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
require("dotenv").config();
require("./data/connect");

const { PORT } = process.env;

const app = express();
const isAuth = require("./middleware/isAuth");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const User = require("./model/user-model");
const userRoutes = require("./routes/user");

// middleware
const storage = multer.diskStorage({
  "destination": function (req, file, cb) {
    cb(null, "./image");
  },
  "filename": function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage,
  "fileFilter": function (req, file, cb) {
    const type = ["image/png", "image/jpg", "image/jpeg"];
    if (type.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", isAuth, userRoutes); // ? path filtering
app.use("/admin", isAuth, upload.single("imageUrl"), adminRoutes);

app.listen(PORT, () => {
  console.log(`server is  running on ${PORT}`);
});
