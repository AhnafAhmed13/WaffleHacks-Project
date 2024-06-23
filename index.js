
// Express
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public'));
// });

// Gemini
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post('/get-recommendation', async function(req, res) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const bmi = req.body.bmi;
    const idealBmi = req.body.idealBmi;
    const height = req.body.height;
    const weight = req.body.weight;
    const timeframe = req.body.timeframe;
    const focus = req.body.focus;
    const weeklyChange = req.body.weeklyChange;

    const prompt = `User's current BMI is ${bmi}, and their ideal BMI is ${idealBmi}. They are ${height} cm tall and currently weigh ${weight} kg. The user aims to achieve their ideal BMI in ${timeframe} weeks by focusing on ${focus}. They need to change their weight by ${weeklyChange} kg per week. Please provide detailed health and wellness recommendations, including specific actions related to ${focus}, to help the user reach their ideal bodyweight.`;

    try {
        console.log(prompt);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.send(text);
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(PORT, () => console.log(`Server: Port ${PORT}`));