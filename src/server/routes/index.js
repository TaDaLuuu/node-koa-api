const Router = require("koa-router");
const router = new Router();
const getProducts = require("./getProducts");
const getInfoProduct = require("./getInfoProduct");
const getInfoShop = require("./getInfoShop");
const httpStatus = require("http-status");
const {
  addInfoShop,
  getAllProductsShopByName,
} = require("../db/queries/shops");
const { addProduct, getAllProductsShop } = require("../db/queries/products");

const checkExist = (arr, name) => {
  return arr.some((e) => e.name === name);
};

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
    const productsFromDB = await getAllProductsShop();
    console.log({ productsFromDB });
    ctx.body = { allShop };
    await next();
  } else {
    const shop = {};
    const data = {};
    const products = [];
    shop.id = 10;
    shop.name = nameShop;
    // shop.image = infoShop.imageShop;
    shop.number_of_sale = infoShop.numberOfSaleShops;
    shop.number_of_favourite = infoShop.numberOfFavourites;
    shop.title = infoShop.titleShop;
    shop.link = "link";
    // console.log({ shop });
    addInfoShop(shop);
    const productsShop = await getProducts(query.url);

    const getDataProducts = async (xs) => {
      const dataProductsLength = xs.length;
      console.log({ dataProductsLength });
      for (let i = 0; i < dataProductsLength; i += 20) {
        const requests = xs.slice(i, i + 10).map(async (x) => {
          try {
            const a = await getInfoProduct(x.link);
            const images = x.img.concat(a.arrayImages);
            data.images = images;
            data.listing_id = Number(a.listingID);
            let tags = "";
            const listTags = a.listTags || [];
            listTags.forEach((e) => (tags = tags.concat(e).concat(",")));
            data.shop_id = 10;
            data.tags = tags;
            data.name = x.title;
            // console.log({ data });
            products.push(data);
            addProduct(data);
            return data;
          } catch (e) {
            return console.log(`Error in sending email for ${x} - ${e}`);
          }
        });
        await Promise.all(requests).catch((e) =>
          console.log(`Error in sending email for the batch ${i} - ${e}`)
        );
      }
    };
    await getDataProducts(productsShop);
    ctx.status = httpStatus.OK;
    ctx.body = { shop, products };
    await next();
  }
});

// router.get("infoProduct", "/infoProduct", async (ctx, next) => {
//   // ctx.router available
//   const query = ctx.query;
//   const infoProduct = await getProducts(query.url);
//   ctx.status = httpStatus.OK;
//   ctx.body = infoProduct;
//   await next();
// });

// router.get("infoShop", "/infoShop", async (ctx, next) => {
//   // ctx.router available
//   const query = ctx.query;
//   const infoShop = await getInfoShop(query.url);
//   ctx.status = httpStatus.OK;
//   ctx.body = infoShop;
//   await next();
// });

module.exports = router;
