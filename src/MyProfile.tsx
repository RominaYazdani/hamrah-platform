
import { useState } from 'react'
import type { ChangeEvent, CSSProperties } from 'react'

type MyProfileProps = {
  onBack: () => void
  onBookings: () => void
  onExplore: () => void
}

type ProfileData = {
  firstName: string
  lastName: string
  phone: string
  email: string
  birthDate: string
  city: string
  language: string
  avatar: string
}

const STORAGE_KEY = 'hamrah-demo-profile-v1'

const emptyProfile: ProfileData = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  birthDate: '',
  city: '',
  language: 'English',
  avatar: '',
}

const colors = {
  navy: '#102B3F',
  petrol: '#1B5362',
  muted: '#6F8B95',
  ivory: '#FAFAF7',
  mist: '#E6EEF0',
  border: '#DCE7E9',
  white: '#FFFFFF',
}

function loadProfile(): ProfileData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) return { ...emptyProfile }

    const parsed = JSON.parse(saved)

    return {
      ...emptyProfile,
      ...parsed,
    }
  } catch {
    return { ...emptyProfile }
  }
}

function MyProfile({
  onBack,
  onBookings,
  onExplore,
}: MyProfileProps) {
  const [profile, setProfile] = useState<ProfileData>(
    loadProfile
  )

  const [draft, setDraft] = useState<ProfileData>(
    () => ({ ...profile })
  )

  const [editing, setEditing] = useState(false)
  const [savedMessage, setSavedMessage] = useState(false)
  const [error, setError] = useState('')

  const fullName = [
    profile.firstName,
    profile.lastName,
  ]
    .filter(Boolean)
    .join(' ')

  const updateField = (
    field: keyof ProfileData,
    value: string
  ) => {
    setDraft((previous) => ({
      ...previous,
      [field]: value,
    }))

    setError('')
  }

  const startEditing = () => {
    setDraft({ ...profile })
    setEditing(true)
    setSavedMessage(false)
    setError('')
  }

  const cancelEditing = () => {
    setDraft({ ...profile })
    setEditing(false)
    setError('')
  }

  const saveProfile = () => {
    if (
      !draft.firstName.trim() ||
      !draft.lastName.trim()
    ) {
      setError('Please enter your first and last name.')
      return
    }

    if (
      draft.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        draft.email.trim()
      )
    ) {
      setError('Please enter a valid email address.')
      return
    }

    const updated: ProfileData = {
      ...draft,
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      phone: draft.phone.trim(),
      email: draft.email.trim(),
      city: draft.city.trim(),
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
      )
    } catch {
      setError(
        'Unable to save your profile in this browser. Try a smaller photo.'
      )
      return
    }

    setProfile(updated)
    setDraft(updated)
    setEditing(false)
    setSavedMessage(true)
    setError('')
  }

  const handlePhotoChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please choose a JPG, PNG or WebP image.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Please choose an image smaller than 2 MB.')
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('avatar', reader.result)
      }
    }

    reader.onerror = () => {
      setError('Unable to read this image.')
    }

    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const fieldStyle: CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '15px 16px',
    background: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: 0,
    color: colors.navy,
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outlineColor: colors.petrol,
  }

  const labelStyle: CSSProperties = {
    display: 'block',
    fontSize: 11,
    letterSpacing: 1.3,
    fontWeight: 700,
    color: colors.petrol,
    marginBottom: 10,
    textTransform: 'uppercase',
  }

  const fields: {
    label: string
    key: keyof ProfileData
    placeholder: string
    type?: string
  }[] = [
    {
      label: 'First Name',
      key: 'firstName',
      placeholder: 'Your first name',
    },
    {
      label: 'Last Name',
      key: 'lastName',
      placeholder: 'Your last name',
    },
    {
      label: 'Phone Number',
      key: 'phone',
      placeholder: '+98 912 000 0000',
      type: 'tel',
    },
    {
      label: 'Email Address',
      key: 'email',
      placeholder: 'name@example.com',
      type: 'email',
    },
    {
      label: 'Date of Birth',
      key: 'birthDate',
      placeholder: '',
      type: 'date',
    },
    {
      label: 'City',
      key: 'city',
      placeholder: 'Your city',
    },
  ]

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
          padding: '25px 6%',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <button
          onClick={onBack}
          style={{
            border: 0,
            background: 'transparent',
            color: colors.navy,
            fontSize: 27,
            fontWeight: 700,
            fontFamily: "'Playfair Display', serif",
            cursor: 'pointer',
          }}
        >
          HAMRAH
          <span style={{ color: colors.petrol }}>
            .
          </span>
        </button>

        <button
          onClick={onBack}
          style={{
            padding: '13px 20px',
            border: `1px solid ${colors.border}`,
            background: 'transparent',
            color: colors.navy,
            cursor: 'pointer',
          }}
        >
          ← Back to Home
        </button>
      </header>

      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '80px 24px 40px',
        }}
      >
        <span
          style={{
            color: colors.petrol,
            fontSize: 11,
            letterSpacing: 3,
            fontWeight: 700,
          }}
        >
          YOUR PERSONAL SPACE / HAMRAH
        </span>

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            color: colors.navy,
            fontSize: 'clamp(48px, 7vw, 76px)',
            fontWeight: 500,
            lineHeight: 1.15,
            margin: '24px 0',
          }}
        >
          A space that's
          <br />
          <em>uniquely yours.</em>
        </h1>

        <p
          style={{
            color: colors.muted,
            lineHeight: 1.9,
            maxWidth: 600,
          }}
        >
          Your details, your preferences, and your
          companionship journey — all in one
          thoughtful space.
        </p>
      </section>

      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '10px 24px 100px',
        }}
      >
        <div
          style={{
            background: colors.white,
            border: `1px solid ${colors.border}`,
            padding: 'clamp(24px, 4vw, 48px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 25,
              paddingBottom: 35,
              borderBottom: `1px solid ${colors.border}`,
            }}
          >
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: '50%',
                overflow: 'hidden',
                background: colors.mist,
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              {(editing ? draft.avatar : profile.avatar) ? (
                <img
                  src={
                    editing
                      ? draft.avatar
                      : profile.avatar
                  }
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <span
                  style={{
                    fontSize: 45,
                    color: colors.petrol,
                  }}
                >
                  ♡
                </span>
              )}
            </div>

            <div style={{ flex: '1 1 200px' }}>
              <span
                style={{
                  fontSize: 11,
                  color: colors.petrol,
                  letterSpacing: 2,
                  fontWeight: 700,
                }}
              >
                MEMBER PROFILE
              </span>

              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: colors.navy,
                  fontWeight: 500,
                  fontSize: 32,
                  margin: '10px 0',
                }}
              >
                {fullName || 'Your Profile'}
              </h2>

              <p
                style={{
                  color: colors.muted,
                  fontSize: 13,
                  margin: 0,
                }}
              >
                {profile.email ||
                  'Add your details to personalise your experience.'}
              </p>

              {editing && (
                <div style={{ marginTop: 15 }}>
                  <label
                    style={{
                      ...labelStyle,
                      cursor: 'pointer',
                      display: 'inline-block',
                    }}
                  >
                    Change Profile Photo ↗
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handlePhotoChange}
                      style={{ display: 'none' }}
                    />
                  </label>

                  {draft.avatar && (
                    <button
                      type="button"
                      onClick={() =>
                        updateField('avatar', '')
                      }
                      style={{
                        display: 'block',
                        border: 0,
                        background: 'transparent',
                        color: colors.muted,
                        cursor: 'pointer',
                        fontSize: 12,
                      }}
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              )}
            </div>

            {!editing && (
              <button
                onClick={startEditing}
                style={{
                  background: colors.navy,
                  color: colors.white,
                  border: 0,
                  padding: '16px 25px',
                  cursor: 'pointer',
                }}
              >
                Edit Profile ↗
              </button>
            )}
          </div>

          <div style={{ paddingTop: 40 }}>
            <span
              style={{
                color: colors.petrol,
                letterSpacing: 2,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              01 / PERSONAL INFORMATION
            </span>

            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 29,
                fontWeight: 500,
                color: colors.navy,
                margin: '12px 0 30px',
              }}
            >
              The details that matter.
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: '25px 30px',
              }}
            >
              {fields.map((field) => (
                <div key={field.key}>
                  <label style={labelStyle}>
                    {field.label}
                  </label>

                  {editing ? (
                    <input
                      type={field.type || 'text'}
                      value={draft[field.key]}
                      placeholder={field.placeholder}
                      onChange={(event) =>
                        updateField(
                          field.key,
                          event.target.value
                        )
                      }
                      style={fieldStyle}
                    />
                  ) : (
                    <div
                      style={{
                        padding: '15px 0',
                        borderBottom: `1px solid ${colors.border}`,
                        minHeight: 22,
                        color: profile[field.key]
                          ? colors.navy
                          : colors.muted,
                        fontSize: 14,
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {profile[field.key] || 'Not added yet'}
                    </div>
                  )}
                </div>
              ))}

              <div>
                <label style={labelStyle}>
                  Preferred Language
                </label>

                {editing ? (
                  <select
                    value={draft.language}
                    onChange={(event) =>
                      updateField(
                        'language',
                        event.target.value
                      )
                    }
                    style={fieldStyle}
                  >
                    <option value="English">
                      English
                    </option>
                    <option value="Persian">
                      Persian
                    </option>
                    <option value="Both">
                      English & Persian
                    </option>
                  </select>
                ) : (
                  <div
                    style={{
                      padding: '15px 0',
                      borderBottom: `1px solid ${colors.border}`,
                      color: colors.navy,
                      fontSize: 14,
                    }}
                  >
                    {profile.language}
                  </div>
                )}
              </div>
            </div>

            {error && (
              <p
                role="alert"
                style={{
                  color: '#B04444',
                  fontSize: 13,
                  marginTop: 25,
                }}
              >
                {error}
              </p>
            )}

            {savedMessage && !editing && (
              <p
                role="status"
                style={{
                  color: colors.petrol,
                  fontSize: 13,
                  marginTop: 25,
                }}
              >
                ✓ Your profile has been saved successfully.
              </p>
            )}

            {editing && (
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  flexWrap: 'wrap',
                  marginTop: 35,
                }}
              >
                <button
                  onClick={saveProfile}
                  style={{
                    padding: '16px 28px',
                    background: colors.navy,
                    color: colors.white,
                    border: 0,
                    cursor: 'pointer',
                  }}
                >
                  Save Changes ↗
                </button>

                <button
                  onClick={cancelEditing}
                  style={{
                    padding: '16px 28px',
                    background: 'transparent',
                    color: colors.navy,
                    border: `1px solid ${colors.border}`,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: 25,
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 20,
          }}
        >
          <button
            onClick={onBookings}
            style={{
              textAlign: 'left',
              padding: 30,
              background: colors.mist,
              border: 0,
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: colors.petrol,
                letterSpacing: 2,
              }}
            >
              YOUR JOURNEY / 02
            </span>

            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                color: colors.navy,
                fontSize: 28,
                fontWeight: 500,
              }}
            >
              My Bookings ↗
            </h3>

            <p
              style={{
                color: colors.muted,
                fontSize: 13,
                lineHeight: 1.8,
              }}
            >
              Revisit your demonstration bookings
              and companionship experiences.
            </p>
          </button>

          <button
            onClick={onExplore}
            style={{
              textAlign: 'left',
              padding: 30,
              background: colors.navy,
              border: 0,
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: '#B7CDD2',
                letterSpacing: 2,
              }}
            >
              EXPLORE / 03
            </span>

            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                color: colors.white,
                fontSize: 28,
                fontWeight: 500,
              }}
            >
              Find a Companion ↗
            </h3>

            <p
              style={{
                color: '#C7D9DE',
                fontSize: 13,
                lineHeight: 1.8,
              }}
            >
              Discover thoughtful companionship
              for your next meaningful moment.
            </p>
          </button>
        </div>

        <p
          style={{
            color: colors.muted,
            fontSize: 12,
            lineHeight: 1.8,
            marginTop: 30,
            textAlign: 'center',
          }}
        >
          University demonstration only. Profile data is
          stored locally in this browser, not in a secure
          user account. Please use fictional information.
        </p>
      </section>

      <footer
        style={{
          background: colors.navy,
          color: colors.white,
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

        <span
          style={{
            fontSize: 11,
            letterSpacing: 2,
          }}
        >
          GOOD COMPANY, WHEN YOU NEED IT.
        </span>

        <span style={{ fontSize: 11 }}>
          © 2026 HAMRAH
        </span>
      </footer>
    </main>
  )
}

export default MyProfile
