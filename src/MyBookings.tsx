
import { useState } from 'react'

export type SavedBooking = {
  id: string
  service: string
  companionName: string
  companionImage?: string
  date: string
  time: string
  duration: number
  total?: number
  location?: string
  status: 'Upcoming' | 'Completed' | 'Cancelled'
}

type MyBookingsProps = {
  bookings: SavedBooking[]
  onBack: () => void
  onExplore: () => void
  onViewDetails: (booking: SavedBooking) => void
}

type Filter = 'All' | SavedBooking['status']

const colors = {
  navy: '#102B3F',
  petrol: '#1B5362',
  muted: '#6F8B95',
  ivory: '#FAFAF7',
  border: '#E6EEF0',
}

function MyBookings({
  bookings,
  onBack,
  onExplore,
  onViewDetails,
}: MyBookingsProps) {
  const [filter, setFilter] = useState<Filter>('All')

  const filters: Filter[] = [
    'All',
    'Upcoming',
    'Completed',
    'Cancelled',
  ]

  const visibleBookings =
    filter === 'All'
      ? bookings
      : bookings.filter(
          (booking) => booking.status === filter
        )

  return (
    <main
      style={{
        minHeight: '100vh',
        background: colors.ivory,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 20,
          padding: '26px 6%',
          borderBottom: `1px solid ${colors.border}`,
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={onBack}
          style={{
            border: 0,
            background: 'transparent',
            fontFamily: "'Playfair Display', serif",
            fontSize: 27,
            fontWeight: 700,
            color: colors.navy,
            cursor: 'pointer',
          }}
        >
          HAMRAH<span style={{ color: colors.petrol }}>.</span>
        </button>

        <button
          onClick={onBack}
          style={{
            border: `1px solid ${colors.border}`,
            background: 'transparent',
            padding: '13px 20px',
            color: colors.navy,
            cursor: 'pointer',
          }}
        >
          ← Back to Home
        </button>
      </header>

      <section
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '85px 24px 45px',
        }}
      >
        <span
          style={{
            color: colors.petrol,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 3,
          }}
        >
          YOUR HAMRAH EXPERIENCE / 01
        </span>

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            color: colors.navy,
            fontWeight: 500,
            fontSize: 'clamp(46px, 7vw, 78px)',
            lineHeight: 1.15,
            margin: '25px 0',
          }}
        >
          Your moments,
          <br />
          <em>beautifully organised.</em>
        </h1>

        <p
          style={{
            color: colors.muted,
            maxWidth: 620,
            lineHeight: 1.9,
            fontSize: 16,
          }}
        >
          Keep track of your companionship experiences,
          revisit the details, and plan your next moment
          of meaningful connection.
        </p>

        <p
          style={{
            color: colors.muted,
            fontSize: 12,
            marginTop: 22,
          }}
        >
          University prototype — all bookings are demonstrations.
          No real reservations or payments are made.
        </p>
      </section>

      <section
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '20px 24px 100px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 20,
            marginBottom: 28,
          }}
        >
          <div>
            <span
              style={{
                fontSize: 11,
                letterSpacing: 2,
                color: colors.petrol,
                fontWeight: 700,
              }}
            >
              YOUR RESERVATIONS
            </span>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 32,
                fontWeight: 500,
                color: colors.navy,
                margin: '12px 0 0',
              }}
            >
              My Bookings{' '}
              <span style={{ color: colors.muted }}>
                ({bookings.length})
              </span>
            </h2>
          </div>

          <button
            onClick={onExplore}
            style={{
              background: colors.navy,
              border: 0,
              color: '#FFFFFF',
              padding: '16px 24px',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            + New Booking ↗
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 32,
          }}
        >
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              style={{
                padding: '11px 20px',
                border: `1px solid ${colors.border}`,
                background:
                  filter === item
                    ? colors.navy
                    : '#FFFFFF',
                color:
                  filter === item
                    ? '#FFFFFF'
                    : colors.muted,
                cursor: 'pointer',
                fontSize: 12,
                transition: '0.2s',
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {visibleBookings.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '85px 24px',
              border: `1px solid ${colors.border}`,
              background: '#FFFFFF',
            }}
          >
            <div
              style={{
                fontSize: 42,
                color: colors.petrol,
                marginBottom: 20,
              }}
            >
              ♡
            </div>

            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 32,
                fontWeight: 500,
                color: colors.navy,
              }}
            >
              {filter === 'All'
                ? 'Your story starts here.'
                : 'No bookings in this category.'}
            </h3>

            <p
              style={{
                color: colors.muted,
                lineHeight: 1.8,
                maxWidth: 450,
                margin: '18px auto 28px',
              }}
            >
              {filter === 'All'
                ? 'You have not made a demonstration booking yet. Discover a companion and start your journey.'
                : 'Try another filter to explore your bookings.'}
            </p>

            {filter === 'All' && (
              <button
                onClick={onExplore}
                style={{
                  background: colors.petrol,
                  border: 0,
                  color: '#FFFFFF',
                  padding: '16px 28px',
                  cursor: 'pointer',
                }}
              >
                Explore Services ↗
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: 20,
            }}
          >
            {visibleBookings.map((booking) => (
              <article
                key={booking.id}
                style={{
                  background: '#FFFFFF',
                  border: `1px solid ${colors.border}`,
                  padding: '28px',
                  display: 'flex',
                  gap: 26,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {booking.companionImage ? (
                  <img
                    src={booking.companionImage}
                    alt={booking.companionName}
                    style={{
                      width: 116,
                      height: 130,
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 116,
                      height: 130,
                      background: '#E6EEF0',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 32,
                      color: colors.petrol,
                    }}
                  >
                    ♡
                  </div>
                )}

                <div style={{ flex: '1 1 240px' }}>
                  <span
                    style={{
                      fontSize: 11,
                      letterSpacing: 1.5,
                      color: colors.petrol,
                      fontWeight: 700,
                    }}
                  >
                    {booking.service.toUpperCase()}
                  </span>

                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: colors.navy,
                      fontSize: 28,
                      fontWeight: 500,
                      margin: '10px 0',
                    }}
                  >
                    {booking.companionName}
                  </h3>

                  <p
                    style={{
                      color: colors.muted,
                      fontSize: 13,
                      lineHeight: 1.9,
                    }}
                  >
                    {booking.date} · {booking.time}
                    <br />
                    {booking.duration} hour
                    {booking.duration !== 1 ? 's' : ''}
                    {booking.location
                      ? ` · ${booking.location}`
                      : ''}
                  </p>

                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: 8,
                      padding: '8px 12px',
                      background: '#E6EEF0',
                      color: colors.petrol,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {booking.status}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 18,
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      color: colors.navy,
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    {booking.total !== undefined
                      ? `$${booking.total.toFixed(2)}`
                      : 'Demo booking'}
                  </span>

                  <button
                    onClick={() => onViewDetails(booking)}
                    style={{
                      background: 'transparent',
                      border: `1px solid ${colors.petrol}`,
                      color: colors.petrol,
                      padding: '13px 22px',
                      cursor: 'pointer',
                    }}
                  >
                    View Details ↗
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer
        style={{
          background: colors.navy,
          color: '#FFFFFF',
          padding: '30px 6%',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <strong
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 23,
          }}
        >
          HAMRAH.
        </strong>

        <span style={{ fontSize: 11, letterSpacing: 2 }}>
          GOOD COMPANY, WHEN YOU NEED IT.
        </span>

        <span style={{ fontSize: 11 }}>
          © 2026 HAMRAH
        </span>
      </footer>
    </main>
  )
}

export default MyBookings
