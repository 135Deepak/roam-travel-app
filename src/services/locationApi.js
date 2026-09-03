const API_URL = "http://localhost:3001/api";

export async function searchLocation(query) {
  const response = await fetch(
    `${API_URL}/location/search?query=${encodeURIComponent(query)}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Location search failed");
  }

  return data;
}

export async function getLocationName(lat, lon) {
  const response = await fetch(
    `${API_URL}/location/reverse?lat=${lat}&lon=${lon}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unable to find location");
  }

  return data;
}