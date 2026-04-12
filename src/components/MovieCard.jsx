import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles/styles';
import { API_URL } from '../constants';

function MovieCard({ movie }) {
  const navigate = useNavigate();

  // Construct full image URL if it's a relative path
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    // For relative paths like /uploads/filename
    return `${API_URL.replace('/api', '')}${imageUrl}`;
  };

  const fullImageUrl = getImageUrl(movie.imageUrl);

  return (
    <div
      style={styles.movieCard}
      onClick={() => navigate(`/movie/${movie._id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = styles.movieCardHover.borderColor;
        e.currentTarget.style.transform = styles.movieCardHover.transform;
        e.currentTarget.style.boxShadow = styles.movieCardHover.boxShadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#000';
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {fullImageUrl ? (
        <img src={fullImageUrl} alt={movie.title} style={styles.movieImage} />
      ) : (
        <div style={{ 
          ...styles.movieImage, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '48px' 
        }}>
          
        </div>
      )}
      <div style={styles.movieInfo}>
        <h3 style={styles.movieTitle}>{movie.title}</h3>
        <div style={styles.movieMeta}>
          <span style={styles.genreBadge}>{movie.genre}</span>
          <span style={{ ...styles.genreBadge, background: '#fff', color: '#000', border: '1px solid #000' }}>{movie.language || 'English'}</span>
          <span style={styles.rating}>⭐ {movie.rating.toFixed(1)}</span>
        </div>
        <p style={{ color: '#666', fontSize: '14px', fontWeight: '600' }}>
          {movie.releaseYear} • {movie.duration} min
        </p>
      </div>
    </div>
  );
}

export default MovieCard;