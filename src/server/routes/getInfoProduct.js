const puppeteer = require("puppeteer");

const getInfoProduct = async (url) => {
  const extractPartners = async (url) => {
    const page = await browser.newPage();
    await page.goto(url);
    page.on("console", (msg) => {
      console.log({ msg });
    });

    const partners = await page.evaluate(async () => {
      const arrayImages = [];
      const product_wrapper = document.querySelectorAll(
        "ul .carousel-pagination-item-v2"
      );
      const listingID = document
        .querySelector(".image-wrapper button")
        .getAttribute("data-listing-id");
      const tagsAll = document.querySelectorAll(
        ".tags-section-container #wt-content-toggle-tags-read-more .wt-action-group .wt-action-group__item-container"
      );
      const listTags = [];
      tagsAll.forEach((e) => {
        listTags.push(e.querySelector(".wt-action-group__item").innerText);
      });

      for (const product of product_wrapper) {
        try {
          const imgs =
            product.querySelector("img").src ||
            product.querySelector("img").getAttribute("data-src");
          arrayImages.push(imgs);
        } catch (err) {
          console.log(err);
        }
      }
      return { arrayImages, listingID, listTags };
    });
    await page.close();
    return partners;
  };

  const browser = await puppeteer.launch();
  const data = await extractPartners(url);
  await browser.close();
  return data;
};

module.exports = getInfoProduct;
