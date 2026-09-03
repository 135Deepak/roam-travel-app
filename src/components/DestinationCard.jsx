import FavoriteButton from "./FavoriteButton";

function DestinationCard({
  destination,
  image,
  onExplore,
  isFavorite,
  onToggleFavorite,
}) {
  return (
    <article className="destination-card">
      <div
        className="destination-image"
        style={{
          backgroundImage: `
            linear-gradient(
              transparent,
              rgba(0, 0, 0, 0.65)
            ),
            url(${image})
          `,
        }}
      >
        <span>
          {destination.name.toUpperCase()}
        </span>

        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={() =>
            onToggleFavorite(destination.id)
          }
        />
      </div>

      <div className="card-content">
        <h3>
          {destination.name}, {destination.country}
        </h3>

        <p>{destination.description}</p>

        <button
          className="explore-button"
          onClick={() => onExplore(destination)}
        >
          Explore →
        </button>
      </div>
    </article>
  );
}

export default DestinationCard;