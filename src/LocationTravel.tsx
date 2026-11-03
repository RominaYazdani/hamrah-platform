
import { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
  useMap,
} from 'react-leaflet'
import { divIcon } from 'leaflet'
import type { TravelDetails } from './BookingConfirmation'
import 'leaflet/dist/leaflet.css'
import './LocationTravel.css'

type Coordinates = {
  lat: number
  lng: number
}

type LocationType = 'pickup' | 'destination'

type LocationTravelProps = {
  onBack: () => void
  onContinue?: (travel: TravelDetails) => void
}

type SearchResult = {
  place_id: number
  display_name: string
  lat: string
  lon: string
  name?: string
  address?: {
    city?: string
    town?: string
    village?: string
    municipality?: string
    suburb?: string
    borough?: string
    city_district?: string
    county?: string
    road?: string
  }
}

type RouteResult = {
  distance: number
  duration: number
  coordinates: [number, number][]
}

const pickupIcon = divIcon({
  className: '',
  html: '<div style="width:20px;height:20px;background:#1b5362;border:4px solid white;border-radius:50%;box-shadow:0 2px 10px #0004"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

const destinationIcon = divIcon({
  className: '',
  html: '<div style="width:20px;height:20px;background:#c79b72;border:4px solid white;border-radius:50%;box-shadow:0 2px 10px #0004"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

function getShortName(result: SearchResult): string {
  const firstPart = result.display_name.split(',')[0].trim()

  const placeName = result.name?.trim() || firstPart

  const address = result.address

  const area =
    address?.city ||
    address?.town ||
    address?.village ||
    address?.municipality ||
    address?.borough ||
    address?.city_district ||
    address?.county ||
    ''

  if (
    area &&
    placeName.toLowerCase() !== area.toLowerCase() &&
    !placeName.toLowerCase().includes(area.toLowerCase())
  ) {
    return `${placeName}, ${area}`
  }

  return placeName
}

function MapClickHandler({
  onSelect,
}: {
  onSelect: (location: Coordinates) => void
}) {
  useMapEvents({
    click(event) {
      onSelect({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      })
    },
  })

  return null
}

function MapFlyTo({
  target,
}: {
  target: Coordinates | null
}) {
  const map = useMap()

  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 14)
    }
  }, [map, target])

  return null
}

