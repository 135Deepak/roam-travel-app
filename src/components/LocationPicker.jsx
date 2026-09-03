import { useState } from "react";
import {
  searchLocation,
  getLocationName,
} from "../services/locationApi";

function LocationPicker({ onLocationSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event) {
    event.preventDefault();

    if (!query.trim()) return;

    try {
      setLoading(true);
      setError("");

      const data = await searchLocation(query);

      setResults(data);
    } catch (err) {
      setError("Unable to search for this location.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleCurrentLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setDetecting(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const data = await getLocationName(lat, lon);

          if (data.length > 0) {
            const location = data[0];

            onLocationSelect({
              name: location.name,
              country: location.country,
              state: location.state || "",
              lat: location.lat,
              lon: location.lon,
            });
          }
        } catch (err) {
          setError("Unable to determine your location.");
        } finally {
          setDetecting(false);
        }
      },
      () => {
        setError(
          "Location permission was denied. Please search manually."
        );
        setDetecting(false);
      }
    );
  }

  function selectLocation(location) {
    onLocationSelect({
      name: location.name,
      country: location.country,
      state: location.state || "",
      lat: location.lat,
      lon: location.lon,
    });

    setQuery("");
    setResults([]);
  }

  return (
    <div className="location-picker">
      <div className="location-header">
        <div>
          <span className="section-label">03 / LOCATION</span>

          <h2>Where are you?</h2>

          <p>
            Use your current location or search for a destination.
          </p>
        </div>

        <button
          className="location-button"
          onClick={handleCurrentLocation}
          disabled={detecting}
        >
          {detecting
            ? "Detecting..."
            : "📍 Use my location"}
        </button>
      </div>

      <form
        className="location-search"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          placeholder="Search city or country..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <p className="location-error">
          {error}
        </p>
      )}

      {results.length > 0 && (
        <div className="location-results">
          {results.map((location, index) => (
            <button
              key={`${location.lat}-${location.lon}-${index}`}
              className="location-result"
              onClick={() => selectLocation(location)}
            >
              <strong>{location.name}</strong>

              <span>
                {location.state
                  ? `${location.state}, `
                  : ""}
                {location.country}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LocationPicker;