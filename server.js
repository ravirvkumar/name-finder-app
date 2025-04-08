const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const uri = "mongodb+srv://ravirvkumar:RavikumarP@cluster0.wyngwlr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ MongoDB connected successfully");
}).catch((err) => {
    console.error("❌ MongoDB connection error:", err);
});

// Define Schema & Model
const NameSchema = new mongoose.Schema({
    name: String,
    tamilName: String
});

const NameModel = mongoose.model("Name", NameSchema);

// API Routes
app.get("/", (req, res) => {
    res.send("Welcome to Name Finder App!");
});

app.get("/api/names", async (req, res) => {
    const nameQuery = req.query.name;
    try {
        const data = await NameModel.findOne({ name: new RegExp("^" + nameQuery + "$", "i") });
        if (data) {
            res.json({ tamilName: data.tamilName });
        } else {
            res.status(404).json({ message: "Name not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching name", error });
    }
});

app.post("/api/names", async (req, res) => {
    const { name, tamilName } = req.body;
    try {
        const newName = new NameModel({ name, tamilName });
        await newName.save();
        res.status(201).json({ message: "Name added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error saving name", error });
    }
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
