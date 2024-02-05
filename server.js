const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Allow all origins (you can customize this based on your needs)
app.use(express.json());

app.get('/manga', async (req, res) => {
  try {
    // Make a request to the manga URL
    const response = await axios.get('https://m.manganelo.com/wwww');
    const htmlContent = response.data;

    // Use cheerio to parse HTML content and extract data
    const $ = cheerio.load(htmlContent);
    const mangaList = [];

    // Example: Extracting titles and images
    $('div.container-main-left > div.panel-content-homepage > div > a > img').each((index, element) => {
      const mangaTitle = $(element).attr('alt');
      const mangaImg = $(element).attr('src');
      mangaList.push({ title: mangaTitle, image: mangaImg });
    });

    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins (you can customize this based on your needs)
    res.json({ mangaList });
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
