# PHASE 1: Architecture Diagram

## Component Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        HOME PAGE                                │
│  (Home.jsx)                                                     │
└────────────────────┬────────────────────────────────────────────┘
                     │
                ┌────┴────┐
                │ SEARCH  │
                └────┬────┘
                     │
                ┌────┴──────────────────────┐
                │                           │
         ┌──────▼──────────┐      ┌────────▼───────────┐
         │  DATABASE TREK  │      │  OSM DESTINATION   │
         │  (Coorg)        │      │  (Kondapalli)      │
         │  type: 'trek'   │      │  type: 'osm'       │
         └──────┬──────────┘      └────────┬───────────┘
                │                          │
                │                    ┌─────┴─────┐
                │                    │ PASS DATA │
                │                    │ via state │
                │                    └─────┬─────┘
                │                          │
         ┌──────▼──────────┐      ┌────────▼──────────┐
         │  NAVIGATE TO    │      │  NAVIGATE TO      │
         │  /treks/{id}    │      │  /destination/    │
         │                 │      │  {slug}           │
         │                 │      │  with state       │
         └──────┬──────────┘      └────────┬──────────┘
                │                          │
                │       ┌─────────────────┘
                │       │
         ┌──────▼───────▼──────────────────────────┐
         │   CARDDETAILS.JSX                       │
         │   (Single unified component)            │
         │                                         │
         │   Detect: location.state?.destination  │
         │   ├─ Yes → source = 'osm'               │
         │   │        trek = state.destination    │
         │   │                                    │
         │   └─ No → source = 'database'          │
         │           trek = fetch from API        │
         └──────┬────────────────────────────────┘
                │
    ┌───────────┴────────────┐
    │ CONDITIONAL RENDERING  │
    │ based on source        │
    │                        │
    ├─ Hero image/gradient   │
    ├─ Operators (DB only)   │
    ├─ Trip info fields      │
    ├─ Famous/Nearby places  │
    └─ Related treks (DB)    │
```

---

## Data Flow: Database Trek

```
USER INPUT: "Coorg"
    ↓
HOME.JSX identifies type
    ├─ useEnhancedSearch returns trek from database
    ├─ suggestion.type = undefined (not 'osm')
    └─ suggestion.id = 123 (database ID)
    ↓
HANDLE SUGGESTION CLICK
    ├─ suggestion.type !== 'osm' → TRUE
    ├─ navigate('/treks/123')
    └─ NO state passed
    ↓
URL: /treks/123
    ↓
CARDDETAILS.JSX LOADS
    ├─ useParams() → id = '123'
    ├─ location.state?.destination = undefined
    ├─ Calls useEffect
    ├─ Checks location.state → NOT FOUND
    ├─ Fetches /api/treks/123/
    ├─ setSource('database')
    ├─ setTrek(database_data)
    └─ setRelatedTreks(data.related_treks)
    ↓
RENDER
    ├─ source = 'database' → show hero IMAGE
    ├─ source = 'database' → show OPERATORS section
    ├─ source = 'database' → show RELATED TREKS
    ├─ Trek info from database fields
    └─ Everything works as BEFORE
```

---

## Data Flow: OSM Destination

```
USER INPUT: "Kondapalli Reserve Forest"
    ↓
HOME.JSX identifies type
    ├─ useEnhancedSearch returns destination from OSM
    ├─ suggestion.type = 'osm'
    ├─ suggestion.id = 'osm-0'
    ├─ suggestion.name = 'Kondapalli Reserve Forest'
    ├─ suggestion.activities = [...]
    └─ suggestion.difficulty = 'Moderate'
    ↓
HANDLE SUGGESTION CLICK
    ├─ suggestion.type === 'osm' → TRUE
    ├─ slug = generateSlug('Kondapalli...')
    ├─ navigate(
    │    '/destination/kondapalli-reserve-forest',
    │    { state: { source: 'osm', destination: suggestion } }
    │  )
    └─ FULL OSM DATA PASSED via state
    ↓
