
import './Services.css'

import homeImage from './assets/home-companion.jpg'
import medicalImage from './assets/medical-companion.jpg'
import seniorImage from './assets/senior-companion.jpg'
import everydayImage from './assets/everyday-companion.jpg'
import socialImage from './assets/social-companion.jpg'
import studyImage from './assets/study-companion.jpg'

const services = [
  {
    number: '01',
    title: 'Home Companion',
    subtitle: 'Comfort in familiar spaces',
    description:
      'Enjoy meaningful conversations, reading, board games, and shared moments in the comfort of your home.',
    icon: '⌂',
    image: homeImage,
  },
  {
    number: '02',
    title: 'Medical Companion',
    subtitle: 'You do not have to go alone',
    description:
      'Have someone accompany you to hospital appointments, PET scans, MRI visits, and other medical appointments. Non-clinical companionship only.',
    icon: '+',
    image: medicalImage,
  },
  {
    number: '03',
    title: 'Senior Companion',
    subtitle: 'Connection across generations',
    description:
      'Thoughtful company for walks, shopping, social activities, and everyday moments.',
    icon: '♡',
    image: seniorImage,
  },
  {
    number: '04',
    title: 'Everyday Companion',
    subtitle: 'A little help along the way',
    description:
      'Find company for shopping trips, errands, visits to the bank, and everyday outings.',
    icon: '↗',
    image: everydayImage,
  },
  {
    number: '05',
    title: 'Social Companion',
    subtitle: 'Experiences are better shared',
    description:
      'Explore galleries, attend events, visit the cinema, or discover new places together.',
    icon: '✧',
    image: socialImage,
  },
  {
    number: '06',
    title: 'Study Companion',
    subtitle: 'Learn and grow together',
    description:
      'Find a study partner for library sessions, focused work, and educational activities.',
    icon: '✎',
    image: studyImage,
  },
]

type ServicesProps = {
  onBack: () => void
  onSelect: (service: string) => void
}

function Services({ onBack, onSelect }: ServicesProps) {
  return (
    <div className="services-page">
      <header className="services-nav">
        <button
          className="services-logo"
          onClick={onBack}
        >
          HAMRAH<span>.</span>
        </button>

        <button
          className="services-back"
          onClick={onBack}
        >
          ← Back to Home
        </button>
      </header>

      <section className="services-hero">
        <div className="services-hero-top">
          <span>THE HAMRAH EXPERIENCE</span>
          <span>01 / 06</span>
        </div>

        <h1>
          Every moment deserves
          <br />
          <em>good company.</em>
        </h1>

        <p>
          Explore companionship designed around your needs,
          your interests, and your everyday life.
        </p>
      </section>

      <section className="services-content">
        <div className="services-intro">
          <span>DISCOVER OUR SERVICES</span>

          <p>
            Choose the experience that feels right for you.
          </p>
        </div>

        <div className="services-list">
          {services.map((service) => (
            <article
              key={service.number}
              className="services-list-card"
            >
              <div className="services-card-image">
                <img
                  src={service.image}
                  alt={`${service.title} companionship`}
                  loading="lazy"
                />
              </div>

              <div className="services-card-copy">
                <div className="services-card-meta">
                  <span className="services-card-number">
                    {service.number} / SERVICE
                  </span>

                  <span className="services-card-small-icon">
                    {service.icon}
                  </span>
                </div>

                <h2>{service.title}</h2>
                <h3>{service.subtitle}</h3>
                <p>{service.description}</p>

                <button
                  className="services-card-button"
                  onClick={() => onSelect(service.title)}
                >
                  Explore Service <span>↗</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="services-ending">
          <span>GOOD COMPANY, WHEN YOU NEED IT.</span>

          <h2>
            The right company can
            <br />
            change <em>everything.</em>
          </h2>
        </div>
      </section>

      <footer className="services-footer">
        <strong>HAMRAH.</strong>
        <span>GOOD COMPANY, WHEN YOU NEED IT.</span>
      </footer>
    </div>
  )
}

export default Services
