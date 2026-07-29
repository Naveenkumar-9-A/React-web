import { expect } from '@playwright/test';

/**
 * SearchPage - Page Object for Search functionality
 * Extends HomePage search capabilities with specialized search testing methods
 * Handles: database treks, OSM destinations, invalid searches, edge cases
 */
export class SearchPage {
  constructor(page) {
    this.page = page;

    // ============ SEARCH INPUT LOCATORS ============
    this.searchInput = page.locator('#hero-search-input');
    this.searchButton = page.locator('.hero-search-button');
    this.searchForm = page.locator('.hero-search-form');

    // ============ SUGGESTIONS DROPDOWN LOCATORS ============
    this.suggestionsContainer = page.locator('#search-suggestions');
    this.suggestionItems = page.locator('.search-suggestion-item');
    this.noResultsMessage = page.locator('.search-suggestion-item:has-text("❌")');

    // ============ TREK SUGGESTION LOCATORS ============
    this.trekSuggestions = page.locator('.search-suggestion-item').filter({ hasText: /🏔️/ });

    // ============ OSM SUGGESTION LOCATORS ============
    this.osmSuggestions = page.locator('.search-suggestion-item').filter({ hasText: /📍/ });

    // ============ SUGGESTION DETAILS LOCATORS ============
    this.suggestionMain = page.locator('.search-suggestion-main');
    this.suggestionSecondary = page.locator('.search-suggestion-secondary');
  }

  // ============ SEARCH INPUT METHODS ============

  /**
   * Type text into search box (triggers API after debounce)
   */
  async typeSearch(text) {
    await this.searchInput.click();
    await this.searchInput.fill(text);
    // Debounce is 500ms in the app
    await this.page.waitForTimeout(600);
  }

  /**
   * Clear search input
   */
  async clearSearchInput() {
    await this.searchInput.clear();
  }

  /**
   * Get current search input value
   */
  async getSearchValue() {
    return await this.searchInput.inputValue();
  }

  /**
   * Get search box placeholder text
   */
  async getPlaceholder() {
    return await this.searchInput.getAttribute('placeholder');
  }

  /**
   * Type search with special characters
   */
  async typeSpecialCharacters(text) {
    await this.searchInput.click();
    // Use type instead of fill for special character handling
    await this.searchInput.type(text, { delay: 50 });
    await this.page.waitForTimeout(600);
  }

  // ============ SUGGESTIONS VISIBILITY METHODS ============

