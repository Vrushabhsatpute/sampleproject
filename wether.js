require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 8000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index", { weather: null, error: null });
});

app.post("/weather", async (req, res) => {
    const city = req.body.city.trim(); // ✅ Trim spaces
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
        return res.send("API Key missing. Check .env file.");
    }

    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    console.log("Fetching:", URL); // ✅ Debugging the request

    try {
        const response = await axios.get(URL);
        const weatherData = response.data;

        const weather = {
            city: weatherData.name,
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            humidity: weatherData.main.humidity
        };

        res.render("index", { weather, error: null });
    } catch (error) {
        console.error("Error fetching weather:", error.response?.data || error.message);
        res.render("index", { weather: null, error: "City not found!" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
