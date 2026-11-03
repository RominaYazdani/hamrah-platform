
import { useState } from 'react'
import type { Companion } from './Companions'
import './CompanionProfile.css'

type CompanionProfileProps = {
  companion: Companion
  service: string
  onBack: () => void
  onBook: (companion: Companion, hours: number) => void
}

type ProfileExtras = {
  headline: string
  approach: string
  skills: string[]
  activities: string[]
}

const profileExtras: Record<string, ProfileExtras> = {
  emma: {
    headline: 'A thoughtful listener who values the little moments.',
    approach:
      'I believe meaningful companionship begins with listening, kindness, and making space for people to feel comfortable being themselves.',
    skills: [
      'Active listening',
      'Friendly conversation',
      'Everyday organisation',
      'Patient communication',
    ],
    activities: [
      'Coffee and conversation',
      'Walks and outdoor activities',
      'Everyday errands',
      'Creative activities',
    ],
  },
  daniel: {
    headline: 'Easygoing company for everyday adventures.',
    approach:
      'I enjoy creating relaxed experiences where people can explore, share stories, and feel supported in everyday activities.',
    skills: [
      'Clear communication',
      'Activity planning',
      'Everyday organisation',
      'Friendly conversation',
    ],
    activities: [
      'City walks',
      'Shopping and errands',
      'Cultural outings',
      'Social activities',
    ],
  },
  sophia: {
    headline: 'Warm conversations and meaningful connections.',
    approach:
      'I value empathy, thoughtful communication, and creating welcoming moments that make ordinary days feel special.',
    skills: [
      'Active listening',
      'Patient communication',
      'Activity planning',
      'Everyday organisation',
    ],
    activities: [
      'Reading together',
      'Coffee and conversation',
      'Creative activities',
      'Community outings',
    ],
  },
  oliver: {
    headline: 'Good company with a calm and positive outlook.',
    approach:
      'I enjoy helping people feel at ease through shared interests, engaging conversations, and enjoyable everyday experiences.',
    skills: [
      'Friendly conversation',
      'Clear communication',
      'Activity planning',
      'Everyday organisation',
    ],
    activities: [
      'Outdoor walks',
      'Everyday errands',
      'Museums and exhibitions',
      'Study companionship',
    ],
  },
}

const defaultExtras: ProfileExtras = {
  headline: 'Meaningful moments begin with good company.',
  approach:
    'A thoughtful approach to companionship, centred on conversation, shared activities, and respect for individual preferences.',
  skills: [
    'Friendly conversation',
    'Active listening',
    'Everyday organisation',
  ],
  activities: [
    'Everyday errands',
    'Social outings',
    'Shared activities',
  ],
}

