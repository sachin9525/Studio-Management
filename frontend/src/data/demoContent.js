const HERO_SLIDES = [
  {
    url: "https://images.pexels.com/photos/38147801/pexels-photo-38147801.jpeg?auto=compress&cs=tinysrgb&w=1920",
    alt: "Close-up of an Indian couple in traditional wedding attire",
    caption: "Portraits"
  },
  {
    url: "https://images.pexels.com/photos/32327732/pexels-photo-32327732.jpeg?auto=compress&cs=tinysrgb&w=1920",
    alt: "Bride and groom performing a traditional wedding ritual",
    caption: "Rituals"
  },
  {
    url: "https://images.pexels.com/photos/32483856/pexels-photo-32483856.jpeg?auto=compress&cs=tinysrgb&w=1920",
    alt: "A joyful couple celebrates their Indian wedding",
    caption: "Celebration"
  }
];
const STUDIO_STATS = [
  { value: "500+", label: "Weddings Covered" },
  { value: "1000+", label: "Happy Clients" },
  { value: "8+", label: "Years Experience" },
  { value: "50+", label: "Cities Covered" }
];
const SERVICES = [
  {
    id: "wedding-photography",
    name: "Wedding Photography",
    description: "Timeless frames of every ritual, glance and embrace of your wedding day.",
    image: "https://images.pexels.com/photos/4128977/pexels-photo-4128977.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    id: "wedding-videography",
    name: "Wedding Videography",
    description: "Cinematic wedding films that replay your story frame by frame.",
    image: "https://images.pexels.com/photos/33975526/pexels-photo-33975526.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    id: "pre-wedding",
    name: "Pre-Wedding Shoot",
    description: "Relaxed, romantic portraits before the big day begins.",
    image: "https://images.pexels.com/photos/30372650/pexels-photo-30372650.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    id: "birthday",
    name: "Birthday Photography",
    description: "Joy, candles and laughter captured for every milestone birthday.",
    image: "https://images.pexels.com/photos/30682919/pexels-photo-30682919.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    id: "engagement",
    name: "Engagement Photography",
    description: "Celebrate the promise with elegant engagement portraits.",
    image: "https://images.pexels.com/photos/15490147/pexels-photo-15490147.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    id: "anniversary",
    name: "Anniversary Photography",
    description: "Relive the years together with timeless anniversary coverage.",
    image: "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    id: "corporate",
    name: "Corporate Events",
    description: "Professional coverage for conferences, launches and galas.",
    image: "https://images.pexels.com/photos/9275222/pexels-photo-9275222.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    id: "traditional",
    name: "Traditional Photography",
    description: "Classic posed coverage honouring every custom and ceremony.",
    image: "https://images.pexels.com/photos/27876529/pexels-photo-27876529.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    id: "candid",
    name: "Candid Photography",
    description: "Unposed, unfiltered moments exactly as they unfold.",
    image: "https://images.pexels.com/photos/16632447/pexels-photo-16632447.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    id: "drone",
    name: "Drone Photography",
    description: "Breathtaking aerial frames of your venue and celebrations.",
    image: "https://images.pexels.com/photos/32404924/pexels-photo-32404924.jpeg?auto=compress&cs=tinysrgb&w=900"
  },
  {
    id: "album-designing",
    name: "Album Designing",
    description: "Hand-crafted albums designed to be heirlooms for generations.",
    image: "https://images.pexels.com/photos/1717969/pexels-photo-1717969.jpeg?auto=compress&cs=tinysrgb&w=900"
  }
];
const WEDDING_PORTFOLIO = [
  { url: "https://images.pexels.com/photos/32327732/pexels-photo-32327732.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Traditional wedding ritual", category: "Ceremony" },
  { url: "https://images.pexels.com/photos/38147801/pexels-photo-38147801.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Couple in wedding attire", category: "Couple" },
  { url: "https://images.pexels.com/photos/18897125/pexels-photo-18897125.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Henna and bangles", category: "Bride" },
  { url: "https://images.pexels.com/photos/17312688/pexels-photo-17312688.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Garland exchange", category: "Ceremony" },
  { url: "https://images.pexels.com/photos/37951751/pexels-photo-37951751.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Henna designs on wedding day", category: "Bride" },
  { url: "https://images.pexels.com/photos/16632447/pexels-photo-16632447.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Smiling couple", category: "Candid Moments" },
  { url: "https://images.pexels.com/photos/32483856/pexels-photo-32483856.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Joyful wedding celebration", category: "Reception" },
  { url: "https://images.pexels.com/photos/27876529/pexels-photo-27876529.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Exchanging jewelry", category: "Groom" },
  { url: "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Mehndi hands", category: "Family" },
  { url: "https://images.pexels.com/photos/38218185/pexels-photo-38218185.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Wedding hand ritual", category: "Ceremony" },
  { url: "https://images.pexels.com/photos/38681643/pexels-photo-38681643.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Colorful wedding ceremony", category: "Reception" },
  { url: "https://images.pexels.com/photos/12060074/pexels-photo-12060074.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Kanyadan ceremony", category: "Ceremony" }
];
const PREWEDDING_PORTFOLIO = [
  { url: "https://images.pexels.com/photos/30871487/pexels-photo-30871487.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Couple at historic church", category: "Outdoor" },
  { url: "https://images.pexels.com/photos/30372650/pexels-photo-30372650.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Flowing veil outdoors", category: "Cinematic" },
  { url: "https://images.pexels.com/photos/37912240/pexels-photo-37912240.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Couple at Golconda Fort", category: "Destination" },
  { url: "https://images.pexels.com/photos/32404924/pexels-photo-32404924.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Mountain top couple", category: "Destination" },
  { url: "https://images.pexels.com/photos/8296813/pexels-photo-8296813.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Rustic brick wall couple", category: "Outdoor" },
  { url: "https://images.pexels.com/photos/30161795/pexels-photo-30161795.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Elegant pre-wedding shoot", category: "Cinematic" },
  { url: "https://images.pexels.com/photos/30161854/pexels-photo-30161854.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Couple embracing outdoors", category: "Cinematic" },
  { url: "https://images.pexels.com/photos/8296801/pexels-photo-8296801.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Historical architecture shoot", category: "Outdoor" }
];
const EVENT_PORTFOLIO = [
  { url: "https://images.pexels.com/photos/30682919/pexels-photo-30682919.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Birthday party with friends", category: "Birthday" },
  { url: "https://images.pexels.com/photos/32333371/pexels-photo-32333371.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Birthday with cakes", category: "Birthday" },
  { url: "https://images.pexels.com/photos/9275222/pexels-photo-9275222.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Conference audience & keynote", category: "Corporate" },
  { url: "https://images.pexels.com/photos/15141493/pexels-photo-15141493.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Business conference", category: "Corporate" },
  { url: "https://images.pexels.com/photos/15490147/pexels-photo-15490147.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Couple in traditional clothing", category: "Engagement" },
  { url: "https://images.pexels.com/photos/27176823/pexels-photo-27176823.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Birthday with sparklers", category: "Birthday" },
  { url: "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Mehndi hands", category: "Anniversary" },
  { url: "https://images.pexels.com/photos/8761782/pexels-photo-8761782.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Conference break conversation", category: "Corporate" }
];
const ALBUMS = [
  {
    id: "rahul-priya",
    couple: "Rahul & Priya",
    date: "10 December 2026",
    location: "Bhopal",
    cover: "https://images.pexels.com/photos/32327732/pexels-photo-32327732.jpeg?auto=compress&cs=tinysrgb&w=900",
    images: [
      "https://images.pexels.com/photos/32327732/pexels-photo-32327732.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/18897125/pexels-photo-18897125.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/17312688/pexels-photo-17312688.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/37951751/pexels-photo-37951751.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/16632447/pexels-photo-16632447.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/32483856/pexels-photo-32483856.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ]
  },
  {
    id: "arjun-meera",
    couple: "Arjun & Meera",
    date: "24 November 2026",
    location: "Udaipur",
    cover: "https://images.pexels.com/photos/38147801/pexels-photo-38147801.jpeg?auto=compress&cs=tinysrgb&w=900",
    images: [
      "https://images.pexels.com/photos/38147801/pexels-photo-38147801.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/27876529/pexels-photo-27876529.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/38218185/pexels-photo-38218185.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/38681643/pexels-photo-38681643.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/12060074/pexels-photo-12060074.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ]
  },
  {
    id: "karan-anaya",
    couple: "Karan & Anaya",
    date: "5 February 2026",
    location: "Jaipur",
    cover: "https://images.pexels.com/photos/32483856/pexels-photo-32483856.jpeg?auto=compress&cs=tinysrgb&w=900",
    images: [
      "https://images.pexels.com/photos/32483856/pexels-photo-32483856.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/4128977/pexels-photo-4128977.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/16632447/pexels-photo-16632447.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/17312688/pexels-photo-17312688.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ]
  },
  {
    id: "vivaan-diya",
    couple: "Vivaan & Diya",
    date: "18 January 2026",
    location: "Delhi",
    cover: "https://images.pexels.com/photos/16632447/pexels-photo-16632447.jpeg?auto=compress&cs=tinysrgb&w=900",
    images: [
      "https://images.pexels.com/photos/16632447/pexels-photo-16632447.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/15490147/pexels-photo-15490147.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/37951751/pexels-photo-37951751.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ]
  }
];
const FEATURED_BENTO_VIDEO = {
  id: "rituals-of-udaipur",
  title: "Rituals of Udaipur — Master Wedding Film",
  caption: "Featured Masterwork",
  category: "Cinema Master Film",
  thumbnail: "https://images.pexels.com/photos/33975526/pexels-photo-33975526.jpeg?auto=compress&cs=tinysrgb&w=1200",
  poster: "https://images.pexels.com/photos/33975526/pexels-photo-33975526.jpeg?auto=compress&cs=tinysrgb&w=1200",
  videoUrl: "/videos/sample-film.mp4",
  fallbackUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
  youtubeId: "ysz5S6PUM-U",
  duration: "08:15",
  quality: "4K DCI · 24.00 FPS · PRORES 422 HQ",
  director: "Sachin V. · Master Colorist",
  description: "An emotional cinematic voyage through the majestic palatial rituals of Udaipur, shot on multi-camera cinema rigs with live Dolby soundscapes and custom 3D LUT grading."
};

const VIDEOS = [
  {
    id: "wedding-film",
    title: "Rahul & Priya — Royal Palace Wedding Film",
    caption: "Royal Palace Wedding",
    category: "Wedding Films",
    thumbnail: "https://images.pexels.com/photos/32327732/pexels-photo-32327732.jpeg?auto=compress&cs=tinysrgb&w=900",
    poster: "https://images.pexels.com/photos/32327732/pexels-photo-32327732.jpeg?auto=compress&cs=tinysrgb&w=900",
    videoUrl: "/videos/sample-film.mp4",
    fallbackUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    youtubeId: "ysz5S6PUM-U",
    duration: "04:35",
    quality: "4K DCI · 60FPS",
    director: "SVML Master Unit",
    description: "Grand traditional wedding ceremonies captured across three days with artisan cinema lenses and live multi-track audio recording."
  },
  {
    id: "wedding-highlights",
    title: "Arjun weds Meera — Palatial Highlights",
    caption: "Palatial Highlights",
    category: "Wedding Highlights",
    thumbnail: "https://images.pexels.com/photos/38147801/pexels-photo-38147801.jpeg?auto=compress&cs=tinysrgb&w=900",
    poster: "https://images.pexels.com/photos/38147801/pexels-photo-38147801.jpeg?auto=compress&cs=tinysrgb&w=900",
    videoUrl: "/videos/sample-film.mp4",
    fallbackUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    youtubeId: "aqz-KE-bpKQ",
    duration: "03:15",
    quality: "4K DCI · 60FPS",
    director: "SVML Master Unit",
    description: "Heartwarming vows, laughter, and high-energy baraat celebrations condensed into an unforgettable cinematic highlight reel."
  },
  {
    id: "prewedding-film",
    title: "Karan & Anaya — Sunset Hills Pre-Wedding",
    caption: "Sunset Hills Pre-Wedding",
    category: "Pre-Wedding Films",
    thumbnail: "https://images.pexels.com/photos/30372650/pexels-photo-30372650.jpeg?auto=compress&cs=tinysrgb&w=900",
    poster: "https://images.pexels.com/photos/30372650/pexels-photo-30372650.jpeg?auto=compress&cs=tinysrgb&w=900",
    videoUrl: "/videos/sample-film.mp4",
    fallbackUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    youtubeId: "jNQXAC9IVRw",
    duration: "05:40",
    quality: "4K DCI · 60FPS",
    director: "SVML Master Unit",
    description: "Golden hour romance in the scenic hills, featuring dramatic aerial drone cinematography and poetic storytelling."
  },
  {
    id: "cinematic",
    title: "Eternal Vows — Cinematic Slow-Motion Reel",
    caption: "Cinematic Slow-Motion Reel",
    category: "Cinematic Videos",
    thumbnail: "https://images.pexels.com/photos/32483856/pexels-photo-32483856.jpeg?auto=compress&cs=tinysrgb&w=900",
    poster: "https://images.pexels.com/photos/32483856/pexels-photo-32483856.jpeg?auto=compress&cs=tinysrgb&w=900",
    videoUrl: "/videos/sample-film.mp4",
    fallbackUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    youtubeId: "aqz-KE-bpKQ",
    duration: "02:50",
    quality: "4K DCI · 120FPS",
    director: "SVML Master Unit",
    description: "High-frame-rate 120 FPS ultra slow-motion capturing floating floral petals, sparkling jewelry, and tearful glances."
  },
  {
    id: "birthday-video",
    title: "Little Mira Turns Five — Golden Celebration",
    caption: "Golden Milestone Birthday",
    category: "Birthday Videos",
    thumbnail: "https://images.pexels.com/photos/30682919/pexels-photo-30682919.jpeg?auto=compress&cs=tinysrgb&w=900",
    poster: "https://images.pexels.com/photos/30682919/pexels-photo-30682919.jpeg?auto=compress&cs=tinysrgb&w=900",
    videoUrl: "/videos/sample-film.mp4",
    fallbackUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    youtubeId: "ysz5S6PUM-U",
    duration: "03:20",
    quality: "4K UHD · 60FPS",
    director: "SVML Master Unit",
    description: "Pure innocence and festive childhood joy documented with playful prime lenses and vibrant color palette."
  },
  {
    id: "event-video",
    title: "Annual Heritage Gala — Executive Highlights",
    caption: "Executive Gala Highlights",
    category: "Event Videos",
    thumbnail: "https://images.pexels.com/photos/9275222/pexels-photo-9275222.jpeg?auto=compress&cs=tinysrgb&w=900",
    poster: "https://images.pexels.com/photos/9275222/pexels-photo-9275222.jpeg?auto=compress&cs=tinysrgb&w=900",
    videoUrl: "/videos/sample-film.mp4",
    fallbackUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    youtubeId: "aqz-KE-bpKQ",
    duration: "06:10",
    quality: "4K DCI · 60FPS",
    director: "SVML Master Unit",
    description: "Multi-angle corporate gala production covering keynote stages, red carpet arrivals, and evening awards banquet."
  }
];
const PACKAGES = [
  {
    id: "basic",
    name: "Essential",
    price: "\u20B949,000",
    tagline: "Beautifully covered, simply priced.",
    features: [
      "Traditional photography",
      "1 professional photographer",
      "8 hours of coverage",
      "300+ edited digital photos",
      "Basic photo album",
      "Online gallery delivery"
    ],
    highlighted: false
  },
  {
    id: "standard",
    name: "Signature",
    price: "\u20B989,000",
    tagline: "Our most chosen wedding package.",
    features: [
      "Candid + traditional photography",
      "2 professional photographers",
      "Full-day coverage",
      "Cinematic wedding highlights film",
      "Premium wedding album",
      "Pre-wedding consultation",
      "Drone shots of venue"
    ],
    highlighted: true
  },
  {
    id: "premium",
    name: "Cinematic",
    price: "\u20B91,49,000",
    tagline: "The complete storytelling experience.",
    features: [
      "Candid + traditional photography",
      "3 photographers + 2 cinematographers",
      "Multi-day coverage",
      "Cinematic wedding film + highlights",
      "Pre-wedding shoot included",
      "Drone + crane coverage",
      "Premium lay-flat album",
      "Same-day edit teaser"
    ],
    highlighted: false
  }
];
const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#wedding" },
  { label: "Wedding", href: "#wedding" },
  { label: "Pre-Wedding", href: "#pre-wedding" },
  { label: "Albums", href: "#albums" },
  { label: "Videos", href: "#videos" },
  { label: "Packages", href: "#packages" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" }
];
export {
  ALBUMS,
  EVENT_PORTFOLIO,
  FEATURED_BENTO_VIDEO,
  HERO_SLIDES,
  NAV_LINKS,
  PACKAGES,
  PREWEDDING_PORTFOLIO,
  SERVICES,
  STUDIO_STATS,
  VIDEOS,
  WEDDING_PORTFOLIO
};
