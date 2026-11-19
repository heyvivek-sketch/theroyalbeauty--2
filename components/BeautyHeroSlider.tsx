"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Slide = {
  id: string | number;
  image: string;
  title: string;
  subtitle?: string | null;
  link?: string | null;
  badge?: string;
};

const fallbackSlides: Slide[] = [
  {
    id: 'default-1',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1800&q=90',
    title: "Delhi's trusted at-home beauty service",
    subtitle: 'Professional beauty services delivered to your home. Relax, choose your service and let our professionals come to you.',
    link: '/booking',
    badge: 'FREE PEDICURE',
  },
  {
    id: 'default-2',
    image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=1800&q=90',
    title: 'Salon-quality care, right at your doorstep',
    subtitle: 'Facials, waxing, massage, nails and more — booked in a few simple steps.',
    link: '/services',
    badge: 'BOOK YOUR SERVICE',
  },
  {
    id: 'default-3',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=90',
    title: 'Look beautiful for every special moment',
    subtitle: 'Professional beauty care for parties, weddings and everyday self-care.',
    link: '/services?category=wedding',
    badge: 'SPECIAL OCCASION',
  },
];

export default function BeautyHeroSlider({ slides = [] }: { slides?: Slide[] }) {
  const items = slides.length >= 2 ? slides : slides.length === 1 ? [slides[0], ...fallbackSlides.slice(1)] : fallbackSlides;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % items.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [paused, items.length]);

  const goTo = (index: number) => setActive((index + items.length) % items.length);
  const next = () => goTo(active + 1);
  const prev = () => goTo(active - 1);

  return (
    <section
      className="beauty-hero beauty-hero-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => setTouchStart(e.changedTouches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        if (touchStart === null) return;
        const end = e.changedTouches[0]?.clientX ?? touchStart;
        const distance = end - touchStart;
        if (Math.abs(distance) > 45) (distance < 0 ? next : prev)();
        setTouchStart(null);
      }}
      aria-roledescription="carousel"
      aria-label="Featured beauty services"
    >
      {items.map((slide, index) => (
        <div
          key={slide.id}
          className={'beauty-hero-slide' + (index === active ? ' is-active' : '')}
          aria-hidden={index !== active}
        >
          <div className="beauty-hero-image">
            <img src={slide.image} alt={slide.title} />
            <div className="beauty-hero-shade" />
          </div>

          <div className="container beauty-hero-content">
            <div className="beauty-hero-copy">
              <div className="beauty-script-kicker">AT-HOME BEAUTY CARE</div>
              <h1>{slide.title}</h1>
              {slide.subtitle && <p>{slide.subtitle}</p>}

              <div className="beauty-hero-badge">
                <b>{slide.badge || 'FREE PEDICURE'}</b>
                <span>On services above ₹1,499*</span>
              </div>

              <Link href={slide.link || '/booking'} className="beauty-book-btn">
                BOOK NOW <span>›</span>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {items.length > 1 && (
        <>
          <button type="button" className="beauty-hero-arrow beauty-hero-prev" onClick={prev} aria-label="Previous slide">‹</button>
          <button type="button" className="beauty-hero-arrow beauty-hero-next" onClick={next} aria-label="Next slide">›</button>

          <div className="beauty-hero-dots" role="tablist" aria-label="Hero slides">
            {items.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={'beauty-hero-dot' + (index === active ? ' is-active' : '')}
                onClick={() => goTo(index)}
                aria-label={'Go to slide ' + (index + 1)}
                aria-selected={index === active}
                role="tab"
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
