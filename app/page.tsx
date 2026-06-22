"use client";

import { useState, useCallback, SyntheticEvent } from "react";
import { fetchShows } from "./utils/api";
import type { TVMazeShow, TVMazeSearchResult } from "./types/movie";
import "./page.css";

export default function Home() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [shows, setShows] = useState<TVMazeShow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchShows = useCallback(async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await fetchShows({
        title: title || undefined,
        genre: genre || undefined,
      });

      let showsArray: TVMazeShow[] = [];

      if (Array.isArray(data)) {
        if (data.length > 0 && "show" in data[0]) {
          showsArray = (data as TVMazeSearchResult[]).map((item) => item.show);
        } else {
          showsArray = data as TVMazeShow[];
        }
      }

      setShows(showsArray);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Undefined";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [title, genre]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    searchShows();
  };

  const getYear = (premiered: string) => {
    if (!premiered) return "N/A";
    return premiered.split("-")[0];
  };

  return (
    <div className="show-search">
      <h1 className="show-search__title">Show Search</h1>

      <form onSubmit={handleSubmit} className="show-search__form">
        <div>
          {" "}
          <label className="show-search__label">Title</label>
          <input
            id="title-input"
            className="show-search__input"
            type="text"
            placeholder="Enter the title of the show"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="show-search__label">Genre</label>
          <input
            id="genre-input"
            className="show-search__input"
            type="text"
            placeholder="Drama, Comedy, Horror f.e."
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </div>
        <div>
          <button
            type="submit"
            className="show-search__button"
            disabled={loading}
          >
            {loading ? "Search..." : "Find"}
          </button>
        </div>
      </form>

      <div className="show-search__grid">
        {shows.map((show) => (
          <article key={show.id} className="show-card">
            <img
              className="show-card__poster"
              src={show.image?.medium || "/undefined.jpeg"}
              alt={show.name}
            />
            <h3 className="show-card__title">{show.name}</h3>
            <h3 className="show-card__genres">
              Genre : {show.genres?.join(", ") || "N/A"}
            </h3>
            {show.network?.name && (
              <h3 className="show-card__network">
                NetWork : {show.network.name}
              </h3>
            )}
            {show.webChannel?.name && (
              <h3 className="show-card__network">
                Channel : {show.webChannel.name}
              </h3>
            )}
            <p className="show-card__info">
              Year: {getYear(show.premiered)}, Rating:{" "}
              {show.rating?.average || "N/A"}
            </p>
            <p className="show-card__info">Status: {show.status}</p>
          </article>
        ))}
      </div>

      {!loading && hasSearched && shows.length === 0 && !error && (
        <p className="show-search__empty">Shows not found </p>
      )}

      {error && <p className="show-search__error">Error: {error}</p>}
    </div>
  );
}
