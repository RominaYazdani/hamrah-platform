
import { useState } from 'react'

type FAQProps = {
  onBack: () => void
  onExplore: () => void
  onMedical: () => void
}

type FAQItem = {
  question: string
  answer: string
}

type FAQCategory = {
  title: string
  subtitle: string
  questions: FAQItem[]
}

const categories: FAQCategory[] = [
  {
    title: 'Getting started',
    subtitle: 'Everything you need to know about HAMRAH.',
    questions: [
      {
        question: 'What is HAMRAH?',
        answer:
          'HAMRAH is a university service-design prototype exploring temporary, non-clinical companionship. The concept helps people find someone to accompany them during everyday activities, appointments, social outings or moments when good company matters.',
      },
      {
        question: 'How does HAMRAH work?',
        answer:
          'Choose a service, explore companion profiles, select a date and duration, enter your pickup and destination details, and review your booking summary. All profiles and bookings in this prototype are fictional demonstrations.',
      },
      {
        question: 'Can I book a companion for just a few hours?',
        answer:
          'Yes. The demonstration booking flow supports sessions from one to six hours. You can choose your preferred duration and review the estimated companion fee before continuing.',
      },
      {
        question: 'What kinds of companionship are available?',
        answer:
          'HAMRAH explores six service categories: Home, Medical, Senior, Everyday, Social and Study companionship. Each category focuses on shared experiences and non-clinical support.',
      },
    ],
  },
  {
    title: 'Medical companionship',
    subtitle: 'Support for appointments and hospital visits.',
    questions: [
      {
        question: 'Can someone accompany me to a hospital appointment?',
        answer:
          'The Medical Companion concept is designed for temporary accompaniment to hospital appointments, outpatient visits and imaging centres. A companion may travel with you, help you navigate the visit and keep you company while waiting, subject to facility rules.',
      },
      {
        question: 'Can I book someone to accompany me to a PET scan or MRI?',
        answer:
          'Yes, PET scans, MRI appointments and CT scans are examples of situations the concept aims to support. A companion may accompany you to the centre and wait with you where permitted. They cannot enter restricted clinical areas unless the facility explicitly allows it, and they must follow any imaging safety or radiation-protection instructions.',
      },
      {
        question: 'Can a HAMRAH companion provide medical care?',
        answer:
          'No. HAMRAH companionship is non-clinical. A companion does not diagnose conditions, administer medication, interpret test results, perform nursing procedures or provide professional medical treatment.',
      },
      {
        question: 'Can a companion replace a required medical escort?',
        answer:
          'Not automatically. Some procedures, sedation or discharge arrangements require a responsible adult or an approved caregiver. The healthcare facility decides what kind of escort is acceptable. Users must confirm these requirements directly with their healthcare provider before making arrangements.',
      },
      {
        question: 'Can a companion help during check-in?',
        answer:
          'A companion may offer practical assistance such as finding the correct department, waiting together and helping you organise non-sensitive appointment information. Access to medical information or conversations with healthcare staff would require your permission and must follow the facility’s rules.',
      },
    ],
  },
  {
    title: 'Booking & pricing',
    subtitle: 'Clear expectations before every experience.',
    questions: [
      {
        question: 'How is the companion fee calculated?',
        answer:
          'The demonstration fee is calculated by multiplying the companion’s displayed hourly rate by the selected number of hours. For example, a companion charging £20 per hour would cost £40 for a two-hour session.',
      },
      {
        question: 'Are travel costs included?',
        answer:
          'The prototype displays an illustrative travel estimate separately from the companion fee. It is not a real transport quotation and does not guarantee a particular fare or service.',
      },
      {
        question: 'Can I choose my preferred time?',
        answer:
          'Yes. The current prototype offers start times from 09:00 to 22:00. Past time slots are disabled for the current day, and the booking must finish by midnight.',
      },
      {
        question: 'Can I change or cancel a booking?',
        answer:
          'The current university prototype does not create real reservations, so it does not yet include a live cancellation or rescheduling system. Those features would need to be developed before a real service launch.',
      },
      {
        question: 'Will I be charged?',
        answer:
          'No. HAMRAH is currently a university demonstration. No real payment is collected, and completing the booking flow does not create a real reservation.',
      },
    ],
  },
  {
    title: 'Trust, privacy & safety',
    subtitle: 'Respectful companionship starts with clarity.',
    questions: [
      {
        question: 'Are the companions verified?',
        answer:
          'No. The people, portraits, ratings, reviews and biographies shown in this prototype are fictional demonstration content. No identity verification, background checks or professional qualifications are claimed.',
      },
      {
        question: 'What personal information should I share?',
        answer:
          'For a real service, users should only be asked for information necessary to arrange companionship. Avoid sharing medical records, diagnoses or other sensitive information in the optional notes field of this prototype.',
      },
      {
        question: 'What if I need urgent medical help?',
        answer:
          'HAMRAH is not an emergency response or medical service. In an emergency, contact your local emergency services or the appropriate healthcare provider rather than relying on a companion.',
      },
      {
        question: 'Does HAMRAH guarantee safety?',
        answer:
          'No. This prototype demonstrates a service concept rather than an operating companionship platform. A real launch would require appropriate identity checks, safeguarding policies, accessibility procedures, insurance, incident reporting and privacy protections.',
      },
    ],
  },
]

