import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovieHandler = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://react-http-app-default-rtdb.firebaseio.com/movies.json');

      if(!response.ok) {
        throw new Error('Something went wrong!')
      };

      const data = await response.json();
      let loadingMovies = [];
      for (let key in data) {
        loadingMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        });
      }
      setMovies(loadingMovies);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }, []);

  const addMovieHandler = async (movie) => {
    setLoading(true);
    try {
      const response = await fetch('https://react-http-app-default-rtdb.firebaseio.com/movies.json', {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
          'Content-Type': 'application/json'
        } 
      });
      const data = response.json();
      setMovies(data);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler]);

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
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
