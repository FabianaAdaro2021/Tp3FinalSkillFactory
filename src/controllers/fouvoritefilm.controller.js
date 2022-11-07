const { PrismaClient } = require("@prisma/client");
const { prismaError } = require("../errors/databaseerrors");
const { limitAndOffset } = require("../helper/limitandoffset");

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

const getAllFavouriteFilms = async (req, res) => {
  try {
    let { limit, offset, order } = req.query;

    order ? (order = order) : (order = "asc");

    let favouriteFilms = await prisma.favouriteFilm.findMany({
      orderBy: {
        id: order,
      },
    });

    favouriteFilms = limitAndOffset(limit, offset, favouriteFilms);

    favouriteFilms.length > 0
      ? res.status(200).json(favouriteFilms)
      : res.status(404).json({ errorMessage: "Favorite film not found" });
  } catch (error) {
    const { name } = error;
    const errorMessage = prismaError[name] || error.message;
    res.status(500).json({ errorMessage });
  }
};

const getFavouriteFilmById = async (req, res) => {
  try {
    const { id } = req.params;

    let favouriteFilm = await prisma.favouriteFilm.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    favouriteFilm
      ? res.status(200).json(favouriteFilm)
      : res.status(404).json({ errorMessage: "Favorite film not found" });
  } catch (error) {
    const { name } = error;
    const errorMessage = prismaError[name] || error.message;
    res.status(500).json({ errorMessage });
  }
};

const getFavouriteFilmByUserId = async (req, res) => {
  try {
    const { limit, offset, order } = req.query;
    let favouriteFilm = await prisma.favouriteFilm.findMany({
      where: {
        id_user: parseInt(req.id),
      },
      orderBy: {
        id: order,
      },
    });

    favouriteFilm = limitAndOffset(limit, offset, favouriteFilm);

    favouriteFilm
      ? res.status(200).json(favouriteFilm)
      : res.status(404).json({ errorMessage: "Favorite film not found" });
  } catch (error) {
    const { name } = error;
    const errorMessage = prismaError[name] || error.message;
    res.status(500).json({ errorMessage });
  }
};

const createFavouriteFilm = async (req, res) => {
  try {
    let { film_id, review } = req.body;

    
    const verifyFavouriteFilm = await prisma.favouriteFilm.findMany({
      where: {
        id_user: parseInt(req.id),
        id_movie: film_id,
      },
    });

    if (verifyFavouriteFilm.length > 0)
      return res
        .status(400)
        .json({ errorMessage: "Film already added to favorite" });

    const userId = { connect: { id: req.id } };
    const filmId = { connect: { code: film_id } };
    const favouriteFilm = await prisma.favouriteFilm.create({
      data: {
        movie: filmId,
        user: userId,
        review: review,
      },
    });

    favouriteFilm
      ? res.status(201).json(favouriteFilm)
      : res.status(404).json({ errorMessage: "Favorite film not found" });
  } catch (error) {
    const { name } = error;
    const errorMessage = prismaError[name] || error.message;
    res.status(500).json({ errorMessage });
  }
};

const updateReview = async (req, res) => {
  try {
    const { review, id } = req.body;
    const favouriteFilm = await prisma.favouriteFilm.updateMany({
      where: {
        id_user: parseInt(req.id),
        id: id,
      },
      data: {
        review: review,
      },
    });
    favouriteFilm
      ? res.status(200).json({ ok: "Review updated" })
      : res.status(404).json({ errorMessage: "Favorite film not found" });
  } catch (error) {
    console.log(error);
    const { name } = error;
    const errorMessage = prismaError[name] || error.message;
    res.status(500).json({ errorMessage });
  }
};

const deleteFavouriteFilm = async (req, res) => {
  try {
    const { id } = req.params;
    const { count } = await prisma.favouriteFilm.deleteMany({
      where: {
        id_user: parseInt(req.id),
        id: parseInt(id),
      },
    });

    count > 0
      ? res.status(200).json({ ok: "Favorite film deleted" })
      : res.status(404).json({ errorMessage: "Favorite film not found" });
  } catch (error) {
    const { name } = error;
    const errorMessage = prismaError[name] || error.message;
    res.status(500).json({ errorMessage });
  }
};

const deleteAdminFavouriteFilm = async (req, res) => {
  console.log("deleteAdminFavouriteFilm");
  try {
    if(! req.isAdmin) return res.status(401).json({errorMessage: "Unauthorized"})
    const { id } = req.params;
     await prisma.favouriteFilm.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(404).json({ notFound: "Favorite film not found" });
  } catch (error) {
    const { name } = error;
    const errorMessage = prismaError[name] || error.message;
    res.status(500).json({ errorMessage });
  }
};
module.exports = {
  getAllFavouriteFilms,
  getFavouriteFilmById,
  getFavouriteFilmByUserId,
  createFavouriteFilm,
  updateReview,
  deleteFavouriteFilm,
  deleteAdminFavouriteFilm,
};
