"use client";
import { useState, useEffect } from "react";
import debounce from "lodash.debounce";

import styles from "./styles/SearchBar.module.css";
import { DataProps } from "./MapProps";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInputFocused, setSearchInputFocused] = useState(false);

  // Debounced search function
  const fetchSearchResults = debounce(async (query: string) => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSearchResults(data.results);
      console.log(data.results);
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
      />
      <div
        className={styles.searchresults}
        style={{
          display: searchInputFocused && searchQuery ? "block" : "none",
        }}
        onBlur={() => setSearchInputFocused(false)}
      >
        {loading && <p>Loading...</p>}
        <div>
          {searchResults.length === 0 ? (
            <p>No data found</p>
          ) : (
            <ul>
              {searchResults.map((result, index) => (
                <li key={index}>
                  {result.route_name ? result.route_name : result.bus_number}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
