# QUICK TEST GUIDE - Search Implementation

## 🚀 Start Development Environment

### Backend Server
```bash
cd c:\Users\gumma\React-web\aorboweb
py manage.py runserver
```
Expected: Django running on http://127.0.0.1:8000

### Frontend Dev Server (New Terminal)
```bash
cd c:\Users\gumma\React-web\aorbo-frontend
npm run dev
```
Expected: Vite dev server running on http://localhost:5173

---

## 🧪 TEST SCENARIOS

### ✅ TEST 1: Search for Existing Trek
**Steps**:
1. Open home page
2. Type "Kerala" in hero search box
3. Wait for dropdown to appear
4. Click on "🏔️ Kerala" suggestion (or press Enter)

**Expected Result**:
- ✓ Dropdown shows: 🏔️ Kerala (with state info below)
- ✓ Navigates to `/treks/kerala`
- ✓ CardDetails page loads with trek information
- ✓ Shows image, price, duration, activities, itinerary

---

### ✅ TEST 2: Search for Another Existing Trek
**Steps**:
1. Go back to home
2. Type "Coorg" in hero search box
3. Click on suggestion (or press Enter)

**Expected Result**:
- ✓ Navigates to `/treks/coorg`
- ✓ CardDetails page loads correctly

**Treks to Test**:
- Coorg
- Araku Valley
- Chikmagalur
- Dandeli
- Gokarna

---

### ✅ TEST 3: Search for Non-Database Destination (OSM)
**Steps**:
1. Go to home
2. Type "Talakona Falls" in hero search box
3. Wait for dropdown
4. Click on "📍 Talakona Falls" suggestion

**Expected Result**:
- ✓ Dropdown shows: 📍 Talakona Falls (OSM result with location info)
- ✓ Navigates to `/destination/talakona-falls`
- ✓ DestinationDetails page loads with:
  - Yellow theme background
  - Hero section with destination name
  - About This Destination section
  - Activities section (e.g., Trekking, Photography, Water Activities)
  - Travel Tips section
  - Nearby Attractions section
  - Estimated Price: ₹1500+
  - Trip Info card with difficulty, best time
  - Accommodation info
  - Local Cuisine info

---

### ✅ TEST 4: Search for Another OSM Destination
**Steps**:
1. Go back to home
2. Type one of these: 
   - "Nagalapuram Falls"
   - "Sundarakanda"
   - "Bheemini Falls"
3. Click suggestion from dropdown

**Expected Result**:
- ✓ Navigates to `/destination/[slug]`
- ✓ DestinationDetails page shows enriched information

---

### ✅ TEST 5: Map Display During Search
**Steps**:
1. Type "Kerala" in search box
2. Check if map appears showing trek location

**Expected Result**:
- ✓ Map displays with markers for trek
- ✓ Status message: "Found 1 trek package in 'Kerala'"

**Steps for OSM**:
1. Type "Talakona Falls"
2. Check map

**Expected Result**:
- ✓ Map displays with marker for location
- ✓ Status message: "Showing destination results from OpenStreetMap"

---

### ✅ TEST 6: Dropdown Formatting
**Steps**:
1. Type "K" in search
2. Wait for dropdown suggestions

**Expected Result**:
- ✓ Trek results show: 🏔️ [Trek Name]
- ✓ Secondary text shows state
- ✓ OSM results show: 📍 [Location Name]
- ✓ Secondary text shows full address from OSM

---

### ✅ TEST 7: Price Generation
**Navigation**:
1. Search for various OSM destinations
2. Check destination details page
3. Look at price badge

**Expected Result**:
- ✓ Easy destinations: ₹1,000+
- ✓ Moderate destinations: ₹1,500+
- ✓ Difficult destinations: ₹2,500+
- ✓ Very Difficult destinations: ₹4,000+

---

### ✅ TEST 8: No Results
**Steps**:
1. Type "XYZ NonExistent Location"
2. Wait for search results

**Expected Result**:
- ✓ Message appears: "No results found for 'XYZ...'"
- ✓ No dropdown suggestions
- ✓ No errors in console

---

### ✅ TEST 9: Navigation Between Pages
**Steps**:
1. Search and navigate to DestinationDetails page
2. Click "← Back" button

