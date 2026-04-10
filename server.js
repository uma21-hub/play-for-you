const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/youtube-search', async (req, res) => {
    const { query, maxResults } = req.query;
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!query || !maxResults) {
        return res.status(400).send('Missing query or maxResults parameters.');
    }

    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: query,
                maxResults: maxResults,
                key: apiKey
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving data from YouTube API.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
