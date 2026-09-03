import { useEffect, useState } from "react";
import { searchPhotos } from "../services/mediaApi";
import { getCurrentWeather } from "../services/weatherApi";
import PlaceCard from "../components/PlaceCard";

function DestinationDetails({
  destination,
  places = [],
  isFavorite,
  onToggleFavorite,
  onBack,
  onPlan,
}) {
  const [heroImage, setHeroImage] = useState("");
  const [placeImages, setPlaceImages] = useState({});
  const [weather, setWeather] = useState(null);

  const [loadingImages, setLoadingImages] = useState(true);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    if (!destination) return;

    let cancelled = false;

    async function loadDestinationData() {
      setLoadingImages(true);
      setLoadingWeather(true);

      try {
        // --------------------------------
        // DESTINATION HERO IMAGE
        // --------------------------------
        try {
          const heroData = await searchPhotos(
            `${destination.name} ${destination.country} travel`
          );

          const heroPhoto = heroData.photos?.[0];

          if (!cancelled) {
            setHeroImage(
              heroPhoto?.src?.large ||
                heroPhoto?.src?.medium ||
                ""
            );
          }
        } catch (error) {
          console.error(
            "Destination image error:",
            error
          );
        }

        // --------------------------------
        // FAMOUS PLACE IMAGES
        // --------------------------------
        const imageEntries = await Promise.all(
          places.map(async (place) => {
            try {
              const query =
                place.searchQuery ||
                `${place.name} ${destination.name}`;

              const data = await searchPhotos(query);

              const photo = data.photos?.[0];

              return [
                place.id,
                photo?.src?.large ||
                  photo?.src?.medium ||
                  "",
              ];
            } catch (error) {
              console.error(
                `Image error for ${place.name}:`,
                error
              );

              return [place.id, ""];
            }
          })
        );

        if (!cancelled) {
          setPlaceImages(
            Object.fromEntries(imageEntries)
          );
        }
      } catch (error) {
        console.error(
          "Destination data error:",
          error
        );
      } finally {
        if (!cancelled) {
          setLoadingImages(false);
        }
      }

      // --------------------------------
      // WEATHER
      // --------------------------------
      try {
        const data = await getCurrentWeather(
          destination.coordinates.lat,
          destination.coordinates.lon
        );

        if (!cancelled) {
          setWeather(data);
        }
      } catch (error) {
        console.error(
          "Destination weather error:",
          error
        );
      } finally {
        if (!cancelled) {
          setLoadingWeather(false);
        }
      }
    }

    loadDestinationData();

    return () => {
      cancelled = true;
    };
  }, [destination, places]);

  if (!destination) {
    return null;
  }

  const weatherCondition =
    weather?.weather?.[0]?.description || "Unavailable";

  const temperature =
    weather?.main?.temp != null
      ? `${Math.round(weather.main.temp)}°C`
      : "--";

  return (
    <div className="destination-details">

      {/* ================================
          HERO
      ================================= */}
      <section
        className="destination-detail-hero"
        style={
          heroImage
            ? {
                backgroundImage: `
                  linear-gradient(
                    rgba(0, 0, 0, 0.25),
                    rgba(0, 0, 0, 0.72)
                  ),
                  url("${heroImage}")
                `,
              }
            : {
                background:
                  "linear-gradient(135deg, #879d90, #dfe9e3)",
              }
        }
      >
        <div className="destination-detail-overlay">
          <button
            className="back-button"
            onClick={onBack}
          >
            ← Back to destinations
          </button>

          <div className="destination-detail-content">
            <span className="section-label">
              DESTINATION GUIDE
            </span>

            <h1>{destination.name}</h1>

            <p>
              {destination.country}
            </p>

            <div className="destination-detail-actions">
              <button
                className="favorite-button"
                onClick={() =>
                  onToggleFavorite(destination.id)
                }
              >
                {isFavorite
                  ? "♥ Saved"
                  : "♡ Save"}
              </button>

              <button
                className="plan-button"
                onClick={() =>
                  onPlan(destination.name)
                }
              >
                ✦ Plan this trip
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================================
          OVERVIEW
      ================================= */}
      <section className="detail-section">
        <div className="detail-two-column">

          <div>
            <span className="section-label">
              ABOUT
            </span>

            <h2>
              Discover {destination.name}
            </h2>

            <p className="detail-description">
              {destination.description}
            </p>

            <p className="detail-description">
              Explore the city's most famous
              landmarks, local experiences, food,
              culture and attractions.
            </p>
          </div>

          {/* WEATHER */}
          <div className="detail-weather-card">

            <span className="section-label">
              LIVE WEATHER
            </span>

            {loadingWeather ? (
              <p>Loading weather...</p>
            ) : weather ? (
              <>
                <div className="detail-temperature">
                  {temperature}
                </div>

                <div className="detail-weather-condition">
                  {weatherCondition}
                </div>

                <div className="detail-weather-info">
                  <div>
                    <span>Feels like</span>
                    <strong>
                      {Math.round(
                        weather.main.feels_like
                      )}
                      °C
                    </strong>
                  </div>

                  <div>
                    <span>Humidity</span>
                    <strong>
                      {weather.main.humidity}%
                    </strong>
                  </div>

                  <div>
                    <span>Wind</span>
                    <strong>
                      {weather.wind.speed} m/s
                    </strong>
                  </div>
                </div>
              </>
            ) : (
              <p>
                Weather information unavailable.
              </p>
            )}
          </div>

        </div>
      </section>

      {/* ================================
          FAMOUS PLACES
      ================================= */}
      <section className="detail-section places-section">

        <div className="section-heading">
          <div>
            <span className="section-label">
              MUST VISIT
            </span>

            <h2>
              Famous places in {destination.name}
            </h2>

            <p>
              Explore landmarks and experiences
              worth adding to your trip.
            </p>
          </div>
        </div>

        {loadingImages ? (
          <div className="places-loading">
            Loading famous places...
          </div>
        ) : places.length > 0 ? (
          <div className="places-grid">
            {places.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                image={placeImages[place.id]}
              />
            ))}
          </div>
        ) : (
          <div className="places-loading">
            No famous places available.
          </div>
        )}

      </section>

      {/* ================================
          TRAVEL INFORMATION
      ================================= */}
      <section className="detail-section">

        <span className="section-label">
          TRAVEL TIPS
        </span>

        <h2>
          Before you visit
        </h2>

        <div className="travel-info-grid">

          <div className="travel-info-card">
            <span>01</span>
            <h3>Best time to visit</h3>
            <p>
              Check the local weather and
              seasonal conditions before planning
              your trip.
            </p>
          </div>

          <div className="travel-info-card">
            <span>02</span>
            <h3>Getting around</h3>
            <p>
              Use local public transport,
              walking routes and ride services
              to explore the destination.
            </p>
          </div>

          <div className="travel-info-card">
            <span>03</span>
            <h3>Local experiences</h3>
            <p>
              Try local food, explore cultural
              attractions and leave time for
              unexpected discoveries.
            </p>
          </div>

        </div>

      </section>

      {/* ================================
          CTA
      ================================= */}
      <section className="detail-cta">

        <span className="section-label">
          READY TO GO?
        </span>

        <h2>
          Let Roam plan your {destination.name} trip.
        </h2>

        <p>
          Create a personalized day-by-day
          itinerary with AI.
        </p>

        <button
          className="plan-button large"
          onClick={() =>
            onPlan(destination.name)
          }
        >
          ✦ Create my itinerary
        </button>

      </section>

    </div>
  );
}

export default DestinationDetails;