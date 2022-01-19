const Controller = require('../Controller');
const Helpers = require('../../../utils/Helper');
const Axios = require('axios');

const { Comment: CommentsModel } = require('../../models');

class MoviesController extends Controller {

  static ENDPOINT = "https://swapi.py4e.com/api/films";

  constructor() { super(); }

  async fetchMovies(req, res, next) {
    try {
      let movies = await Axios.get(`${MoviesController.ENDPOINT}`, {
        headers: {
          Accept: 'application/json',
          "Cache-Control": "no-cache"
        }
      });

      /* Confirm We Have A 200 Request */
      if (movies.status == 200) {
        let moviesList = movies.data.results;
        moviesList = moviesList.sort((dateOne, dateTwo) => {
          return new Date(dateOne.release_date).getTime() - new Date(dateTwo.release_date).getTime();
        });

        /* Parse The Movies List */
        moviesList = moviesList.map(MoviesController.buildMovies);
        let resultSet = await Promise.all(moviesList);

        return super.sendSuccessResponse(res, resultSet, `${resultSet.length} movies retrieved successfully!`, 200);
      }
      
      /* Send An Error Response */
      return super.sendErrorResponse(res, { movies: 'An unexpected error occurred and your movies could not be retrieved!' }, 'Failed to retrieve movies list!', 400);
    } catch (err) {
      console.log(err);
      return super.sendServerError(
        res,
        "Sorry, something went wrong! Please, try again"
      );
    }
  }

  async fetchMovie(req, res, next) {
    try {
      let movieID = req.params.movieId;
      let movie = await Axios.get(`${MoviesController.ENDPOINT}/${movieID}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      /* Check For A 200 Response */
      if (movie.status == 200) {
        movie = await MoviesController.buildMovies(movie.data);

        /* Send Out A Success Response */
        return super.sendSuccessResponse(res, movie, 'Movie retrieved successfully!', 200);
      }

      /* Send An Error Response */
      return super.sendErrorResponse(res, { movie: 'Failed to retrieve the selected movie!' }, 'The selected movie could not be retrieved! Please, try again later!', 400);
    } catch (err) {
      console.log(err);
      return super.sendServerError(
        res,
        "Sorry, something went wrong! Please, try again"
      );
    }
  }

  static async buildMovies(Payload) {

    /* Retrieve The Total No Of Comments */
    const commentsCount = await CommentsModel.count({ where: { movieId: Helpers.fetchResourceID(Payload.url) } });
    
    return {
      id: Helpers.fetchResourceID(Payload.url),
      title: Payload.title,
      director: Payload.director,
      planets: Payload.planets.map(Helpers.fetchResourceID),
      species: Payload.species.map(Helpers.fetchResourceID),
      producer: Payload.producer,
      vehicles: Payload.vehicles.map(Helpers.fetchResourceID),
      starships: Payload.starships.map(Helpers.fetchResourceID),
      episode_id: Payload.episode_id,
      characters: Payload.characters.map(Helpers.fetchResourceID),
      release_date: Payload.release_date,
      opening_crawl: Payload.opening_crawl,
      totalComments: commentsCount
    }
  }
}

module.exports = new MoviesController();