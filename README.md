# 🌍 Roam — AI-Powered Travel Planner

Roam is a modern travel discovery and trip-planning web application built with React and Vite. It helps users explore destinations, discover famous places, check live weather, find locations, save favorite destinations, chat with an AI travel assistant, and generate personalized day-by-day itineraries.

## 🚀 Live Application

**Live Demo:**  
https://roam-travel-app-lake.vercel.app/

## 💻 GitHub Repository

**Source Code:**  
https://github.com/135Deepak/roam-travel-app

---

## 📌 Project Overview

Roam is designed to provide a complete travel-planning experience in one application.

Users can:

- Explore popular destinations
- Search and filter destinations
- View detailed destination information
- Discover famous places to visit
- Get live weather information
- Use their current location or search for a location manually
- View dynamically fetched destination and place images
- Save destinations as favorites
- Ask travel-related questions using an AI assistant
- Generate personalized travel itineraries

The application combines real-time APIs, dynamic media, location services, and generative AI to create an interactive travel experience.

---

## ✨ Features

### 🏠 Interactive Landing Experience

- Full-screen travel hero section
- Dynamically fetched looping background travel video
- Responsive layout
- Smooth navigation between sections

### 🌎 Destination Explorer

- Browse popular destinations
- Search destinations by name
- Filter destinations by country
- Destination cards with dynamically fetched images
- Explore detailed information for each destination

### 📍 Location Awareness

- Detect the user's current location using browser geolocation
- Reverse geocode coordinates to identify the location
- Manually search for locations
- Use the selected location for weather information

### ☀️ Live Weather

- Real-time weather information using OpenWeather
- Current temperature
- Feels-like temperature
- Humidity
- Wind speed
- Weather condition
- Weather icons

### 🏛️ Famous Places

Each destination provides famous places and attractions with:

- Place name
- Description
- Category
- Dynamically fetched images

### ❤️ Favorites

Users can save their favorite destinations.

Favorites are stored using browser local storage so they remain available between sessions on the same device.

### 🤖 AI Travel Assistant

Roam includes an AI-powered travel assistant using Google Gemini.

Users can ask questions such as:

- What should I visit in Paris?
- What are the best places in Tokyo?
- What should I pack for Bali?
- What is the best time to visit Dubai?

The assistant provides conversational travel recommendations.

### 🗓️ AI Itinerary Planner

Users can generate personalized travel plans by providing:

- Destination
- Number of days
- Travel style
- Interests

The AI generates a structured day-by-day itinerary instead of displaying raw chatbot text.

### 🖼️ Dynamic Images and Video

Destination images, famous-place images, and the hero background video are fetched dynamically through the Pexels API instead of being hardcoded into the application.

---

## 🛠️ Technologies Used

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express.js
- CORS
- dotenv

### APIs & Services

- OpenWeather API — real-time weather and location data
- Pexels API — destination images, place images, and travel videos
- Google Gemini API — AI assistant and itinerary generation

### Deployment

- Vercel — frontend deployment
- Render — backend deployment
- GitHub — source code management

---

## 🏗️ Application Architecture

```text
                    ┌─────────────────────┐
                    │      Roam UI        │
                    │   React + Vite      │
                    └──────────┬──────────┘
                               │
                               │ HTTP Requests
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │     Node.js         │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
       OpenWeather          Pexels           Gemini
          API                API                API
             │                 │                 │
             ▼                 ▼                 ▼
        Weather &          Images &          AI Chat &
         Location            Video           Itineraries