const knex = require("../connection");

function getAllProductsShopByName(name) {
  return knex("shops").select("*").where({ name: name });
}

function addInfoShop(shop) {
  return knex("shops").then(() => {
    return knex("shops").insert(shop);
  });
}

module.exports = {
  addInfoShop,
  getAllProductsShopByName,
};
