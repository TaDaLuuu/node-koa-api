const puppeteer = require("puppeteer");

const getProducts = async (url) => {
  const extractPartners = async (url) => {
    const page = await browser.newPage();
    await page.goto(url, {
      timeout: 0,
    });
    page.on("console", (msg) => {
      console.log({ msg });
    });

    const lastNumberLi = await page.evaluate(() => {
      const pagination = document.querySelector(
        ".wt-action-group.wt-list-inline.wt-flex-no-wrap.wt-flex-no-wrap.wt-pt-lg-1.wt-pb-lg-3"
      );
      const liArr = pagination.querySelectorAll("li");
      const lastNumberLi = liArr[liArr.length - 2];
      const pageNumbers = /\d+/g.exec(lastNumberLi.innerText);
      return pageNumbers;
    });

    const partners = await page.evaluate(async () => {
      const products = [];
      const product_wrapper = document.querySelectorAll(
        ".listing-cards .v2-listing-card"
      );

      for (const product of product_wrapper) {
        const dataJson = {};
        try {
          dataJson.img = [
            product.querySelector(
              ".v2-listing-card__img .height-placeholder > img"
            ).src,
          ] || [
            product
              .querySelector(".v2-listing-card__img .height-placeholder > img")
              .getAttribute("data-src"),
          ];
          dataJson.title = product.querySelector(
            ".v2-listing-card__info > div > h3"
          ).innerText;
          dataJson.link = product.querySelector(
            ".v2-listing-card .listing-link"
          ).href;
        } catch (err) {
          console.log(err);
        }
        products.push(dataJson);
      }
      return products;
    });

    await page.close();
    const currentPageNumber = parseInt(url.match(/page=(\d+)$/)[1], 10);
    const nextPageNumber = currentPageNumber + 1;
    console.log({ nextPageNumber });
    console.log({ lastNumberLi });
    if (nextPageNumber <= Number(lastNumberLi)) {
      console.log({ url });
      const nextUrl = url.replace(
        `page=${currentPageNumber}`,
        `page=${nextPageNumber}`
      );
      console.log({ nextUrl });
      return partners.concat(await extractPartners(nextUrl));
    } else {
      return partners;
    }
  };

  const browser = await puppeteer.launch();
  const urlPage = `${url}?page=1`;
  const partners = await extractPartners(urlPage);
  await browser.close();
  // console.log(partners);
  return partners;
};

module.exports = getProducts;
