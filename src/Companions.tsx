
import { useMemo, useState } from 'react'
import './Companions.css'

export type Companion = {
  id: number
  name: string
  age: number
  rating: number
  reviews: number
  price: number
  languages: string[]
  interests: string[]
  description: string
  initials: string
  color: string
  image: string
}

const companions: Companion[] = [
  {
    id: 1,
    name: 'Emma Wilson',
    age: 27,
    rating: 4.9,
    reviews: 124,
    price: 18,
    languages: ['English', 'French'],
    interests: ['Art', 'Reading', 'Coffee'],
    description:
      'A warm listener who loves meaningful conversations and discovering little joys in everyday life.',
    initials: 'EW',
    color: '#DCE9E9',
    image: '/companions/emma.jpg',
  },
  {
    id: 2,
    name: 'Daniel Carter',
    age: 31,
    rating: 4.8,
    reviews: 96,
    price: 20,
    languages: ['English', 'German'],
    interests: ['Walking', 'Music', 'Cinema'],
    description:
      'Friendly, patient, and always happy to share a walk, a good conversation, or a new experience.',
    initials: 'DC',
    color: '#E6E9E3',
    image: '/companions/daniel.jpg',
  },
  {
    id: 3,
    name: 'Sophia Bennett',
    age: 25,
    rating: 5.0,
    reviews: 87,
    price: 22,
    languages: ['English', 'Spanish'],
    interests: ['Books', 'Museums', 'Study'],
    description:
      'Curious and thoughtful, with a passion for learning, culture, and making people feel comfortable.',
    initials: 'SB',
    color: '#EAE5E1',
    image: '/companions/sophia.jpg',
  },
  {
    id: 4,
    name: 'Oliver James',
    age: 29,
    rating: 4.9,
    reviews: 112,
    price: 19,
    languages: ['English', 'French'],
    interests: ['Travel', 'Photography', 'Nature'],
    description:
      'Easygoing and dependable, bringing calm energy to appointments, outings, and everyday plans.',
    initials: 'OJ',
    color: '#E0E9ED',
    image: '/companions/oliver.jpg',
  },
]

type CompanionsProps = {
  service: string
  onBack: () => void
  onSelect: (companion: Companion) => void
}

const navy = '#102B3F'
const petrol = '#1B5362'
const muted = '#78909A'
const border = '#DFE8EA'

function CompanionPortrait({
  companion,
}: {
  companion: Companion
}) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div
      className="companion-photo"
      style={{
        backgroundColor: companion.color,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {!imageFailed ? (
        <img
          src={companion.image}
          alt={`${companion.name} fictional demo portrait`}
          loading="lazy"
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
        <span>{companion.initials}</span>
      )}

      <div
        className="companion-verified"
        style={{
          position: 'absolute',
          zIndex: 2,
        }}
      >
        ✓ Demo profile
      </div>
    </div>
  )
}

function ComparisonPortrait({
  companion,
}: {
  companion: Companion
}) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div
      style={{
        width: 84,
        height: 84,
        flexShrink: 0,
        overflow: 'hidden',
        background: companion.color,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: navy,
        fontSize: 24,
        fontFamily: "'Playfair Display', serif",
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
            objectFit: 'cover',
            objectPosition: 'center 35%',
          }}
        />
      ) : (
        companion.initials
      )}
    </div>
  )
}

