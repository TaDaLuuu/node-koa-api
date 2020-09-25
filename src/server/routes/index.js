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
const fs = require("fs");

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

router.post("uploadTemplate", "/uploadTemplate", async (ctx, next) => {
  const fileName = "../../template.txt";
  fs.writeFile(__dirname + fileName, ctx.request.body.text, function (
    err,
    data
  ) {
    console.log(err || data);
  });
  ctx.status = httpStatus.OK;
  ctx.body = "Update Template Successfully";
  await next();
});

router.post("uploadFileTM", "/uploadFileTM", async (ctx, next) => {
  const fileName = "/../../TMList2.txt";
  fs.writeFile(__dirname + fileName, ctx.request.body.text, function (
    err,
    data
  ) {
    console.log(err || data);
  });
  ctx.status = httpStatus.OK;
  ctx.body = "Update File TM Successfully";
  await next();
});

router.post("addTemplate", "/addTemplate", async (ctx, next) => {
  const fileName = "/../../template.txt";
  fs.appendFile(__dirname + fileName, "\r\n" + ctx.request.body.text, function (
    err,
    data
  ) {
    console.log(err || data);
  });
  ctx.status = httpStatus.OK;
  ctx.body = "Add Template Successfully";
  await next();
});

router.get("productsShop", "/productsShop", async (ctx, next) => {
  // ctx.router available
  const fileNameTM = "/../../TMList2.txt";
  const fileTM = fs.readFileSync(__dirname + fileNameTM, "utf-8");

  const fileNameTemplate = "/../../template.txt";
  const fileTemplate = fs.readFileSync(__dirname + fileNameTemplate, "utf-8");
  const query = ctx.query;
  const infoShop = await getInfoShop(query.url);
  const nameShop = infoShop.name;
  const allShop = await getAllProductsShopByName(nameShop);
  const checkShopExistInDatabase = checkExist(allShop, nameShop);

  if (checkShopExistInDatabase) {
    ctx.status = httpStatus.OK;
    const listProducts = await getAllProductsShop(allShop[0].id_shop);
    ctx.body = { infoShop, listProducts, fileTM, fileTemplate };
    await next();
  } else {
    const data = {};
    const listProducts = [];
    infoShop.id_shop = uuidv4();
    const productsShop = await getProducts(query.url);
    if (productsShop.length !== 0) {
      addInfoShop(infoShop);
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
      const listListingID = [];
      let id_product = 0;
      for (let i = 0; i < dataProductsLength; i++) {
        id_product = id_product + 1;
        const a = await getInfoProduct(xs[i].link);
        a.arrayImages.push(xs[i].img);
        data.id_product = id_product;
        data.images_product = a.arrayImages.slice(0, -1);
        data.listing_id = Number(a.listingID);

        let tags = "";
        const listTags = a.listTags || [];
        console.log({ listTags });
        listTags.forEach((e, index) => {
          if (index < listTags.length - 1) {
            tags = tags.concat(e).concat(",");
          } else tags = tags.concat(e).concat(".");
        });
        data.shop_id = infoShop.id_shop;
        data.tags = tags;
        data.name = xs[i].title;
        listListingID.push(data.listing_id);
        listProducts.push(data);
        const count = countElementInArray(listListingID, data.listing_id);
        if (count === 1) {
          addProduct(data);
        }
      }
    };
    await getDataProducts(productsShop);
    ctx.status = httpStatus.OK;
    ctx.body = { infoShop, listProducts, fileTM, fileTemplate };
    await next();
  }
});

module.exports = router;
