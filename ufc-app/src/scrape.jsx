// //TESTING MAIN
// async function run() {
//   const browser = await puppeteer.launch({
//     headless: false,
//     timeout: 100000,
//   })

//   const page = await browser.newPage()
//   await page.goto("https://www.ufc.com/athletes/all")
//   console.log("PAGE LOADED")
//   await new Promise(resolve => setTimeout(resolve, 2000))
//   console.log("FILTERING FOR ACTIVE FIGHTERS")
//   await page.evaluate(() => {
//     window.scrollBy(0, 100) // Scroll 100 pixels down
//   })
//   await page.click(".view-items-outer-wrp .e-button--small")
//   await new Promise(resolve => setTimeout(resolve, 2000))
//   await page.click(".block-facets__header ")
//   await new Promise(resolve => setTimeout(resolve, 2000))
//   await page.click(".facet-item__value")
//   await new Promise(resolve => setTimeout(resolve, 9000))

//SCROLLNLOAD TESTER
// const scrapeInfiniteScrollItems = async page => {
//   while (true) {
//     const previousHeight = await page.evaluate("document.body.scrollHeight")
//     await page.click(".js-pager__items .button")
//     await page.waitForTimeout(3000) // Pause for 1 second

//     await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
//     await page.waitForTimeout(3000) // Pause for 1 second

//     const newHeight = await page.evaluate("document.body.scrollHeight")
//     if (newHeight === previousHeight) {
//       break // Exit the loop if the page height remains the same
//     }
//   }
//   return scrapeInfiniteScrollItems
// }
// await scrapeInfiniteScrollItems(page)
// }

// run()

//SCRAPING TESTER
// const courses = await page.evaluate(() =>
//   Array.from(
//     document.querySelectorAll(
//       ".view-items-outer-wrp .c-listing-athlete__text "
//     ),
//     e => ({
//       nick_Name:
//         e.querySelector(".c-listing-athlete__nickname")?.innerText || "",

//       name: e.querySelector(".c-listing-athlete__name").innerText,
//       weight_Class: e.querySelector(".c-listing-athlete__title .field__item ")
//         .innerText,
//       record: e.querySelector(".c-listing-athlete__record ").innerText,
//     })
//   )
// )
// console.log(courses)

// //NEW TEST EXPERIEMNTAL
// async function safePageGoto(page, url) {
//   try {
//     await page.goto(url, { waitUntil: "domcontentloaded" })
//   } catch (error) {
//     console.error(`Error navigating to ${url}. Retrying...`)
//     await safePageGoto(page, url) // Retry navigating to the URL
//   }
// }

// async function scrapePage(pageNum, page) {
//   const url = `https://www.ufc.com/athletes/all?gender=All&filters%5B0%5D=status%3A23&search=&page=${pageNum}`
//   await safePageGoto(page, url)

//   // Your scraping code here
//   // For example, scrape the fighters' data on the current page
//   const fighters = await page.evaluate(() =>
//     Array.from(
//       document.querySelectorAll(".view-content .c-listing-athlete__text"),
//       e => ({
//         nick_Name:
//           e.querySelector(".c-listing-athlete__nickname")?.innerText || "",
//         name: e.querySelector(".c-listing-athlete__name").innerText,
//         weight_Class: e.querySelector(".c-listing-athlete__title .field__item")
//           .innerText,
//         record: e.querySelector(".c-listing-athlete__record").innerText,
//       })
//     )
//   )

//   console.log(`Scraping page ${pageNum}`)
//   return fighters
// }

// ;(async () => {
//   const browser = await puppeteer.launch({
//     headless: true,
//     defaultViewport: null, // Allow pages to have their own viewport
//     args: [
//       "--disable-gpu",
//       "--disable-dev-shm-usage",
//       "--disable-setuid-sandbox",
//     ],
//   })

//   const totalPages = 87 // Total number of pages to scrape
//   const concurrentPages = 5 // Number of pages to run in parallel

//   const pages = await Promise.all(
//     Array.from({ length: concurrentPages }, () => browser.newPage())
//   )

//   const allFighters = [] // Array to store all the fighters

//   for (let pageNum = 1; pageNum <= totalPages; pageNum += concurrentPages) {
//     const promises = []

//     for (let i = 0; i < concurrentPages && pageNum + i <= totalPages; i++) {
//       promises.push(scrapePage(pageNum + i, pages[i]))
//     }

//     const results = await Promise.all(promises)

//     // Concatenate the results from each page into the main array
//     allFighters.push(...results.flat())

//     // Add a delay between sets of concurrent page requests to avoid overloading the server
//     const delay = 100 // 0.1 seconds delay (adjust as needed)
//     await new Promise(resolve => setTimeout(resolve, delay))
//   }

