const puppeteer = require("puppeteer");

const getInfoShop = async (url) => {
  const extractPartners = async (url) => {
    const page = await browser.newPage();
    await page.goto(url);
    page.on("console", (msg) => {
      console.log({ msg });
    });

    const data = await page.evaluate(async () => {
      const nameShop = document.querySelector("h1").innerText;
      const shopWrapper = document.querySelector(".shop-icon");
      const imageShop = shopWrapper.querySelector("img").src;
      const titleShop = shopWrapper.querySelector(
        ".shop-name-and-title-container > span"
      ).innerText;
      const numberOfSaleShopsTxt = shopWrapper.querySelector(
        ".shop-icon .display-flex-lg > span"
      ).innerText;
      const numberOfSaleShops = numberOfSaleShopsTxt.replace(/\D/g, "");
      const numberOfFavouritesTxt = shopWrapper.querySelector(
        ".shop-info .trust-actions"
      ).innerText;
      const numberOfFavourites = numberOfFavouritesTxt.replace(/\D/g, "");

      const infoShop = {};
      infoShop.nameShop = nameShop;
      infoShop.titleShop = titleShop;
      infoShop.imageShop = imageShop;
      infoShop.numberOfSaleShops = numberOfSaleShops;
      infoShop.numberOfFavourites = numberOfFavourites;
      return infoShop;
    });
    await page.close();
    return data;
  };

  const browser = await puppeteer.launch();
  const partners = await extractPartners(url);
  await browser.close();
  return partners;
};

module.exports = getInfoShop;
