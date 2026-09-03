function FavoriteButton({ isFavorite, onToggle }) {
  return (
    <button
      className={`favorite-button ${
        isFavorite ? "favorite-active" : ""
      }`}
      onClick={onToggle}
      aria-label={
        isFavorite
          ? "Remove from favorites"
          : "Add to favorites"
      }
    >
      {isFavorite ? "♥" : "♡"}
    </button>
  );
}

export default FavoriteButton;