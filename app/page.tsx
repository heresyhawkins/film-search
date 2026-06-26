"use client";

import "./reset.css";
import "./page.css";

import Image from "next/image";
import { SyntheticEvent, useCallback, useState } from "react";

import { fetchShows } from "./api/api";
import type { TVMazeSearchResult, TVMazeShow } from "./types/movie";

const Home = () => {
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
        title: title,
        genre: genre,
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
      const message =
        err instanceof Error ? err.message : "Failed to fetch shows data";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [title, genre]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    void searchShows();
  };

  const getYear = (premieredYear: string) => {
    if (!premieredYear) {
      return "N/A";
    }

    return premieredYear.split("-")[0];
  };

  return (
    <div className="show-search">
      <h1 className="show-search__title">Show Search</h1>

      <form onSubmit={handleSubmit} className="show-search__form">
        <div>
          <label className="show-search__label" htmlFor="title-input">
            Title
          </label>
          <input
            id="title-input"
            className="show-search__input"
            type="text"
            placeholder="Enter the title of the show"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <label className="show-search__label" htmlFor="genre-input">
            Genre
          </label>
          <input
            id="genre-input"
            className="show-search__input"
            type="text"
            placeholder="Drama, Comedy, Horror f.e."
            value={genre}
            onChange={(e) => {
              setGenre(e.target.value);
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
        {shows.map((show) => (
          <article key={show.id} className="show-card">
            <Image
              width={260}
              height={280}
              className="show-card__poster"
              src={show.image?.medium ?? "/empty.jpeg"}
              alt={show.name}
            />
            <h3 className="show-card__title">{show.name}</h3>
            <h3 className="show-card__genres">
              Genre : {show.genres.join(", ") || "N/A"}
            </h3>
            {show.network?.name && (
              <h3 className="show-card__network">
                Network : {show.network.name}
              </h3>
            )}
            {show.webChannel?.name && (
              <h3 className="show-card__network">
                Channel : {show.webChannel.name}
              </h3>
            )}
            <p className="show-card__info">
              Year: {getYear(show.premiered)}, Rating:{" "}
              {show.rating?.average ?? "N/A"}
            </p>
            <p className="show-card__info">Status: {show.status}</p>
          </article>
        ))}
      </div>

      {!loading && hasSearched && shows.length === 0 && !error && (
        <p className="show-search__empty">Shows not found</p>
      )}

      {error && <p className="show-search__error">Error: {error}</p>}
    </div>
  );
};

export default Home;
