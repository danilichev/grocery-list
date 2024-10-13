const fs = require("fs");

const units = ["kg", "l", "pc"];

const generateGroceryItem = (id) => ({
  id: `item${id}`,
  isChecked: Math.random() > 0.5,
  name: `Item ${id}`,
  quantity: Math.floor(Math.random() * 10) + 1,
  unit: units[Math.floor(Math.random() * units.length)],
});

const generateGroceryList = (id, itemCount) => ({
  id: `${id}`,
  items: Array.from({ length: itemCount }, (_, i) =>
    generateGroceryItem(i + 1),
  ),
  name: `List ${id}`,
});

const generateDb = (listCount, itemCount) => ({
  "grocery-lists": Array.from({ length: listCount }, (_, i) =>
    generateGroceryList(i + 1, Math.floor(Math.random() * itemCount) + 1),
  ).reverse(),
});

const db = generateDb(100, 10);

fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
