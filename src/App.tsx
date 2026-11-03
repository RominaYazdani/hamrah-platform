
import { useState } from 'react'

import Services from './Services'
import Companions from './Companions'
import CompanionProfile from './CompanionProfile'
import Booking from './Booking'
import BookingConfirmation from './BookingConfirmation'
import LocationTravel from './LocationTravel'
import FAQ from './FAQ'
import MyBookings from './MyBookings'
import MyProfile from './MyProfile'

import heroImage from './assets/hero.jpg'
import homeImage from './assets/home-companion.jpg'
import medicalImage from './assets/medical-companion.jpg'
import seniorImage from './assets/senior-companion.jpg'

import type { Companion } from './Companions'
import type { BookingDetails } from './Booking'
import type { TravelDetails } from './BookingConfirmation'
import type { SavedBooking } from './MyBookings'

import './App.css'

type Page =
  | 'home'
  | 'how-it-works'
  | 'faq'
  | 'services'
  | 'companions'
  | 'profile'
  | 'booking'
  | 'location'
  | 'confirmation'
  | 'my-bookings'
  | 'my-profile'

type CompleteBooking = BookingDetails & {
  travel?: TravelDetails
}

type StoredReservation = {
  id: string
  booking: CompleteBooking
  summary: SavedBooking
}

const STORAGE_KEY = 'hamrah-demo-bookings-v1'

const services = [
  {
    title: 'Home Companion',
    description:
      'Good conversations and meaningful moments at home.',
    image: homeImage,
  },
  {
    title: 'Medical Companion',
    description:
      'Temporary companionship for hospital appointments, PET scans, MRI visits and more.',
    image: medicalImage,
  },
  {
    title: 'Senior Companion',
    description:
      'Thoughtful companionship for everyday experiences.',
    image: seniorImage,
  },
]

const bookingSteps = [
  'Service',
  'Companion',
  'Booking',
  'Location',
  'Confirmation',
]

function readStoredReservations(): StoredReservation[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) return []

    const parsed: unknown = JSON.parse(saved)

    if (!Array.isArray(parsed)) return []

    return parsed.filter(
      (item): item is StoredReservation =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.booking === 'object' &&
        item.booking !== null &&
        typeof item.summary === 'object' &&
        item.summary !== null
    )
  } catch {
    return []
  }
}

function BookingProgress({ page }: { page: Page }) {
  const currentStep =
    page === 'services'
      ? 0
      : page === 'companions' || page === 'profile'
        ? 1
        : page === 'booking'
          ? 2
          : page === 'location'
            ? 3
            : page === 'confirmation'
              ? 4
              : -1

  if (currentStep < 0) return null

  return (
    <div
      aria-label="Booking progress"
      style={{
        background: '#FAFAF7',
        borderBottom: '1px solid #E6EEF0',
        padding: '20px 24px',
      }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            gap: 10,
          }}
        >
          {bookingSteps.map((label, index) => {
            const completed = index < currentStep
            const active = index === currentStep

            return (
              <div
                key={label}
                aria-current={active ? 'step' : undefined}
                style={{ minWidth: 0 }}
              >
                <div
                  style={{
                    height: 5,
                    borderRadius: 20,
                    background:
                      completed || active
                        ? '#1B5362'
                        : '#DCE7E9',
                    marginBottom: 10,
                  }}
                />

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    color: active ? '#102B3F' : '#6F8B95',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 'clamp(9px, 1.1vw, 12px)',
                    fontWeight: active ? 700 : 500,
                    textAlign: 'center',
                  }}
                >
                  <span>
                    {completed ? '✓' : `0${index + 1}`}
                  </span>
                  <span>{label}</span>
                </div>
              </div>
            )
          })}
        </div>

        <p
          style={{
            margin: '14px 0 0',
            textAlign: 'center',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            letterSpacing: '1.5px',
            color: '#6F8B95',
            textTransform: 'uppercase',
          }}
        >
          Step {currentStep + 1} of 5
        </p>
      </div>
    </div>
  )
}

