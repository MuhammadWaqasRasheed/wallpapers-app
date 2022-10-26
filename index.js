const express = require("express");
const mongoose = require("mongoose");
const { DB_CONNECTION_STRING } = require("./Util/Constants");

const PORT = process.env.PORT || 3000;

const app = express();

//parsing incoming requests as json
app.use(express.json());

//models
const UserRoutes = require("./routes/User");
const WallpaperRoutes = require("./routes/Wallpaper");
const CategoryRoutes = require("./routes/Category");

app.use("/users", UserRoutes);
app.use("/wallpaper", WallpaperRoutes);
app.use("/category", CategoryRoutes);

app.use((req, res) => {
  return res.status(404).send("Invalid Route");
});

mongoose
  .connect(DB_CONNECTION_STRING)
  .then((result) => {
    console.log("Database Connection Successfull.");
    // listening to PORT
    app.listen(PORT, () => {
      console.log(`Server is Up and Running on PORT : ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
