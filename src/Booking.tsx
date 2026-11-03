
import { useState } from 'react'
import type { Companion } from './Companions'
import './Booking.css'

type BookingProps = {
  companion: Companion
  service: string
  initialHours: number
  initialBooking?: BookingDetails | null
  onBack: () => void
  onContinue: (booking: BookingDetails) => void
}

export type BookingDetails = {
  companion: Companion
  service: string
  date: string
  time: string
  hours: number
  total: number
  notes?: string
}

const availableTimes = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
]

function getLocalDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getEndTime(
  startTime: string,
  hours: number
) {
  if (!startTime) return ''

  const [startHour, startMinute] = startTime
    .split(':')
    .map(Number)

  const endHour = startHour + hours

  return `${String(endHour).padStart(2, '0')}:${String(
    startMinute
  ).padStart(2, '0')}`
}

function isPastTime(
  selectedDate: string,
  selectedTime: string,
  currentDate: Date
) {
  if (!selectedDate) return false

  const today = getLocalDate(currentDate)

  if (selectedDate < today) return true
  if (selectedDate > today) return false

  const [hour, minute] = selectedTime
    .split(':')
    .map(Number)

  const selectedMinutes = hour * 60 + minute

  const currentMinutes =
    currentDate.getHours() * 60 +
    currentDate.getMinutes()

  return selectedMinutes <= currentMinutes
}

function exceedsMidnight(
  startTime: string,
  hours: number
) {
  const [startHour, startMinute] = startTime
    .split(':')
    .map(Number)

  return startHour * 60 + startMinute +
    hours * 60 > 24 * 60
}

function BookingAvatar({
  companion,
}: {
  companion: Companion
}) {
  const [imageFailed, setImageFailed] =
    useState(false)

  return (
    <div
      className="booking-avatar"
      style={{
        backgroundColor: companion.color,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {!imageFailed ? (
        <img
          src={companion.image}
          alt={`${companion.name} demo portrait`}
          onError={() => setImageFailed(true)}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: 'inherit',
          }}
        />
      ) : (
        <span>{companion.initials}</span>
      )}
    </div>
  )
}

