// Sorry for the messy code, I will refactor it later. Did it in a hurry because of hackathon.

import express, { json } from "express";
import cors from "cors";
import User from "./models/User.js";
import Product from "./models/Product.js";
import connectMongo from "./db.js";
const corsOptions = {
  origin: "*",
};
import dotenv from "dotenv";
import authMiddleware from "./middleware/auth.js";
import multer from "multer";
import path from "path";
dotenv.config({ path: "./.env" });

const app = express();
await connectMongo();
const port = process.env.PORT || 3000;

app.use(json());
app.use(express.static("public"));
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const emailDomain = email.split("@")[1];
    const college = emailDomain.split(".")[0];

    const newUser = new User({ name, email, password, college });
    await newUser.save();

    const token = await newUser.generateToken();

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.isCorrectPassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await user.generateToken();

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.log(error);
  }
});

app.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.log(error);
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/productImg");
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

app.post(
  "/product",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    const { name, price, category, description, type, duration, durationType } =
      req.body;
    const image = req.file ? req.file.path : null;

    if (!name || !price || !category || !description || !type || !image) {
      return res.status(400).json({
        message: "All fields except duration and durationType are required",
      });
    }

    try {
      if (type === "rent" && (!duration || !durationType)) {
        return res.status(400).json({
          message: "Duration and durationType are required for rent products",
        });
      }

      const newProduct = new Product({
        name,
        price,
        category,
        description,
        type,
        duration,
        durationType,
        image,
        college: req.user.college,
        seller: req.user._id,
      });

      await newProduct.save();

      res.status(200).json({ message: "Product added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
      console.log(error);
    }
  }
);

app.post("/getproducts", authMiddleware, async (req, res) => {
  const { type } = req.body;

  if (!type || (type !== "rent" && type !== "sell")) {
    return res.status(400).json({ message: "Type must be 'rent' or 'sell'" });
  }

  try {
    const products = await Product.find({ type, college: req.user.college }).populate("seller", "name email");;
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.log(error);
  }
});

app.get("/product/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).populate("seller", "name email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