const colors = {
  navy: '#102B3F',
  petrol: '#1B5362',
  muted: '#547783',
  pale: '#E6EEF0',
  ivory: '#FAFAF7',
  border: '#DCE7E9',
}

function FAQ({
  onBack,
  onExplore,
  onMedical,
}: FAQProps) {
  const [openQuestion, setOpenQuestion] =
    useState<string | null>('0-0')

  const [search, setSearch] = useState('')

  const filteredCategories = categories
    .map((category, categoryIndex) => ({
      ...category,
      categoryIndex,
      questions: category.questions
        .map((question, questionIndex) => ({
          ...question,
          id: `${categoryIndex}-${questionIndex}`,
        }))
        .filter((question) => {
          const query = search.trim().toLowerCase()

          return (
            question.question
              .toLowerCase()
              .includes(query) ||
            question.answer
              .toLowerCase()
              .includes(query) ||
            category.title
              .toLowerCase()
              .includes(query)
          )
        }),
    }))
    .filter((category) => category.questions.length > 0)

  const totalResults = filteredCategories.reduce(
    (sum, category) => sum + category.questions.length,
    0
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
          minHeight: 90,
          padding: '22px clamp(24px, 6vw, 100px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 20,
          borderBottom: `1px solid ${colors.border}`,
          background: colors.ivory,
        }}
      >
        <button
          type="button"
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
          type="button"
          onClick={onBack}
          style={{
            border: `1px solid ${colors.border}`,
            background: 'transparent',
            color: colors.navy,
            padding: '12px 20px',
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          ← Back to Home
        </button>
      </header>

      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '85px 26px 65px',
        }}
      >
        <span
          style={{
            color: colors.petrol,
            fontSize: 11,
            letterSpacing: 2,
            fontWeight: 700,
          }}
        >
          THE HAMRAH EXPERIENCE / HELP & SAFETY
        </span>

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 500,
            color: colors.navy,
            fontSize: 'clamp(44px, 6vw, 76px)',
            lineHeight: 1.13,
            margin: '25px 0',
          }}
        >
          Good questions.
          <br />
          <em>Thoughtful answers.</em>
        </h1>

        <p
          style={{
            maxWidth: 650,
            color: colors.muted,
            fontSize: 16,
            lineHeight: 1.9,
            marginBottom: 32,
          }}
        >
          Explore how HAMRAH works, what temporary
          companionship includes, and the boundaries
          that help create respectful experiences.
        </p>

        <div
          style={{
            maxWidth: 650,
            background: '#FFFFFF',
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            gap: 14,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              fontSize: 20,
              color: colors.petrol,
            }}
          >
            ⌕
          </span>

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search questions, topics or keywords..."
            aria-label="Search frequently asked questions"
            style={{
              flex: 1,
              minWidth: 0,
              padding: '20px 0',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 14,
              color: colors.navy,
              fontFamily: 'inherit',
            }}
          />
        </div>
      </section>

      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 26px 85px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 32,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.7,
              color: colors.petrol,
            }}
          >
            01 — FREQUENTLY ASKED QUESTIONS
          </span>

          <span
            style={{
              fontSize: 12,
              color: colors.muted,
            }}
          >
            {totalResults} questions
          </span>
        </div>

        {filteredCategories.map((category) => (
          <div
            key={category.categoryIndex}
            style={{ marginBottom: 55 }}
          >
            <div style={{ marginBottom: 23 }}>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(27px, 3vw, 36px)',
                  fontWeight: 500,
                  color: colors.navy,
                  margin: '0 0 8px',
                }}
              >
                {category.title}
              </h2>

              <p
                style={{
                  color: colors.muted,
                  fontSize: 13,
                  margin: 0,
                }}
              >
                {category.subtitle}
              </p>
            </div>

            <div
              style={{
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              {category.questions.map((item) => {
                const isOpen =
                  openQuestion === item.id

                return (
                  <div
                    key={item.id}
                    style={{
                      borderBottom:
                        `1px solid ${colors.border}`,
                      background: isOpen
                        ? '#FFFFFF'
                        : 'transparent',
                    }}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${item.id}`}
                      onClick={() =>
                        setOpenQuestion(
                          isOpen ? null : item.id
                        )
                      }
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 20,
                        padding: '23px 22px',
                        border: 0,
                        background: 'transparent',
                        color: colors.navy,
                        textAlign: 'left',
                        fontSize: 15,
                        fontWeight: 600,
                        lineHeight: 1.6,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      <span>{item.question}</span>

                      <span
                        aria-hidden="true"
                        style={{
                          color: colors.petrol,
                          fontSize: 23,
                          fontWeight: 400,
                          flexShrink: 0,
                        }}
                      >
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        id={`faq-answer-${item.id}`}
                        style={{
                          padding: '0 22px 26px',
                          color: colors.muted,
                          fontSize: 14,
                          lineHeight: 1.9,
                          maxWidth: 900,
                        }}
                      >
                        {item.answer}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {totalResults === 0 && (
          <div
            style={{
              padding: '45px 25px',
              textAlign: 'center',
              background: colors.pale,
              color: colors.muted,
              lineHeight: 1.8,
            }}
          >
            No matching questions found.
            Try another keyword.
          </div>
        )}
      </section>

      <section
        style={{
          background: colors.pale,
          padding: '80px 26px',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.8,
              color: colors.petrol,
            }}
          >
            02 — UNDERSTANDING THE BOUNDARIES
          </span>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 500,
              color: colors.navy,
              margin: '20px 0 36px',
            }}
          >
            Care begins with <em>clarity.</em>
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(270px, 1fr))',
              gap: 18,
            }}
          >
            <article
              style={{
                background: '#FFFFFF',
                padding: '32px 28px',
              }}
            >
              <span
                style={{
                  color: colors.petrol,
                  fontSize: 12,
                  letterSpacing: 1.5,
                  fontWeight: 700,
                }}
              >
                01 / WHAT COMPANIONSHIP CAN INCLUDE
              </span>

              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: colors.navy,
                  fontWeight: 500,
                  fontSize: 25,
                  margin: '18px 0',
                }}
              >
                Someone by your side.
              </h3>

              <p
                style={{
                  color: colors.muted,
                  lineHeight: 1.9,
                  fontSize: 14,
                }}
              >
                Friendly conversation, shared activities,
                company during travel, help navigating
                public spaces and waiting together
                at appointments where permitted.
              </p>
            </article>

            <article
              style={{
                background: '#FFFFFF',
                padding: '32px 28px',
              }}
            >
              <span
                style={{
                  color: colors.petrol,
                  fontSize: 12,
                  letterSpacing: 1.5,
                  fontWeight: 700,
                }}
              >
                02 / WHAT COMPANIONSHIP DOES NOT INCLUDE
              </span>

              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: colors.navy,
                  fontWeight: 500,
                  fontSize: 25,
                  margin: '18px 0',
                }}
              >
                Not a medical service.
              </h3>

              <p
                style={{
                  color: colors.muted,
                  lineHeight: 1.9,
                  fontSize: 14,
                }}
              >
                No diagnosis, treatment, medication
                administration, nursing procedures,
                emergency response or guaranteed
                replacement for a required medical escort.
              </p>
            </article>

            <article
              style={{
                background: '#FFFFFF',
                padding: '32px 28px',
              }}
            >
              <span
                style={{
                  color: colors.petrol,
                  fontSize: 12,
                  letterSpacing: 1.5,
                  fontWeight: 700,
                }}
              >
                03 / DEMONSTRATION STATUS
              </span>

              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: colors.navy,
                  fontWeight: 500,
                  fontSize: 25,
                  margin: '18px 0',
                }}
              >
                A concept in progress.
              </h3>

              <p
                style={{
                  color: colors.muted,
                  lineHeight: 1.9,
                  fontSize: 14,
                }}
              >
                HAMRAH is a university prototype.
                Companions are fictional, prices are
                illustrative, and no real reservations,
                dispatches or payments take place.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '90px 26px',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            color: colors.petrol,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.8,
          }}
        >
          03 — YOUR NEXT STEP
        </span>

        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            color: colors.navy,
            fontWeight: 500,
            fontSize: 'clamp(32px, 4vw, 48px)',
            margin: '20px 0',
          }}
        >
          Every journey begins
          <br />
          with <em>good company.</em>
        </h2>

        <p
          style={{
            color: colors.muted,
            fontSize: 15,
            lineHeight: 1.9,
            maxWidth: 570,
            margin: '0 auto 30px',
          }}
        >
          Explore companionship options or take
          a closer look at our Medical Companion
          concept for hospital appointments.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 14,
          }}
        >
          <button
            type="button"
            onClick={onExplore}
            style={{
              background: colors.navy,
              color: '#FFFFFF',
              padding: '16px 25px',
              border: 0,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            Explore Services ↗
          </button>

          <button
            type="button"
            onClick={onMedical}
            style={{
              background: 'transparent',
              color: colors.navy,
              padding: '15px 24px',
              border: `1px solid ${colors.petrol}`,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            Medical Companion ↗
          </button>
        </div>
      </section>

      <footer
        style={{
          background: colors.navy,
          color: '#FFFFFF',
          padding: '34px clamp(24px, 6vw, 100px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
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

        <span
          style={{
            fontSize: 11,
            letterSpacing: 1.5,
          }}
        >
          GOOD COMPANY, WHEN YOU NEED IT.
        </span>

        <span style={{ fontSize: 12 }}>
          © 2026 HAMRAH
        </span>
      </footer>
    </main>
  )
}

export default FAQ