//   // Log the entire array of fighters once all pages are scraped
//   console.log(allFighters)

//   await browser.close()
// })()

// // SLOWER TESTER EXPERIMENTAL

//************************************************************************************************
//************************************************************************************************
//************************************************************************************************
//************************************************************************************************
//************************************************************************************************
//************************************************************************************************
//************************************************************************************************
//************************************************************************************************

// //PRODUCTION MAIN
const puppeteer = require("puppeteer")

const fs = require("fs")

async function safePageGoto(page, url, maxRetries = 3) {
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

// ... Rest of the code remains the same ...

async function scrapePage(pageNum, page) {
  const url = `https://www.ufc.com/athletes/all?gender=All&filters%5B0%5D=status%3A23&search=&page=${pageNum}`
  console.log(`Scraping page ${pageNum}`)
  try {
    await safePageGoto(page, url)
  } catch (error) {
    console.error(error.message)
    return [] // Return an empty array if the page couldn't be loaded
  }

  const fighters = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".view-items-outer-wrp "), e => ({
      imgSrc: e.querySelector(".c-listing-athlete__thumbnail img")?.src || "",
      nick_Name:
        e.querySelector(".c-listing-athlete__nickname")?.innerText || "",
      name: e.querySelector(".c-listing-athlete__name").innerText,
      weight_Class: e.querySelector(".c-listing-athlete__title .field__item")
        .innerText,
      record: e.querySelector(".c-listing-athlete__record").innerText,
    }))
  )

  console.log(`Page ${pageNum} successfully scraped`)
  return fighters
}

// ... Rest of the code remains the same ...

async function scrapeAllPages() {
  const totalPages = 5
  const fightersArray = []

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
    ],
  })

  const pages = await Promise.all(
    Array.from({ length: 5 }, () => browser.newPage())
  )

  for (let pageNum = 1; pageNum <= totalPages; pageNum += 5) {
    const promises = []

    for (let i = 0; i < 5 && pageNum + i <= totalPages; i++) {
      promises.push(scrapePage(pageNum + i, pages[i]))
    }

    const pageFighters = await Promise.all(promises)
    fightersArray.push(...pageFighters.flat()) // Merge the arrays into one

    // Add a delay between sets of concurrent page requests to avoid overloading the server
    const delay = 100 // 0.1 seconds delay (adjust as needed)
    await new Promise(resolve => setTimeout(resolve, delay))
  }

  await browser.close()

  // Write the fightersArray to a JSON file
  fs.writeFileSync("ufc_fighters.json", JSON.stringify(fightersArray, null, 2))

  console.log("Scraping complete! Data saved to ufc_fighters.json.")

  // Calculate the total number of fighters
  const totalFighters = fightersArray.length
  console.log(`Total number of fighters scraped: ${totalFighters}`)
  console.log(fightersArray)
}

scrapeAllPages()

// ;(async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     timeout: 1000000,
//   })

//   const page = await browser.newPage()
//   await page.goto(
//     "https://www.ufc.com/athletes/all?gender=All&filters%5B0%5D=status%3A23&search=&page=1"
//   )
//   console.log("SUCESSFULL LOAD, NOW SCROLLING!")

// await scrapeInfiniteScrollItems(page)
// console.log("SCROLLING COMPLETE")
// await new Promise(resolve => setTimeout(resolve, 10000))

// console.log("STARTING SCRAPE!!")
// const fighters = await maleFighters(page)

// console.log(fighters)
// console.log("COMPLETE!!!")
// await scrapeInfiniteScrollItems(page)
// })()

// // //Male Fighter Scrape
// const maleFighters = async page => {
//   const fighters = await page.evaluate(() =>
//     Array.from(
//       document.querySelectorAll(
//         ".view-items-outer-wrp .c-listing-athlete__text "
//       ),
//       e => ({
//         nick_Name:
//           e.querySelector(".c-listing-athlete__nickname")?.innerText || "",
//         name: e.querySelector(".c-listing-athlete__name").innerText,
//         weight_Class: e.querySelector(".c-listing-athlete__title .field__item ")
//           .innerText,
//         record: e.querySelector(".c-listing-athlete__record ").innerText,
//       })
//     )
//   )
//   return fighters
// }

// // //SCROLLDOWN PRODUCTION
// const scrapeInfiniteScrollItems = async page => {
//   while (true) {
//     const previousHeight = await page.evaluate("document.body.scrollHeight")
//     await page.click(".js-pager__items .button")
//     await page.waitForTimeout(4000) // Pause for 1 second

//     await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
//     await page.waitForTimeout(4000) // Pause for 1 second

//     const newHeight = await page.evaluate("document.body.scrollHeight")
//     if (newHeight === previousHeight) {
//       break // Exit the loop if the page height remains the same
//     }
//   }
// }