function CompanionProfile({
  companion,
  service,
  onBack,
  onBook,
}: CompanionProfileProps) {
  const [hours, setHours] = useState(2)
  const [imageFailed, setImageFailed] = useState(false)

  const profile =
    profileExtras[String(companion.id).toLowerCase()] ??
    profileExtras[
      companion.name.split(' ')[0].toLowerCase()
    ] ??
    defaultExtras

  const total = companion.price * hours

  return (
    <main className="profile-page">
      <header className="profile-nav">
        <div className="profile-brand">
          HAMRAH<span>.</span>
        </div>

        <button
          className="profile-back"
          onClick={onBack}
        >
          ← Back to Companions
        </button>
      </header>

      <section className="profile-hero">
        <span className="profile-eyebrow">
          THE HAMRAH EXPERIENCE / PERSONAL CONNECTIONS
        </span>

        <h1>
          A connection that
          <br />
          <em>feels personal.</em>
        </h1>

        <p>
          Get to know the person who could make your
          next experience a little more meaningful.
        </p>
      </section>

      <section className="profile-content">
        <div className="profile-layout">
          <div className="profile-main">
            <div
              className="profile-photo"
              style={{
                backgroundColor: companion.color,
                position: 'relative',
                overflow: 'hidden',
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
                    objectPosition: 'center 35%',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#102B3F',
                    fontSize: 64,
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  {companion.initials}
                </div>
              )}

              <div
                className="profile-photo-label"
                style={{
                  position: 'absolute',
                  zIndex: 2,
                }}
              >
                DEMONSTRATION PROFILE
              </div>
            </div>

            <div className="profile-introduction">
              <span className="profile-eyebrow">
                MEET YOUR COMPANION
              </span>

              <h2>{companion.name}</h2>

              <p className="profile-subtitle">
                {companion.age} years old ·{' '}
                ★ {companion.rating.toFixed(1)} ·{' '}
                {companion.reviews} sample reviews
              </p>

              <p
                style={{
                  marginTop: 18,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(19px, 2vw, 25px)',
                  lineHeight: 1.5,
                  color: '#1B5362',
                  fontStyle: 'italic',
                }}
              >
                “{profile.headline}”
              </p>

              <div className="profile-divider" />

              <span className="profile-eyebrow">
                01 / A LITTLE ABOUT ME
              </span>

              <p className="profile-description">
                {companion.description}
              </p>

              <p
                className="profile-description"
                style={{ marginTop: 16 }}
              >
                {profile.approach}
              </p>

              <div className="profile-divider" />

              <span className="profile-eyebrow">
                02 / HOW I CAN HELP
              </span>

              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 27,
                  fontWeight: 500,
                  color: '#102B3F',
                  margin: '16px 0 20px',
                }}
              >
                Thoughtful support for
                <em> everyday moments.</em>
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(190px, 1fr))',
                  gap: 12,
                }}
              >
                {profile.skills.map((skill) => (
                  <div
                    key={skill}
                    style={{
                      background: '#E6EEF0',
                      padding: '16px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      color: '#102B3F',
                      fontSize: 13,
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        color: '#1B5362',
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>

                    <span>{skill}</span>
                  </div>
                ))}
              </div>

              <div className="profile-divider" />

              <span className="profile-eyebrow">
                03 / ACTIVITIES WE COULD SHARE
              </span>

              <p
                className="profile-description"
                style={{ marginTop: 16, marginBottom: 20 }}
              >
                Every experience is personal.
                Here are a few ideas for spending
                meaningful time together.
              </p>

              <div className="profile-tags">
                {profile.activities.map((activity) => (
                  <span key={activity}>
                    {activity}
                  </span>
                ))}
              </div>

              <div className="profile-divider" />

              <span className="profile-eyebrow">
                04 / THINGS I ENJOY
              </span>

              <div
                className="profile-tags"
                style={{ marginTop: 18 }}
              >
                {companion.interests.map((interest) => (
                  <span key={interest}>
                    {interest}
                  </span>
                ))}
              </div>

              <div className="profile-divider" />

              <span className="profile-eyebrow">
                05 / LANGUAGES I SPEAK
              </span>

              <p
                className="profile-languages"
                style={{ marginTop: 18 }}
              >
                {companion.languages.join(' · ')}
              </p>

              <div className="profile-divider" />

              <span className="profile-eyebrow">
                06 / GOOD TO KNOW
              </span>

              <div
                style={{
                  marginTop: 18,
                  padding: '22px 24px',
                  background: '#FAFAF7',
                  border: '1px solid #E6EEF0',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: '#547783',
                    fontSize: 13,
                    lineHeight: 1.9,
                  }}
                >
                  HAMRAH is designed for non-clinical
                  companionship and shared everyday
                  experiences. Medical companionship
                  means accompanying someone to an
                  appointment, not providing diagnosis,
                  treatment, or professional care.
                </p>
              </div>

              <p
                style={{
                  marginTop: 20,
                  color: '#81939A',
                  fontSize: 12,
                  lineHeight: 1.8,
                }}
              >
                This is a fictional demonstration
                profile for a university project.
                Descriptions, ratings, reviews and
                skills are illustrative and have
                not been independently verified.
              </p>
            </div>
          </div>

          <aside className="profile-booking">
            <span className="profile-eyebrow">
              YOUR EXPERIENCE
            </span>

            <h3>
              Make time for
              <br />
              <em>good company.</em>
            </h3>

            <div className="profile-booking-row">
              <span>Selected service</span>
              <strong>{service}</strong>
            </div>

            <div className="profile-booking-row">
              <span>Hourly rate</span>
              <strong>
                £{companion.price} / hour
              </strong>
            </div>

            <div className="profile-hours">
              <label htmlFor="booking-hours">
                How many hours?
              </label>

              <select
                id="booking-hours"
                value={hours}
                onChange={(event) =>
                  setHours(Number(event.target.value))
                }
              >
                {[1, 2, 3, 4, 5, 6].map((value) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {value}{' '}
                    {value === 1 ? 'hour' : 'hours'}
                  </option>
                ))}
              </select>
            </div>

            <div className="profile-total">
              <span>Estimated total</span>
              <strong>
                £{total.toFixed(2)}
              </strong>
            </div>

            <button
              className="profile-book-button"
              onClick={() =>
                onBook(companion, hours)
              }
            >
              Continue to Booking ↗
            </button>

            <p className="profile-booking-note">
              This is a university project demonstration.
              No real payment or reservation is made.
            </p>
          </aside>
        </div>
      </section>

      <footer className="profile-footer">
        <strong>HAMRAH.</strong>
        <span>
          GOOD COMPANY, WHEN YOU NEED IT.
        </span>
      </footer>
    </main>
  )
}

export default CompanionProfile
