const Controller = require('../Controller');
const Helpers = require('../../../utils/Helper');
const Axios = require('axios');

class CharactersController extends Controller {

  static ENDPOINT = "https://swapi.py4e.com/api/people";

  constructor() { super(); }

  async fetchCharacters(req, res, next) {
    try {
      const Filter = req.body.filter;
      const Sort = req.body.sort;
      let people = await Axios.get(`${CharactersController.ENDPOINT}`, {
        headers: {
          Accept: 'application/json',
          "Cache-Control": "no-cache"
        }
      });

      /* Confirm A 200 Response Code */
      if (people.status == 200) {
        /* Call The Filter Params */
        people = people.data.results
          .filter((el) => {
            if (el.gender.toLocaleLowerCase() == Filter.toLocaleLowerCase()) {
              return true;
            }

            return false;
        });

        /* Sort By Name, Gender Or Height */
        people = people.sort((peopleA, peopleB) => {
          if (Sort['key'] == 'name') {
            return peopleA.name.localeCompare(peopleB.name);
          }

          if (Sort['key'] == 'gender') {
            return peopleA.gender.localeCompare(peopleB.gender);
          }

          if (Sort['key'] == 'height') {
            return parseInt(peopleA.height) - parseInt(peopleB.height);
          }

          return;
        });

        if (people.length > 0) {
          people = people.map(CharactersController.buildCharacters);

          /* Sort The Array In ASC Or Desc Orde */
          if (Sort.order.toLocaleLowerCase() == 'desc') {
            people = people.reverse();
          }
          
          return super.sendSuccessResponse(res, { people, totalCharacters: people.length }, `${people.length} characters retrieved successfully!`, 200);
        }
      }

      /* Send Out An Error Response */
      return super.sendErrorResponse(res, { people: 'An unexpected error occurred and some characters could not be retrieved!' }, 'Failed to retrieve characters! Please, try again later.', 400);        
    } catch (err) {
      return super.sendServerError(
        res,
        "Sorry, something went wrong! Please, try again"
      );
    }
  }

  async fetchCharacter(req, res, next) {
    try {
      const Id = req.params.characterId;
      let people = await Axios.get(`${CharactersController.ENDPOINT}/${Id}`, {
        headers: {
          Accept: 'application/json',
          "Cache-Control": "no-cache"
        }
      });

      if (people.status == 200) {
        people = CharactersController.buildCharacters(people.data);

        return super.sendSuccessResponse(res, people, 'Character retrieved successfully!', 200);
      }

      /* Send Out An Error Response */
      return super.sendErrorResponse(res, { character: 'Failed to retrieve character!' }, 'Character could not be retrieved! Please, try again!', 400);
    } catch (err) {
      console.log(err);
      return super.sendServerError(
        res,
        "Sorry, something went wrong! Please, try again"
      );
    }
  }

  static buildCharacters(Payload) {
    return {
      id: Helpers.fetchResourceID(Payload.url),
      name: Payload.name,
      mass: Payload.mass,
      gender: Payload.gender,
      height: Helpers.convertHeightToFeetAndInches(Payload.height),
      filmsId: Payload.films.map(Helpers.fetchResourceID),
      created: Payload.created,
      eyeColor: Payload.eye_color,
      homeWorld: Payload.homeworld,
      hairColor: Payload.hair_color,
      speciesId: Payload.species.map(Helpers.fetchResourceID),
      skinColor: Payload.skin_color,
      birthYear: Payload.birth_year,
      vehiclesId: Payload.vehicles.map(Helpers.fetchResourceID),
      starshipsId: Payload.starships.map(Helpers.fetchResourceID),
    }
  }
}

module.exports = new CharactersController();