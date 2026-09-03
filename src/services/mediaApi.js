const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function searchPhotos(query) {
  const response = await fetch(
    `${API_URL}/media/photos?query=${encodeURIComponent(query)}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch photos");
  }

  return data;
}

export async function searchVideo(query = "travel") {
  const response = await fetch(
    `${API_URL}/media/video?query=${encodeURIComponent(query)}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch video");
  }

  return data;
}