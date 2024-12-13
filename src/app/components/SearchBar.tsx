"use client";
import { useState, useEffect } from "react";
import debounce from "lodash.debounce";

import styles from "./styles/SearchBar.module.css";

interface SearchResult {
  id: number;
  bus_number: string;
}

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    buses: SearchResult[];
    routes: SearchResult[];
  }>({ buses: [], routes: [] });
  const [loading, setLoading] = useState(false);
  const [searchInputFocused, setSearchInputFocused] = useState(false);

  // Debounced search function
  const fetchSearchResults = debounce(async (query: string) => {
    if (query.trim() === "") {
      setSearchResults({ buses: [], routes: [] });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/search?query=${query}`);
      const data = await response.json();
      setSearchResults(data);
      console.log(data, searchResults);
    } catch (error) {
      console.error("Error fetching search results", error);
    } finally {
      setLoading(false);
    }
  }, 300); // 300ms debounce

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    }
  }, [searchQuery]);

  return (
    <div className={`${styles.searchbarcontainer} max-sm:hidden`}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search buses, routes..."
        className={`${styles.searchInput}`}
        onFocus={() => setSearchInputFocused(true)}
        onBlur={() => setSearchInputFocused(false)}
      />
      <div
        className={styles.searchresults}
        style={{
          display: searchInputFocused && searchQuery ? "block" : "none",
        }}
      >
        {loading && <p>Loading...</p>}
        <div>
          {searchResults.buses.length === 0 ? (
            <p>No data found</p>
          ) : (
            <ul>
              {searchResults.buses.map((bus) => (
                <li key={bus.id}>{bus.bus_number}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