function LocationTravel({
  onBack,
  onContinue,
}: LocationTravelProps) {
  const [pickup, setPickup] = useState<Coordinates | null>(null)
  const [destination, setDestination] =
    useState<Coordinates | null>(null)

  const [pickupName, setPickupName] = useState('')
  const [destinationName, setDestinationName] = useState('')

  const [pickupQuery, setPickupQuery] = useState('')
  const [destinationQuery, setDestinationQuery] = useState('')

  const [pickupResults, setPickupResults] =
    useState<SearchResult[]>([])
  const [destinationResults, setDestinationResults] =
    useState<SearchResult[]>([])

  const [selection, setSelection] =
    useState<LocationType>('pickup')

  const [searching, setSearching] =
    useState<LocationType | null>(null)

  const [searchError, setSearchError] = useState('')
  const [mapTarget, setMapTarget] =
    useState<Coordinates | null>(null)

  const [route, setRoute] = useState<RouteResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function searchAddress(type: LocationType) {
    const query =
      type === 'pickup'
        ? pickupQuery.trim()
        : destinationQuery.trim()

    if (query.length < 3) {
      setSearchError('Please enter at least 3 characters.')
      return
    }

    setSearching(type)
    setSearchError('')

    if (type === 'pickup') {
      setPickupResults([])
    } else {
      setDestinationResults([])
    }

    try {
      const url =
        'https://nominatim.openstreetmap.org/search?' +
        new URLSearchParams({
          q: query,
          format: 'json',
          addressdetails: '1',
          namedetails: '1',
          limit: '5',
          countrycodes: 'gb',
        }).toString()

      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Address search unavailable')
      }

      const results: SearchResult[] = await response.json()

      if (type === 'pickup') {
        setPickupResults(results)
      } else {
        setDestinationResults(results)
      }

      if (results.length === 0) {
        setSearchError('No matching UK addresses found.')
      }
    } catch {
      setSearchError(
        'Address search is unavailable. You can still select locations on the map.'
      )
    } finally {
      setSearching(null)
    }
  }

  function chooseAddress(
    type: LocationType,
    result: SearchResult
  ) {
    const location: Coordinates = {
      lat: Number(result.lat),
      lng: Number(result.lon),
    }

    const shortName = getShortName(result)

    if (type === 'pickup') {
      setPickup(location)
      setPickupName(shortName)
      setPickupQuery(shortName)
      setPickupResults([])
      setSelection('destination')
    } else {
      setDestination(location)
      setDestinationName(shortName)
      setDestinationQuery(shortName)
      setDestinationResults([])
    }

    setMapTarget(location)
    setSearchError('')
  }

  function handleMapSelect(location: Coordinates) {
    const coordinatesLabel =
      `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`

    if (selection === 'pickup') {
      setPickup(location)
      setPickupName(coordinatesLabel)
      setPickupQuery('')
      setPickupResults([])
      setSelection('destination')
    } else {
      setDestination(location)
      setDestinationName(coordinatesLabel)
      setDestinationQuery('')
      setDestinationResults([])
    }
  }

  useEffect(() => {
    if (!pickup || !destination) {
      setRoute(null)
      setError('')
      setLoading(false)
      return
    }

    const controller = new AbortController()

    async function calculateRoute() {
      setLoading(true)
      setRoute(null)
      setError('')

      try {
        const url =
          'https://router.project-osrm.org/route/v1/driving/' +
          `${pickup!.lng},${pickup!.lat};` +
          `${destination!.lng},${destination!.lat}` +
          '?overview=full&geometries=geojson'

        const response = await fetch(url, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Routing service unavailable')
        }

        const data = await response.json()

        if (!data.routes || data.routes.length === 0) {
          throw new Error('No road route found')
        }

        const result = data.routes[0]

        setRoute({
          distance: result.distance,
          duration: result.duration,
          coordinates: result.geometry.coordinates.map(
            (point: number[]) =>
              [point[1], point[0]] as [number, number]
          ),
        })
      } catch {
        if (controller.signal.aborted) return

        setError(
          'Unable to calculate this route. Please try different locations.'
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    calculateRoute()

    return () => controller.abort()
  }, [pickup, destination])

  const miles = route ? route.distance / 1609.344 : 0
  const minutes = route ? route.duration / 60 : 0

  const estimatedFare = route
    ? 3.5 + miles * 1.8 + minutes * 0.25
    : 0

  function resetLocations() {
    setPickup(null)
    setDestination(null)
    setPickupName('')
    setDestinationName('')
    setPickupQuery('')
    setDestinationQuery('')
    setPickupResults([])
    setDestinationResults([])
    setSelection('pickup')
    setMapTarget(null)
    setRoute(null)
    setError('')
    setSearchError('')
  }

  function handleContinue() {
    if (!pickup || !destination || !route || !onContinue) {
      return
    }

    onContinue({
      pickup,
      destination,
      pickupName,
      destinationName,
      distanceMiles: miles,
      durationMinutes: minutes,
      estimatedFare,
    })
  }

  const searchInputStyle = {
    flex: '1 1 220px',
    minWidth: 0,
    padding: 15,
    border: '1px solid #ccd8dc',
    borderRadius: 10,
    fontSize: 14,
  }

  const searchButtonStyle = {
    padding: '13px 22px',
    border: 'none',
    borderRadius: 10,
    background: '#102b3f',
    color: '#fff',
    cursor: 'pointer',
  }

  return (
    <div className="location-page">
      <header className="location-header">
        <button className="location-logo" onClick={onBack}>
          HAMRAH<span>.</span>
        </button>

        <button className="location-back" onClick={onBack}>
          ← Back
        </button>
      </header>

      <section className="location-hero">
        <span className="location-eyebrow">
          HAMRAH / UK TRAVEL
        </span>

        <h1>
          Every journey,
          <br />
          <em>better together.</em>
        </h1>

        <p>
          Search for a meeting point and destination,
          or select both directly on the map.
        </p>
      </section>

      <main className="location-content">
        <div className="location-controls">
          <div className="location-section-label">
            <span>01 / YOUR JOURNEY</span>
            <span>UNITED KINGDOM</span>
          </div>

          <h2>Plan your route</h2>

          <p className="location-help">
            Search by street, neighbourhood or landmark.
            Choose a result to place it on the map.
          </p>

          <div style={{ marginTop: 26 }}>
            <label
              htmlFor="pickup-search"
              style={{
                display: 'block',
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              Pickup location
            </label>

            <div
              style={{
                display: 'flex',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <input
                id="pickup-search"
                type="text"
                value={pickupQuery}
                placeholder="e.g. King's Cross Station, London"
                onChange={(event) => {
                  setPickupQuery(event.target.value)
                  setPickupResults([])
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    searchAddress('pickup')
                  }
                }}
                style={searchInputStyle}
              />

              <button
                type="button"
                onClick={() => searchAddress('pickup')}
                disabled={searching !== null}
                style={searchButtonStyle}
              >
                {searching === 'pickup'
                  ? 'Searching...'
                  : 'Search'}
              </button>
            </div>

            {pickupResults.length > 0 && (
              <div
                style={{
                  marginTop: 8,
                  border: '1px solid #e6eef0',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}
              >
                {pickupResults.map((result) => (
                  <button
                    key={result.place_id}
                    type="button"
                    onClick={() =>
                      chooseAddress('pickup', result)
                    }
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: 14,
                      textAlign: 'left',
                      border: 'none',
                      borderBottom: '1px solid #e6eef0',
                      background: '#fff',
                      cursor: 'pointer',
                      fontSize: 13,
                      color: '#102b3f',
                    }}
                  >
                    📍 {getShortName(result)}
                    <span
                      style={{
                        display: 'block',
                        marginTop: 5,
                        color: '#70838b',
                        fontSize: 11,
                      }}
                    >
                      {result.display_name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: 24 }}>
            <label
              htmlFor="destination-search"
              style={{
                display: 'block',
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              Destination
            </label>

            <div
              style={{
                display: 'flex',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <input
                id="destination-search"
                type="text"
                value={destinationQuery}
                placeholder="e.g. Buckingham Palace, London"
                onChange={(event) => {
                  setDestinationQuery(event.target.value)
                  setDestinationResults([])
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    searchAddress('destination')
                  }
                }}
                style={searchInputStyle}
              />

              <button
                type="button"
                onClick={() => searchAddress('destination')}
                disabled={searching !== null}
                style={searchButtonStyle}
              >
                {searching === 'destination'
                  ? 'Searching...'
                  : 'Search'}
              </button>
            </div>

            {destinationResults.length > 0 && (
              <div
                style={{
                  marginTop: 8,
                  border: '1px solid #e6eef0',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}
              >
                {destinationResults.map((result) => (
                  <button
                    key={result.place_id}
                    type="button"
                    onClick={() =>
                      chooseAddress('destination', result)
                    }
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: 14,
                      textAlign: 'left',
                      border: 'none',
                      borderBottom: '1px solid #e6eef0',
                      background: '#fff',
                      cursor: 'pointer',
                      fontSize: 13,
                      color: '#102b3f',
                    }}
                  >
                    📍 {getShortName(result)}
                    <span
                      style={{
                        display: 'block',
                        marginTop: 5,
                        color: '#70838b',
                        fontSize: 11,
                      }}
                    >
                      {result.display_name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {searchError && (
            <p style={{ color: '#b45353', marginTop: 12 }}>
              {searchError}
            </p>
          )}

          <div className="location-selection">
            <button
              className={selection === 'pickup' ? 'active' : ''}
              onClick={() => setSelection('pickup')}
            >
              <span className="location-dot pickup-dot" />
              Set pickup on map
            </button>

            <button
              className={
                selection === 'destination' ? 'active' : ''
              }
              onClick={() => setSelection('destination')}
            >
              <span className="location-dot destination-dot" />
              Set destination on map
            </button>
          </div>

          <div className="location-map">
            <MapContainer
              center={[51.5074, -0.1278]}
              zoom={12}
              scrollWheelZoom
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapClickHandler onSelect={handleMapSelect} />
              <MapFlyTo target={mapTarget} />

              {pickup && (
                <Marker
                  position={[pickup.lat, pickup.lng]}
                  icon={pickupIcon}
                >
                  <Popup>
                    {pickupName || 'Pickup location'}
                  </Popup>
                </Marker>
              )}

              {destination && (
                <Marker
                  position={[
                    destination.lat,
                    destination.lng,
                  ]}
                  icon={destinationIcon}
                >
                  <Popup>
                    {destinationName || 'Destination'}
                  </Popup>
                </Marker>
              )}

              {route && (
                <Polyline
                  positions={route.coordinates}
                  pathOptions={{
                    color: '#1b5362',
                    weight: 5,
                    opacity: 0.85,
                  }}
                />
              )}
            </MapContainer>
          </div>

          <div className="location-results">
            <div>
              <span>PICKUP</span>
              <strong>
                {pickupName || 'Not selected'}
              </strong>
            </div>

            <div>
              <span>DESTINATION</span>
              <strong>
                {destinationName || 'Not selected'}
              </strong>
            </div>
          </div>

          {loading && (
            <p
              className="location-help"
              style={{ marginTop: 24 }}
            >
              Calculating your journey...
            </p>
          )}

          {error && (
            <p style={{ color: '#b45353', marginTop: 24 }}>
              {error}
            </p>
          )}

          {route && (
            <div
              style={{
                marginTop: 28,
                padding: 28,
                borderRadius: 14,
                background: '#e6eef0',
              }}
            >
              <span
                className="location-eyebrow"
                style={{ color: '#1b5362' }}
              >
                YOUR JOURNEY ESTIMATE
              </span>

              <h2
                style={{
                  fontSize: 29,
                  marginTop: 14,
                }}
              >
                Your route, beautifully planned.
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: 16,
                  marginTop: 22,
                }}
              >
                <div>
                  <small>ROAD DISTANCE</small>
                  <h3>{miles.toFixed(1)} mi</h3>
                </div>

                <div>
                  <small>ESTIMATED TIME</small>
                  <h3>{Math.round(minutes)} min</h3>
                </div>

                <div>
                  <small>ESTIMATED RIDE FARE</small>
                  <h3>£{estimatedFare.toFixed(2)}</h3>
                </div>
              </div>

              <p
                style={{
                  fontSize: 12,
                  marginTop: 22,
                  color: '#607985',
                }}
              >
                Illustrative fare only. Not a live Uber
                price. Actual prices may vary.
              </p>
            </div>
          )}

          {onContinue && (
            <button
              type="button"
              className="booking-confirm"
              onClick={handleContinue}
              disabled={!route || loading}
              style={{
                width: '100%',
                marginTop: 28,
                padding: '18px 24px',
                borderRadius: 30,
                background: route
                  ? '#102b3f'
                  : '#a9b7bc',
                color: '#ffffff',
                border: 'none',
                cursor: route
                  ? 'pointer'
                  : 'not-allowed',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Continue to Confirmation ↗
            </button>
          )}

          <button
            className="location-reset"
            onClick={resetLocations}
          >
            Reset locations ↺
          </button>

          <p className="location-disclaimer">
            Address search uses OpenStreetMap Nominatim.
            Route estimates use a public routing service.
            No live traffic or actual ride booking is included.
          </p>
        </div>
      </main>
    </div>
  )
}

export default LocationTravel
