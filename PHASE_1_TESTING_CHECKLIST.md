# PHASE 1: Testing Checklist

## LOCAL TESTING INSTRUCTIONS

### Prerequisites
- Backend running on `http://127.0.0.1:8000`
- Frontend dev server running
- Recent npm build completed

---

## TEST CASES

### ✅ TEST 1: Database Trek Search (Existing Behavior - Should Work Exactly Same)

**Steps:**
1. Open home page
2. Search for "Coorg" in hero search bar
3. Click first suggestion
4. Verify navigation to `/treks/[id]`

**Expected Results:**
- Page loads with trek details
- Hero image displays
- "Trusted Operators" section visible
- "Related Treks" section visible
- Trip Info shows: Duration, Departure, State
- Activities section shows
- Famous Places section shows
- Price displays correctly
- **Console**: Should NOT show "📍 Loading OSM destination"

**Status**: [ ] Pass [ ] Fail

---

### ✅ TEST 2: OpenStreetMap Destination Search (New Behavior)

**Steps:**
1. Open home page
2. Search for "Kondapalli Reserve Forest" in hero search bar
3. Click result from OSM suggestions (marked 📍)
4. Verify navigation to `/destination/kondapalli-reserve-forest`

**Expected Results:**
- Page loads with destination details
- Hero uses gradient background (no image)
- OSM badge visible in hero ("🗺️ OpenStreetMap")
- "Trusted Operators" section is HIDDEN
- "Nearby Attractions" section visible (not "Famous Places")
- Trip Info shows: Difficulty, Best Time, Location (not Departure)
- No crash, graceful fallbacks for missing data
- **Console**: Should show "📍 Loading OSM destination: {...}"

**Status**: [ ] Pass [ ] Fail

---

### ✅ TEST 3: Map Marker Click - Database Trek

**Steps:**
1. Search "Coorg" in hero search
2. Wait for map to load
3. Click gold mountain marker (🏔️) on map
4. Verify navigation to `/treks/[id]`

**Expected Results:**
- CardDetails page loads
- Shows database trek data (Coorg)
- source = 'database' in state

**Status**: [ ] Pass [ ] Fail

---

### ✅ TEST 4: Map Marker Click - OSM Destination

**Steps:**
1. Search "Kondapalli Reserve Forest" in hero search
2. Wait for map to load
3. Click blue location marker (📍) on map
4. Verify navigation to `/destination/kondapalli-reserve-forest`

**Expected Results:**
- CardDetails page loads
- Shows OSM destination data
- Gradient hero (no image)
- source = 'osm' in state

**Status**: [ ] Pass [ ] Fail

---

### ✅ TEST 5: No CSS or Styling Changes

**Steps:**
1. Search any database trek
2. Check styling (colors, fonts, layout)
3. Search any OSM destination
4. Compare styling

**Expected Results:**
- CardDetails page maintains identical styling
- Only content changes based on source
- No layout shifts
- Same hero height, same card styling
- Yellow/gold theme consistent

**Status**: [ ] Pass [ ] Fail

---

### ✅ TEST 6: Fallback Data (Missing Fields)

**Steps:**
1. Search an OSM destination
2. Navigate to details
3. Check all sections render

**Expected Results:**
- Page doesn't crash
- "Coming soon..." shows for empty activities
- Price shows only if available
- State shows only if available
- All sections render gracefully

**Status**: [ ] Pass [ ] Fail

---

### ✅ TEST 7: Related Treks - Only for Database

**Steps:**
1. Search database trek "Coorg"
2. Navigate to details
3. Scroll to "Related Treks" section
4. Verify section is visible with related treks
5. Go back, search OSM destination
6. Scroll to "Related Treks" section
7. Verify section is NOT visible

**Expected Results:**
- Database trek: "Related Treks" section visible with data
- OSM destination: "Related Treks" section does NOT appear
- No console errors

**Status**: [ ] Pass [ ] Fail

---

### ✅ TEST 8: URL Parameters Work

**Steps:**
1. Manually navigate to `/destination/coorg` (if such a slug exists)
2. Verify CardDetails loads with appropriate data

**Expected Results:**
- If data exists in state: Load from state
- If no state: Try to treat as trek ID and fetch from database
- Page either loads correctly or shows "Trek not found"
- No crashes

**Status**: [ ] Pass [ ] Fail

---

### ✅ TEST 9: Browser Back Button

**Steps:**
1. Search and navigate to database trek
2. Click browser back button
3. Should return to home
4. Search and navigate to OSM destination
5. Click browser back button
6. Should return to home

**Expected Results:**
- Navigation history preserved
- Back button works correctly
- Returns to appropriate previous page

**Status**: [ ] Pass [ ] Fail

---

### ✅ TEST 10: Search Dropdown Consistency

**Steps:**
1. Type "coorg" in search
2. See suggestion with 🏔️ icon (database trek)
3. Type "forest" in search
4. See suggestion with 📍 icon (OSM destination)

**Expected Results:**
- Database treks show 🏔️ icon
- OSM destinations show 📍 icon
- Click either navigates to correct page
- Both use CardDetails page

**Status**: [ ] Pass [ ] Fail

---

## BUILD VERIFICATION

```bash
npm run build
```

**Expected Result:**
- ✅ Build completes successfully
- ✅ No errors
- ✅ Warnings are acceptable (Leaflet images, chunk size)

**Status**: [ ] Pass [ ] Fail

---

## CONSOLE CHECK

After each test, verify console:
- [ ] No error messages
- [ ] No "Failed to fetch" errors
- [ ] Appropriate logging visible (`📍 Loading OSM destination` for OSM routes)

---

## SUMMARY

**Total Tests**: 10  
**Must Pass**: All  
**Critical Tests**: 1, 2, 3, 4, 5

**Overall Status**: [ ] READY FOR PHASE 2 [ ] NEEDS FIXES

---

## NOTES FOR DEVELOPERS

If a test fails, check:
1. **Navigation issue**: Check URL in address bar
2. **Styling issue**: Check CardDetails.jsx for conditional styles
3. **Data issue**: Open DevTools → Console to see loading logs
4. **Source detection issue**: Check if `location.state?.destination` is being passed
5. **Backend issue**: Verify Django server is running on localhost:8000

All data flows through the same CardDetails component, so issues are localized to:
- Navigation state passing (Home.jsx)
- Data detection logic (CardDetails.jsx)
- Conditional rendering (CardDetails.jsx)
