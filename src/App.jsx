import { useEffect, useState } from "react";

import {
  searchPhotos,
  searchVideo,
} from "./services/mediaApi";

import { getCurrentWeather } from "./services/weatherApi";

import destinations from "./data/destinations";
import places from "./data/places";

import DestinationCard from "./components/DestinationCard";
import WeatherCard from "./components/WeatherCard";
import Navbar from "./components/Navbar";
import LocationPicker from "./components/LocationPicker";

import DestinationDetails from "./pages/DestinationDetails";
import Planner from "./pages/Planner";
import Assistant from "./pages/Assistant";


function App() {
  // =====================================================
  // BASIC APP STATE
  // =====================================================

  const [selectedDestination, setSelectedDestination] =
    useState(null);

  const [activeSection, setActiveSection] =
    useState("home");

  const [search, setSearch] =
    useState("");

  const [country, setCountry] =
    useState("All");


  // =====================================================
  // HERO VIDEO
  // =====================================================

  const [heroVideo, setHeroVideo] =
    useState("");

  const [heroVideoLoading, setHeroVideoLoading] =
    useState(true);


  // =====================================================
  // DESTINATION IMAGES
  // =====================================================

  const [destinationImages, setDestinationImages] =
    useState({});

  const [imagesLoading, setImagesLoading] =
    useState(true);


  // =====================================================
  // LOCATION
  // =====================================================

  const [selectedLocation, setSelectedLocation] =
    useState(null);

  const [locationWeather, setLocationWeather] =
    useState(null);

  const [locationWeatherLoading, setLocationWeatherLoading] =
    useState(false);


  // =====================================================
  // FAVORITES
  // =====================================================

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved =
        localStorage.getItem("roam-favorites");

      return saved
        ? JSON.parse(saved)
        : [];
    } catch {
      return [];
    }
  });


  // =====================================================
  // HERO VIDEO - PEXELS
  // =====================================================

  useEffect(() => {
  let cancelled = false;

  async function loadHeroVideo() {
    try {
      setHeroVideoLoading(true);

      const data = await searchVideo(
        "cinematic travel city"
      );

      const videos = data.videos || [];

      if (!videos.length) {
        console.log("No Pexels videos found");
        return;
      }

      // Find a landscape HD MP4 suitable for a desktop hero
      let selectedFile = null;

      for (const video of videos) {
        const files = video.video_files || [];

        const landscapeHD = files.find(
          (file) =>
            file.file_type === "video/mp4" &&
            file.width >= 1280 &&
            file.height >= 600 &&
            file.width > file.height
        );

        if (landscapeHD?.link) {
          selectedFile = landscapeHD;
          break;
        }
      }

      // Fallback to any landscape MP4
      if (!selectedFile) {
        for (const video of videos) {
          const files = video.video_files || [];

          const landscape = files.find(
            (file) =>
              file.file_type === "video/mp4" &&
              file.width > file.height
          );

          if (landscape?.link) {
            selectedFile = landscape;
            break;
          }
        }
      }

      // Final fallback to any MP4
      if (!selectedFile) {
        for (const video of videos) {
          const files = video.video_files || [];

          const mp4 = files.find(
            (file) =>
              file.file_type === "video/mp4"
          );

          if (mp4?.link) {
            selectedFile = mp4;
            break;
          }
        }
      }

      if (!cancelled && selectedFile?.link) {
        console.log(
          "Hero video selected:",
          selectedFile.link
        );

        setHeroVideo(selectedFile.link);
      }
    } catch (error) {
      console.error(
        "Hero video error:",
        error
      );
    } finally {
      if (!cancelled) {
        setHeroVideoLoading(false);
      }
    }
  }

  loadHeroVideo();

  return () => {
    cancelled = true;
  };
}, []);
  // =====================================================
  // DESTINATION IMAGES - PEXELS
  // =====================================================

  useEffect(() => {
    async function loadDestinationImages() {
      try {
        setImagesLoading(true);

        const imageEntries =
          await Promise.all(
            destinations.map(
              async (destination) => {
                try {
                  const data =
                    await searchPhotos(
                      destination.searchQuery
                    );

                  const photo =
                    data.photos?.[0];

                  return [
                    destination.id,
                    photo?.src?.large ||
                      photo?.src?.medium ||
                      "",
                  ];
                } catch (error) {
                  console.error(
                    `Image error for ${destination.name}:`,
                    error
                  );

                  return [
                    destination.id,
                    "",
                  ];
                }
              }
            )
          );

        setDestinationImages(
          Object.fromEntries(
            imageEntries
          )
        );
      } catch (error) {
        console.error(
          "Destination images error:",
          error
        );
      } finally {
        setImagesLoading(false);
      }
    }

    loadDestinationImages();
  }, []);


  // =====================================================
  // SAVE FAVORITES
  // =====================================================

  useEffect(() => {
    localStorage.setItem(
      "roam-favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);


  // =====================================================
  // LOCATION SELECT
  // =====================================================

  async function handleLocationSelect(
    location
  ) {
    setSelectedLocation(location);
    setLocationWeather(null);
    setLocationWeatherLoading(true);

    try {
      const weather =
        await getCurrentWeather(
          location.lat,
          location.lon
        );

      setLocationWeather(weather);
    } catch (error) {
      console.error(
        "Location weather error:",
        error
      );
    } finally {
      setLocationWeatherLoading(false);
    }
  }


  // =====================================================
  // NAVIGATION
  // =====================================================

  function navigate(section) {
    setActiveSection(section);

    // If destination details is open,
    // close it before navigating.
    if (selectedDestination) {
      setSelectedDestination(null);
    }

    setTimeout(() => {
      const element =
        document.getElementById(
          section
        );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  }


  // =====================================================
  // FAVORITE TOGGLE
  // =====================================================

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
  }


  // =====================================================
  // EXPLORE DESTINATION
  // =====================================================

  function handleExplore(
    destination
  ) {
    setSelectedDestination(
      destination
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  // =====================================================
  // FIND PLACES FOR DESTINATION
  // =====================================================

  function getPlacesForDestination(
    destination
  ) {
    return places.filter(
      (place) => {
        // Supports destinationId
        if (
          place.destinationId !==
          undefined
        ) {
          return (
            place.destinationId ===
            destination.id
          );
        }

        // Supports destination_id
        if (
          place.destination_id !==
          undefined
        ) {
          return (
            place.destination_id ===
            destination.id
          );
        }

        // Supports destination name
        if (
          typeof place.destination ===
          "string"
        ) {
          return (
            place.destination
              .toLowerCase() ===
            destination.name.toLowerCase()
          );
        }

        // Supports destinationName
        if (
          typeof place.destinationName ===
          "string"
        ) {
          return (
            place.destinationName
              .toLowerCase() ===
            destination.name.toLowerCase()
          );
        }

        return false;
      }
    );
  }


  // =====================================================
  // FILTERS
  // =====================================================

  const countries = [
    "All",
    ...new Set(
      destinations.map(
        (item) =>
          item.country
      )
    ),
  ];


  const filteredDestinations =
    destinations.filter(
      (destination) => {
        const searchText =
          search.toLowerCase();

        const matchesSearch =
          destination.name
            .toLowerCase()
            .includes(searchText) ||
          destination.country
            .toLowerCase()
            .includes(searchText) ||
          destination.description
            .toLowerCase()
            .includes(searchText);

        const matchesCountry =
          country === "All" ||
          destination.country ===
            country;

        return (
          matchesSearch &&
          matchesCountry
        );
      }
    );


  // =====================================================
  // FAVORITE DESTINATIONS
  // =====================================================

  const favoriteDestinations =
    destinations.filter(
      (destination) =>
        favorites.includes(
          destination.id
        )
    );


  // =====================================================
  // DESTINATION DETAILS MODE
  // =====================================================

  if (selectedDestination) {
    const destinationPlaces =
      getPlacesForDestination(
        selectedDestination
      );

    return (
      <div className="app">

        <Navbar
          activeSection="destinations"
          onNavigate={navigate}
          favoritesCount={
            favorites.length
          }
        />

        <DestinationDetails
          destination={
            selectedDestination
          }

          places={
            destinationPlaces
          }

          isFavorite={favorites.includes(
            selectedDestination.id
          )}

          onToggleFavorite={
            toggleFavorite
          }

          onBack={() => {
            setSelectedDestination(
              null
            );

            setTimeout(() => {
              document
                .getElementById(
                  "destinations"
                )
                ?.scrollIntoView({
                  behavior:
                    "smooth",
                });
            }, 100);
          }}

          onPlan={() => {
            setSelectedDestination(
              null
            );

            setTimeout(() => {
              document
                .getElementById(
                  "planner"
                )
                ?.scrollIntoView({
                  behavior:
                    "smooth",
                });
            }, 100);
          }}
        />

        <footer className="footer">

          <div className="footer-main">

            <div>
              <div className="footer-brand">
                ✈ Roam
              </div>

              <p>
                Discover more. Plan better.
                Travel further.
              </p>
            </div>

            <div className="footer-links">

              <button
                onClick={() =>
                  navigate("home")
                }
              >
                Home
              </button>

              <button
                onClick={() =>
                  navigate(
                    "destinations"
                  )
                }
              >
                Destinations
              </button>

              <button
                onClick={() =>
                  navigate("planner")
                }
              >
                Planner
              </button>

              <button
                onClick={() =>
                  navigate("assistant")
                }
              >
                AI Assistant
              </button>

            </div>

          </div>

          <div className="footer-bottom">

            <span>
              © 2026 Roam Travel Platform
            </span>

            <span>
              Built with React + Vite
            </span>

          </div>

        </footer>

      </div>
    );
  }


  // =====================================================
  // MAIN APPLICATION
  // =====================================================

  return (
    <div className="app">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar
        activeSection={
          activeSection
        }
        onNavigate={navigate}
        favoritesCount={
          favorites.length
        }
      />


      {/* =================================================
          HERO
      ================================================= */}

      <section
        id="home"
        className="hero"
      >

        {heroVideo && (
  <video
    className="hero-video"
    autoPlay
    muted
    loop
    playsInline
    preload="auto"
    onError={(event) => {
      console.error(
        "Hero video failed to play:",
        event.currentTarget.error
      );
    }}
    onCanPlay={() => {
      console.log("Hero video is ready");
    }}
  >
    <source
      src={heroVideo}
      type="video/mp4"
    />
  </video>
)}

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <span className="hero-label">
            TRAVEL DIFFERENTLY
          </span>

          <h1>
            Go somewhere
            <br />
            <em>
              worth remembering.
            </em>
          </h1>

          <p>
            Discover destinations,
            explore famous places,
            check live weather and
            let AI plan your perfect
            journey.
          </p>

          <div className="hero-actions">

            <button
              className="hero-primary-button"
              onClick={() =>
                navigate(
                  "destinations"
                )
              }
            >
              Explore destinations
            </button>

            <button
              className="hero-secondary-button"
              onClick={() =>
                navigate(
                  "assistant"
                )
              }
            >
              ✦ Plan with AI
            </button>

          </div>

        </div>

        <div className="hero-scroll">

          <span>
            SCROLL TO EXPLORE
          </span>

          <span>
            ↓
          </span>

        </div>

        <div className="pexels-credit">

          Video provided by{" "}

          <a
            href="https://www.pexels.com/"
            target="_blank"
            rel="noreferrer"
          >
            Pexels
          </a>

        </div>

      </section>


      {/* =================================================
          DESTINATIONS
      ================================================= */}

      <section
        id="destinations"
        className="section destinations-section"
      >

        <div className="section-heading">

          <div>

            <span className="section-label">
              DISCOVER
            </span>

            <h2>
              Find your next adventure
            </h2>

            <p>
              Explore destinations
              handpicked for
              unforgettable experiences.
            </p>

          </div>

          <div className="destination-stats">

            <strong>
              {destinations.length}
            </strong>

            <span>
              destinations
            </span>

          </div>

        </div>


        {/* SEARCH */}

        <div className="search-panel">

          <div className="search-box">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

            {search && (
              <button
                className="clear-search"
                onClick={() =>
                  setSearch("")
                }
              >
                ×
              </button>
            )}

          </div>


          <div className="country-filter">

            <span>
              Country
            </span>

            <select
              value={country}
              onChange={(event) =>
                setCountry(
                  event.target.value
                )
              }
            >

              {countries.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}

            </select>

          </div>

        </div>


        {/* DESTINATION CARDS */}

        {filteredDestinations.length >
        0 ? (

          imagesLoading ? (

            <div className="loading-message">
              Loading destination
              images...
            </div>

          ) : (

            <div className="destination-grid">

              {filteredDestinations.map(
                (destination) => (

                  <DestinationCard
                    key={
                      destination.id
                    }

                    destination={
                      destination
                    }

                    image={
                      destinationImages[
                        destination.id
                      ]
                    }

                    onExplore={
                      handleExplore
                    }

                    isFavorite={
                      favorites.includes(
                        destination.id
                      )
                    }

                    onToggleFavorite={
                      toggleFavorite
                    }
                  />

                )
              )}

            </div>

          )

        ) : (

          <div className="empty-state">

            <div>
              🌍
            </div>

            <h3>
              No destinations found
            </h3>

            <p>
              Try another destination
              or remove the filters.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCountry("All");
              }}
            >
              Clear filters
            </button>

          </div>

        )}

      </section>


      {/* =================================================
          LOCATION
      ================================================= */}

      <section
        id="location"
        className="location-section"
      >

        <LocationPicker
          onLocationSelect={
            handleLocationSelect
          }
        />

        {selectedLocation && (

          <div className="selected-location">

            <div>

              <span className="section-label">
                SELECTED LOCATION
              </span>

              <h3>
                {selectedLocation.name}

                {selectedLocation.state
                  ? `, ${selectedLocation.state}`
                  : ""}
              </h3>

              <p>
                {selectedLocation.country}
              </p>

            </div>


            {locationWeatherLoading && (

              <div className="location-weather-loading">
                Loading weather...
              </div>

            )}


            {locationWeather && (

              <div className="location-weather">

                <div className="location-temperature">

                  {Math.round(
                    locationWeather
                      .main
                      .temp
                  )}
                  °C

                </div>


                <div>

                  <strong>
                    {
                      locationWeather
                        .weather?.[0]
                        ?.main
                    }
                  </strong>

                  <p>
                    Feels like{" "}

                    {Math.round(
                      locationWeather
                        .main
                        .feels_like
                    )}
                    °C
                  </p>

                </div>


                <div>

                  <span>
                    💧{" "}
                    {
                      locationWeather
                        .main
                        .humidity
                    }%
                  </span>

                  <span>
                    💨{" "}
                    {
                      locationWeather
                        .wind
                        .speed
                    }{" "}
                    m/s
                  </span>

                </div>

              </div>

            )}

          </div>

        )}

      </section>


      {/* =================================================
          WEATHER
      ================================================= */}

      <section
        id="weather"
        className="section weather-section"
      >

        <div className="section-heading centered">

          <span className="section-label">
            LIVE CONDITIONS
          </span>

          <h2>
            Check the weather
          </h2>

          <p>
            Current weather information
            for popular destinations.
          </p>

        </div>


        <div className="weather-grid">

          {destinations.map(
            (destination) => (

              <WeatherCard
                key={
                  destination.id
                }
                destination={
                  destination
                }
              />

            )
          )}

        </div>

      </section>


      {/* =================================================
          FAVORITES
      ================================================= */}

      <section
        id="favorites"
        className="section favorites-section"
      >

        <div className="section-heading">

          <div>

            <span className="section-label">
              YOUR COLLECTION
            </span>

            <h2>
              Favorite destinations
            </h2>

            <p>
              Keep the places you're
              dreaming about close.
            </p>

          </div>

          <div className="destination-stats">

            <strong>
              {favorites.length}
            </strong>

            <span>
              saved
            </span>

          </div>

        </div>


        {favoriteDestinations.length >
        0 ? (

          <div className="destination-grid">

            {favoriteDestinations.map(
              (destination) => (

                <DestinationCard
                  key={
                    destination.id
                  }

                  destination={
                    destination
                  }

                  image={
                    destinationImages[
                      destination.id
                    ]
                  }

                  onExplore={
                    handleExplore
                  }

                  isFavorite={true}

                  onToggleFavorite={
                    toggleFavorite
                  }
                />

              )
            )}

          </div>

        ) : (

          <div className="empty-state">

            <div>
              ♡
            </div>

            <h3>
              No favorites yet
            </h3>

            <p>
              Click the heart on a
              destination to save it
              here.
            </p>

            <button
              onClick={() =>
                navigate(
                  "destinations"
                )
              }
            >
              Explore destinations
            </button>

          </div>

        )}

      </section>


      {/* =================================================
          PLANNER
      ================================================= */}

      <div
        id="planner"
        className="planner-wrapper"
      >

        <Planner />

      </div>


      {/* =================================================
          AI ASSISTANT
      ================================================= */}

      <section
        id="assistant"
        className="section assistant-section"
      >

        <div className="section-heading centered">

          <span className="section-label">
            ROAM INTELLIGENCE
          </span>

          <h2>
            Your personal travel
            assistant
          </h2>

          <p>
            Ask Roam for destination
            ideas, itineraries,
            activities and food
            recommendations.
          </p>

        </div>

        <Assistant />

      </section>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="footer">

        <div className="footer-main">

          <div>

            <div className="footer-brand">
              ✈ Roam
            </div>

            <p>
              Discover more. Plan better.
              Travel further.
            </p>

          </div>


          <div className="footer-links">

            <button
              onClick={() =>
                navigate("home")
              }
            >
              Home
            </button>

            <button
              onClick={() =>
                navigate(
                  "destinations"
                )
              }
            >
              Destinations
            </button>

            <button
              onClick={() =>
                navigate("planner")
              }
            >
              Planner
            </button>

            <button
              onClick={() =>
                navigate("assistant")
              }
            >
              AI Assistant
            </button>

          </div>

        </div>


        <div className="footer-bottom">

          <span>
            © 2026 Roam Travel Platform
          </span>

          <span>
            Built with React + Vite
          </span>

        </div>

      </footer>

    </div>
  );
}


export default App;