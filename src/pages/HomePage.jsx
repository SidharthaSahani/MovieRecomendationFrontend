import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import { styles } from '../styles/styles';
import { API_URL } from '../constants';
import MovieCard from '../components/MovieCard';
import FilterSection from '../components/FilterSection';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    fetchMovies();
  }, [selectedGenre, sortBy]);

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