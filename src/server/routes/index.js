const Router = require("koa-router");
const router = new Router();
const getProducts = require("./getProducts");
const getInfoProduct = require("./getInfoProduct");
const getInfoShop = require("./getInfoShop");
const httpStatus = require("http-status");
const { v4: uuidv4 } = require("uuid");
const {
  addInfoShop,
  getAllProductsShopByName,
} = require("../db/queries/shops");
const { addProduct, getAllProductsShop } = require("../db/queries/products");

const checkExist = (arr, name) => {
  return arr.some((e) => e.name === name);
};
require("events").EventEmitter.prototype._maxListeners = 100;

router.get("/", async (ctx) => {
  ctx.body = {
    status: "success",
    message: "hello, world!",
  };
});
router.get("productsShop", "/productsShop", async (ctx, next) => {
  // ctx.router available
  const query = ctx.query;
  const infoShop = await getInfoShop(query.url);
  const nameShop = infoShop.nameShop;
  const allShop = await getAllProductsShopByName(infoShop.nameShop);
  const checkShopExistInDatabase = checkExist(allShop, nameShop);

  if (checkShopExistInDatabase) {
    ctx.status = httpStatus.OK;
    const productsFromDB = await getAllProductsShop(allShop[0].id_shop);
    ctx.body = { allShop, productsFromDB };
    await next();
  } else {
    const shop = {};
    const data = {};
    const products = [];
    shop.id_shop = uuidv4();
    shop.name = nameShop;
    shop.image_shop = infoShop.imageShop;
    shop.number_of_sale = infoShop.numberOfSaleShops;
    shop.number_of_favourite = infoShop.numberOfFavourites;
    shop.title = infoShop.titleShop;
    shop.link = "link";

    const productsShop = await getProducts(query.url);
    if (productsShop.length !== 0) {
      addInfoShop(shop);
    }
    const countElementInArray = (array, value) => {
      let count = 0;
      array.forEach((e) => {
        if (e === value) {
          count++;
        }
      });
      return count;
    };
    const getDataProducts = async (xs) => {
      const dataProductsLength = xs.length;
      console.log({ dataProductsLength });
      const listListingID = [];
      let id_product = 0;
      for (let i = 0; i < dataProductsLength; i++) {
        id_product = id_product + 1;
        console.log({ id_product });
        const a = await getInfoProduct(xs[i].link);
        const images = xs[i].img.concat(a.arrayImages);
        data.id_product = id_product;
        data.images_product = images;
        data.listing_id = Number(a.listingID);

        let tags = "";
        const listTags = a.listTags || [];
        listTags.forEach((e) => (tags = tags.concat(e).concat(",")));
        data.shop_id = shop.id_shop;
        data.tags = tags;
        data.name = xs[i].title;
        listListingID.push(data.listing_id);
        products.push(data);
        // console.log({ data });
        const count = countElementInArray(listListingID, data.listing_id);
        if (count === 1) {
          addProduct(data);
        }
      }
    };
    await getDataProducts(productsShop);
    ctx.status = httpStatus.OK;
    ctx.body = { shop, products };
    await next();
  }
});

module.exports = router;