function Booking({
  companion,
  service,
  initialHours,
  initialBooking,
  onBack,
  onContinue,
}: BookingProps) {
  const [date, setDate] = useState(
    initialBooking?.date ?? ''
  )

  const [time, setTime] = useState(
    initialBooking?.time ?? ''
  )

  const [hours, setHours] = useState(
    initialBooking?.hours ?? initialHours
  )

  const [notes, setNotes] = useState(
    initialBooking?.notes ?? ''
  )

  const [now, setNow] = useState(
    () => new Date()
  )

  const refreshCurrentTime = () => {
    setNow(new Date())
  }

  const minDate = getLocalDate(now)
  const total = companion.price * hours

  const endTime = getEndTime(time, hours)

  const selectedTimeUnavailable =
    Boolean(time) &&
    (
      isPastTime(date, time, now) ||
      exceedsMidnight(time, hours)
    )

  const canContinue =
    Boolean(date) &&
    Boolean(time) &&
    date >= minDate &&
    availableTimes.includes(time) &&
    !selectedTimeUnavailable

  const handleContinue = () => {
    const currentDate = new Date()
    setNow(currentDate)

    if (!date || !time) {
      window.alert(
        'Please select a date and start time.'
      )
      return
    }

    if (date < getLocalDate(currentDate)) {
      window.alert(
        'Please select today or a future date.'
      )
      return
    }

    if (
      !availableTimes.includes(time) ||
      isPastTime(date, time, currentDate)
    ) {
      window.alert(
        'This time has already passed. Please choose another time.'
      )
      return
    }

    if (exceedsMidnight(time, hours)) {
      window.alert(
        'Please choose a shorter duration or an earlier start time. Bookings must end by midnight.'
      )
      return
    }

    onContinue({
      companion,
      service,
      date,
      time,
      hours,
      total,
      notes: notes.trim(),
    })
  }

  return (
    <main className="booking-page">
      <header className="booking-nav">
        <div className="booking-brand">
          HAMRAH<span>.</span>
        </div>

        <button
          className="booking-back"
          onClick={onBack}
        >
          ← Back to Profile
        </button>
      </header>

      <section className="booking-hero">
        <span className="booking-eyebrow">
          YOUR JOURNEY / BOOKING
        </span>

        <h1>
          Make time for
          <br />
          <em>good company.</em>
        </h1>

        <p>
          A meaningful moment starts with a simple plan.
          Choose when and how you'd like to connect.
        </p>
      </section>

      <section className="booking-content">
        <div className="booking-layout">
          <div className="booking-form">
            <span className="booking-eyebrow">
              01 / YOUR COMPANION
            </span>

            <h2>
              Your chosen <em>company.</em>
            </h2>

            <div className="booking-person">
              <BookingAvatar companion={companion} />

              <div>
                <h3>{companion.name}</h3>
                <p>{service}</p>

                <span>
                  ★ {companion.rating.toFixed(1)}
                  {' · '}
                  £{companion.price} / hour
                </span>
              </div>
            </div>

            <div className="booking-divider" />

            <span className="booking-eyebrow">
              02 / DATE & TIME
            </span>

            <h2>
              Choose your <em>moment.</em>
            </h2>

            <div className="booking-field">
              <label htmlFor="booking-date">
                Preferred date
              </label>

              <input
                id="booking-date"
                type="date"
                min={minDate}
                value={date}
                onFocus={refreshCurrentTime}
                onChange={(event) => {
                  setDate(event.target.value)
                  setTime('')
                  refreshCurrentTime()
                }}
              />
            </div>

            <div className="booking-field">
              <label>Preferred start time</label>

              <div className="booking-times">
                {availableTimes.map(
                  (availableTime) => {
                    const past =
                      isPastTime(
                        date,
                        availableTime,
                        now
                      )

                    const tooLate =
                      exceedsMidnight(
                        availableTime,
                        hours
                      )

                    const unavailable =
                      past || tooLate

                    return (
                      <button
                        type="button"
                        key={availableTime}
                        disabled={unavailable}
                        aria-pressed={
                          time === availableTime
                        }
                        title={
                          tooLate
                            ? 'This duration would end after midnight'
                            : past
                              ? 'This time has already passed'
                              : undefined
                        }
                        className={
                          'booking-time ' +
                          (time === availableTime
                            ? 'selected'
                            : '')
                        }
                        style={
                          unavailable
                            ? {
                                opacity: 0.35,
                                cursor: 'not-allowed',
                                background: '#F0F2F2',
                                color: '#81939A',
                              }
                            : undefined
                        }
                        onClick={() => {
                          const currentDate =
                            new Date()

                          setNow(currentDate)

                          if (
                            !isPastTime(
                              date,
                              availableTime,
                              currentDate
                            ) &&
                            !exceedsMidnight(
                              availableTime,
                              hours
                            )
                          ) {
                            setTime(availableTime)
                          }
                        }}
                      >
                        {availableTime}
                      </button>
                    )
                  }
                )}
              </div>

              {date === minDate && (
                <p
                  style={{
                    marginTop: 12,
                    fontSize: 12,
                    color: '#78909A',
                  }}
                >
                  Past time slots are unavailable
                  for today.
                </p>
              )}

              <p
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: '#78909A',
                }}
              >
                Available start times: 09:00–22:00.
                Bookings must end by midnight.
              </p>
            </div>

            <div className="booking-divider" />

            <span className="booking-eyebrow">
              03 / YOUR EXPERIENCE
            </span>

            <h2>
              Just the right{' '}
              <em>amount of time.</em>
            </h2>

            <div className="booking-field">
              <label htmlFor="booking-duration">
                Duration
              </label>

              <select
                id="booking-duration"
                value={hours}
                onChange={(event) => {
                  const nextHours =
                    Number(event.target.value)

                  setHours(nextHours)

                  if (
                    time &&
                    exceedsMidnight(
                      time,
                      nextHours
                    )
                  ) {
                    setTime('')
                  }
                }}
              >
                {[1, 2, 3, 4, 5, 6].map(
                  (value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {value}{' '}
                      {value === 1
                        ? 'hour'
                        : 'hours'}
                    </option>
                  )
                )}
              </select>
            </div>

            {time && (
              <div
                style={{
                  background: '#E6EEF0',
                  padding: '18px 22px',
                  marginBottom: 28,
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  alignItems: 'center',
                  gap: 16,
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <span
                    style={{
                      display: 'block',
                      fontSize: 11,
                      letterSpacing: 1.5,
                      color: '#547783',
                      marginBottom: 6,
                    }}
                  >
                    START TIME
                  </span>

                  <strong
                    style={{
                      color: '#102B3F',
                    }}
                  >
                    {time}
                  </strong>
                </div>

                <span
                  style={{
                    color: '#547783',
                    fontSize: 20,
                  }}
                >
                  →
                </span>

                <div>
                  <span
                    style={{
                      display: 'block',
                      fontSize: 11,
                      letterSpacing: 1.5,
                      color: '#547783',
                      marginBottom: 6,
                    }}
                  >
                    END TIME
                  </span>

                  <strong
                    style={{
                      color: '#102B3F',
                    }}
                  >
                    {endTime}
                  </strong>
                </div>
              </div>
            )}

            <div className="booking-field">
              <label htmlFor="booking-notes">
                Anything you'd like us to know?
                <span className="booking-optional">
                  {' '}Optional
                </span>
              </label>

              <textarea
                id="booking-notes"
                rows={4}
                placeholder="Share your preferences or any helpful details..."
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
              />
            </div>
          </div>

          <aside className="booking-summary">
            <span className="booking-eyebrow">
              YOUR BOOKING SUMMARY
            </span>

            <h3>
              A little time,
              <br />
              <em>a lot of meaning.</em>
            </h3>

            <div className="booking-summary-row">
              <span>Companion</span>
              <strong>{companion.name}</strong>
            </div>

            <div className="booking-summary-row">
              <span>Service</span>
              <strong>{service}</strong>
            </div>

            <div className="booking-summary-row">
              <span>Date</span>
              <strong>
                {date || 'Not selected'}
              </strong>
            </div>

            <div className="booking-summary-row">
              <span>Start time</span>
              <strong>
                {time || 'Not selected'}
              </strong>
            </div>

            <div className="booking-summary-row">
              <span>End time</span>
              <strong>
                {endTime || 'Not selected'}
              </strong>
            </div>

            <div className="booking-summary-row">
              <span>Duration</span>
              <strong>
                {hours}{' '}
                {hours === 1
                  ? 'hour'
                  : 'hours'}
              </strong>
            </div>

            <div className="booking-summary-total">
              <div>
                <span>Companion fee</span>

                <small>
                  £{companion.price} × {hours}{' '}
                  {hours === 1
                    ? 'hour'
                    : 'hours'}
                </small>
              </div>

              <strong>
                £{total.toFixed(2)}
              </strong>
            </div>

            <button
              className="booking-confirm"
              onClick={handleContinue}
              disabled={!canContinue}
            >
              Continue to Location & Travel ↗
            </button>

            <p className="booking-disclaimer">
              This is a university project prototype.
              Times are illustrative, availability is
              not verified, and no real reservation
              or payment is made.
            </p>
          </aside>
        </div>
      </section>

      <footer className="booking-footer">
        <strong>HAMRAH.</strong>

        <span>
          GOOD COMPANY, WHEN YOU NEED IT.
        </span>
      </footer>
    </main>
  )
}

export default Booking
