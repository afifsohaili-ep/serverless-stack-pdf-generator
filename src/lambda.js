import chrome from "chrome-aws-lambda";
import * as fs from "fs";

const puppeteer = chrome.puppeteer;

export async function handler(event) {
  let browser
  let response
  try {
    const { url } = event.queryStringParameters;

    browser = await puppeteer.launch({
      args: chrome.args,
      executablePath: await chrome.executablePath,
    });

    const page = await browser.newPage();
    const width = 874
    const height = 1240

    await page.setViewport({ width, height });

    // Navigate to the url
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Take the screenshot
    await page.pdf({path: 'receipt.pdf', width: width + "px", height: height + "px", printBackground: true});
    const buffer = fs.readFileSync('receipt.pdf')

    response = {
      statusCode: 200,
      headers: {'Content-type' : 'application/pdf'},
      body: buffer.toString('base64'),
      isBase64Encoded : true,
    };
  } catch(err) {
    response = {
      statusCode: 500,
      body: JSON.stringify({message: `An error occured. ${err.message}`})
    }
  } finally {
    await browser && browser.close()
  }
  return response
}
