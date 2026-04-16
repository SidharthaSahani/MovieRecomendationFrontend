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
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);

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
  }, [id, user?.id]);

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

      // If current user has already rated, set the rating state to their rating
      const currentUserId = user?.id;
      if (currentUserId) {
        const userReview = reviewResponse.data.find(r => (r.user?._id || r.user)?.toString() === currentUserId.toString());
        if (userReview && userReview.rating) {
          setRating(userReview.rating);
        }
      }
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
        rating: rating,
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

  const handleRatingOnlySubmit = async () => {
    try {
      setSubmittingRating(true);
      const response = await axios.post(`${API_URL}/reviews`, {
        movie: id,
        rating: rating,
      });

      // Update reviews list (either add new or update existing)
      setReviews((prevReviews) => {
        const existingIndex = prevReviews.findIndex(r => (r.user?._id || r.user)?.toString() === user.id.toString());
        if (existingIndex > -1) {
          const newReviews = [...prevReviews];
          newReviews[existingIndex] = response.data;
          return newReviews;
        }
        return [response.data, ...prevReviews];
      });

      toast.success('Rating saved successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading || !movie) {
    return <LoadingState message="Loading movie details..." />;
  }

  const fullImageUrl = getImageUrl(movie.imageUrl);
  
  // Find the current user's review if it exists
  const userReview = user?.id && reviews.length > 0 
    ? reviews.find(review => (review.user?._id || review.user)?.toString() === user.id.toString())
    : null;
  
  const hasRating = Boolean(userReview && userReview.rating);
  const hasComment = Boolean(userReview && userReview.comment);
  const hasUserReview = hasRating || hasComment;

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

          {isAuthenticated && !hasRating && (
            <div style={{ marginTop: '30px', padding: '15px', border: '2px solid #000', background: '#f9f9f9', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px' }}>
              <label style={{ ...styles.label, marginBottom: 0 }}>Your Rating:</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                style={{ ...styles.input, padding: '5px 10px' }}
              >
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>
                    {num} Star{num !== 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              <button
                onClick={handleRatingOnlySubmit}
                disabled={submittingRating}
                style={{
                  ...styles.submitButton,
                  maxWidth: '100px',
                  padding: '8px 15px',
                  fontSize: '12px',
                  opacity: submittingRating ? 0.7 : 1,
                }}
              >
                {submittingRating ? '...' : 'Rate'}
              </button>
              <span style={{ fontSize: '12px', color: '#666', fontStyle: 'italic', flexBasis: '100%', marginTop: '5px' }}>
                (You can also write a review below)
              </span>
            </div>
          )}
          {isAuthenticated && hasRating && (
            <div style={{ marginTop: '30px', padding: '20px', border: '2px solid #000', background: '#e8f5e9', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>⭐ {userReview.rating} / 5</div>
              <div style={{ fontWeight: '700' }}>✓ You have rated this movie</div>
              {!hasComment && (
                <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                  Scroll down to add a text review!
                </p>
              )}
            </div>
          )}
          {!isAuthenticated && (
            <div style={{ marginTop: '30px', padding: '15px', border: '2px dashed #000', textAlign: 'center' }}>
              <Link to="/login" style={{ color: '#000', fontWeight: '700', textDecoration: 'underline' }}>Login to rate this movie</Link>
            </div>
          )}
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

        {isAuthenticated && !hasComment && (
          <form style={{ ...styles.form, marginBottom: '30px' }} onSubmit={handleReviewSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Write Your Review</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                style={styles.textarea}
                placeholder="What did you think of this movie?"
                required
              />
            </div>
            <button
              type="submit"
              style={{
                ...styles.submitButton,
                maxWidth: '220px',
                opacity: submittingReview ? 0.7 : 1,
              }}
              disabled={submittingReview}
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
        
        {isAuthenticated && hasComment && (
          <div style={{ marginBottom: '30px', padding: '15px', border: '2px solid #000', background: '#f9f9f9', fontWeight: '700', textAlign: 'center' }}>
            ✓ You have already shared your review for this movie
          </div>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 'bold' }}>⭐ {review.rating}</span>
                    <span style={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
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