URL: /destination/kondapalli-reserve-forest
    ↓
CARDDETAILS.JSX LOADS
    ├─ useParams() → id = 'kondapalli-reserve-forest'
    ├─ useLocation() → state = { source: 'osm', destination: {...} }
    ├─ Checks location.state?.destination → FOUND
    ├─ setSource('osm')
    ├─ setTrek(state.destination)
    ├─ setRelatedTreks([])
    └─ setLoading(false) → NO API CALL
    ↓
RENDER
    ├─ source = 'osm' → show GRADIENT (no image)
    ├─ source = 'osm' → HIDE OPERATORS section
    ├─ source = 'osm' → show NEARBY ATTRACTIONS (not Famous Places)
    ├─ OSM info from state fields
    ├─ Graceful fallbacks for missing data
    └─ Everything works as EXPECTED
```

---

## Route Mapping

```
OLD ARCHITECTURE:
┌─ /treks/{id} ─────────────► CardDetails ─────────► Database API
│
├─ /destination/{slug} ─────► DestinationDetails ──► Database API
│                            (SEPARATE PAGE)
│
└─ No code sharing, duplication

NEW ARCHITECTURE:
┌─ /treks/{id} ─────────────► CardDetails ─────────► Database API
│                            (SHARED PAGE)            (if needed)
│
├─ /destination/{slug} ─────► CardDetails ◄─────────┘
│                            (SHARED PAGE)            React Router
│                            Detect source           State
│                            Handle accordingly
│
└─ Single source of truth, reusable, scalable
```

---

## Source Detection Logic

```
CardDetails Component loads:

┌─────────────────────────────────────┐
│ Check: location.state?.destination  │
└────────────┬────────────────────────┘
             │
       ┌─────▼─────┐
       │ EXISTS?   │
       └─┬─────────┬─┐
         │         │ │
        YES       NO │
         │          │
         ▼          ▼
    ┌────────┐  ┌─────────────┐
    │ source │  │ Fetch from  │
    │= 'osm' │  │ API         │
    │        │  │ source=     │
    │trek=   │  │ 'database'  │
    │state   │  └─────────────┘
    └────────┘
```

---

## Conditional Rendering Tree

```
CardDetails render() {
  
  if (loading) return <LoadingSpinner />
  if (!trek) return <NotFound />
  
  return (
    <Hero>
      {source === 'osm' 
        ? <Gradient /> 
        : <Image src={trek.main_image} />}
      
      {source === 'osm' && <Badge>🗺️ OpenStreetMap</Badge>}
      
      <Title>{trek.name}</Title>
      
      {trek.duration_days && <Duration />}
      {source === 'osm' && trek.best_time_to_visit && <BestTime />}
      {source === 'database' && trek.operating_days && <Departure />}
      {trek.price_start && <Price />}
    </Hero>
    
    <Content>
      <Description 
        text={trek.description || trek.summary || placeholder} 
      />
      
      <Activities activities={trek.activities} />
      
      {source === 'database' 
        ? <FamousPlaces places={trek.famous_places} />
        : <NearbyAttractions places={trek.nearby_attractions} />}
      
      <TripInfo
        duration={trek.duration_days}
        departure={source === 'database' ? trek.operating_days : null}
        bestTime={source === 'osm' ? trek.best_time_to_visit : null}
        difficulty={trek.difficulty}
        location={trek.state}
      />
      
      {source === 'database' && (
        <>
          <Operators operators={trek.operators} />
          <RelatedTreks treks={trek.related_treks} />
        </>
      )}
    </Content>
  )
}
```

---

## Data Schema Comparison

```
DATABASE TREK                    | OSM DESTINATION
─────────────────────────────────┼─────────────────────────────────
{                                | {
  id: 123,                       |   id: "osm-0",
  name: "Coorg",                 |   name: "Kondapalli...",
  description: "...",            |   summary: "...",
  duration_days: "3 Days",       |   duration_days: undefined,
  operating_days: "Fri-Sun",     |   operating_days: undefined,
  price_start: 2500,             |   price_start: undefined,
  state: "Karnataka",            |   state: "Telangana",
  main_image: "/path/to/img",    |   main_image: undefined,
  famous_places: [...],          |   famous_places: undefined,
  activities: [...],             |   nearby_attractions: [...],
  operators: [...],              |   activities: [...],
  related_treks: [...],          |   difficulty: "Moderate",
  latitude: 12.5,                |   best_time_to_visit: "Oct-May",
  longitude: 75.7                |   lat: 16.5,
}                                |   lon: 79.5
                                 | }
                                 
