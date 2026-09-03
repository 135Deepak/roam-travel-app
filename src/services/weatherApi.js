const API_URL = "http://localhost:3001/api";

export async function getCurrentWeather(lat, lon) {
  const response = await fetch(
    `${API_URL}/weather?lat=${lat}&lon=${lon}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to fetch weather"
    );
  }

  return data;
}