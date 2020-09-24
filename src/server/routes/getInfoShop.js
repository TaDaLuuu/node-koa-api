const puppeteer = require("puppeteer");

const getInfoShop = async (url) => {
  const extractPartners = async (url) => {
    const page = await browser.newPage();
    await page.goto(url);
    page.on("console", (msg) => {
      console.log({ msg });
    });

    const data = await page.evaluate(async () => {
      const info_shop_wrapper = document.querySelector(
        ".wider-content .large-banner"
      );
      const nameShop = document.querySelector("h1").innerText;
      const shopWrapper = info_shop_wrapper.querySelector(".shop-icon");
      const imageShop = shopWrapper.querySelector("img").src;
      const titleShop = shopWrapper.querySelector(
        ".shop-name-and-title-container > span"
      ).innerText;
      const numberOfSaleShopsTxt = shopWrapper.querySelector(
        ".shop-icon .wt-text-body-01"
      ).innerText;
      const numberOfSaleShops = numberOfSaleShopsTxt.replace(/\D/g, "");
      const numberOfFavouritesTxt = shopWrapper.querySelector(
        ".shop-info .trust-actions .favorite-shop-action"
      ).innerText;
      const numberOfFavourites = numberOfFavouritesTxt.replace(/\D/g, "");

      const infoShop = {};
      infoShop.name = nameShop;
      infoShop.title = titleShop;
      infoShop.image_shop = imageShop;
      infoShop.number_of_sale = numberOfSaleShops;
      infoShop.number_of_favourite = numberOfFavourites;
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
