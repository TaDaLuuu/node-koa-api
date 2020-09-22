const knex = require("../connection");

function getAllProductsShopByName(name) {
  return knex("shops").select("*").where({ name: name });
}

function addInfoShop(shop) {
  return knex("shops").then(() => {
    return knex("shops").insert(shop);
  });
}

function updateMovie(id, movie) {
  return knex("movies")
    .update(movie)
    .where({ id: parseInt(id) })
    .returning("*");
}

function deleteMovie(id) {
  return knex("movies")
    .del()
    .where({ id: parseInt(id) })
    .returning("*");
}

module.exports = {
  addInfoShop,
  getAllProductsShopByName,
  updateMovie,
  deleteMovie,
};