function HowItWorks({
  onBack,
  onExplore,
  onMedical,
}: {
  onBack: () => void
  onExplore: () => void
  onMedical: () => void
}) {
  const steps = [
    {
      number: '01',
      title: 'Choose a service',
      description:
        'Select the kind of temporary companionship you need, from everyday activities to hospital appointments.',
    },
    {
      number: '02',
      title: 'Find your companion',
      description:
        'Explore demonstration profiles and compare interests, languages, ratings and hourly prices.',
    },
    {
      number: '03',
      title: 'Book your time',
      description:
        'Choose a date, start time and duration, then share any useful preferences.',
    },
    {
      number: '04',
      title: 'Set your location',
      description:
        'Enter pickup and destination details and review an illustrative travel estimate.',
    },
    {
      number: '05',
      title: 'Review confirmation',
      description:
        'See a demonstration summary of your selected companion, schedule and travel details.',
    },
  ]

  const journey = [
    {
      title: 'Before',
      description:
        'Choose a companion and book a time that fits your appointment.',
    },
    {
      title: 'On the way',
      description:
        'Travel together to the hospital or imaging centre.',
    },
    {
      title: 'At the centre',
      description:
        'Have company during check-in and waiting, where permitted.',
    },
    {
      title: 'Afterwards',
      description:
        'Return together if the facility allows and the plan fits your needs.',
    },
  ]

  return (
    <main
      className="site"
      style={{
        minHeight: '100vh',
        background: '#FAFAF7',
      }}
    >
      <header className="navbar">
        <button
          type="button"
          className="brand"
          onClick={onBack}
          style={{
            border: 0,
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          HAMRAH<span>.</span>
        </button>

        <span className="nav-caption">
          COMPANIONSHIP, REIMAGINED
        </span>

        <button
          type="button"
          className="nav-button"
          onClick={onBack}
        >
          ← Back to Home
        </button>
      </header>

      <section
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '88px 28px 48px',
        }}
      >
        <span className="section-number">
          YOUR JOURNEY / HOW IT WORKS
        </span>

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#102B3F',
            fontWeight: 500,
            fontSize: 'clamp(42px, 6vw, 76px)',
            lineHeight: 1.12,
            margin: '25px 0',
          }}
        >
          Good company,
          <br />
          <em>made simple.</em>
        </h1>

        <p
          style={{
            maxWidth: 650,
            fontSize: 17,
            lineHeight: 1.9,
            color: '#547783',
          }}
        >
          HAMRAH is a university service-design
          prototype for arranging temporary,
          non-clinical companionship — for a few
          hours, whenever an everyday moment feels
          easier with someone by your side.
        </p>
      </section>

      <section
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '22px 28px 75px',
        }}
      >
        <span className="section-number">
          01 — THE EXPERIENCE
        </span>

        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#102B3F',
            fontWeight: 500,
            fontSize: 'clamp(30px, 4vw, 46px)',
            margin: '16px 0 30px',
          }}
        >
          Five thoughtful <em>steps.</em>
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
          }}
        >
          {steps.map((step) => (
            <article
              key={step.number}
              style={{
                padding: '30px 28px',
                background: '#FFFFFF',
                border: '1px solid #E6EEF0',
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  letterSpacing: 2,
                  color: '#1B5362',
                  fontWeight: 700,
                }}
              >
                {step.number} / 05
              </span>

              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: '#102B3F',
                  fontSize: 26,
                  fontWeight: 500,
                  margin: '22px 0 12px',
                }}
              >
                {step.title}
              </h3>

              <p
                style={{
                  color: '#547783',
                  fontSize: 14,
                  lineHeight: 1.85,
                  margin: 0,
                }}
              >
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        style={{
          background: '#E6EEF0',
          padding: '76px 28px',
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 48,
            alignItems: 'center',
          }}
        >
          <div>
            <span className="section-number">
              02 — REAL-LIFE SCENARIO
            </span>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                color: '#102B3F',
                fontWeight: 500,
                fontSize: 'clamp(32px, 4vw, 48px)',
                lineHeight: 1.25,
                margin: '22px 0',
              }}
            >
              A little support for
              <em> hospital visits.</em>
            </h2>

            <p
              style={{
                color: '#547783',
                lineHeight: 1.9,
                fontSize: 15,
              }}
            >
              Need someone to accompany you to a
              PET scan, MRI, CT scan, blood test or
              doctor's appointment? The Medical
              Companion concept is designed for
              temporary company during travel,
              check-in, waiting and the journey home.
            </p>

            <p
              style={{
                color: '#547783',
                lineHeight: 1.9,
                fontSize: 14,
              }}
            >
              This is companionship, not medical care.
              A companion cannot perform clinical tasks,
              interpret results or replace a caregiver
              or escort required by the healthcare
              facility. Some scans may have special
              preparation, visitor or post-procedure
              requirements; always follow the
              facility's instructions.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={onMedical}
              style={{ marginTop: 22 }}
            >
              Explore Medical Companion
              <span>↗</span>
            </button>
          </div>

          <div
            style={{
              background: '#FAFAF7',
              padding: '35px 32px',
              border: '1px solid #DCE7E9',
            }}
          >
            <span className="section-number">
              EXAMPLE JOURNEY
            </span>

            {journey.map((item, index) => (
              <div
                key={item.title}
                style={{
                  padding: '20px 0',
                  borderBottom:
                    index === journey.length - 1
                      ? 'none'
                      : '1px solid #DCE7E9',
                }}
              >
                <strong
                  style={{
                    color: '#102B3F',
                    fontSize: 15,
                  }}
                >
                  {item.title}
                </strong>

                <p
                  style={{
                    color: '#547783',
                    fontSize: 13,
                    lineHeight: 1.7,
                    margin: '8px 0 0',
                  }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '85px 28px',
          textAlign: 'center',
        }}
      >
        <span className="section-number">
          03 — BEGIN YOUR JOURNEY
        </span>

        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#102B3F',
            fontWeight: 500,
            fontSize: 'clamp(32px, 4vw, 48px)',
            margin: '20px 0',
          }}
        >
          Ready to find
          <em> good company?</em>
        </h2>

        <p
          style={{
            maxWidth: 540,
            margin: '0 auto 28px',
            color: '#547783',
            lineHeight: 1.9,
          }}
        >
          Explore the different ways HAMRAH
          can make everyday moments feel
          more connected.
        </p>

        <button
          type="button"
          className="primary-button"
          onClick={onExplore}
        >
          Explore Services
          <span>↗</span>
        </button>

        <p
          style={{
            marginTop: 28,
            color: '#78909A',
            fontSize: 12,
            lineHeight: 1.8,
          }}
        >
          University demonstration only.
          No real companions are dispatched,
          and no actual bookings or payments
          are processed.
        </p>
      </section>

      <footer>
        <span className="footer-brand">
          HAMRAH.
        </span>
        <span>
          GOOD COMPANY, WHEN YOU NEED IT.
        </span>
        <span>© 2026 HAMRAH</span>
      </footer>
    </main>
  )
}

