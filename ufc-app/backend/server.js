import express from "express"
import fs from "fs"
import puppeteer from "puppeteer"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

let fightersArray = []
let isScrapingComplete = false

const backendDirectory = path.dirname(fileURLToPath(import.meta.url))
const publicDirectory = path.join(backendDirectory, "..", "public")

const safePageGoto = async (page, url, maxRetries = 3) => {
  let retries = 0
  while (retries < maxRetries) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded" })
      return
    } catch (error) {
      console.error(`Error navigating to ${url}. Retrying...`)
      retries++
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  throw new Error(`Failed to navigate to ${url} after ${maxRetries} retries.`)
}

const scrapePage = async (pageNum, page, url) => {
  try {
    fightersArray = []
    console.log(`Scraping page ${pageNum}`)
    await safePageGoto(page, url)

    // Wait for the list of fighters to load with increased timeout for selectors
    await page.waitForSelector(".item-list", { timeout: 10000 })

    const fighters = await page.$$eval(
      ".c-listing-athlete-flipcard__front",
      fighterElements => {
        const fighters = []

        fighterElements.forEach(element => {
          imgSrc =
            element
              .querySelector(".c-listing-athlete__thumbnail img")
              ?.getAttribute("src") || ""
          let name = element
            .querySelector(".c-listing-athlete__name")
            .textContent.trim()
          let nickname = element
            .querySelector(".c-listing-athlete__nickname")
            .textContent.trim()
          let weight_Class = element
            .querySelector(".c-listing-athlete__title .field__item")
            .textContent.trim()
          let record = element
            .querySelector(".c-listing-athlete__record")
            .textContent.trim()

          // Check if the nickname is empty or null, and set it to an empty string if so
          if (!nickname) {
            nickname = ""
          }

          fighters.push({ imgSrc, name, nickname, weight_Class, record })
        })

        return fighters
      }
    )

    fightersArray.push(...fighters)
    console.log(`Page ${pageNum} successfully scraped`)
    console.log(
      `Length of fightersArray after scraping page ${pageNum}: ${fightersArray.length}`
    )
  } catch (error) {
    console.error(`Error scraping page ${pageNum}:`, error.message)
  } finally {
    await page.close()
    const delay = 100
    await new Promise(resolve => setTimeout(resolve, delay))
  }
}

const scrapeUFCFighters = async () => {
  fightersArray = [] // Reset fightersArray before starting scraping
  isScrapingComplete = false // Reset the flag
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
    console.log("Starting scraping process...")

    const allFighterData = [] // Array to store data from all pages

    // Loop through all 90 pages
    for (let page_number = 1; page_number <= 87; page_number++) {
      // Create a new page for each iteration
      const page = await browser.newPage()

      // Construct the URL with the current page number
      const url =
        "https://www.ufc.com/athletes/all?filters%5B0%5D=status%3A23&gender=All&search=&page=" +
        page_number

      // Scrape the page
      await scrapePage(page_number, page, url)

      // Add the data from the current page to the array of all fighter data
      allFighterData.push(...fightersArray)

      // Display the message indicating the page has been scraped
      console.log(`Page ${page_number} has been scraped.`)
    }

    // Write the allFighterData to a JSON file in the public folder
    const jsonData = JSON.stringify(allFighterData, null, 2)
    fs.writeFileSync(path.join(publicDirectory, "ufc_fighters.json"), jsonData)

    console.log(
      `Scraping complete! Data saved to ${path.join(
        publicDirectory,
        "ufc_fighters.json"
      )}.`
    )

    console.log(`Total number of fighters scraped: ${allFighterData.length}`)

    isScrapingComplete = true
  } catch (error) {
    console.error("Error scraping data:", error)
  } finally {
    await browser.close()
  }
}

scrapeUFCFighters()

app.get("/api/isScrapingComplete", (req, res) => {
  res.json({ isScrapingComplete })
})

app.get("/api/fighters", (req, res) => {
  const jsonData = fs.readFileSync(
    path.join(publicDirectory, "ufc_fighters.json"),
    "utf8"
  )
  const fightersData = JSON.parse(jsonData)
  res.json(fightersData)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
