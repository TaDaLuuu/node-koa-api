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
  console.log({ query });
  const infoShop = await getInfoShop(query.url);
  const nameShop = infoShop.nameShop;
  const productsShop = await getProducts(query.url);
  const allShop = await getAllProductsShopByName(infoShop.nameShop);
  const checkShopExistInDatabase = checkExist(allShop, nameShop);
  console.log({ productsShop });
  if (checkShopExistInDatabase) {
    ctx.status = httpStatus.OK;
    ctx.body = allShop;
    await next();
  } else {
    const shop = {};
    const product = {};

    shop.name = nameShop;
    shop.image = infoShop.imageShop;
    shop.number_of_sale = infoShop.numberOfSaleShops;
    shop.number_of_favourite = infoShop.numberOfFavourites;
    shop.title = infoShop.titleShop;
    shop.link = "link";
    addInfoShop(shop);

    async (productsShop) => {
      const getInfoProduct = async (link) => {
        const info = await getInfoProduct(link);
        product.listing_id = info.listingID;
        let tags = "";
        info.listTags.forEach((e) => (tags = tags.concat(e)));
        product.tags = tags;
      };

      const getData = async () => {
        return Promise.all(
          productsShop.map((item) => {
            product.name = item.title;
            product.image = item.img;
            product.shop_id = 1;
            getInfoProduct(item);
          })
        );
      };
    };
    // productsShop.forEach((e) => {
    //   product.name = e.title;
    //   product.image = e.img;
    //   product.shop_id = 1;
    //   const getInfoProduct = async (link) => {
    //     return await getInfoProduct(link)
    //   }

    //   for (const link of e.link) {
    //     const infoProduct = await getInfoProduct(link);
    //     console.log({ infoProduct });
    //     product.listing_id = infoProduct.listingID;
    //     let tags = "";
    //     infoProduct.listTags.forEach((e) => (tags = tags.concat(e)));
    //     product.tags = tags;
    //   }
    //   console.log({ product });
    //   addProduct(product);
    // });
    ctx.status = httpStatus.OK;
    ctx.body = productsShop;
    await next();
  }
});

router.get("infoProduct", "/infoProduct", async (ctx, next) => {
  // ctx.router available
  const query = ctx.query;
  const infoProduct = await getProducts(query.url);
  ctx.status = httpStatus.OK;
  ctx.body = infoProduct;
  await next();
});

// router.get("infoShop", "/infoShop", async (ctx, next) => {
//   // ctx.router available
//   const query = ctx.query;
//   const infoShop = await getInfoShop(query.url);
//   ctx.status = httpStatus.OK;
//   ctx.body = infoShop;
//   await next();
// });

module.exports = router;