  /**
   * Wait for suggestions dropdown to appear
   */
  async waitForSuggestions(timeout = 5000) {
    await this.suggestionsContainer.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for suggestions to disappear
   */
  async waitForSuggestionsToDisappear(timeout = 3000) {
    await this.suggestionsContainer.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Check if suggestions are visible
   */
  async areSuggestionsVisible() {
    try {
      return await this.suggestionsContainer.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get count of suggestion items
   */
  async getSuggestionsCount() {
    return await this.suggestionItems.count();
  }

  /**
   * Get all suggestion texts
   */
  async getAllSuggestionTexts() {
    const count = await this.getSuggestionsCount();
    const texts = [];

    for (let i = 0; i < count; i++) {
      const item = this.suggestionItems.nth(i);
      const text = await item.textContent();
      texts.push(text);
    }

    return texts;
  }

  // ============ TREK SUGGESTION METHODS ============

  /**
   * Get count of trek suggestions (database results)
   */
  async getTrekSuggestionsCount() {
    return await this.trekSuggestions.count();
  }

  /**
   * Get trek suggestion by index
   */
  async getTrekSuggestion(index = 0) {
    return await this.trekSuggestions.nth(index).textContent();
  }

  /**
   * Click trek suggestion by name
   */
  async clickTrekSuggestion(trekName) {
    const suggestion = this.page.locator('.search-suggestion-item').filter({
      hasText: new RegExp(`🏔️.*${trekName}`, 'i')
    }).first();

    await suggestion.click();
    await this.page.waitForLoadState('networkidle');
  }

  // ============ OSM SUGGESTION METHODS ============

  /**
   * Get count of OSM suggestions (OpenStreetMap results)
   */
  async getOsmSuggestionsCount() {
    return await this.osmSuggestions.count();
  }

  /**
   * Get OSM suggestion by index
   */
  async getOsmSuggestion(index = 0) {
    return await this.osmSuggestions.nth(index).textContent();
  }

  /**
   * Click OSM suggestion by name
   */
  async clickOsmSuggestion(locationName) {
    const suggestion = this.page.locator('.search-suggestion-item').filter({
      hasText: new RegExp(`📍.*${locationName}`, 'i')
    }).first();

    await suggestion.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get OSM suggestion main text (location name)
   */
  async getOsmSuggestionName(index = 0) {
    const osmSuggestion = this.osmSuggestions.nth(index);
    const mainText = osmSuggestion.locator('.search-suggestion-main');
    return await mainText.textContent();
  }

  // ============ NO RESULTS METHODS ============

  /**
   * Check if "no results" message is displayed
   */
  async isNoResultsMessageVisible() {
    try {
      await this.noResultsMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get no results message text
   */
  async getNoResultsMessage() {
    try {
      return await this.noResultsMessage.textContent();
    } catch {
      return null;
    }
  }

  // ============ SEARCH SUBMISSION METHODS ============

  /**
   * Press Enter to submit search
   */
  async pressEnter() {
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click search button to submit
   */
  async clickSearchButton() {
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click first suggestion item
   */
  async clickFirstSuggestion() {
    const firstItem = this.suggestionItems.first();
    await firstItem.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click suggestion by exact text match
   */
  async clickSuggestionByText(text) {
    const suggestion = this.page.locator('.search-suggestion-item').filter({
      hasText: new RegExp(text, 'i')
    }).first();

    await suggestion.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Press Escape to close suggestions
   */
  async pressEscape() {
    await this.searchInput.press('Escape');
    await this.page.waitForTimeout(300);
  }

  // ============ KEYBOARD NAVIGATION METHODS ============

  /**
   * Press arrow down key for suggestion navigation
   */
  async pressArrowDown() {
    await this.searchInput.press('ArrowDown');
    await this.page.waitForTimeout(200);
  }

  /**
   * Press arrow up key for suggestion navigation
   */
  async pressArrowUp() {
    await this.searchInput.press('ArrowUp');
    await this.page.waitForTimeout(200);
  }

  /**
   * Focus on search input
   */
  async focusSearchInput() {
    await this.searchInput.focus();
  }

  // ============ SEARCH INPUT EDGE CASES ============

  /**
   * Type text with leading spaces
   */
  async typeWithLeadingSpaces(text) {
    await this.searchInput.click();
    await this.searchInput.fill(`   ${text}`);
    await this.page.waitForTimeout(600);
  }

  /**
   * Type text with trailing spaces
   */
  async typeWithTrailingSpaces(text) {
    await this.searchInput.click();
    await this.searchInput.fill(`${text}   `);
    await this.page.waitForTimeout(600);
  }

  /**
   * Type only 1 character (below debounce threshold)
   */
  async typeSingleCharacter(char) {
    await this.searchInput.click();
    await this.searchInput.fill(char);
    await this.page.waitForTimeout(600);
  }

  /**
   * Type exactly 2 characters (minimum for search)
   */
  async typeTwoCharacters(text) {
    await this.searchInput.click();
    await this.searchInput.fill(text.substring(0, 2));
    await this.page.waitForTimeout(600);
  }

  /**
   * Perform multiple consecutive searches
   */
  async performConsecutiveSearches(searchTerms) {
    for (const term of searchTerms) {
      await this.clearSearchInput();
      await this.typeSearch(term);
    }
  }

  // ============ SUGGESTION DETAILS METHODS ============

  /**
   * Get main text of first suggestion
   */
  async getFirstSuggestionMain() {
    const firstItem = this.suggestionItems.first();
    const mainText = firstItem.locator('.search-suggestion-main');
    return await mainText.textContent();
  }

  /**
   * Get secondary text of first suggestion
   */
  async getFirstSuggestionSecondary() {
    const firstItem = this.suggestionItems.first();
    const secondaryText = firstItem.locator('.search-suggestion-secondary');
    return await secondaryText.textContent();
  }

  /**
   * Verify suggestion contains expected category emoji
   */
  async verifyFirstSuggestionHasEmoji(emoji) {
    const mainText = await this.getFirstSuggestionMain();
    return mainText && mainText.includes(emoji);
  }

  // ============ URL NAVIGATION VERIFICATION ============

  /**
   * Wait for trek details page and verify URL
   */
  async verifyTrekDetailsNavigation() {
    await expect(this.page).toHaveURL(/\/treks\//, { timeout: 5000 });
  }

  /**
   * Wait for destination page and verify URL
   */
  async verifyDestinationPageNavigation() {
    await expect(this.page).toHaveURL(/\/destination\//, { timeout: 5000 });
  }

  /**
   * Get current URL path
   */
  async getCurrentPath() {
    return this.page.url();
  }

  /**
   * Verify URL contains specific text
   */
  async verifyUrlContains(text) {
    await expect(this.page).toHaveURL(new RegExp(text, 'i'));
  }

  // ============ SUGGESTION INTERACTION METHODS ============

  /**
   * Hover over suggestion item
   */
  async hoverSuggestion(index = 0) {
    await this.suggestionItems.nth(index).hover();
    await this.page.waitForTimeout(300);
  }

  /**
   * Wait for specific suggestion to appear
   */
  async waitForSuggestionWithText(text, timeout = 5000) {
    const suggestion = this.page.locator('.search-suggestion-item').filter({
      hasText: new RegExp(text, 'i')
    }).first();

    await suggestion.waitFor({ state: 'visible', timeout });
    return suggestion;
  }

  /**
   * Check if specific suggestion is visible
   */
  async isSuggestionVisible(text) {
    try {
      const suggestion = this.page.locator('.search-suggestion-item').filter({
        hasText: new RegExp(text, 'i')
      }).first();

      return await suggestion.isVisible();
    } catch {
      return false;
    }
  }
}
