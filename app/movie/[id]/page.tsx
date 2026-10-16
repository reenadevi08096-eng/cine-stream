'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

function MovieDetailContent() {
  const params = useParams();
  const id = params?.id;

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || '98c25031555408f4494ac2a39f4db12e';

    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p className="text-yellow-400 text-xl">Loading movie...</p>;
  }

  if (error || !movie) {
    return (
      <div>
        <p className="text-red-400">Movie details load nahi ho payi.</p>
        <Link href="/" className="mt-4 inline-block text-blue-400 underline">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/500x750'
        }
        alt={movie.title}
        className="w-full md:w-80 rounded-lg shadow-lg"
      />
      <div>
        <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
        <p className="text-yellow-400 text-lg mb-2">⭐ Rating: {movie.vote_average?.toFixed(1)} / 10</p>
        <p className="text-gray-400 mb-4">Release Date: {movie.release_date}</p>
        <p className="text-gray-200 text-lg mb-6 leading-relaxed">{movie.overview}</p>
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition"
        >
          &larr; Back to Movies
        </Link>
      </div>
    </div>
  );
}

export default function MovieDetailPage() {
  return (
    <main className="p-8 bg-gray-900 min-h-screen text-white">
      <Suspense fallback={<p className="text-yellow-400 text-xl">Loading movie...</p>}>
        <MovieDetailContent />
      </Suspense>
    </main>
  );
}