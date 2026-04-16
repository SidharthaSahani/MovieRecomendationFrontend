import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles/styles';
import { API_URL } from '../constants';

function RecommendationCard({ movie }) {
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
  
  // Get recommendation reason based on similarity score breakdown
  const displayReason = movie.reason || (movie.scoreBreakdown ? (() => {
    const reasons = [];
    const breakdown = movie.scoreBreakdown;
    
    if (breakdown.genre > 0.9) reasons.push('same genre');
    else if (breakdown.genre > 0.4) reasons.push('similar genre');
    
    if (breakdown.language > 0.9) reasons.push('same language');
    
    if (breakdown.director > 0.9) reasons.push('same director');
    else if (breakdown.director > 0.1) reasons.push('similar director');
    
    if (breakdown.year > 0.7) reasons.push('from the same era');
    if (breakdown.rating > 0.7) reasons.push('similar rating');
    if (breakdown.cast > 0.1) reasons.push('shared cast');
    if (breakdown.description > 0.3) reasons.push('similar story');
    
    if (reasons.length === 0) return 'Similar characteristics';
    if (reasons.length === 1) return reasons[0].charAt(0).toUpperCase() + reasons[0].slice(1);
    if (reasons.length === 2) return `${reasons[0]} and ${reasons[1]}`;
    
    return `${reasons.slice(0, -1).join(', ')}, and ${reasons[reasons.length - 1]}`;
  })() : 'Similar characteristics');

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
        
        {movie.similarityScore && (
          <div style={{
            marginTop: '10px',
            padding: '8px',
            background: '#fff',
            border: '2px solid #000',
            fontSize: '11px',
            color: '#333',
          }}>
            <div style={{ marginBottom: '4px', fontWeight: '800', color: '#000', textTransform: 'uppercase' }}>
              {(movie.similarityScore * 100).toFixed(0)}% Match
            </div>
            <div style={{ fontWeight: '600' }}>{displayReason}</div>
          </div>
        )}
        
        <p style={{ color: '#666', fontSize: '13px', marginTop: '8px', fontWeight: '600' }}>
          {movie.releaseYear} • {movie.duration} min
        </p>
      </div>
    </div>
  );
}

export default RecommendationCard;