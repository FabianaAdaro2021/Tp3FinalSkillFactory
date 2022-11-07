const { limitAndOffset } = require("../helper/limitandoffset");

const getMovies = async (req, res) => {
  try {
    const { order } = req.query;

    const response = await fetch("https://ghibliapi.herokuapp.com/films");
    const movies = await response.json();
    if (order == "desc") {
      movies.sort((a, b) => -b.release_date - a.release_date);
    } else if (order == "asc") {
     
      movies.sort((a, b) => -a.release_date - b.release_date);
    }

    movies.length > 0
      ? res.status(200).json(movies)
      : res.status(404).json({ errorMessage: "Movies not found" });
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal server error" });
  }
};

const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(`https://ghibliapi.herokuapp.com/films/${id}`);
    const movie = await response.json();
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal server error" });
  }
};

const getMovieByName = async (req, res) => {
  try {
    const { title } = req.params;
    const titleFormatted = title.split("-").join(" ");
    console.log(titleFormatted);

    const response = await fetch(`https://ghibliapi.herokuapp.com/films`);
    const movies = await response.json();
    const movie = movies.find((movie) => movie.title === titleFormatted);
    movie
      ? res.status(200).json(movie)
      : res.status(404).json({ errorMessage: "Movie not found" });
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal server error" });
  }
};

module.exports = {
  getMovies,
  getMovieById,
  getMovieByName,
};
