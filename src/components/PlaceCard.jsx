function PlaceCard({ place, image }) {
  return (
    <article className="place-card">
      <div
        className="place-image"
        style={
          image
            ? {
                backgroundImage: `
                  linear-gradient(
                    0deg,
                    rgba(0, 0, 0, 0.7),
                    transparent 60%
                  ),
                  url("${image}")
                `,
              }
            : {
                background:
                  "linear-gradient(135deg, #dfe9e3, #879d90)",
              }
        }
      >
        <div className="place-image-content">
          <span>FAMOUS PLACE</span>

          <h3>{place.name}</h3>
        </div>
      </div>

      <div className="place-content">
        <p>{place.description}</p>

        {place.category && (
          <span className="place-category">
            {place.category}
          </span>
        )}
      </div>
    </article>
  );
}

export default PlaceCard;