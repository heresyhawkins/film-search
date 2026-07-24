/* eslint-disable @next/next/no-img-element */
"use client";

import { SyntheticEvent, useCallback, useEffect, useState } from "react";

import { fetchGenres, fetchMovies } from "./api/api";
import PaginationButton, {
  Direction,
} from "./components/PaginationButton/PaginationButton";
import { NOT_AVAILABLE } from "./constants/common";
import type { TMDBGenre, TMDBMovie } from "./types/movie";
import { getYear } from "./utils/common";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export const Home = () => {
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [movies, setMovies] = useState<TMDBMovie[] | null>(null);
  const [genres, setGenres] = useState<TMDBGenre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genresList = await fetchGenres();
        setGenres(genresList);
      } catch (err) {
        console.error("Failed to load genres:", err);
      }
    };
    void loadGenres();
  }, []);

  const searchMovies = useCallback(
    async (
      currentPage: number,
      searchTitle?: string,
      searchGenreId?: number | null,
    ) => {
      setLoading(true);
      setError(null);

      try {
        const fetchedMovies = await fetchMovies(currentPage, {
          title: searchTitle ?? undefined,
          genre: searchGenreId ?? undefined,
        });
        setMovies(fetchedMovies);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch movies data";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleGenreClick = useCallback(
    async (genreId: number) => {
      if (selectedGenreId === genreId) {
        setSelectedGenreId(null);
        setPage(1);
        await searchMovies(1, title, null);
      } else {
        setSelectedGenreId(genreId);
        setTitle("");
        setPage(1);
        await searchMovies(1, undefined, genreId);
      }
    },
    [selectedGenreId, title, searchMovies],
  );

  const handleSubmit = useCallback(
    async (e: SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSelectedGenreId(null);
      setPage(1);
      await searchMovies(1, title, null);
    },
    [title, searchMovies],
  );

  const goToNextPage = useCallback(async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await searchMovies(nextPage, title, selectedGenreId);
  }, [page, title, selectedGenreId, searchMovies]);

  const goToPrevPage = useCallback(async () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      await searchMovies(prevPage, title, selectedGenreId);
    }
  }, [page, title, selectedGenreId, searchMovies]);

  return (
    <div className="show-search">
      <h1 className="show-search__title">Movie Search</h1>
      <div className="show-search__genre-panel">
        <h3 className="show-search__genre-title">Genre:</h3>
        <div className="show-search__genre-list">
          {genres.map((genre) => (
            <button
              key={genre.id}
              type="button"
              className={`show-search__genre-button ${
                selectedGenreId === genre.id
                  ? "show-search__genre-button--active"
                  : ""
              }`}
              onClick={() => void handleGenreClick(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="show-search__form">
        <div>
          <label className="show-search__label" htmlFor="title-input">
            Title
          </label>
          <input
            id="title-input"
            className="show-search__input"
            type="text"
            placeholder="Enter the title of the movie"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div>
          <button
            type="submit"
            className="show-search__button"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>
      <div className="show-search__grid">
        {movies?.map((movie) => (
          <article key={movie.id} className="show-card">
            <img
              width={260}
              height={390}
              className="show-card__poster"
              src={
                movie.poster_path
                  ? `${IMAGE_BASE_URL}${movie.poster_path}`
                  : "/empty.jpeg"
              }
              alt={movie.title}
            />
            <p className="show-card__title">{movie.title}</p>
            <p className="show-card__genres">
              Genres: {movie.genre_ids.join(", ") || NOT_AVAILABLE}
            </p>
            <p className="show-card__info">
              Year:{" "}
              {movie.release_date ? getYear(movie.release_date) : NOT_AVAILABLE}
              , Rating: {movie.vote_average || NOT_AVAILABLE}
            </p>
            {movie.overview && (
              <p className="show-card__overview">
                {movie.overview.length > 150
                  ? `${movie.overview.substring(0, 150)}...`
                  : movie.overview}
              </p>
            )}
          </article>
        ))}
      </div>
      {!loading && movies?.length === 0 && !error && (
        <p className="show-search__empty">Movies not found</p>
      )}
      {(movies?.length ?? 0) > 1 && (
        <div className="show-search__pagination">
          <PaginationButton
            onClick={() => void goToPrevPage()}
            direction={Direction.PREV}
            disabled={page === 1 || loading}
            size={30}
          />
          <span className="show-search__number-page">Page {page}</span>
          <PaginationButton
            onClick={() => void goToNextPage()}
            direction={Direction.NEXT}
            disabled={loading}
            size={30}
          />
        </div>
      )}
      {!loading && error && (
        <p className="show-search__error">Error: {error}</p>
      )}
    </div>
  );
};

export default Home;
