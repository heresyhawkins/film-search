import clsx from "clsx";
import type { SubmitEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchGenres } from "./api/genre";
import { fetchMovies } from "./api/movie";
import { PaginationButton } from "./components/PaginationButton/PaginationButton";
import { Direction } from "./components/PaginationButton/types";
import {
  IMAGE_BASE_URL,
  NOT_AVAILABLE,
  OVERVIEW_MAX_LENGTH,
} from "./constants/common";
import type { TMDBGenre, TMDBMovie } from "./types/movie";
import { getYear } from "./utils/common";

export const App = () => {
  const [title, setTitle] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [movies, setMovies] = useState<TMDBMovie[] | null>(null);
  const [genres, setGenres] = useState<TMDBGenre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenreClick = useCallback(
    (genreId: number) => {
      if (selectedGenreId === genreId) {
        setSelectedGenreId(null);
        setPage(1);

        return;
      }

      setSelectedGenreId(genreId);
      setTitle("");
      setPage(1);
    },
    [selectedGenreId],
  );

  const handleSubmit = useCallback((e: SubmitEvent) => {
    e.preventDefault();

    setSelectedGenreId(null);
    setPage(1);
  }, []);

  const handlePageChange = useCallback(
    (delta: number) => {
      const newPage = page + delta;

      if (newPage < 1 || newPage > totalPages) {
        return;
      }

      setPage(newPage);
    },
    [page, totalPages],
  );

  const genreMap = useMemo(() => {
    return new Map(genres.map((genre) => [genre.id, genre.name]));
  }, [genres]);

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

  useEffect(() => {
    const searchMovies = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchMovies(page, {
          title,
          genre: selectedGenreId,
        });

        setMovies(response.results);
        setTotalPages(response.total_pages);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch movies data";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void searchMovies();
  }, [page, selectedGenreId, title]);

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
              className={clsx("show-search__genre-button", {
                "show-search__genre-button--active":
                  selectedGenreId === genre.id,
              })}
              onClick={() => {
                handleGenreClick(genre.id);
              }}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
      <form className="show-search__form" onSubmit={handleSubmit}>
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
              Genres:{" "}
              {movie.genre_ids.length
                ? movie.genre_ids.map((id) => genreMap.get(id)).join(", ")
                : NOT_AVAILABLE}
            </p>
            <p className="show-card__info">
              Year:{" "}
              {movie.release_date ? getYear(movie.release_date) : NOT_AVAILABLE}
            </p>
            <p className="show-card__info">
              Rating: {movie.vote_average ?? NOT_AVAILABLE}
            </p>
            {movie.overview && (
              <p className="show-card__overview">
                {movie.overview.length > OVERVIEW_MAX_LENGTH
                  ? `${movie.overview.substring(0, OVERVIEW_MAX_LENGTH)}...`
                  : movie.overview}
              </p>
            )}
          </article>
        ))}
      </div>

      {!loading && error && (
        <p className="show-search__error">Error: {error}</p>
      )}

      {!loading && movies?.length === 0 && !error && (
        <p className="show-search__empty">Movies not found</p>
      )}

      {(movies?.length ?? 0) > 0 && (
        <div className="show-search__pagination">
          <PaginationButton
            direction={Direction.PREV}
            disabled={page === 1 || loading}
            onClick={() => {
              handlePageChange(-1);
            }}
          />

          <span className="show-search__number-page">Page {page}</span>

          <PaginationButton
            direction={Direction.NEXT}
            disabled={loading || page >= totalPages}
            onClick={() => {
              handlePageChange(1);
            }}
          />
        </div>
      )}
    </div>
  );
};
