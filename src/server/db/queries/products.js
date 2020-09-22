const knex = require("../connection");

function getAllProductsShop() {
  console.log(1);
  return knex("shops").then(() => {
    return knex("shops").where("products.shop_id", 10).select("*");
  });
}

function addProduct(product) {
  return knex("products").then(() => {
    return knex("products").insert(product);
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
  addProduct,
  getAllProductsShop,
  updateMovie,
  deleteMovie,
};
