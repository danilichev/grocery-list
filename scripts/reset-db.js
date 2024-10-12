const fs = require("fs");

const initialState = {
  "grocery-lists": [],
};

fs.writeFileSync("db.json", JSON.stringify(initialState, null, 2));

console.log("db.json has been cleaned and reset to its initial state.");
