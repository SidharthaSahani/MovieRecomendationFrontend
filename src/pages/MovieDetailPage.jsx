import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import { styles } from '../styles/styles';
import { API_URL } from '../constants';
import { useAuth } from '../context/AuthContext';
import RecommendationCard from '../components/RecommendationCard';
import LoadingState from '../components/LoadingState';

function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewComment, setReviewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Construct full image URL if it's a relative path
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    // For relative paths like /uploads/filename
    return `${API_URL.replace('/api', '')}${imageUrl}`;
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const [movieResponse, recResponse, reviewResponse] = await Promise.all([
        axios.get(`${API_URL}/movies/${id}`),
        axios.get(`${API_URL}/recommendations/similar/${id}`),
        axios.get(`${API_URL}/reviews/${id}`),
      ]);

      setMovie(movieResponse.data);
      setRecommendations(recResponse.data);
      setReviews(reviewResponse.data);
    } catch (error) {
      toast.error('Failed to fetch movie details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!reviewComment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    try {
      setSubmittingReview(true);
      const response = await axios.post(`${API_URL}/reviews`, {
        movie: id,
        comment: reviewComment,
      });

      setReviews((prevReviews) => [response.data, ...prevReviews]);
      setReviewComment('');
      toast.success('Review added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading || !movie) {
    return <LoadingState message="Loading movie details..." />;
  }

  const fullImageUrl = getImageUrl(movie.imageUrl);
  const hasUserReview = Boolean(
    user?.id && reviews.some((review) => review.user?._id === user.id)
  );

  return (
    <div style={styles.detailPage}>
      <Link to="/" style={styles.backButton}>← Back to Movies</Link>
      
      <div style={styles.detailContainer}>
        {fullImageUrl ? (
          <img src={fullImageUrl} alt={movie.title} style={styles.detailImage} />
        ) : (
          <div style={{ 
            ...styles.detailImage, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '100px', 
            background: '#f5f5f5' 
          }}>
            
          </div>
        )}
        <div style={styles.detailInfo}>
          <h1 style={styles.detailTitle}>{movie.title}</h1>
          <div style={styles.detailMeta}>
            <span style={styles.genreBadge}>{movie.genre}</span>
            <span style={{ ...styles.metaItem, color: '#000', borderColor: '#000', borderWidth: '2px', background: '#fff' }}>
              {movie.language || 'English'}
            </span>
            <span style={{ ...styles.metaItem, color: '#000', borderColor: '#000', borderWidth: '2px' }}>
              ⭐ {movie.rating.toFixed(1)}
            </span>
            <span style={{ ...styles.metaItem, color: '#000', borderColor: '#000', borderWidth: '2px' }}>{movie.releaseYear}</span>
            <span style={{ ...styles.metaItem, color: '#000', borderColor: '#000', borderWidth: '2px' }}>{movie.duration} min</span>
          </div>
          <p style={styles.description}>{movie.description}</p>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Director:</span>
            <span style={styles.infoValue}>{movie.director}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Cast:</span>
            <span style={styles.infoValue}>{movie.cast}</span>
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div style={styles.recommendSection}>
          <h2 style={styles.recommendTitle}>
              Recommended For You
          </h2>
          <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px', textTransform: 'uppercase', fontWeight: '700' }}>
            Based on content similarity analysis
          </p>
          <div style={styles.moviesGrid}>
            {recommendations.slice(0, 4).map(rec => (
              <RecommendationCard key={rec._id} movie={rec} />
            ))}
          </div>
        </div>
      )}

      <div style={styles.reviewSection}>
        <h2 style={styles.recommendTitle}>Movie Reviews</h2>

        {isAuthenticated && !hasUserReview ? (
          <form style={styles.form} onSubmit={handleReviewSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Write Your Review</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                style={styles.textarea}
                onFocus={(e) => e.currentTarget.style.boxShadow = styles.inputFocus.boxShadow}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                placeholder="Write your review here"
                maxLength={1000}
                required
              />
            </div>
            <button
              type="submit"
              style={{
                ...styles.submitButton,
                maxWidth: '220px',
                opacity: submittingReview ? 0.7 : 1,
                cursor: submittingReview ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!submittingReview) {
                  e.currentTarget.style.background = styles.submitButtonHover.background;
                  e.currentTarget.style.transform = styles.submitButtonHover.transform;
                }
              }}
              onMouseLeave={(e) => {
                if (!submittingReview) {
                  e.currentTarget.style.background = styles.submitButton.background;
                  e.currentTarget.style.transform = 'none';
                }
              }}
              disabled={submittingReview}
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : isAuthenticated ? (
          <div style={styles.reviewLoginMessage}>You have already reviewed this movie</div>
        ) : (
          <div style={styles.reviewLoginMessage}>Login to write a review</div>
        )}

        {reviews.length === 0 ? (
          <div style={{ ...styles.emptyState, marginTop: '20px', padding: '30px 20px' }}>
            <p>No reviews yet.</p>
          </div>
        ) : (
          <div style={styles.reviewList}>
            {reviews.map((review) => (
              <div
                key={review._id}
                style={styles.reviewCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = styles.reviewCardHover.borderColor;
                  e.currentTarget.style.background = styles.reviewCardHover.background;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#000';
                  e.currentTarget.style.background = '#fff';
                }}
              >
                <div style={styles.reviewHeader}>
                  <span style={styles.reviewUsername}>{review.user?.username || 'User'}</span>
                  <span style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={styles.reviewComment}>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetailPage;
