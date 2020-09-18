const knex = require("../connection");

function getAllProductsShop() {
  return knex("products").select("*");
}

function addProduct(product) {
  return knex("products").insert(product).returning("*");
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
  addProduct,
  getAllProductsShop,
  updateMovie,
  deleteMovie,
};
