import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import { styles } from '../styles/styles';
import { API_URL } from '../constants';
import MovieCard from '../components/MovieCard';
import FilterSection from '../components/FilterSection';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import RecommendationCard from '../components/RecommendationCard';

function HomePage() {
  const { isAuthenticated } = useAuth();
  const [movies, setMovies] = useState([]);
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    fetchMovies();
    if (isAuthenticated) {
      fetchUserRecommendations();
    }
  }, [selectedGenre, sortBy, isAuthenticated]);

  const fetchUserRecommendations = async () => {
    try {
      setRecLoading(true);
      const response = await axios.get(`${API_URL}/recommendations/user/collaborative`);
      setUserRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error('Failed to fetch user recommendations:', error);
    } finally {
      setRecLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedGenre !== 'All') params.append('genre', selectedGenre);
      if (sortBy === 'rating') params.append('sort', 'rating');
      if (sortBy === 'year') params.append('sort', 'year');
      if (sortBy === 'title') params.append('sort', 'title');

      const response = await axios.get(`${API_URL}/movies?${params}`);
      setMovies(response.data);
    } catch (error) {
      toast.error('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(search.toLowerCase()) ||
    movie.director.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <div style={styles.heroSection}>
        <h1 style={styles.heroTitle}>Discover Amazing Movies</h1>
        <p style={styles.heroSubtitle}>
        </p>
      </div>

      {isAuthenticated && userRecommendations.length > 0 && (
        <div style={{ ...styles.recommendSection, padding: '0 0 40px 0' }}>
          <h2 style={styles.recommendTitle}>Picked For You</h2>
          <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px', textTransform: 'uppercase', fontWeight: '700' }}>
            Based on what similar users liked
          </p>
          <div style={styles.moviesGrid}>
            {userRecommendations.map(rec => (
              <RecommendationCard key={rec._id} movie={rec} />
            ))}
          </div>
          <hr style={{ margin: '40px 0', border: '0', borderTop: '1px solid #eee' }} />
        </div>
      )}

      <FilterSection
        search={search}
        setSearch={setSearch}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {loading ? (
        <LoadingState message="Loading movies..." />
      ) : filteredMovies.length === 0 ? (
        <EmptyState message="No movies found. Check back later!" />
      ) : (
        <div style={styles.moviesGrid}>
          {filteredMovies.map(movie => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;