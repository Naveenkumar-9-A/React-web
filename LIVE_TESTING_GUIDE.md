# 🚀 LIVE TESTING GUIDE - AORBO TREKS

**Date**: June 26, 2026  
**Status**: ✅ **SERVERS RUNNING & READY TO TEST**

---

## 📱 SERVER STATUS

### Backend (Django)
```
Status: ✅ RUNNING
URL: http://127.0.0.1:8000/
Port: 8000
Command: py manage.py runserver
```

### Frontend (React)
```
Status: ✅ RUNNING
URL: http://localhost:5174/
Port: 5174
Command: npm run dev
Note: Port 5173 was in use, automatically using 5174
```

---

## 🧪 TESTING CHECKLIST

### TEST 1: Phase 1 - Trek Search & Routing

#### Test 1a: Search Existing Trek (Database)
```
Steps:
1. Open: http://localhost:5174/
2. Type: "Coorg"
3. Press: Enter or click search icon
4. Expected: 
   - Dropdown shows "Coorg" with 🏔️ Trek icon
   - Click result
   - Should navigate to: /treks/coorg

Status: [ ] Not tested yet
Result: _______________
```

#### Test 1b: Search New Destination (OpenStreetMap)
```
Steps:
1. Open: http://localhost:5174/
2. Type: "Talakona Falls"
3. Press: Enter or click search icon
4. Expected:
   - Dropdown shows "Talakona Falls" with 📍 Destination icon
   - Click result
   - Should navigate to: /destination/talakona-falls

Status: [ ] Not tested yet
Result: _______________
```

#### Test 1c: Verify Pagination Still Works
```
Steps:
1. Scroll down on homepage
2. Look for Featured Destinations section
3. Scroll further to pagination
4. Expected: Previous/Next buttons functional

Status: [ ] Not tested yet
Result: _______________
```

#### Test 1d: Verify Map Still Works
```
Steps:
1. Check home page for map
2. Expected: Map displays with markers
3. Check console (F12) for errors

Status: [ ] Not tested yet
Result: _______________
```

---

### TEST 2: Phase 2 - Destination Details Page

#### Test 2a: Load Destination Details
```
Steps:
1. From Phase 1 Test 1b result page
2. URL should be: /destination/talakona-falls
3. Expected: Page loads with all sections

Verify Sections Present:
  [ ] Hero Banner
  [ ] Destination Name
  [ ] State/Category badges
  [ ] Price display
  [ ] Book Now button
  [ ] About Destination
  [ ] Activities list
  [ ] Trip Information
  [ ] Best Time to Visit
  [ ] Difficulty Level
  [ ] Nearby Attractions
  [ ] Location Details
  [ ] Price Rules

Status: [ ] Not tested yet
Result: _______________
```

#### Test 2b: Verify Design (Compare with Trek Details)
```
Steps:
1. Open Trek Details: http://localhost:5174/treks/coorg
2. Take note of colors, layout, spacing
3. Open Destination Details: http://localhost:5174/destination/talakona-falls
4. Compare visually

Expected: Design should be IDENTICAL
  [ ] Colors match (yellow/green)
  [ ] Layout same (2fr + 1fr grid)
  [ ] Typography same
  [ ] Spacing same (1.25rem gaps)
  [ ] Cards same styling
  [ ] Buttons same appearance

Status: [ ] Not tested yet
Result: _______________
```

#### Test 2c: Verify Pricing Logic
```
Steps:
1. Check destination difficulty level
2. Verify price calculation

Expected Pricing:
  Easy: ₹1000
  Moderate: ₹1500
  Difficult: ₹2500
  Very Difficult: ₹4000

Status: [ ] Not tested yet
Result: _______________
```

#### Test 2d: Test Back Button
```
Steps:
1. On Destination Details page
2. Click back button (top-left 25%)
3. Expected: Navigate to previous page

Status: [ ] Not tested yet
Result: _______________
```

---

### TEST 3: Phase 3 - AI Enrichment

#### Test 3a: Verify Enriched Content Display
```
Steps:
1. On Destination Details page (/destination/talakona-falls)
2. Scroll to view all sections
3. Expected: See enriched content fields:
  [ ] Summary/description
  [ ] Activities (5+ items)
  [ ] Travel tips (4+ items)
  [ ] Why visit (reasons)
  [ ] Best season
  [ ] Estimated duration
  [ ] Packing suggestions
  [ ] Nearby attractions
  [ ] Accommodation
  [ ] Local cuisine

Status: [ ] Not tested yet
Result: _______________
```

