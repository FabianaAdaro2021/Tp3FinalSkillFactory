const express = require("express");
const router = express.Router();
const favouriteFilmController = require("../controllers/fouvoritefilm.controller");
const { requireToken } = require("../middleware/requiretoken");

router.get("/", requireToken, favouriteFilmController.getAllFavouriteFilms);
router.get(
  "/user",
  requireToken,
  favouriteFilmController.getFavouriteFilmByUserId
);
router.put("/", requireToken, favouriteFilmController.updateReview);
router.post("/", requireToken, favouriteFilmController.createFavouriteFilm);
router.delete("/:id", requireToken, favouriteFilmController.deleteFavouriteFilm);
router.get("/:id", requireToken, favouriteFilmController.getFavouriteFilmById);
router.delete("/admin/:id", requireToken, favouriteFilmController.deleteAdminFavouriteFilm);


module.exports = router;
