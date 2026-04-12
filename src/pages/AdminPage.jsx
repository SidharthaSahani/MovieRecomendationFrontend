import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import { styles } from '../styles/styles';
import { API_URL } from '../constants';
import Modal from '../components/Modal';
import MovieForm from '../components/MovieForm';
import MovieTable from '../components/MovieTable';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

function AdminPage() {
  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: 'Action',
    language: 'English',
    releaseYear: new Date().getFullYear(),
    rating: 0,
    director: '',
    cast: '',
    duration: 120,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/movies`);
      setMovies(response.data);
    } catch (error) {
      toast.error('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      genre: 'Action',
      language: 'English',
      releaseYear: new Date().getFullYear(),
      rating: 0,
      director: '',
      cast: '',
      duration: 120,
    });
    setImageFile(null);
    setImagePreview('');
    setEditingMovie(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      genre: movie.genre,
      language: movie.language || 'English',
      releaseYear: movie.releaseYear,
      rating: movie.rating,
      director: movie.director,
      cast: movie.cast,
      duration: movie.duration,
    });
    setImagePreview(movie.imageUrl || '');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (editingMovie) {
        await axios.put(`${API_URL}/movies/${editingMovie._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Movie updated successfully!');
      } else {
        await axios.post(`${API_URL}/movies`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Movie added successfully!');
      }
      setShowModal(false);
      resetForm();
      fetchMovies();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await axios.delete(`${API_URL}/movies/${id}`);
        toast.success('Movie deleted successfully!');
        fetchMovies();
      } catch (error) {
        toast.error('Failed to delete movie');
      }
    }
  };

  return (
    <div style={styles.adminContainer}>
      <div style={styles.adminHeader}>
        <h1 style={styles.adminTitle}> Movie Management</h1>
        <button
          style={styles.addButton}
          onClick={openAddModal}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#333';
            e.currentTarget.style.transform = 'scale(0.98)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = styles.addButton.background;
            e.currentTarget.style.transform = 'none';
          }}
        >
           Add New Movie
        </button>
      </div>

      {loading ? (
        <LoadingState message="Loading movies..." />
      ) : movies.length === 0 ? (
        <EmptyState icon="📽️" message="No movies yet. Add your first movie!" />
      ) : (
        <MovieTable 
          movies={movies} 
          onEdit={openEditModal} 
          onDelete={handleDelete} 
        />
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingMovie ? ' Edit Movie' : ' Add New Movie'}
      >
        <MovieForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleImageChange={handleImageChange}
          imagePreview={imagePreview}
          editingMovie={editingMovie}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}

export default AdminPage;