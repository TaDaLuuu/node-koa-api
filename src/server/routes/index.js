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
const { addProduct } = require("../db/queries/products");
const { FakeXMLHttpRequest } = require("sinon");

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
    ctx.body = allShop;
    await next();
  } else {
    const shop = {};
    shop.id = 10;
    shop.name = nameShop;
    shop.image = infoShop.imageShop;
    shop.number_of_sale = infoShop.numberOfSaleShops;
    shop.number_of_favourite = infoShop.numberOfFavourites;
    shop.title = infoShop.titleShop;
    shop.link = "link";
    console.log({ shop });
    addInfoShop(shop);
    const productsShop = await getProducts(query.url);
    const getDataProducts = async (xs) => {
      const data = {};
      const dataProductsLength = xs.length;
      console.log({ dataProductsLength });
      for (let i = 0; i < dataProductsLength; i += 50) {
        const requests = xs.slice(i, i + 10).map(async (x) => {
          console.log({ x });
          const img = x.img;
          data.title = x.title;
          try {
            const a = await getInfoProduct(x.link);
            // console.log({ a });
            const arraysImage = a.arrayImages;
            data.listing_id = a.listing_id;
            let tags = "";
            const listTags = a.tags;
            listTags.forEach((e) => tags.concat(e).concat(","));
            data.tags = tags;
            // addProduct(data);
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
    ctx.body = productsShop;
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
