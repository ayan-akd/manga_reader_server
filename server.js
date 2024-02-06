const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/manga', async (req, res) => {
  try {
    const response = await axios.get('https://m.manganelo.com/wwww');
    const htmlContent = response.data;

    const $ = cheerio.load(htmlContent);
    const mangaList = [];

    $('div.container-main-left > div.panel-content-homepage > div > a > img').each((index, element) => {
      const mangaTitle = $(element).attr('alt');
      const mangaImg = $(element).attr('src');
      mangaList.push({ title: "", attributes: { src: mangaImg, alt: mangaTitle } });
    });

    res.header('Access-Control-Allow-Origin', '*');
    res.json(mangaList);
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
