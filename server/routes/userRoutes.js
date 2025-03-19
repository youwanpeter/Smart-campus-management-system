const express = require("express");
const router = express.Router();
const User = require("../models/Users.js");

//Generate ID with 01, 02, 03 precedence
const generateId = async () => {
  const users = await User.find().sort({ id: 1 });
  let newId = users.length > 0 ? parseInt(users[users.length - 1].id) + 1 : 1;
  return newId.toString().padStart(2, "0");
};

//Get All Users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

//Add User
router.post("/", async (req, res) => {
  try {
    const { name, role, email, phone, username, password } = req.body;
    const id = await generateId();
    const newUser = new User({ id, name, role, email, phone, username, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error adding user" });
  }
});

//Edit User
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
});

//Delete User
router.delete("/:id", async (req, res) => {
  try {
    await User.findOneAndDelete({ id: req.params.id });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});


router.get('/instructors', async (req, res) => {
  try {
    const instructors = await User.find({ role: 'Lecturer' });
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching instructors" });
  }
});

module.exports = router;
