import { useState, useCallback } from 'react';

/**
 * useMapSearch Hook
 * 
 * Manages map search state and filtering logic.
 * Handles:
 * - Search query management
 * - Trek filtering based on search
 * - Highlighted trek tracking
 * - Card and marker sync
 */
export function useMapSearch(allTreks = []) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTreks, setFilteredTreks] = useState([]);
  const [highlightedTrekId, setHighlightedTrekId] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Filter treks based on search query
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);

    if (!query || query.trim().length < 2) {
      setFilteredTreks([]);
      setIsSearchActive(false);
      setHighlightedTrekId(null);
      return;
    }

    const normalized = query.toLowerCase().trim();
    const results = allTreks.filter((trek) => {
      const nameMatch = trek.name?.toLowerCase().includes(normalized);
      const stateMatch = trek.state?.toLowerCase().includes(normalized);
      return nameMatch || stateMatch;
    });

    setFilteredTreks(results);
    setIsSearchActive(true);
    if (results.length > 0) {
      setHighlightedTrekId(results[0].id);
    }
  }, [allTreks]);

  // Handle trek card click - highlight on map
  const handleTrekCardClick = useCallback((trekId) => {
    setHighlightedTrekId(trekId);
  }, []);

  // Handle map marker click - highlight card
  const handleMapMarkerClick = useCallback((trek) => {
    setHighlightedTrekId(trek.id);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setFilteredTreks([]);
    setIsSearchActive(false);
    setHighlightedTrekId(null);
  }, []);

  return {
    searchQuery,
    filteredTreks,
    highlightedTrekId,
    isSearchActive,
    handleSearch,
    handleTrekCardClick,
    handleMapMarkerClick,
    clearSearch,
  };
}
