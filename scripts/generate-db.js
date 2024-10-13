const fs = require("fs");

const units = ["kg", "l", "pc"];

const generateGroceryItem = (id) => ({
  id: `item${id}`,
  isChecked: Math.random() > 0.5,
  name: `Item ${id}`,
  quantity: Math.floor(Math.random() * 10) + 1,
  unit: units[Math.floor(Math.random() * units.length)],
});

const generateGroceryList = (number, itemCount) => ({
  id: `${number}`,
  items: Array.from({ length: itemCount }, (_, i) =>
    generateGroceryItem(i + 1),
  ),
  name: `List ${number}`,
  number: number,
});

const generateDb = (listCount, itemCount) => ({
  "grocery-lists": Array.from({ length: listCount }, (_, i) =>
    generateGroceryList(i + 1, Math.floor(Math.random() * itemCount) + 1),
  ),
});

const db = generateDb(100, 10);

fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
