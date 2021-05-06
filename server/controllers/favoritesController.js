
const db = require("../models/curioModel");

const favoritesController = {};

//GET FAVORITES CONTROLLER:
favoritesController.getFavorites = async (req, res, next) => {
  const user_id = res.locals.user_id;
  const getFaveQuery = `SELECT image_id FROM "Favorites" WHERE user_id=$1`;
  const value = [user_id];



  //OPTION 2: Query using async/await:
  try {
    const response = await db.query(getFaveQuery, value);
    if (response) {
      res.locals.favorites = response.rows;
      return next();
    }
  } catch (error) {
    return next({
      message: { err: "Error getting favorites from database: " + error },
    });
  }
};

//ADD FAVORITES CONTROLLER:
favoritesController.addFavorite = async (req, res, next) => {
  const { image_id, user_id } = req.body;

  const addFaveQuery = `INSERT INTO "Favorites" (user_id, image_id) VALUES ($1, $2) RETURNING *`;
  const values = [user_id, image_id];

  //OPTION 1: Query using .then:
  /* 
    db.query(addFaveQuery, values)
        .then((data) => {
            return next();
        })
        .catch((err) => {
            return next({
                message: { err: 'Error adding Favorite to database'}
            })
        })
    */

  //OPTION 2: Query using async/await:
  try {
    const response = await db.query(addFaveQuery, values);
    if (response) return next();
  } catch (error) {
    return next({
      message: { err: "Error adding Favorite to database: " + error },
    });
  }
};

//DELETE FAVORITES CONTROLLER:
favoritesController.deleteFavorite = async (req, res, next) => {
  const { image_id } = req.body;
  const user_id = res.locals.user_id;

  const deleteFave = `DELETE FROM "Favorites" WHERE user_id=$1 AND image_id=$2 RETURNING *;`;
  const values = [user_id, image_id];

  //OPTION 1: Query using .then:
  /* 
  db.query(deleteFave, values)
    .then((data) => {
      console.log(data);
      if (data.rows[0]) return next();
      else {
        return next({
          message: { err: "Favorite does not exist for user." },
        });
      }
    })
    .catch((err) => {
      return next({
        message: { err: "Error deleting favorite from database" },
      });
    });
    */

  //OPTION 2: Query using async/await:
  try {
    const response = await db.query(deleteFave, values);
    if (response.rows[0]) return next();
    else {
        return next({
            message: { err: "Favorite does not exist for user." },
          });
    }
  } catch (error) {
    return next({
      message: { err: "Error deleting Favorite to database: " + error },
    });
  }

};

module.exports = favoritesController;
