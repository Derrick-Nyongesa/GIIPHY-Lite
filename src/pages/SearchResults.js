import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Search from "../components/Search";

function SearchResults() {
  const { query } = useParams();
  const API_KEY = process.env.REACT_APP_GIPHY_API_KEY;
  const LIMIT = 12;

  const [gifs, setGifs] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <div className="p-4">
      <Navbar />
      <Search />
    </div>
  );
}

export default SearchResults;
