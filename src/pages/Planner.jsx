import { useState } from "react";

const destinations = {
  Paris: {
    country: "France",
    activities: {
      Relaxation: [
        "Walk through Luxembourg Gardens",
        "Enjoy a café in Montmartre",
        "Take an evening Seine River walk",
      ],
      Adventure: [
        "Explore the Eiffel Tower",
        "Walk along the Seine",
        "Discover Montmartre",
      ],
      Culture: [
        "Visit the Louvre Museum",
        "Explore Notre-Dame",
        "Visit the Arc de Triomphe",
      ],
      Food: [
        "Try French pastries",
        "Have lunch at a local café",
        "Enjoy a traditional French dinner",
      ],
    },
  },

  Tokyo: {
    country: "Japan",
    activities: {
      Relaxation: [
        "Visit a traditional Japanese garden",
        "Relax at a local café",
        "Enjoy an evening walk in Shibuya",
      ],
      Adventure: [
        "Explore Shibuya Crossing",
        "Visit Tokyo Skytree",
        "Explore Akihabara",
      ],
      Culture: [
        "Visit Senso-ji Temple",
        "Visit Meiji Shrine",
        "Explore traditional Tokyo neighborhoods",
      ],
      Food: [
        "Try authentic ramen",
        "Visit a sushi restaurant",
        "Explore Japanese street food",
      ],
    },
  },

  Bali: {
    country: "Indonesia",
    activities: {
      Relaxation: [
        "Relax on Seminyak Beach",
        "Enjoy a spa experience",
        "Watch the sunset",
      ],
      Adventure: [
        "Explore Ubud",
        "Visit Tegenungan Waterfall",
        "Try a water activity",
      ],
      Culture: [
        "Visit Uluwatu Temple",
        "Explore Tanah Lot",
        "Visit traditional Balinese villages",
      ],
      Food: [
        "Try nasi goreng",
        "Enjoy traditional satay",
        "Explore a local food market",
      ],
    },
  },

  "New York": {
    country: "USA",
    activities: {
      Relaxation: [
        "Walk through Central Park",
        "Relax at Bryant Park",
        "Enjoy the Manhattan skyline",
      ],
      Adventure: [
        "Visit the Statue of Liberty",
        "Walk across Brooklyn Bridge",
        "Explore Times Square",
      ],
      Culture: [
        "Visit the Metropolitan Museum of Art",
        "Explore Broadway",
        "Visit the Museum of Modern Art",
      ],
      Food: [
        "Try New York pizza",
        "Have a classic bagel",
        "Explore international food in Queens",
      ],
    },
  },

  Dubai: {
    country: "UAE",
    activities: {
      Relaxation: [
        "Relax at Jumeirah Beach",
        "Enjoy a luxury hotel experience",
        "Watch the Dubai sunset",
      ],
      Adventure: [
        "Visit Burj Khalifa",
        "Go on a desert safari",
        "Explore Dubai Marina",
      ],
      Culture: [
        "Visit Al Fahidi Historical District",
        "Explore Dubai Creek",
        "Visit the Dubai Museum area",
      ],
      Food: [
        "Try traditional shawarma",
        "Enjoy Arabic cuisine",
        "Explore Dubai food markets",
      ],
    },
  },

  Rome: {
    country: "Italy",
    activities: {
      Relaxation: [
        "Relax in Villa Borghese",
        "Enjoy Italian coffee",
        "Take an evening walk through Rome",
      ],
      Adventure: [
        "Explore the Colosseum",
        "Visit the Roman Forum",
        "Explore ancient Roman streets",
      ],
      Culture: [
        "Visit the Pantheon",
        "Explore Vatican City",
        "Visit the Trevi Fountain",
      ],
      Food: [
        "Try authentic Roman pasta",
        "Enjoy Italian pizza",
        "Have traditional gelato",
      ],
    },
  },
};

const styles = [
  "Relaxation",
  "Adventure",
  "Culture",
  "Food",
];

function Planner() {
  const [destination, setDestination] = useState("Paris");
  const [days, setDays] = useState(3);
  const [style, setStyle] = useState("Culture");

  const [itinerary, setItinerary] = useState([]);

  function generateItinerary() {
    const selected = destinations[destination];

    if (!selected) {
      return;
    }

    const activities = selected.activities[style];

    const generated = [];

    for (let i = 0; i < Number(days); i++) {
      generated.push({
        day: i + 1,
        morning: activities[i % activities.length],
        afternoon:
          activities[(i + 1) % activities.length],
        evening:
          activities[(i + 2) % activities.length],
      });
    }

    setItinerary(generated);
  }

  return (
    <div className="planner">

      {/* PLANNER FORM */}

      <div className="planner-card">

        <div className="planner-card-header">
          <div>
            <span className="section-label">
              TRIP BUILDER
            </span>

            <h3>Create your itinerary</h3>

            <p>
              Tell Roam what kind of trip you want.
            </p>
          </div>

          <div className="planner-icon">
            ✈
          </div>
        </div>

        <div className="planner-form">

          {/* DESTINATION */}

          <div className="form-group">

            <label>
              Destination
            </label>

            <select
              value={destination}
              onChange={(event) =>
                setDestination(event.target.value)
              }
            >
              {Object.keys(destinations).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

          </div>

          {/* DAYS */}

          <div className="form-group">

            <label>
              Number of days
            </label>

            <select
              value={days}
              onChange={(event) =>
                setDays(Number(event.target.value))
              }
            >
              <option value={1}>1 Day</option>
              <option value={2}>2 Days</option>
              <option value={3}>3 Days</option>
              <option value={4}>4 Days</option>
              <option value={5}>5 Days</option>
              <option value={6}>6 Days</option>
              <option value={7}>7 Days</option>
            </select>

          </div>

          {/* STYLE */}

          <div className="form-group">

            <label>
              Travel style
            </label>

            <select
              value={style}
              onChange={(event) =>
                setStyle(event.target.value)
              }
            >
              {styles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

          </div>

        </div>

        <button
          className="generate-button"
          onClick={generateItinerary}
        >
          ✦ Generate itinerary
        </button>

      </div>

      {/* ITINERARY */}

      {itinerary.length > 0 && (
        <div className="itinerary">

          <div className="itinerary-header">

            <div>
              <span className="section-label">
                YOUR TRIP
              </span>

              <h3>
                {destination}, {destinations[destination].country}
              </h3>
            </div>

            <span className="trip-duration">
              {days} Days
            </span>

          </div>

          {itinerary.map((item) => (
            <div
              className="itinerary-day"
              key={item.day}
            >

              <div className="day-number">
                {item.day}
              </div>

              <div className="day-content">

                <h4>
                  Day {item.day}
                </h4>

                <div className="activity-grid">

                  <div className="activity">
                    <span>🌅</span>
                    <div>
                      <small>Morning</small>
                      <p>{item.morning}</p>
                    </div>
                  </div>

                  <div className="activity">
                    <span>☀️</span>
                    <div>
                      <small>Afternoon</small>
                      <p>{item.afternoon}</p>
                    </div>
                  </div>

                  <div className="activity">
                    <span>🌙</span>
                    <div>
                      <small>Evening</small>
                      <p>{item.evening}</p>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Planner;