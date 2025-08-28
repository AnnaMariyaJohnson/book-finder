import { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchBooks = async () => {
    if (!query) return;
    setLoading(true);
    setError("");
    setBooks([]);

    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (data.docs.length === 0) {
        setError("No books found.");
      }
      setBooks(data.docs.slice(0, 12)); // show 12 results
    } catch {
      setError("Failed to fetch books.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        📚 Book Finder
      </h1>

      <div className="flex w-full max-w-md mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter book title..."
          className="flex-grow border p-2 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={searchBooks}
          className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600 transition"
        >
          Search
        </button>
      </div>

      {loading && <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {books.map((book, index) => (
          <li
            key={index}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col items-center"
          >
            {book.cover_i ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
                className="h-60 w-auto object-contain mb-3 rounded"
              />
            ) : (
              <div className="h-60 w-40 bg-gray-200 flex items-center justify-center text-gray-500 text-sm mb-3">
                No Cover
              </div>
            )}
            <h2 className="font-semibold text-lg text-center">{book.title}</h2>
            <p className="text-sm text-gray-600 text-center">
              {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
