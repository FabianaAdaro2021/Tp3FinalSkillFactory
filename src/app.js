
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");
const movieRoutes = require("./routes/movie.routes");
const rentRoutes = require("./routes/rent.routes");
const favouriteFilmRoutes = require("./routes/favouritefilm.routes");
const  { errorHandler }  = require("./middleware/errorhandler");

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    
});

app.use("/api/auth", authRoutes);       
app.use("/api/movies", movieRoutes);
app.use("/api/rent", rentRoutes);
app.use("/api/favouritefilm", favouriteFilmRoutes);
app.use(errorHandler, (req, res) => {
  res.status(404).json({ errorMessage: "Not found" });
});