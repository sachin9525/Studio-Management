import { useEffect, useState } from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import { apiRequest } from '@/utils/api';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

function TestimonialSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCurrent = true;
    apiRequest('/testimonials')
      .then((data) => { if (isCurrent) setTestimonials(data.testimonials || []); })
      .catch((requestError) => { if (isCurrent) setError(requestError instanceof Error ? requestError.message : 'Unable to load testimonials.'); })
      .finally(() => { if (isCurrent) setLoading(false); });
    return () => { isCurrent = false; };
  }, []);

  useEffect(() => {
    if (testimonials.length < 2) return undefined;
    const timer = setInterval(() => setActive((index) => (index + 1) % testimonials.length), 7000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const current = testimonials.length ? testimonials[active % testimonials.length] : null;
  const move = (direction) => setActive((index) => (index + direction + testimonials.length) % testimonials.length);

  return <section id="testimonials" className="section-pad bg-ink-950 bg-grain"><div className="container-max">
    <SectionHeading eyebrow="Client Love" title="Words from our couples" subtitle="We are honoured to have documented over a thousand celebrations. Here is what some of our families say." />
    {loading ? <p className="py-12 text-center text-sm text-ink-500">Loading testimonials…</p> : error ? <p role="alert" className="py-12 text-center text-sm text-red-300">{error}</p> : current ? <div className="relative mx-auto max-w-4xl">
      <Quote className="mx-auto mb-8 h-16 w-16 text-gold-400/20" />
      <div key={current._id} className="animate-fade-in text-center">
        <div className="mb-6 flex justify-center gap-1">{Array.from({ length: current.rating || 5 }, (_, index) => <Star key={index} className="h-5 w-5 fill-current text-gold-400" />)}</div>
        <p className="mx-auto mb-8 max-w-3xl text-balance font-serif text-2xl italic leading-relaxed text-ink-100 md:text-3xl">“{current.review}”</p>
        <div className="flex items-center justify-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-gold-400/40 bg-gold-400/10 font-serif text-gold-300">
            {current.imageUrl || current.image?.url ? <img src={current.imageUrl || current.image.url} alt={current.name} className="h-full w-full object-cover" /> : current.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="text-left">
            <p className="font-serif text-lg text-ink-50">{current.name}</p>
            <p className="mt-0.5 text-xs uppercase tracking-widest text-gold-400">{current.role}</p>
          </div>
        </div>
      </div>
      {testimonials.length > 1 && <div className="mt-10 flex items-center justify-center gap-4">
        <button type="button" onClick={() => move(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ink-300 transition-colors hover:border-gold-400 hover:text-gold-400" aria-label="Previous testimonial"><ChevronLeft className="h-5 w-5" /></button>
        <div className="flex gap-2">{testimonials.map((item, index) => <button key={item._id} type="button" onClick={() => setActive(index)} className={`h-1.5 rounded-full transition-all ${index === active % testimonials.length ? 'w-8 bg-gold-400' : 'w-1.5 bg-ink-600 hover:bg-ink-400'}`} aria-label={`Go to testimonial ${index + 1}`} />)}</div>
        <button type="button" onClick={() => move(1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ink-300 transition-colors hover:border-gold-400 hover:text-gold-400" aria-label="Next testimonial"><ChevronRight className="h-5 w-5" /></button>
      </div>}
    </div> : <p className="py-12 text-center text-sm text-ink-500">No testimonials have been published yet.</p>}
  </div></section>;
}

export default TestimonialSection;