MAPPING IN CARDDETAILS.JSX:
─────────────────────────────────────────────────────────────────
For both to render correctly, CardDetails maps:
  - description → description || summary || placeholder
  - famous_places → famous_places (database) || nearby_attractions (osm)
  - operating_days → operating_days (database) || best_time_to_visit (osm)
  - operators → always database only (hidden for osm)
```

---

## Navigation State Example

```javascript
// HOME.JSX - When OSM destination clicked
navigate(`/destination/kondapalli-reserve-forest`, {
  state: {
    source: 'osm',
    destination: {
      id: 'osm-0',
      name: 'Kondapalli Reserve Forest',
      summary: 'A pristine forest reserve in Telangana...',
      activities: ['Trekking', 'Nature Walk', 'Photography'],
      difficulty: 'Moderate',
      best_time_to_visit: 'Oct-May',
      nearby_attractions: ['Lake View', 'Ancient Temple'],
      travel_tips: ['Carry water', 'Wear good shoes'],
      lat: 16.5,
      lon: 79.5,
      display_name: 'Kondapalli, Telangana, India',
      category: 'natural'
    }
  }
})

// CARDDETAILS.JSX - Received as
const location = useLocation();
location.state.source          // 'osm'
location.state.destination     // Full object above
```

---

## Fallback Chain

```javascript
// How CardDetails handles missing fields:

description = trek.description || trek.summary || "Explore this destination"
operations = trek.operators?.map(...) || "Coming soon..."
places = trek.famous_places?.length > 0 ? (render) : "Coming soon..."
price = trek.price_start && <show />  // hidden if undefined
duration = trek.duration_days || (hidden)
state = trek.state && <show />         // hidden if undefined
```

---

## Performance Characteristics

```
DATABASE TREK:
  ✅ One API call: /api/treks/{id}/
  ✅ Load: ~200ms (network + processing)
  ✅ Data ready: After API response
  ✅ Render: Full data available

OSM DESTINATION:
  ✅ Zero API calls: Data passed via state
  ✅ Load: Immediate (~0ms)
  ✅ Data ready: On component mount
  ✅ Render: Full data available

BENEFIT: OSM destinations load instantly!
```

---

## Error Handling Flow

```
CardDetails Load:

  ├─ location.state?.destination exists?
  │  ├─ YES → Use it (OSM)
  │  └─ NO → Fetch from database
  │
  ├─ Fetch API?
  │  ├─ SUCCESS → Parse data
  │  ├─ ERROR → show "Trek not found"
  │  └─ (OSM bypass this entirely)
  │
  ├─ Fields missing in data?
  │  ├─ Use fallback text
  │  ├─ Use placeholder
  │  └─ or hide section
  │
  └─ No crashes, graceful degradation
```

---

This architecture is:
- ✅ **Scalable**: Easy to add new data sources
- ✅ **Maintainable**: Single component, clear logic
- ✅ **Performant**: No unnecessary API calls for OSM
- ✅ **Resilient**: Graceful fallbacks for missing data
- ✅ **Future-proof**: Ready for Phase 2 enrichment
