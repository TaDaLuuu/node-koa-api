const knex = require("../connection");

function getAllProductsShop(id) {
  return knex("products").then(() => {
    return knex("products").where("shop_id", id).select("*");
  });
}

function addProduct(product) {
  return knex("products").then(() => {
    return knex("products").insert(product);
  });
}

function updateDataToDB(products) {
  return knex("products").then(() => {
    Promise.all(
      products.map((product) => {
        return knex("products")
          .update({
            images_product: product.images_product,
            name: product.name,
            tags: product.tags,
          })
          .where({
            shop_id: product.shop_id,
            id_product: product.id_product,
          });
      })
    );
  });
}

module.exports = {
  addProduct,
  getAllProductsShop,
  updateDataToDB,
};
