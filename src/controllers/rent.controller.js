const { PrismaClient } = require("@prisma/client");
const { prismaError } = require("../errors/databaseerrors");
const { limitAndOffset } = require("../helper/limitandoffset");
const { rentPrice } = require("../helper/rentprice");

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

const getRents = async (req, res) => {
  try {
    let { limit, offset, order } = req.query;

    order ? (order = order) : (order = "asc");

    let rents = await prisma.rent.findMany({
      orderBy: {
        id: order,
      },
    });

    rents = limitAndOffset(limit, offset, rents);

    rents.length > 0
      ? res.status(200).json(rents)
      : res.status(404).json({ errorMessage: "Rent not found" });
  } catch (error) {
    const { name } = error;
    const errorMessage = prismaError[name] || error.message;
    res.status(500).json({ errorMessage });
  }
};

const getRentById = async (req, res) => {
  try {
    const { id } = req.params;

    const rent = await prisma.rent.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    rent
      ? res.status(200).json(rent)
      : res.status(404).json({ errorMessage: "Rent not found" });
  } catch (error) {
    const { name } = error;
    const errorMessage = prismaError[name] || error.message;
    res.status(500).json({ errorMessage });
  }
};

const getRentByUserId = async (req, res) => {
  console.log(req.id);
  try {
    let { order } = req.query;
    order ? (order = order) : (order = "asc");

    const rents = await prisma.rent.findMany({
      where: {
        id_user: req.id,
      },
      orderBy: {
        id: order,
      },
    });

    rents.length > 0
      ? res.status(200).json(rents)
      : res.status(404).json({ errorMessage: "Rent not found" });
  } catch (error) {
    const { name } = error;
    const errorMessage = prismaError[name] || error.message;
    res.status(500).json({ errorMessage });
  }
};

const addRent = async (req, res) => {
  try {
    let { id_movie } = req.body;

    const rent_date = new Date();

    
    const refund_date = new Date(rent_date.getTime() + 7 * 24 * 60 * 60 * 1000);

    const movie = await prisma.movie.findUnique({
      where: {
        code: id_movie,
      },
    });

    
    if (!movie)
      return res.status(404).json({ errorMessage: "Movie not found" });
    if (movie.stock === 0)
      return res.status(400).json({ errorMessage: "Movie not available" });

    const movieId = { connect: { code: id_movie } };
    const userId = { connect: { id: req.id } };

    const rent = await prisma.rent.create({
      data: {
        rent_date,
        return_date: refund_date,
        movie: movieId,
        user: userId,
      },
    });

    movie.stock--;
    movie.rentals++;

    await prisma.movie.update({
      where: {
        code: id_movie,
      },
      data: {
        stock: movie.stock,
        rentals: movie.rentals,
      },
    });

    res.status(201).json({ message: "Rent created", rent });
  } catch (error) {
    const { name } = error;
    const errorMessage = prismaError[name] || error.message;
    res.status(500).json({ errorMessage });
  }
};

const returnRent = async (req, res) => {
  try {
    let { id } = req.params;
    id = parseInt(id);

    const rent = await prisma.rent.findUnique({
      where: {
        id: id,
      },
    });

    if (!rent) return res.status(404).json({ errorMessage: "Rent not found" });

    rent.user_return_date = new Date();

    const movie = await prisma.movie.findUnique({
      where: {
        code: rent.id_movie,
      },
    });

    movie.stock++;

    await prisma.movie.update({
      where: {
        code: movie.code,
      },
      data: {
        stock: movie.stock,
      },
    });

    await prisma.rent.update({
      where: {
        id: id,
      },
      data: {
        user_return_date: rent.user_return_date,
      },
    });

    res.status(200).json({
      message: "The movie was returned",
      price: rentPrice(rent.user_return_date, rent.return_date),
    });
  } catch (error) {

    const { name } = error;

    const errorMessage = prismaError[name] || error.message;
    res.status(500).json({ errorMessage });
  }
};

const cancelRent = async (req, res) => {
  try {
    const { id } = req.params;
    const rent = await prisma.rent.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    const today = new Date();

    if (!rent) return res.status(404).json({ errorMessage: "Rent not found" });
    if (
      rent.rent_date.getDay() != today.getDay() &&
      rent.rent_date.getFullYear() != today.getFullYear() &&
      rent.rent_date.getMonth() != today.getMonth()
    ) {
      return res.status(400).json({ errorMessage: "Rent can't be canceled" });
    } //if the rent is not the same day
    if (rent.id_user != req.id)
      res
        .status(401)
        .json({ errorMessage: "You are not authorized to cancel this rent" });

    await prisma.rent.delete({
      where: {
        id: parseInt(id),
      },
    });
    console.log(rent.id_movie);

    await prisma.movie.update({
      where: {
        code: rent.id_movie,
      },
      data: {
        stock: {
          increment: 1,
        },
        rentals: {
          decrement: 1,
        },
      },
    });

    res.status(200).json({ message: "Rent canceled" });
  } catch (error) {
    const { name } = error;
    const errorMessage = prismaError[name] || error.message;
    res.status(500).json({ errorMessage });
  }
};

const deleteRent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.isAdmin)
      return res
        .status(401)
        .json({ errorMessage: "You are not authorized to delete this rent" });

    const rent = await prisma.rent.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    await prisma.rent.delete({
      where: {
        id: parseInt(id),
      },
    });

    await prisma.movie.update({
      where: {
        code: rent.id_movie,
      },
      data: {
        stock: {
          increment: 1,
        },
        rentals: {
          decrement: 1,
        },
      },
    });

    res.status(200).json({ message: "Rent deleted" });
  } catch (error) {
    const { name } = error;
    const errorMessage = prismaError[name] || error.message;
    res.status(500).json({ errorMessage });
  }
};
module.exports = {
  getRents,
  getRentById,
  getRentByUserId,
  addRent,
  returnRent,
  cancelRent,
  deleteRent,
};
