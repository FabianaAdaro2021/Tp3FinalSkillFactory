const movieController = require('../controllers/movie.controller');
const express = require('express');
const router = express.Router();
const {requireToken} = require("../middleware/requiretoken");

router.get('/', requireToken ,movieController.getMovies);
router.get('/:id', requireToken ,movieController.getMovieById);
router.get('/title/:title', requireToken ,movieController.getMovieByName);


module.exports = router;