function App() {
  const [page, setPage] = useState<Page>('home')

  const [selectedService, setSelectedService] =
    useState('')

  const [selectedCompanion, setSelectedCompanion] =
    useState<Companion | null>(null)

  const [bookingHours, setBookingHours] =
    useState(2)

  const [pendingBooking, setPendingBooking] =
    useState<BookingDetails | null>(null)

  const [confirmedBooking, setConfirmedBooking] =
    useState<CompleteBooking | null>(null)

  const [reservations, setReservations] =
    useState<StoredReservation[]>(readStoredReservations)

  const navigate = (nextPage: Page) => {
    setPage(nextPage)
    window.scrollTo(0, 0)
  }

  const goHome = () => {
    setSelectedService('')
    setSelectedCompanion(null)
    setBookingHours(2)
    setPendingBooking(null)
    setConfirmedBooking(null)
    navigate('home')
  }

  const openServices = () => {
    navigate('services')
  }

  const openMyBookings = () => {
    navigate('my-bookings')
  }

  const openMyProfile = () => {
    navigate('my-profile')
  }

  const handleServiceSelect = (service: string) => {
    setSelectedService(service)
    setSelectedCompanion(null)
    setBookingHours(2)
    setPendingBooking(null)
    setConfirmedBooking(null)
    navigate('companions')
  }

  const handleCompanionSelect = (
    companion: Companion
  ) => {
    setSelectedCompanion(companion)
    setPendingBooking(null)
    navigate('profile')
  }

  const handleBooking = (
    companion: Companion,
    hours: number
  ) => {
    setSelectedCompanion(companion)
    setBookingHours(hours)

    if (
      pendingBooking &&
      (
        pendingBooking.companion.id !== companion.id ||
        pendingBooking.service !== selectedService
      )
    ) {
      setPendingBooking(null)
    }

    navigate('booking')
  }

  const handleBookingContinue = (
    booking: BookingDetails
  ) => {
    setPendingBooking(booking)
    navigate('location')
  }

  const handleTravelContinue = (
    travel: TravelDetails
  ) => {
    if (!pendingBooking) return

    const completeBooking: CompleteBooking = {
      ...pendingBooking,
      travel,
    }

    setConfirmedBooking(completeBooking)

    const details = pendingBooking as unknown as Record<
      string,
      unknown
    >

    const companion = pendingBooking.companion

    const companionData = companion as unknown as Record<
      string,
      unknown
    >

    const getText = (
      value: unknown,
      fallback: string
    ) => {
      if (
        typeof value === 'string' ||
        typeof value === 'number'
      ) {
        return String(value)
      }

      return fallback
    }

    const date = getText(
      details.date ?? details.selectedDate,
      'Date not specified'
    )

    const time = getText(
      details.time ??
        details.startTime ??
        details.selectedTime,
      'Time not specified'
    )

    const durationValue =
      details.hours ??
      details.duration ??
      details.bookingHours ??
      bookingHours

    const duration =
      typeof durationValue === 'number' &&
      Number.isFinite(durationValue)
        ? durationValue
        : bookingHours

    const hourlyRate =
      companionData.hourlyRate ??
      companionData.pricePerHour ??
      companionData.price

    const total =
      typeof hourlyRate === 'number'
        ? hourlyRate * duration
        : undefined

    const companionImage =
      typeof companionData.image === 'string'
        ? companionData.image
        : typeof companionData.photo === 'string'
          ? companionData.photo
          : undefined

    const id = `HAM-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)}`

    const summary: SavedBooking = {
      id,
      service: pendingBooking.service,
      companionName: companion.name,
      companionImage,
      date,
      time,
      duration,
      total,
      status: 'Upcoming',
    }

    const newReservation: StoredReservation = {
      id,
      booking: completeBooking,
      summary,
    }

    setReservations((previous) => {
      const updated = [
        newReservation,
        ...previous,
      ]

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updated)
        )
      } catch {
        // Keep the reservation in memory if storage is unavailable.
      }

      return updated
    })

    navigate('confirmation')
  }

  const handleViewBooking = (booking: SavedBooking) => {
    const reservation = reservations.find(
      (item) => item.id === booking.id
    )

    if (!reservation) return

    setConfirmedBooking(reservation.booking)
    navigate('confirmation')
  }

  const renderPage = () => {
    if (page === 'my-profile') {
      return (
        <MyProfile
          onBack={goHome}
          onBookings={openMyBookings}
          onExplore={openServices}
        />
      )
    }

    if (page === 'my-bookings') {
      return (
        <MyBookings
          bookings={reservations.map(
            (reservation) => reservation.summary
          )}
          onBack={goHome}
          onExplore={openServices}
          onViewDetails={handleViewBooking}
        />
      )
    }

    if (page === 'faq') {
      return (
        <FAQ
          onBack={goHome}
          onExplore={openServices}
          onMedical={() =>
            handleServiceSelect('Medical Companion')
          }
        />
      )
    }

    if (page === 'how-it-works') {
      return (
        <HowItWorks
          onBack={goHome}
          onExplore={openServices}
          onMedical={() =>
            handleServiceSelect('Medical Companion')
          }
        />
      )
    }

    if (page === 'services') {
      return (
        <Services
          onBack={goHome}
          onSelect={handleServiceSelect}
        />
      )
    }

    if (page === 'companions') {
      return (
        <Companions
          service={selectedService}
          onBack={openServices}
          onSelect={handleCompanionSelect}
        />
      )
    }

    if (
      page === 'profile' &&
      selectedCompanion
    ) {
      return (
        <CompanionProfile
          companion={selectedCompanion}
          service={selectedService}
          onBack={() => navigate('companions')}
          onBook={handleBooking}
        />
      )
    }

    if (
      page === 'booking' &&
      selectedCompanion
    ) {
      return (
        <Booking
          companion={selectedCompanion}
          service={selectedService}
          initialHours={bookingHours}
          initialBooking={pendingBooking}
          onBack={() => navigate('profile')}
          onContinue={handleBookingContinue}
        />
      )
    }

    if (page === 'location') {
      return (
        <LocationTravel
          onBack={() =>
            navigate(
              pendingBooking ? 'booking' : 'home'
            )
          }
          onContinue={
            pendingBooking
              ? handleTravelContinue
              : undefined
          }
        />
      )
    }

    if (
      page === 'confirmation' &&
      confirmedBooking
    ) {
      return (
        <BookingConfirmation
          booking={confirmedBooking}
          onHome={goHome}
        />
      )
    }

    return (
      <main className="site">
        <header className="navbar">
          <a
            className="brand"
            href="#"
            onClick={(event) => {
              event.preventDefault()
              goHome()
            }}
          >
            HAMRAH<span>.</span>
          </a>

          <span className="nav-caption">
            COMPANIONSHIP, REIMAGINED
          </span>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <button
              className="nav-button"
              onClick={openMyProfile}
            >
              My Profile ↗
            </button>

            <button
              className="nav-button"
              onClick={openMyBookings}
            >
              My Bookings ↗
            </button>

            <button
              className="nav-button"
              onClick={() => {
                setPendingBooking(null)
                navigate('location')
              }}
            >
              Location & Travel ↗
            </button>

            <button
              className="nav-button"
              onClick={() =>
                navigate('how-it-works')
              }
            >
              How It Works ↗
            </button>

            <button
              className="nav-button"
              onClick={() => navigate('faq')}
            >
              FAQ & Safety ↗
            </button>

            <button
              className="nav-button"
              onClick={openServices}
            >
              Explore Services ↗
            </button>
          </div>
        </header>

        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">
              A MORE HUMAN WAY TO CONNECT
            </div>

            <h1>
              Life feels better
              <br />
              with <em>someone</em>
              <br />
              by your side.
            </h1>

            <p>
              Find thoughtful companionship for
              the moments that matter. Real people,
              meaningful connections, and support
              on your terms.
            </p>

            <button
              className="primary-button"
              onClick={openServices}
            >
              Find Your Companion
              <span>↗</span>
            </button>

            <div className="hero-footnote">
              MADE FOR REAL HUMAN CONNECTION
            </div>
          </div>

          <div className="hero-photo">
            <img
              src={heroImage}
              alt="People spending time together"
            />

            <div className="photo-label">
              01 / THE BEAUTY OF BEING TOGETHER
            </div>
          </div>
        </section>

        <section className="intro">
          <span className="section-number">
            01 — OUR PHILOSOPHY
          </span>

          <h2>
            Sometimes, all we need
            <br />
            is <em>good company.</em>
          </h2>

          <p>
            From everyday errands to meaningful
            conversations, HAMRAH makes
            companionship accessible, personal,
            and beautifully simple.
          </p>
        </section>

        <section
          className="services"
          id="services"
        >
          <div className="section-heading">
            <div>
              <span className="section-number">
                02 — EXPLORE
              </span>

              <h2>
                Companionship
                <br />
                <em>for every moment.</em>
              </h2>
            </div>

            <p>
              Discover the right kind of company
              for your day.
            </p>
          </div>

          <div className="service-grid">
            {services.map((service, index) => (
              <button
                className={
                  'service-card ' +
                  (
                    selectedService === service.title
                      ? 'active'
                      : ''
                  )
                }
                key={service.title}
                onClick={() =>
                  handleServiceSelect(service.title)
                }
              >
                <div className="service-image">
                  <img
                    src={service.image}
                    alt={service.title}
                  />

                  <span className="service-index">
                    0{index + 1}
                  </span>
                </div>

                <div className="service-info">
                  <h3>{service.title}</h3>
                  <span>↗</span>
                </div>

                <p>{service.description}</p>
              </button>
            ))}
          </div>

          <div
            style={{
              textAlign: 'center',
              marginTop: '45px',
            }}
          >
            <button
              className="primary-button"
              onClick={openServices}
            >
              Explore All Six Services
              <span>↗</span>
            </button>
          </div>
        </section>

        <section
          style={{
            textAlign: 'center',
            padding: '15px 24px 75px',
          }}
        >
          <button
            className="primary-button"
            onClick={() =>
              navigate('how-it-works')
            }
          >
            See How HAMRAH Works
            <span>↗</span>
          </button>
        </section>

        <footer>
          <span className="footer-brand">
            HAMRAH.
          </span>

          <span>
            GOOD COMPANY, WHEN YOU NEED IT.
          </span>

          <span>© 2026 HAMRAH</span>
        </footer>
      </main>
    )
  }

  return (
    <>
      {page !== 'home' &&
        page !== 'how-it-works' &&
        page !== 'faq' &&
        page !== 'my-bookings' &&
        page !== 'my-profile' &&
        !(
          page === 'location' &&
          !pendingBooking
        ) && (
          <BookingProgress page={page} />
        )}

      {renderPage()}
    </>
  )
}

export default App
