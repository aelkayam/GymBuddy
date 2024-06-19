const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello, GymBuddy!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// const express = require('express');
// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(express.json());

// app.use('/api/auth', require('./routes/api/auth'));

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