#### Test 3b: Test Cache (Fallback Enrichment)
```
Notes: 
- If OpenAI API key not configured: Fallback mode
- Fallback provides rule-based enrichment (still complete)
- Results will be generic but accurate

Steps:
1. Search new destination: "Nagalapuram Falls"
2. Click to open destination details
3. Observe enriched content
4. Expected: Content displayed (either AI or fallback)

Status: [ ] Not tested yet
Result: _______________
```

#### Test 3c: Check Console for Errors
```
Steps:
1. Press: F12 to open browser console
2. Tab: Console
3. Expected: No error messages
4. Look for: Green checkmarks in network tab

Status: [ ] Not tested yet
Result: _______________
```

---

### TEST 4: Phase 4 - Nearby Discovery

#### Test 4a: Display Nearby Trekking Places
```
Steps:
1. On Destination Details page
2. Scroll down to bottom
3. Look for "Nearby Trekking Places" section
4. Expected:
  [ ] Section visible
  [ ] Shows 3-6 nearby destinations
  [ ] Each shows distance (e.g., "12.5 km away")
  [ ] Sorted by distance (nearest first)
  [ ] Destinations are different from current

Status: [ ] Not tested yet
Result: _______________
```

#### Test 4b: Test Different Categories
```
If implemented with categories, test each:

Search and open different destination types:
  [ ] Weekend Getaway → See nearby weekend getaways
  [ ] Beach destination → See nearby beach trails
  [ ] Spiritual place → See nearby spiritual places
  [ ] Nature destination → See nearby nature escapes

Status: [ ] Not tested yet
Result: _______________
```

#### Test 4c: Click Nearby Destination
```
Steps:
1. On Destination Details page
2. Scroll to nearby section
3. Click any nearby destination
4. Expected:
  [ ] Navigate to destination details page
  [ ] URL changes to /destination/{nearby-slug}
  [ ] Page loads with nearby destination info
  [ ] Can explore infinitely

Status: [ ] Not tested yet
Result: _______________
```

#### Test 4d: Verify Distance Sorting
```
Steps:
1. On Destination Details page
2. Scroll to nearby section
3. Note the distances listed
4. Expected: Distances in ascending order
  Example: 5km, 12km, 18km, 25km

Status: [ ] Not tested yet
Result: _______________
```

---

### TEST 5: Mobile Responsiveness

#### Test 5a: Mobile View
```
Steps:
1. Press: F12 to open developer tools
2. Click: Device toolbar icon
3. Select: iPhone 12 or similar
4. Test on mobile size

Expected:
  [ ] Search bar responsive
  [ ] Destination cards stack vertically
  [ ] Back button accessible
  [ ] Book Now button clickable
  [ ] All content readable
  [ ] No horizontal scrolling

Status: [ ] Not tested yet
Result: _______________
```

#### Test 5b: Tablet View
```
Steps:
1. In developer tools
2. Select: iPad or similar
3. Verify layout

Expected: Proper tablet layout

Status: [ ] Not tested yet
Result: _______________
```

---

### TEST 6: Error Handling

#### Test 6a: Invalid Search
```
Steps:
1. Search: "xyzabc12345" (nonsense)
2. Expected: 
  [ ] No results or error message
  [ ] Page doesn't crash
  [ ] Can search again

Status: [ ] Not tested yet
Result: _______________
```

#### Test 6b: Missing Parameters
```
Steps:
1. Try accessing: http://localhost:5174/destination/
2. Expected: Error page or redirect

Status: [ ] Not tested yet
Result: _______________
```

#### Test 6c: Console Errors
```
Steps:
1. Press: F12 throughout testing
2. Tab: Console
3. Expected: No red error messages
4. Note any warnings (should be minimal)

Status: [ ] Not tested yet
Result: _______________
```

---

## 📋 QUICK TEST SUMMARY

### All Tests Passing? ✅
- [ ] Phase 1: Trek Search ✅
- [ ] Phase 2: Destination Details ✅
- [ ] Phase 3: AI Enrichment ✅
- [ ] Phase 4: Nearby Discovery ✅
- [ ] Mobile Responsiveness ✅
- [ ] Error Handling ✅

