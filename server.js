const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const IceCream = require("./models/IceCream");
const User = require("./models/User");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Get all ice creams
app.get("/icecreams", async (req, res) => {
  const { category } = req.query;
  const query = category ? { category } : {};
  const icecreams = await IceCream.find(query);
  res.json(icecreams);
});

// Add a new ice cream
app.post("/icecreams", async (req, res) => {
  const newIceCream = new IceCream(req.body);
  await newIceCream.save();
  res.status(201).json(newIceCream);
});

// User authentication (simple signup/login)
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  res.json({ message: "Login successful", user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
