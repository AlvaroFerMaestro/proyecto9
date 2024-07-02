const { log } = require("console");
const { default: puppeteer } = require("puppeteer");
const fs = require("fs");

const portatilesArray = [];

const scrapper = async (url) => {

    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024  });
    
    repeat(page);

}

const repeat = async (page) => {
    const arrayDivs = await page.$$(".product-card")

    for (const portatilesDiv of arrayDivs) {

        let price =await portatilesDiv.$eval(".product-card__price-container", (el) => parseFloat(el.textContent.slice(0, el.textContent.length -1)));
        let title = await portatilesDiv.$eval(".product-card__title", (el) => el.textContent);
        let img = await portatilesDiv.$eval("img", (el)  => el.src);

        const portatil = {
            title,
            img,
            price
            
        }

        portatilesArray.push(portatil);
        
    }
 
   /*  try {
    await page.$eval('[aria-label="Página siguiente"][data-testid="icon_right"]', el => el.click());
    await page.waitForNavigation();
    } catch (error) {
    write(portatilesArray);
    }
     */
    await page.$eval('[aria-label="Página siguiente"][data-testid="icon_right"]', el => el.click());
    await page.waitForNavigation();
    write(portatilesArray);
    repeat(page);
}

const write = (portatilesArray) =>{
    fs.writeFile("portatiles.json", JSON.stringify(portatilesArray), () => {
        console.log("Archivo esrcito");
    });
}

scrapper("https://www.pccomponentes.com/portatiles?s_kwcid=AL!14405!3!604060658535!e!!g!!pccomponentes%20portatiles&gad_source=1&gclid=CjwKCAjwyo60BhBiEiwAHmVLJXzQDgiPMyVpxgIdmqUU-shbtvTBDCxCxQnpl-KJT8Kk6Ods0VeRsBoCVEkQAvD_BwE");