function Companions({
  service,
  onBack,
  onSelect,
}: CompanionsProps) {
  const [search, setSearch] = useState('')
  const [language, setLanguage] =
    useState('All languages')
  const [sort, setSort] = useState('Recommended')

  const [selectedIds, setSelectedIds] =
    useState<number[]>([])

  const [showComparison, setShowComparison] =
    useState(false)

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim()

    const result = companions.filter((companion) => {
      const matchesSearch =
        companion.name.toLowerCase().includes(query) ||
        companion.interests.some((interest) =>
          interest.toLowerCase().includes(query)
        )

      const matchesLanguage =
        language === 'All languages' ||
        companion.languages.includes(language)

      return matchesSearch && matchesLanguage
    })

    if (sort === 'Highest rated') {
      result.sort((a, b) => b.rating - a.rating)
    }

    if (sort === 'Price: low to high') {
      result.sort((a, b) => a.price - b.price)
    }

    return result
  }, [search, language, sort])

  const selectedCompanions = selectedIds
    .map((id) =>
      companions.find((companion) => companion.id === id)
    )
    .filter(
      (companion): companion is Companion =>
        companion !== undefined
    )

  const toggleCompare = (id: number) => {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id)
      }

      if (current.length >= 2) {
        return current
      }

      return [...current, id]
    })

    setShowComparison(false)
  }

  const clearComparison = () => {
    setSelectedIds([])
    setShowComparison(false)
  }

  const comparisonRows = [
    {
      label: 'Age',
      getValue: (companion: Companion) =>
        `${companion.age} years`,
    },
    {
      label: 'Hourly rate',
      getValue: (companion: Companion) =>
        `£${companion.price} / hour`,
    },
    {
      label: 'Rating',
      getValue: (companion: Companion) =>
        `★ ${companion.rating.toFixed(1)}`,
    },
    {
      label: 'Reviews',
      getValue: (companion: Companion) =>
        `${companion.reviews} sample reviews`,
    },
    {
      label: 'Languages',
      getValue: (companion: Companion) =>
        companion.languages.join(', '),
    },
    {
      label: 'Interests',
      getValue: (companion: Companion) =>
        companion.interests.join(', '),
    },
    {
      label: 'About',
      getValue: (companion: Companion) =>
        companion.description,
    },
  ]

  return (
    <main className="companions-page">
      <header className="companions-nav">
        <div className="companions-brand">
          HAMRAH<span>.</span>
        </div>

        <button
          onClick={onBack}
          className="companions-back"
        >
          ← Back to Services
        </button>
      </header>

      <section className="companions-hero">
        <span className="companions-eyebrow">
          YOUR JOURNEY / FIND A COMPANION
        </span>

        <h1>
          Find someone who
          <br />
          <em>feels right.</em>
        </h1>

        <p>
          Explore thoughtful people, shared interests,
          and meaningful connections.
        </p>

        <div className="companions-service">
          SELECTED SERVICE
          <strong>{service}</strong>
        </div>
      </section>

      <section className="companions-content">
        <div className="companions-heading">
          <div>
            <span className="companions-eyebrow">
              MEET YOUR COMPANIONS
            </span>

            <h2>
              People worth <em>meeting.</em>
            </h2>
          </div>

          <p>
            {filtered.length} demo companions
          </p>
        </div>

        <div className="companions-filters">
          <input
            type="search"
            placeholder="Search by name or interest..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            aria-label="Search companions"
          />

          <select
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value)
            }
            aria-label="Filter by language"
          >
            <option>All languages</option>
            <option>English</option>
            <option>French</option>
            <option>German</option>
            <option>Spanish</option>
          </select>

          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value)
            }
            aria-label="Sort companions"
          >
            <option>Recommended</option>
            <option>Highest rated</option>
            <option>Price: low to high</option>
          </select>
        </div>

        <div
          style={{
            margin: '22px 0 30px',
            padding: '20px 24px',
            background: '#E6EEF0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 18,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <span
              className="companions-eyebrow"
              style={{ display: 'block', marginBottom: 7 }}
            >
              FIND YOUR BEST MATCH
            </span>

            <strong
              style={{
                display: 'block',
                fontSize: 16,
                color: navy,
              }}
            >
              Compare up to two companions
            </strong>

            <p
              style={{
                margin: '7px 0 0',
                fontSize: 13,
                lineHeight: 1.6,
                color: muted,
              }}
            >
              Select two profiles to compare
              their rates, interests and languages.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: petrol,
                fontWeight: 600,
              }}
            >
              {selectedIds.length} / 2 selected
            </span>

            <button
              type="button"
              disabled={selectedIds.length !== 2}
              onClick={() => setShowComparison(true)}
              style={{
                border: 'none',
                background:
                  selectedIds.length === 2
                    ? navy
                    : '#B9C9CE',
                color: '#FFFFFF',
                padding: '13px 20px',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 0.4,
                cursor:
                  selectedIds.length === 2
                    ? 'pointer'
                    : 'not-allowed',
              }}
            >
              Compare selected ↗
            </button>

            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={clearComparison}
                style={{
                  border: `1px solid ${border}`,
                  background: 'transparent',
                  color: petrol,
                  padding: '12px 15px',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="companions-grid">
          {filtered.map((companion) => {
            const isSelected =
              selectedIds.includes(companion.id)

            const isLimitReached =
              selectedIds.length === 2 &&
              !isSelected

            return (
              <article
                className="companion-card"
                key={companion.id}
                style={{
                  outline: isSelected
                    ? `2px solid ${petrol}`
                    : undefined,
                  outlineOffset: isSelected ? -2 : undefined,
                }}
              >
                <CompanionPortrait
                  companion={companion}
                />

                <div className="companion-details">
                  <div className="companion-rating">
                    ★ {companion.rating.toFixed(1)}
                    <span>
                      ({companion.reviews} sample reviews)
                    </span>
                  </div>

                  <h3>{companion.name}</h3>

                  <p className="companion-age">
                    {companion.age} years old
                  </p>

                  <p className="companion-description">
                    {companion.description}
                  </p>

                  <div className="companion-tags">
                    {companion.interests.map((interest) => (
                      <span key={interest}>
                        {interest}
                      </span>
                    ))}
                  </div>

                  <p className="companion-languages">
                    Languages:{' '}
                    {companion.languages.join(', ')}
                  </p>

                  <div
                    style={{
                      margin: '20px 0 18px',
                      padding: '14px 16px',
                      border: `1px solid ${
                        isSelected ? petrol : border
                      }`,
                      background: isSelected
                        ? '#E6EEF0'
                        : '#FAFAF7',
                    }}
                  >
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        cursor: isLimitReached
                          ? 'not-allowed'
                          : 'pointer',
                        fontSize: 13,
                        fontWeight: 600,
                        color: navy,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isLimitReached}
                        onChange={() =>
                          toggleCompare(companion.id)
                        }
                        style={{
                          width: 17,
                          height: 17,
                          accentColor: petrol,
                          cursor: isLimitReached
                            ? 'not-allowed'
                            : 'pointer',
                        }}
                      />

                      {isSelected
                        ? 'Added to comparison'
                        : 'Add to comparison'}
                    </label>
                  </div>

                  <div className="companion-card-bottom">
                    <div className="companion-price">
                      <strong>
                        £{companion.price}
                      </strong>
                      <span> / hour</span>
                    </div>

                    <button
                      onClick={() => onSelect(companion)}
                    >
                      View Profile ↗
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="companions-empty">
            No companions match your search.
            Try a different name, interest, or language.
          </div>
        )}

        {showComparison &&
          selectedCompanions.length === 2 && (
            <section
              aria-label="Companion comparison"
              style={{
                marginTop: 55,
                padding: '35px 30px',
                background: '#FAFAF7',
                border: `1px solid ${border}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 20,
                  flexWrap: 'wrap',
                  marginBottom: 30,
                }}
              >
                <div>
                  <span className="companions-eyebrow">
                    YOUR COMPARISON
                  </span>

                  <h2
                    style={{
                      fontFamily:
                        "'Playfair Display', serif",
                      fontSize: 'clamp(26px, 3vw, 38px)',
                      fontWeight: 500,
                      color: navy,
                      margin: '12px 0 0',
                    }}
                  >
                    Find your <em>best match.</em>
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowComparison(false)
                  }
                  style={{
                    border: `1px solid ${border}`,
                    background: '#FFFFFF',
                    color: navy,
                    padding: '11px 16px',
                    cursor: 'pointer',
                  }}
                >
                  Close comparison ×
                </button>
              </div>

              <div
                style={{
                  overflowX: 'auto',
                  width: '100%',
                }}
              >
                <table
                  style={{
                    width: '100%',
                    minWidth: 590,
                    borderCollapse: 'collapse',
                    tableLayout: 'fixed',
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          width: '22%',
                          padding: 14,
                          textAlign: 'left',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            letterSpacing: 1.2,
                            color: muted,
                          }}
                        >
                          FEATURES
                        </span>
                      </th>

                      {selectedCompanions.map(
                        (companion) => (
                          <th
                            key={companion.id}
                            scope="col"
                            style={{
                              width: '39%',
                              padding: '16px 18px 24px',
                              textAlign: 'left',
                              verticalAlign: 'top',
                              background: '#E6EEF0',
                              borderLeft:
                                '6px solid #FAFAF7',
                            }}
                          >
                            <ComparisonPortrait
                              companion={companion}
                            />

                            <strong
                              style={{
                                display: 'block',
                                fontFamily:
                                  "'Playfair Display', serif",
                                fontSize: 22,
                                fontWeight: 500,
                                color: navy,
                                marginTop: 14,
                              }}
                            >
                              {companion.name}
                            </strong>

                            <span
                              style={{
                                display: 'block',
                                fontSize: 12,
                                color: muted,
                                marginTop: 7,
                              }}
                            >
                              Demonstration profile
                            </span>
                          </th>
                        )
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {comparisonRows.map((row) => (
                      <tr key={row.label}>
                        <th
                          scope="row"
                          style={{
                            textAlign: 'left',
                            padding: '20px 14px',
                            borderBottom:
                              `1px solid ${border}`,
                            verticalAlign: 'top',
                            color: petrol,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {row.label}
                        </th>

                        {selectedCompanions.map(
                          (companion) => (
                            <td
                              key={companion.id}
                              style={{
                                padding: '20px 18px',
                                borderBottom:
                                  `1px solid ${border}`,
                                borderLeft:
                                  '6px solid #FAFAF7',
                                background: '#FFFFFF',
                                verticalAlign: 'top',
                                color: navy,
                                fontSize: 13,
                                lineHeight: 1.8,
                                overflowWrap: 'anywhere',
                              }}
                            >
                              {row.getValue(companion)}
                            </td>
                          )
                        )}
                      </tr>
                    ))}

                    <tr>
                      <th
                        scope="row"
                        style={{
                          padding: 14,
                          textAlign: 'left',
                          color: petrol,
                          fontSize: 12,
                        }}
                      >
                        NEXT STEP
                      </th>

                      {selectedCompanions.map(
                        (companion) => (
                          <td
                            key={companion.id}
                            style={{
                              padding: '24px 18px',
                              background: '#E6EEF0',
                              borderLeft:
                                '6px solid #FAFAF7',
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                onSelect(companion)
                              }
                              style={{
                                width: '100%',
                                border: 'none',
                                background: navy,
                                color: '#FFFFFF',
                                padding: '14px 12px',
                                fontSize: 12,
                                cursor: 'pointer',
                              }}
                            >
                              View Profile ↗
                            </button>
                          </td>
                        )
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>

              <p
                style={{
                  fontSize: 12,
                  lineHeight: 1.8,
                  color: muted,
                  margin: '24px 0 0',
                }}
              >
                All profiles, ratings and reviews
                are fictional demonstration data.
                This comparison does not indicate
                verified availability or qualifications.
              </p>
            </section>
          )}
      </section>

      <footer className="companions-footer">
        <strong>HAMRAH.</strong>
        <span>
          GOOD COMPANY, WHEN YOU NEED IT.
        </span>
      </footer>
    </main>
  )
}

export default Companions
