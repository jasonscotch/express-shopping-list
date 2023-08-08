const express = require("express")
const fs = require("fs");
const path = require("path");
const router = new express.Router()
const ExpressError = require("./expressError")
// const items = require("./fakeDb")
const itemsFile = path.join(__dirname, "items.json");

// Helper function to read data from JSON file
function readDataFromFile() {
  try {
    const data = fs.readFileSync(itemsFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Helper function to write data to JSON file
function writeDataToFile(data) {
  fs.writeFileSync(itemsFile, JSON.stringify(data, null, 2), "utf8");
}

router.get("/", function(req,res){
  const items = readDataFromFile();
  res.json({ items });
})

router.post("/", function (req, res) {
  const newItem = { name: req.body.name, price: req.body.price }
  const items = readDataFromFile();
  items.push(newItem);
  writeDataToFile(items);
  res.status(201).json({ added: newItem });
})

router.get("/:name", function (req, res) {
  const items = readDataFromFile();
  const foundItem = items.find((item) => item.name === req.params.name);
  if(foundItem === undefined){
    throw new ExpressError("Item not found", 404);
  }
  res.json({ foundItem });
})

router.patch("/:name", function (req, res) {
  const items = readDataFromFile();
  const foundItem = items.find((item) => item.name === req.params.name);
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404);
  }
  foundItem.name = req.body.name;
  foundItem.price = req.body.price;
  writeDataToFile(items); 
  res.json({ foundItem });
})

router.delete("/:name", function (req, res) {
  const items = readDataFromFile();
  const foundItem = items.findIndex((item) => item.name === req.params.name);
  if (foundItem === -1) {
    throw new ExpressError("Item not found", 404)
  }
  items.splice(foundItem, 1);
  writeDataToFile(items);
  res.json({ message: "Deleted" });
})

module.exports = {
  router,
  readDataFromFile,
  writeDataToFile
};