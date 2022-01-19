/**
 * @author Ilori Stephen A <stephenilori458@gmail.com>
 * @description This file loads in all of the route required by the application.
 * @param {Object}
 * @name APIRoutes
 * @alias Routes
 * @returns {Function}
 *
 */

module.exports = (Route) => {
  Route.get("/api/v1/inspire", (req, res, next) => {
    return res.status(200)
      .json({ message: "May the force be with you!" });
  });

  /* Movies Route */
  Route.get(
    "/api/v1/movies",
    require("../app/controllers/API/MoviesController")
      .fetchMovies
  );
  Route.get(
    "/api/v1/movies/:movieId",
    require("../app/controllers/API/MoviesController")
      .fetchMovie
  );

  /* Characters Route */
  Route.post(
    "/api/v1/people",
    require("../app/controllers/API/CharactersController")
      .fetchCharacters
  );
  Route.get(
    "/api/v1/people/:characterId",
    require("../app/controllers/API/CharactersController")
      .fetchCharacter
  );

  /* Comment Routes */
  Route.post(
    "/api/v1/comment/:movieId",
    require("../app/controllers/API/CommentsController")
      .createComments
  );
  Route.get(
    "/api/v1/comments/:movieId",
    require("../app/controllers/API/CommentsController")
      .fetchComments
  );
}