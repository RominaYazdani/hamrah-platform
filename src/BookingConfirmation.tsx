
import { useState } from 'react'
import type { BookingDetails } from './Booking'
import './BookingConfirmation.css'

type BookingConfirmationProps = {
  booking: BookingDetails
  onHome: () => void
}

export type TravelDetails = {
  pickup: {
    lat: number
    lng: number
  }
  destination: {
    lat: number
    lng: number
  }
  pickupName?: string
  destinationName?: string
  distanceMiles: number
  durationMinutes: number
  estimatedFare: number
}

type BookingWithTravel = BookingDetails & {
  travel?: TravelDetails
}

function ConfirmationAvatar({
  image,
  name,
  initials,
  color,
}: {
  image: string
  name: string
  initials: string
  color: string
}) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div
      className="confirmation-avatar"
      style={{
        backgroundColor: color,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {!imageFailed ? (
        <img
          src={image}
          alt={`${name} fictional demo portrait`}
          onError={() => setImageFailed(true)}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: 'inherit',
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}

function BookingConfirmation({
  booking,
  onHome,
}: BookingConfirmationProps) {
  const fullBooking = booking as BookingWithTravel

  const formattedDate = new Date(
    `${booking.date}T12:00:00`
  ).toLocaleDateString('en-GB', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const bookingReference = `HM-${booking.date.replaceAll(
    '-',
    ''
  )}-${String(booking.companion.id).padStart(3, '0')}`

  const companionFee = booking.total
  const travelFee = fullBooking.travel?.estimatedFare ?? 0
  const estimatedTotal = companionFee + travelFee

  const pickupDisplay =
    fullBooking.travel?.pickupName ||
    (fullBooking.travel
      ? `${fullBooking.travel.pickup.lat.toFixed(5)}, ${fullBooking.travel.pickup.lng.toFixed(5)}`
      : '')

  const destinationDisplay =
    fullBooking.travel?.destinationName ||
    (fullBooking.travel
      ? `${fullBooking.travel.destination.lat.toFixed(5)}, ${fullBooking.travel.destination.lng.toFixed(5)}`
      : '')

  return (
    <main className="confirmation-page">
      <header className="confirmation-nav">
        <div className="confirmation-brand">
          HAMRAH<span>.</span>
        </div>

        <button
          className="confirmation-home-link"
          onClick={onHome}
        >
          Back to Home ↗
        </button>
      </header>

      <section className="confirmation-hero">
        <div className="confirmation-symbol">
          <span>✓</span>
        </div>

        <span className="confirmation-eyebrow">
          YOUR HAMRAH JOURNEY
        </span>

        <h1>
          Here's to
          <br />
          <em>good company.</em>
        </h1>

        <p>
          Your demo booking is complete.
          A meaningful connection starts with
          a little time set aside.
        </p>

        <div className="confirmation-status">
          ✓ DEMO BOOKING COMPLETE
        </div>
      </section>

      <section className="confirmation-content">
        <div className="confirmation-intro">
          <span className="confirmation-eyebrow">
            YOUR EXPERIENCE AT A GLANCE
          </span>

          <h2>
            The details of
            <br />
            <em>your moment.</em>
          </h2>

          <p>
            Everything you've selected, thoughtfully
            brought together in one place.
          </p>
        </div>

        <div className="confirmation-card">
          <div className="confirmation-card-top">
            <div>
              <span className="confirmation-eyebrow">
                BOOKING REFERENCE / DEMO
              </span>

              <strong>{bookingReference}</strong>
            </div>

            <span className="confirmation-demo-badge">
              DEMONSTRATION
            </span>
          </div>

          <div className="confirmation-companion">
            <ConfirmationAvatar
              key={booking.companion.id}
              image={booking.companion.image}
              name={booking.companion.name}
              initials={booking.companion.initials}
              color={booking.companion.color}
            />

            <div>
              <span className="confirmation-eyebrow">
                YOUR COMPANION
              </span>

              <h3>{booking.companion.name}</h3>

              <p>{booking.service}</p>
            </div>
          </div>

          <div className="confirmation-details">
            <div className="confirmation-detail">
              <span>Date</span>
              <strong>{formattedDate}</strong>
            </div>

            <div className="confirmation-detail">
              <span>Start time</span>
              <strong>{booking.time}</strong>
            </div>

            <div className="confirmation-detail">
              <span>Duration</span>
              <strong>
                {booking.hours}{' '}
                {booking.hours === 1
                  ? 'hour'
                  : 'hours'}
              </strong>
            </div>

            <div className="confirmation-detail">
              <span>Hourly rate</span>
              <strong>
                £{booking.companion.price.toFixed(2)}
                {' / hour'}
              </strong>
            </div>
          </div>

          {fullBooking.travel && (
            <div
              style={{
                borderTop: '1px solid #e6eef0',
                padding: '28px 44px 0',
                marginTop: 26,
              }}
            >
              <span className="confirmation-eyebrow">
                LOCATION & TRAVEL
              </span>

              <h3
                style={{
                  fontFamily:
                    "'Playfair Display', serif",
                  fontSize: 26,
                  margin: '14px 0 22px',
                  fontWeight: 500,
                }}
              >
                Your journey details.
              </h3>

              <div
                className="confirmation-details"
                style={{
                  padding: 0,
                }}
              >
                <div className="confirmation-detail">
                  <span>Pickup location</span>
                  <strong>{pickupDisplay}</strong>
                </div>

                <div className="confirmation-detail">
                  <span>Destination</span>
                  <strong>
                    {destinationDisplay}
                  </strong>
                </div>

                <div className="confirmation-detail">
                  <span>Road distance</span>
                  <strong>
                    {fullBooking.travel.distanceMiles.toFixed(
                      1
                    )}{' '}
                    mi
                  </strong>
                </div>

                <div className="confirmation-detail">
                  <span>Estimated travel time</span>
                  <strong>
                    {Math.round(
                      fullBooking.travel.durationMinutes
                    )}{' '}
                    min
                  </strong>
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              borderTop: '1px solid #e6eef0',
              padding: '24px 44px 0',
              marginTop: 26,
            }}
          >
            <div className="confirmation-detail">
              <span>Companion fee</span>
              <strong>
                £{companionFee.toFixed(2)}
              </strong>
            </div>

            <div
              className="confirmation-detail"
              style={{
                marginTop: 16,
              }}
            >
              <span>Estimated travel fare</span>

              <strong>
                {fullBooking.travel
                  ? `£${travelFee.toFixed(2)}`
                  : 'Not added'}
              </strong>
            </div>
          </div>

          <div className="confirmation-total">
            <div>
              <span>Estimated combined total</span>
              <p>No payment has been made</p>
            </div>

            <strong>
              £{estimatedTotal.toFixed(2)}
            </strong>
          </div>
        </div>

        <div className="confirmation-bottom">
          <p>
            This is an interactive university project
            prototype. The booking reference and
            confirmation are for demonstration only.
            Travel fares are illustrative estimates,
            not official Uber quotes. No real companion
            has been contacted, and no reservation,
            ride or payment has been processed.
          </p>

          <button
            className="confirmation-button"
            onClick={onHome}
          >
            Back to Home ↗
          </button>
        </div>
      </section>

      <footer className="confirmation-footer">
        <strong>HAMRAH.</strong>

        <span>
          GOOD COMPANY, WHEN YOU NEED IT.
        </span>

        <span>© 2026 HAMRAH</span>
      </footer>
    </main>
  )
}

export default BookingConfirmation
