# 🧪 TESTING GUIDE - Duplicate Search Request Fix

## Overview
After removing duplicate search logic from Home.jsx, test the following scenarios to verify the fix works correctly.

---

## 🟢 TEST 1: Single Search Request

### Setup
1. Open browser DevTools → Network tab
2. Clear network history
3. Go to Home page
4. Start typing in search box

### Test Steps
1. Type "Coorg" (one character at a time)
2. Stop typing
3. Watch Network tab

### Expected Result
- ✅ No API calls until 600ms after you stop typing
- ✅ ONLY ONE `/api/search/intelligent/` request appears
- ✅ NO Nominatim.openstreetmap.org calls from frontend
- ✅ NO multiple calls to `/api/treks/search/`

### Failure Indicators
- ❌ Multiple requests in quick succession
- ❌ Direct Nominatim API calls from browser (https://nominatim.openstreetmap.org/)
- ❌ Multiple calls per keystroke

---

## 🟢 TEST 2: Debounce Timer (600ms)

### Setup
1. Open DevTools → Network tab
2. Clear history
3. Go to Home page

### Test Steps
1. Type "M" → wait
2. Type "M" + "u" → wait
3. Type "M" + "u" + "n" → wait
4. Type "M" + "u" + "n" + "n" → wait
5. Type "M" + "u" + "n" + "n" + "a" → wait
6. **Stop typing for 600ms**
7. Observe Network tab

### Expected Result
- ✅ Search box shows text immediately
- ✅ NO API calls until 600ms after you stop typing
- ✅ Exactly ONE API request appears
- ✅ Status code 200 with results

### Failure Indicators
- ❌ API calls appearing on every keystroke
- ❌ Multiple API requests for same query
- ❌ API calls before 600ms delay

---

## 🟢 TEST 3: Trek Database Search (No OSM)

### Setup
1. Open DevTools → Network tab
2. Clear history

### Test Steps
1. Search for "Coorg" (exists in database)
2. Wait for results

### Expected Result
- ✅ ONE request to `/api/search/intelligent/?q=Coorg`
- ✅ Trek cards appear showing "Coorg" treks
- ✅ "Found X trek packages in 'Coorg'" message appears
- ✅ Map shows trek locations
- ✅ NO Nominatim calls in Network tab
- ✅ Response time < 1 second

### Failure Indicators
- ❌ Multiple API requests
- ❌ Nominatim.openstreetmap.org calls
- ❌ "No results found" for Coorg (should find treks)

---

## 🟢 TEST 4: OpenStreetMap Search (Non-Trek)

### Setup
1. Open DevTools → Network tab
2. Clear history

### Test Steps
1. Search for "Bengaluru city center" (not in trek database)
2. Wait for results

### Expected Result
- ✅ ONE request to `/api/search/intelligent/?q=Bengaluru city center`
- ✅ Backend makes ONE call to Nominatim
- ✅ Destination cards appear from OSM
- ✅ Map shows OSM locations
- ✅ Message: "Showing destination results from OpenStreetMap"
- ✅ NO multiple Nominatim calls

### Failure Indicators
- ❌ Multiple requests
- ❌ Multiple Nominatim calls
- ❌ Direct browser calls to Nominatim (should only be backend)

---

## 🟢 TEST 5: Request Cancellation

### Setup
1. Open DevTools → Network tab
2. Clear history

### Test Steps
1. Start typing "M"
2. Wait 200ms
3. Type "u" (now "Mu")
4. Wait 200ms
5. Type "n" (now "Mun")
6. Wait 200ms
7. Type "n" (now "Munn")
8. Wait 200ms
9. Type "a" (now "Munna")
10. Wait 600ms for request to complete

### Expected Result
- ✅ Only FINAL request for "Munna" is sent
- ✅ Earlier pending requests are cancelled
- ✅ Network tab shows 1 request, not 5
- ✅ Console shows "Cancelling previous request" messages

### Failure Indicators
- ❌ Multiple requests appear in Network tab
- ❌ Multiple results shown for partial queries
- ❌ Old search results override new ones

---

## 🟢 TEST 6: Short Query Handling

### Setup
1. Open DevTools → Network tab
2. Clear history

### Test Steps
1. Type "Co" (2 characters) → wait 1 second
2. Nothing should happen (no API calls)
3. Type "o" to make "Coo" → wait 1 second
4. Nothing should happen (still no API calls, minimum is 4 chars)
5. Type "r" to make "Coorg" → wait 600ms
6. NOW search should fire

### Expected Result
- ✅ NO API calls for queries < 4 characters
- ✅ Query length indicator or validation
- ✅ First API call only when query reaches 4+ characters

### Failure Indicators
- ❌ API calls for 2-3 character queries
- ❌ Excessive requests for short inputs

---

## 🟢 TEST 7: Error Handling

### Setup
1. Simulate poor network (DevTools → Network → Throttle)

### Test Steps
1. Set network to "Slow 3G" or offline
2. Search for "Munnar"
3. Wait for timeout

### Expected Result
- ✅ No crash or "TypeError: x.map is not a function"
- ✅ UI shows "No trekking destinations found" gracefully
- ✅ No red error boxes or console errors
- ✅ Search box remains functional

### Failure Indicators
- ❌ Runtime errors in console
- ❌ White screen or app crash
- ❌ Uncaught Promise rejection

---

## 🟢 TEST 8: Caching (15 minutes)

### Setup
1. Open DevTools → Network tab
2. Perform a search for "Coorg"
3. Note the response

### Test Steps
1. Clear Network tab history
2. Search for "Coorg" again (same query)
3. Observe response

### Expected Result
- ✅ Second request shows `"from_cache": true` in response
- ✅ Response time is instant (< 100ms)
- ✅ Same results as first search
- ✅ No additional Nominatim calls

### Failure Indicators
- ❌ `"from_cache": false` on repeat searches
- ❌ Multiple Nominatim calls for same query

---

## 🟢 TEST 9: Map Display

### Setup
1. Search for "Coorg" (exists in database)

### Test Steps
1. Observe map below search box
2. Click on a marker on the map
3. Verify trek details page loads

### Expected Result
- ✅ Map appears with trek markers
- ✅ Markers have correct locations
- ✅ Clicking marker navigates to trek details
- ✅ No console errors
- ✅ Map doesn't show duplicate markers

### Failure Indicators
- ❌ Map doesn't appear
- ❌ Markers in wrong locations
- ❌ Duplicate markers for same trek

---

## 🟢 TEST 10: Suggestion Dropdown

### Setup
1. Type "Coorg" in search box

### Test Steps
1. Observe suggestion dropdown
2. Click on "🏔️ Coorg" suggestion
3. Verify navigation to trek details

### Expected Result
- ✅ Dropdown shows up to 8 suggestions
- ✅ Trek suggestions appear first
- ✅ OSM suggestions appear below (if any)
- ✅ Clicking navigates correctly

### Failure Indicators
- ❌ No suggestions shown
- ❌ Crash when clicking suggestion
- ❌ Navigation doesn't work

---

## 📊 Network Tab Analysis

When all tests pass, Network tab should show:

### For Trek Search (e.g., "Coorg"):
```
GET /api/search/intelligent/?q=Coorg
Status: 200
Response: {
  "results": [...trek results...],
  "from_cache": false,
  "message": "..."
}
Size: ~5-20 KB
Time: 200-1000ms
```

### For OSM Search (e.g., "Paris"):
```
GET /api/search/intelligent/?q=Paris
Status: 200
Response: {
  "results": [...OSM results...],
  "from_cache": false,
  "message": "..."
}
Size: ~5-20 KB
Time: 500-2000ms (includes Nominatim call)
Backend makes ONE call to:
  GET https://nominatim.openstreetmap.org/search...
```

### What Should NOT Appear:
- ❌ GET /api/treks/search/ (removed from frontend)
- ❌ GET https://nominatim.openstreetmap.org/ (no direct frontend calls)
- ❌ Multiple /api/search/intelligent/ for same query (within 15 minutes)
- ❌ 429 Too Many Requests errors

---

## 🚀 Automated Test Results

### Jest Tests (if running)
```bash
npm run test -- --run
```

Expected: All tests pass, specifically:
- Search debounce tests ✅
- Request cancellation tests ✅
- Defensive array checks ✅
- Error handling ✅

### Build Status
```bash
npm run build
```

Expected:
```
✓ built in X.XXs
- 0 errors
- 0 warnings
- 1805 modules transformed
```

---

## 📝 Troubleshooting

### Problem: "HTTP 429 Too Many Requests"
- **Cause**: Duplicate requests still happening
- **Fix**: Check Network tab - should only see ONE request per search
- **Check**: Lines 103-126 in Home.jsx (should only have one `handleSearch(val)` call)

### Problem: "No results found" for Coorg
- **Cause**: Backend not returning results or search not reaching backend
- **Fix**: Check browser DevTools - verify `/api/search/intelligent/` request is being made
- **Check**: Backend logs - verify search is reaching Django

### Problem: "TypeError: x.map is not a function"
- **Cause**: Response not array (should be fixed by previous task)
- **Fix**: Check defensive Array.isArray() checks are in place
- **Check**: Console logs - look for "DEBUG enrichDestinationData" messages

### Problem: Search works first time, fails after
- **Cause**: Could be caching, AbortController, or state management
- **Fix**: Clear browser cache, check `lastSearchQueryRef`
- **Check**: Console logs - look for duplicate detection messages

---

## ✅ Success Criteria

All of these must be true:

1. ✅ Single `/api/search/intelligent/` request per search
2. ✅ 600ms debounce working
3. ✅ No direct Nominatim calls from browser
4. ✅ No HTTP 429 errors
5. ✅ No runtime "map is not a function" errors
6. ✅ Treks found quickly (< 1 second)
7. ✅ OSM results work correctly
8. ✅ Caching working (same query = instant)
9. ✅ Request cancellation working (new search cancels old)
10. ✅ Build passes with 0 errors

---

## 📞 If Tests Fail

1. **Check Network tab** - Are you seeing duplicate requests?
2. **Check browser console** - Any JavaScript errors?
3. **Check backend logs** - Are requests reaching Django?
4. **Check browser cache** - Try Hard Refresh (Ctrl+Shift+R)
5. **Check file changes** - Verify Home.jsx was saved correctly

---

**Last Updated**: After duplicate search fix
**Status**: Ready for testing ✅
