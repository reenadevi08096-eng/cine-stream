'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || "98c25031555408f4494ac2a39f4db12e";
    
    // Agar query hai toh search endpoint, nahi toh popular movies
    const endpoint = query.trim()
      ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`
      : `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;

    setLoading(true);

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error('Fetch failed');
        return res.json();
      })
      .then((data) => {
        setMovies(data.results || []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [query]);

  return (
    <main className="p-8 bg-gray-900 min-h-screen text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Cine-Stream Movies</h1>
        
        {/* Search Input Bar */}
        <input
          type="text"
          placeholder="Search any movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500 w-full md:w-80"
        />
      </div>

      {loading && <p className="text-yellow-400 text-xl">Loading movies...</p>}

      {error && (
        <p className="text-red-400">
          Network issue. Please refresh or check connection.
        </p>
      )}

      {!loading && !error && movies.length === 0 && (
        <p className="text-gray-400 text-xl">No movies found for "{query}".</p>
      )}

      {!loading && !error && movies.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <Link
              href={`/movie/${movie.id}`}
              key={movie.id}
              className="bg-gray-800 p-4 rounded-lg hover:scale-105 transition block"
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : 'https://via.placeholder.com/500x750'
                }
                alt={movie.title}
                className="rounded-md mb-2 w-full h-auto"
              />
              <h2 className="font-semibold text-lg">{movie.title}</h2>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}