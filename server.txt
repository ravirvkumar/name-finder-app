// ✅ server.js
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
let myCollection;

const char_values = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 8, 'G': 3,
    'H': 5, 'I': 1, 'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5,
    'O': 7, 'P': 8, 'Q': 1, 'R': 2, 'S': 3, 'T': 4, 'U': 6,
    'V': 6, 'W': 6, 'X': 5, 'Y': 1, 'Z': 7
};

async function connectDB() {
    try {
        await client.connect();
        const db = client.db("mydatabase");
        myCollection = db.collection("mycollection");
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ Database connection error:", err);
    }
}
connectDB();

app.get('/fetch-names', async (req, res) => {
    try {
        const value = parseInt(req.query.value);
        const letter = req.query.letter?.toUpperCase();

        const query = { Name_Value: value };
        if (letter) {
            query.NAMES = { $regex: `^${letter}`, $options: 'i' };
        }

        const data = await myCollection.find(query).toArray();

        if (data.length === 0) {
            return res.json(["No names found!"]);
        }

        const names = data.map(doc => `${doc.NAMES} - ${doc.tamil_name || "—"}`);
        res.json(names);
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Add new name
app.post("/add-name", async (req, res) => {
    try {
        const rawName = req.body.name;
        if (!rawName) return res.status(400).json({ error: "Name is required" });

        const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();

        const existing = await myCollection.findOne({ NAMES: formattedName });
        if (existing) {
            return res.json({ message: "Name already exists", value: existing.Name_Value });
        }

        // Calculate value
        const calculatedValue = [...formattedName.toUpperCase()].reduce((sum, ch) => {
            return sum + (char_values[ch] || 0);
        }, 0);

        await myCollection.insertOne({ NAMES: formattedName, Name_Value: calculatedValue });
        res.json({ message: "Name added successfully", value: calculatedValue });
    } catch (err) {
        console.error("❌ Error adding name:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
