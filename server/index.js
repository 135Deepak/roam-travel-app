import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Roam API server is running",
  });
});

// --------------------------------------------------
// WEATHER - OPENWEATHER
// --------------------------------------------------

app.get("/api/weather", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: "Latitude and longitude are required",
      });
    }

    const url = new URL(
      "https://api.openweathermap.org/data/2.5/weather"
    );

    url.searchParams.set("lat", lat);
    url.searchParams.set("lon", lon);
    url.searchParams.set(
      "appid",
      process.env.OPENWEATHER_API_KEY
    );
    url.searchParams.set("units", "metric");

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();

      console.error("OpenWeather error:", errorText);

      return res.status(response.status).json({
        error: "Unable to fetch weather",
      });
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Weather error:", error);

    res.status(500).json({
      error: "Weather service failed",
    });
  }
});

// --------------------------------------------------
// LOCATION SEARCH - OPENWEATHER GEOCODING
// --------------------------------------------------

app.get("/api/location/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || !query.trim()) {
      return res.status(400).json({
        error: "Location search query is required",
      });
    }

    const url = new URL(
      "https://api.openweathermap.org/geo/1.0/direct"
    );

    url.searchParams.set("q", query.trim());
    url.searchParams.set("limit", "5");
    url.searchParams.set(
      "appid",
      process.env.OPENWEATHER_API_KEY
    );

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Location search error:", errorText);

      return res.status(response.status).json({
        error: "Unable to search location",
      });
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Location search error:", error);

    res.status(500).json({
      error: "Location search failed",
    });
  }
});

// --------------------------------------------------
// LOCATION FROM COORDINATES
// --------------------------------------------------

app.get("/api/location/reverse", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: "Latitude and longitude are required",
      });
    }

    const url = new URL(
      "https://api.openweathermap.org/geo/1.0/reverse"
    );

    url.searchParams.set("lat", lat);
    url.searchParams.set("lon", lon);
    url.searchParams.set("limit", "1");
    url.searchParams.set(
      "appid",
      process.env.OPENWEATHER_API_KEY
    );

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Unable to determine location",
      });
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Reverse location error:", error);

    res.status(500).json({
      error: "Reverse location failed",
    });
  }
});

// --------------------------------------------------
// PEXELS PHOTO SEARCH
// --------------------------------------------------

app.get("/api/media/photos", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || !query.trim()) {
      return res.status(400).json({
        error: "Photo search query is required",
      });
    }

    const url = new URL(
      "https://api.pexels.com/v1/search"
    );

    url.searchParams.set("query", query.trim());
    url.searchParams.set("per_page", "10");
    url.searchParams.set("orientation", "landscape");

    const response = await fetch(url, {
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Pexels photo error:", errorText);

      return res.status(response.status).json({
        error: "Unable to fetch photos",
      });
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Pexels photo error:", error);

    res.status(500).json({
      error: "Photo service failed",
    });
  }
});

// --------------------------------------------------
// PEXELS VIDEO SEARCH
// --------------------------------------------------

app.get("/api/media/video", async (req, res) => {
  try {
    const { query = "travel" } = req.query;

    const response = await fetch(
      `https://api.pexels.com/v1/videos/search?query=${encodeURIComponent(
        query
      )}&orientation=landscape&size=medium&per_page=10`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Pexels video error:", data);

      return res.status(response.status).json({
        error: data.error || "Pexels video request failed",
      });
    }

    res.json(data);
  } catch (error) {
    console.error("Video API error:", error);

    res.status(500).json({
      error: "Failed to fetch videos",
    });
  }
});

// --------------------------------------------------
// GEMINI CHAT
// --------------------------------------------------

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: message,
      config: {
        systemInstruction: `
You are Roam AI, a friendly travel planning assistant.

Help users with:
- destinations
- famous places
- things to do
- travel duration
- best time to visit
- food experiences
- travel styles
- trip planning
- itineraries

Give useful, practical and concise travel advice.

Do not claim that information is live unless it is supplied
by the application.
        `,
      },
    });

    res.json({
      reply: response.text,
    });
  } catch (error) {
    console.error("Gemini error:", error);

    res.status(500).json({
      error: "Unable to get a response from Roam AI",
    });
  }
});

// --------------------------------------------------
// GEMINI ITINERARY
// --------------------------------------------------

app.post("/api/itinerary", async (req, res) => {
  try {
    const {
      destination,
      days,
      travelStyle,
      interests,
    } = req.body;

    if (!destination || !days) {
      return res.status(400).json({
        error: "Destination and number of days are required",
      });
    }

    const prompt = `
Create a ${days}-day travel itinerary for ${destination}.

Travel style:
${travelStyle || "Balanced"}

Interests:
${interests || "Culture, food, sightseeing and relaxation"}

Requirements:
- Create exactly ${days} days.
- Each day must have morning, afternoon and evening.
- Include realistic activities.
- Include famous attractions where appropriate.
- Include food experiences where appropriate.
- Avoid repeating the same attraction.
- Keep the schedule practical.
- Return only JSON matching the requested structure.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseFormat: {
          text: {
            mimeType: "application/json",
            schema: {
              type: "object",
              properties: {
                destination: {
                  type: "string",
                },
                days: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      day: {
                        type: "integer",
                      },
                      morning: {
                        type: "string",
                      },
                      afternoon: {
                        type: "string",
                      },
                      evening: {
                        type: "string",
                      },
                    },
                    required: [
                      "day",
                      "morning",
                      "afternoon",
                      "evening",
                    ],
                  },
                },
              },
              required: [
                "destination",
                "days",
              ],
            },
          },
        },
      },
    });

    const itinerary = JSON.parse(response.text);

    res.json(itinerary);
  } catch (error) {
    console.error("Gemini itinerary error:", error);

    res.status(500).json({
      error: "Unable to generate itinerary",
    });
  }
});

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(
    `Roam API server running at http://localhost:${PORT}`
  );
});