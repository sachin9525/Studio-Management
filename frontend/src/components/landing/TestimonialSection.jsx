import { useEffect, useState } from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import { apiRequest } from '@/utils/api';
import { ChevronLeft, ChevronRight, Quote, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import TiltCard3D from '@/components/3d/TiltCard3D';

const FALLBACK_TESTIMONIALS = [
  {
    _id: 't-1',
    name: 'Pooja & Siddharth Sharma',
    role: 'Destination Wedding · Udaipur Palace',
    rating: 5,
    review:
      'Sachin Video Mixing Lab didn’t just record our wedding, they captured the soul of every ritual. When we watched the 4K cinematic film with our families, there wasn’t a single dry eye. The 24-hour teaser delivery was astonishing!',
    imageUrl: 'https://images.pexels.com/photos/38147801/pexels-photo-38147801.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    _id: 't-2',
    name: 'Ananya & Rohan Mehra',
    role: 'Royal Wedding · Jaipur Heritage Fort',
    rating: 5,
    review:
      'The multi-camera drone shots of the baraat and the candids during the pheras look like a high-budget Bollywood production. The leather layflat album is pure luxury. We couldn’t have asked for a better team.',
    imageUrl: 'https://images.pexels.com/photos/32327732/pexels-photo-32327732.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    _id: 't-3',
    name: 'Dr. Kavita & Vikramaditya',
    role: 'Pre-Wedding & Reception · Bhopal Lakeview',
    rating: 5,
    review:
      'Super professional, unobtrusive yet always in the right place at the right second. The color grading on our pre-wedding shoot was breathtaking. Truly the finest photography studio in Central India.',
    imageUrl: 'https://images.pexels.com/photos/16632447/pexels-photo-16632447.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
];

function TestimonialSection() {
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    apiRequest('/testimonials')
      .then((data) => {
        if (isCurrent && data.testimonials && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
        }
      })
      .catch(() => {});
    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    if (testimonials.length < 2) return undefined;
    const timer = setInterval(() => setActive((index) => (index + 1) % testimonials.length), 7500);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const current = testimonials[active % testimonials.length];
  const move = (direction) =>
    setActive((index) => (index + direction + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="section-pad bg-ink-950 bg-grain relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold-400/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-max relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[10px] uppercase tracking-widest font-semibold mb-3">
            <Sparkles className="w-3 h-3 text-gold-400" />
            <span>Verified Couple Reviews</span>
          </div>
          <h2 className="heading-serif text-3xl sm:text-4xl md:text-5xl text-ink-50 font-normal">
            Cherished by Over <span className="italic text-gold-300">1,000 Families</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-ink-300 font-light max-w-xl mx-auto">
            Honoured to document memories across Rajasthan, Madhya Pradesh, Delhi NCR, and destination venues across India.
          </p>
        </div>

        {/* 3D Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <TiltCard3D
            maxTilt={7}
            className="rounded-sm p-8 sm:p-12 bg-gradient-to-br from-ink-900/90 via-ink-900/70 to-ink-950 border border-white/10 hover:border-gold-400/40 shadow-2xl relative overflow-hidden"
          >
            <Quote className="mx-auto mb-6 h-12 w-12 text-gold-400/30" />

            <div key={current._id} className="animate-fade-in text-center relative z-10">
              {/* Star Rating */}
              <div className="mb-6 flex justify-center gap-1.5">
                {Array.from({ length: current.rating || 5 }, (_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current text-gold-400 drop-shadow-[0_0_8px_rgba(216,179,106,0.5)]" />
                ))}
              </div>

              {/* Review Text */}
              <p className="mx-auto mb-8 max-w-3xl font-serif text-xl sm:text-2xl md:text-3xl italic leading-relaxed text-ink-50">
                “{current.review}”
              </p>

              {/* Author Profile */}
              <div className="flex items-center justify-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-gold-400/60 bg-gold-400/10 font-serif text-gold-300 shadow-lg">
                  {current.imageUrl || current.image?.url ? (
                    <img
                      src={current.imageUrl || current.image.url}
                      alt={current.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    current.name?.charAt(0)?.toUpperCase()
                  )}
                </div>
                <div className="text-left">
                  <p className="font-serif text-lg sm:text-xl text-ink-50 font-medium">
                    {current.name}
                  </p>
                  <p className="text-[11px] uppercase tracking-widest text-gold-400 font-mono font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {current.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Carousel Controls */}
            {testimonials.length > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => move(-1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ink-300 transition-all hover:border-gold-400 hover:text-gold-300 hover:scale-105"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((item, index) => (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => setActive(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === active % testimonials.length
                          ? 'w-8 bg-gold-400 shadow-sm shadow-gold-400'
                          : 'w-2 bg-ink-600 hover:bg-ink-400'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => move(1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ink-300 transition-all hover:border-gold-400 hover:text-gold-300 hover:scale-105"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </TiltCard3D>
        </div>
      </div>
    </section>
  );
}

export default TestimonialSection;
