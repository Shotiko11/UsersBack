const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

// Use built-in JSON middleware to parse request bodies
app.use(express.json());

// Read data from file
const dataFilePath = "./data.json";
let data = fs.existsSync(dataFilePath)
  ? JSON.parse(fs.readFileSync(dataFilePath))
  : [];

// GET all data
app.get("/data", (req, res) => {
  res.json(data);
});

// GET single data by ID
app.get("/data/:id", (req, res) => {
  const id = req.params.id;
  const item = data.find((d) => d.id === parseInt(id));
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

// POST new data
app.post("/data", (req, res) => {
  const newItem = req.body;
  const lastItem = data[data.length - 1];
  const newId = lastItem ? lastItem.id + 1 : 1;
  newItem.id = newId;
  data.push(newItem);
  fs.writeFileSync(dataFilePath, JSON.stringify(data));
  res.json(newItem);
});

// PUT update data by ID
app.put("/data/:id", (req, res) => {
  const id = req.params.id;
  const index = data.findIndex((d) => d.id === parseInt(id));
  if (index !== -1) {
    const updatedItem = req.body;
    updatedItem.id = parseInt(id);
    data[index] = updatedItem;
    fs.writeFileSync(dataFilePath, JSON.stringify(data));
    res.json(updatedItem);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

// DELETE data by ID
app.delete("/data/:id", (req, res) => {
  const id = req.params.id;
  const index = data.findIndex((d) => d.id === parseInt(id));
  if (index !== -1) {
    data.splice(index, 1);
    fs.writeFileSync(dataFilePath, JSON.stringify(data));
    res.json({ message: "Item deleted" });
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