### Overall Status
If all checkboxes are checked: ✅ **READY FOR PRODUCTION**

---

## 🐛 TROUBLESHOOTING

### Issue: Backend not responding (http://127.0.0.1:8000/)
```
Solution:
1. Check if Django server is running
2. Look for: "Starting development server at http://127.0.0.1:8000/"
3. If not running, restart: py manage.py runserver
```

### Issue: Frontend showing blank page
```
Solution:
1. Check if React server is running
2. Look for: "VITE ready in XXX ms"
3. If not running, restart: npm run dev
4. Clear browser cache: Ctrl+Shift+Del
```

### Issue: API calls failing
```
Solution:
1. Check backend console for errors
2. Verify API endpoint exists
3. Check CORS configuration
4. Verify database connection
```

### Issue: Enriched content not showing
```
Solution:
1. If OpenAI key not set: Fallback enrichment will show
2. Check backend logs for API errors
3. Verify openai package installed: py -m pip list | grep openai
4. Check .env file for API key
```

### Issue: Nearby destinations not showing
```
Solution:
1. Verify destination has coordinates
2. Check if nearby destinations exist in database
3. Review backend logs for errors
4. Verify API endpoint is accessible
```

---

## 📊 TESTING RESULTS TEMPLATE

```
═════════════════════════════════════════════════════════════════
                    TESTING RESULTS
═════════════════════════════════════════════════════════════════

Date Tested: _______________
Tester: _______________

PHASE 1: Trek Search & Routing
  ✅ Search existing trek: PASS / FAIL
  ✅ Search new destination: PASS / FAIL
  ✅ Pagination works: PASS / FAIL
  ✅ Map displays: PASS / FAIL

PHASE 2: Destination Details
  ✅ Page loads: PASS / FAIL
  ✅ All sections display: PASS / FAIL
  ✅ Design identical: PASS / FAIL
  ✅ Pricing correct: PASS / FAIL
  ✅ Back button works: PASS / FAIL

PHASE 3: AI Enrichment
  ✅ Content displayed: PASS / FAIL
  ✅ All fields shown: PASS / FAIL
  ✅ No errors: PASS / FAIL

PHASE 4: Nearby Discovery
  ✅ Section displays: PASS / FAIL
  ✅ Distance sorted: PASS / FAIL
  ✅ Can click nearby: PASS / FAIL
  ✅ Categories work: PASS / FAIL

MOBILE:
  ✅ Mobile responsive: PASS / FAIL
  ✅ Tablet responsive: PASS / FAIL

ERRORS:
  ✅ No console errors: PASS / FAIL
  ✅ Error handling works: PASS / FAIL

═════════════════════════════════════════════════════════════════
OVERALL STATUS: [ ] READY FOR PRODUCTION
═════════════════════════════════════════════════════════════════
```

---

## 🎯 NEXT STEPS AFTER TESTING

### If All Tests Pass ✅
1. Review documentation one more time
2. Check deployment checklist
3. Prepare for production deployment
4. Consider adding OpenAI API key (optional, enhances features)

### If Any Tests Fail ❌
1. Document the issue
2. Check error messages
3. Review backend logs
4. Review frontend console
5. Troubleshoot using guide above

---

## 📞 HELPFUL LINKS

- **Frontend**: http://localhost:5174/
- **Backend API**: http://127.0.0.1:8000/api/
- **Django Admin**: http://127.0.0.1:8000/admin/
- **Browser DevTools**: Press F12
- **Network Tab**: Press F12 → Network tab
- **Console**: Press F12 → Console tab

---

## ✨ PRO TESTING TIPS

1. **Open DevTools Early**: Press F12 at start to catch errors
2. **Test on Multiple Browsers**: Chrome, Firefox, Edge
3. **Clear Cache**: Ctrl+Shift+Del between major tests
4. **Check Network Tab**: Watch API calls in Network tab
5. **Test Slowly**: Don't rush through tests
6. **Document Issues**: Note any problems with screenshots
7. **Test Mobile Last**: After desktop is working

---

**Ready to test? Open http://localhost:5174/ in your browser and start with TEST 1! 🚀**

---

*All servers running. All systems ready. Begin testing now.*

**Status**: ✅ LIVE AND READY

**Servers**:
- Backend: http://127.0.0.1:8000/ ✅
- Frontend: http://localhost:5174/ ✅

**Begin testing!**