**Expected Result**:
- ✓ Returns to previous page (home)

---

### ✅ TEST 10: Featured Destinations Still Working
**Steps**:
1. Refresh home page
2. Scroll down to "Featured Destinations" section
3. Click on any trek card

**Expected Result**:
- ✓ Navigates to `/treks/[id]`
- ✓ CardDetails page loads (existing functionality preserved)
- ✓ Pagination still works (12 cards per page)

---

## 🔍 DEBUGGING CHECKLIST

### If Search Doesn't Work
- [ ] Check backend server is running (`http://127.0.0.1:8000/api/treks/search/`)
- [ ] Check browser console for errors
- [ ] Verify BACKEND_URL in Home.jsx is correct
- [ ] Check network tab to see if API calls are made

### If Dropdown Doesn't Show
- [ ] Type at least 2 characters
- [ ] Wait for suggestions to load
- [ ] Check console for network errors
- [ ] Try refreshing page

### If DestinationDetails Page Shows Error
- [ ] Check if slug is properly formatted (e.g., talakona-falls)
- [ ] Verify backend `/api/enrich-destination/` endpoint is accessible
- [ ] Check if .env has OpenAI API key configured (for AI enrichment)
- [ ] Page should still load with fallback data even if AI fails

### If Price is Not Showing
- [ ] Check getEstimatedPrice function in DestinationDetails.jsx
- [ ] Verify difficulty value is one of: easy, moderate, difficult, very difficult
- [ ] Check console for any JavaScript errors

---

## 📊 EXPECTED BEHAVIOR SUMMARY

| Scenario | Input | Expected | Result |
|----------|-------|----------|--------|
| Trek Search | "Kerala" | Navigate to /treks/kerala | ✓ |
| Trek Search | "Coorg" | Navigate to /treks/coorg | ✓ |
| OSM Search | "Talakona Falls" | Navigate to /destination/talakona-falls | ✓ |
| OSM Search | "Nagalapuram Falls" | Navigate to /destination/nagalapuram-falls | ✓ |
| Empty Search | "" | No dropdown, no navigation | ✓ |
| No Results | "XYZ" | Error message shown | ✓ |
| Dropdown Click | Any result | Navigation triggered | ✓ |
| Back Button | Any details page | Return to previous page | ✓ |

---

## 🎯 SUCCESS CRITERIA

✓ Search "Kerala" → Trek Details Page
✓ Search "Talakona Falls" → Destination Details Page (NEW)
✓ Search "Coorg" → Trek Details Page
✓ Search "Nagalapuram Falls" → Destination Details Page (NEW)
✓ Dropdown shows different icons (🏔️ trek, 📍 OSM)
✓ DestinationDetails displays enriched data
✓ Price generation working correctly
✓ Back button navigation working
✓ Featured destinations pagination intact
✓ No existing functionality broken

---

## 🐛 Common Issues & Solutions

### Issue: Build errors
**Solution**: 
```bash
cd c:\Users\gumma\React-web\aorbo-frontend
rm -r node_modules
npm install
npm run build
```

### Issue: Port 8000 already in use
**Solution**:
```bash
py manage.py runserver 8001  # Use different port
# Then update BACKEND_URL in Home.jsx to http://127.0.0.1:8001
```

### Issue: OpenAI enrichment not working
**Solution**:
- Check .env has OPENAI_API_KEY configured
- Fallback enrichment will still work
- Check console for errors

### Issue: Map not displaying
**Solution**:
- This is expected only when searching
- Map should appear when typing 2+ characters
- Leaflet library is included (check network tab)

---

## 📝 TESTING CHECKLIST

- [ ] Backend running on http://127.0.0.1:8000
- [ ] Frontend running on http://localhost:5173
- [ ] Can search existing trek and navigate to details
- [ ] Can search OSM destination and navigate to new details page
- [ ] Dropdown shows proper formatting with icons
- [ ] Destination Details page displays all sections
- [ ] Price badge shows correct value based on difficulty
- [ ] Back button works on destination details page
- [ ] Featured destinations section still displays trek cards
- [ ] Pagination still works on home page (12 cards)
- [ ] No JavaScript errors in console

**Overall Status**: Ready for Testing ✓
