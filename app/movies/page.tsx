
'use client';

import { useEffect, useState } from 'react';
//import { supabase } from '@/lib/supabaseClient';

type Movie = {
  id: number;
  title: string;
  actors: string;
  release_year: number;
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [actors, setActors] = useState('');
  const [releaseYear, setReleaseYear] = useState<number | ''>('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchMovies = async () => {
    setLoading(true);
    // const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching movies:', error.message);
    } else {
      setMovies(data as Movie[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('movies').delete().eq('id', id);
    if (error) {
      console.error('Error deleting movie:', error.message);
    } else {
      await fetchMovies();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !actors || !releaseYear) {
      alert('Please fill in all fields.');
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from('movies')
        .update({
          title,
          actors,
          release_year: releaseYear,
        })
        .eq('id', editingId);

      if (error) {
        console.error('Error updating movie:', error.message);
      }
    } else {
      const { error } = await supabase.from('movies').insert({
        title,
        actors,
        release_year: releaseYear,
      });

      if (error) {
        console.error('Error adding movie:', error.message);
      }
    }

    setTitle('');
    setActors('');
    setReleaseYear('');
    setEditingId(null);

    await fetchMovies();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setActors('');
    setReleaseYear('');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Movies List</h1>
      <p className="mb-4 text-gray-700">
        Manage the Internet Movies Rental Company database: add, edit, and delete movies.
      </p>

      {loading ? (
        <p>Loading movies...</p>
      ) : movies.length === 0 ? (
        <p>No movies yet. Add one using the form below.</p>
      ) : (
        <ul className="space-y-3 mb-6">
          {movies.map((movie) => (
            <li
              key={movie.id}
              className="border rounded bg-white p-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-lg">{movie.title}</p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Actors:</span> {movie.actors}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Release Year:</span>{' '}
                  {movie.release_year}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                  onClick={() => {
                    setEditingId(movie.id);
                    setTitle(movie.title);
                    setActors(movie.actors);
                    setReleaseYear(movie.release_year);
                  }}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  onClick={() => handleDelete(movie.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={handleSubmit}
        className="border rounded bg-white p-4 max-w-md space-y-3"
      >
        <h2 className="text-xl font-semibold mb-2">
          {editingId ? 'Edit Movie' : 'Add Movie'}
        </h2>

        <div>
          <label className="block mb-1 text-sm font-medium">Title</label>
          <input
            className="border rounded w-full px-2 py-1 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Movie title"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Actors (comma separated)
          </label>
          <input
            className="border rounded w-full px-2 py-1 text-sm"
            value={actors}
            onChange={(e) => setActors(e.target.value)}
            placeholder="Actor 1, Actor 2, Actor 3"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Release Year</label>
          <input
            type="number"
            className="border rounded w-full px-2 py-1 text-sm"
            value={releaseYear}
            onChange={(e) =>
              setReleaseYear(e.target.value ? Number(e.target.value) : '')
            }
            placeholder="2024"
          />
        </div>

        <div className="mt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded text-sm"
          >
            {editingId ? 'Save Changes' : 'Add Movie'}
          </button>

          {editingId && (
            <button
              type="button"
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded text-sm"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}