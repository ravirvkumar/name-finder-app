const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ✅ MongoDB Atlas connection string
const mongoURI = "mongodb+srv://ravikumarrv:RavikumarP@cluster0.wyngwlr.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0";

// ✅ Connect to MongoDB Atlas
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Define schema (points to "mycollection" in your database)
const nameSchema = new mongoose.Schema({
  Name_Value: Number,
  NAMES: String,
  tamil_name: String
}, { collection: "mycollection" });

const NameModel = mongoose.model("NameModel", nameSchema);

// ✅ API route to fetch names by Name_Value
app.get("/get-name/:value", async (req, res) => {
  const value = parseInt(req.params.value);
  try {
    const names = await NameModel.find({ Name_Value: value });
    if (names.length === 0) {
      return res.status(404).json({ message: "❌ No names found for that value." });
    }
    res.json(names);
  } catch (err) {
    res.status(500).json({ message: "❌ Error fetching data", error: err });
  }
});

// ✅ Serve frontend (index.html)
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`🚀 Server running `);
});
