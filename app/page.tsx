"use client";

import { useState, FormEvent, useCallback, SyntheticEvent } from "react";
import type { Movie } from "./types/movie";
import { fetchMovies } from "./utils/api";
import "./page.css";

export default function Home() {
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await fetchMovies({
        year: year ? Number(year) : undefined,
        genre: genre || undefined,
      });
      setMovies(data.docs);
      console.log(data.docs);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Произошла неизвестная ошибка";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [year, genre]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    searchMovies();
  };

  return (
    <div className="movie-search">
      <h1 className="movie-search__title">Поиск фильмов</h1>

      <form onSubmit={handleSubmit} className="movie-search__form">
        <label className="movie-search__label" htmlFor="year-input">
          Год
        </label>
        <input
          id="year-input"
          className="movie-search__input"
          type="number"
          placeholder="Год(1900 - 2026)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <label className="movie-search__label" htmlFor="genre-input">
          Жанр
        </label>
        <input
          id="genre-input"
          className="movie-search__input"
          type="text"
          placeholder="Жанр"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />

        <button
          type="submit"
          className="movie-search__button"
          disabled={loading}
        >
          {loading ? "Поиск..." : "Найти"}
        </button>
      </form>

      <div className="movie-search__grid">
        {movies.map((movie) => {
          return (
            <article key={movie.id} className="movie-card">
              <img
                className="movie-card__poster"
                src={movie.poster?.url || "/undefined.jpeg"}
                alt={movie.name}
              />
              <h3 className="movie-card__title">{movie.names?.[0]?.name}</h3>
              <h3 className="movie-card__genres">
                {movie.genres?.length > 0 ? (
                  <span>
                    {movie.genres.map((genre, index) => (
                      <span key={index}>
                        {genre.name}
                        {index < movie.genres.length - 1 && ", "}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span>Нет данных</span>
                )}
              </h3>
              <h3 className="movie-card__countries">
                {movie.countries?.length > 0 ? (
                  <span>
                    {movie.countries.map((country, index) => (
                      <span key={index}>
                        {country.name}
                        {index < movie.countries.length - 1 && ", "}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span>Нет данных</span>
                )}
              </h3>
              <p className="movie-card__info">
                Год: {movie.year}, КП: {movie.rating?.kp ?? "-"}, IMDb:{" "}
                {movie.rating?.imdb ?? "-"}
              </p>
            </article>
          );
        })}
      </div>

      {!loading && hasSearched && movies.length === 0 && !error && (
        <p className="movie-search__empty">Фильмы не найдены</p>
      )}
    </div>
  );
}
