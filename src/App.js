import React, { useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchMovieHandler() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://swapi.dev/api/films/');

      if(!response.ok) {
        throw new Error('Something went wrong!')
      };

      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  let content = <p>Loading....!</p>;

  if(error){
    content = <p>{error}</p>
  }
  
  if(movies.length) {
    content = <MoviesList movies={movies} />
  }

  if(!movies.length){
    content = <p>Movies not found</p>
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
