import express from "express"
import fs from "fs"
import puppeteer from "puppeteer"
import cors from "cors"

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

let fightersArray = [] // Array to store the scraped data

const scrapeData = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
    ],
  })

  try {
    const totalPages = 5 // Adjust the number of pages to scrape
    const concurrentPages = 5 // Number of concurrent pages to scrape

    const promises = []
    for (let pageNum = 1; pageNum <= totalPages; pageNum += concurrentPages) {
      for (let i = 0; i < concurrentPages; i++) {
        const page = await browser.newPage()
        const url = `https://www.ufc.com/athletes/all?gender=All&filters%5B0%5D=status%3A23&search=&page=${
          pageNum + i
        }`
        promises.push(scrapePage(pageNum + i, page, url))
      }
      await Promise.all(promises)
    }

    // Write the fightersArray to a JSON file
    fs.writeFileSync(
      "ufc_fighters.json",
      JSON.stringify(fightersArray, null, 2)
    )

    console.log("Scraping complete! Data saved to ufc_fighters.json.")
  } catch (error) {
    console.error("Error scraping data:", error)
  } finally {
    await browser.close()
  }
}

const scrapePage = async (pageNum, page, url) => {
  console.log(`Scraping page ${pageNum}`)
  await safePageGoto(page, url)

  const fighters = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".view-items-outer-wrp"), e => ({
      imgSrc: e.querySelector(".c-listing-athlete__thumbnail img")?.src || "",
      nick_Name:
        e.querySelector(".c-listing-athlete__nickname")?.innerText || "",
      name: e.querySelector(".c-listing-athlete__name").innerText,
      weight_Class: e.querySelector(".c-listing-athlete__title .field__item")
        .innerText,
      record: e.querySelector(".c-listing-athlete__record").innerText,
    }))
  )

  fightersArray.push(...fighters)
  console.log(`Page ${pageNum} successfully scraped`)
  await page.close()

  // Add a delay between scraping each page to avoid overloading the server
  const delay = 100 // 0.1 seconds delay (adjust as needed)
  await new Promise(resolve => setTimeout(resolve, delay))
}

const safePageGoto = async (page, url, maxRetries = 3) => {
  let retries = 0
  while (retries < maxRetries) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded" })
      return // Successfully loaded the page, return
    } catch (error) {
      console.error(`Error navigating to ${url}. Retrying...`)
      retries++
      // Wait for a short period before retrying
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  throw new Error(`Failed to navigate to ${url} after ${maxRetries} retries.`)
}

// Start the scraping process when the server starts
scrapeData()

// API endpoint to serve the scraped data to the frontend
app.get("/api/fighters", (req, res) => {
  res.json(fightersArray)
})

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
