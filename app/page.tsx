import Link from 'next/link';
import { db } from '@/lib/db';
import BeautyHeroSlider from '@/components/BeautyHeroSlider';

const categoryImages: Record<string,string> = {
  'beauty-package':'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=88',
  'facial':'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=1200&q=88',
  'wedding':'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=88',
  'waxing':'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=88',
  'massage':'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=88',
  'mani-pedi':'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=88'
};
const fallbackHero='https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1800&q=90';
const defaultCategories = [
  ['Beauty Package','beauty-package','/services?category=beauty-package'],
  ['Facial','facial','/services?category=facial'],
  ['Wedding','wedding','/services?category=wedding'],
  ['Waxing','waxing','/services?category=waxing'],
  ['Massage','massage','/services?category=massage'],
  ['Mani+pedi','mani-pedi','/services?category=mani-pedi']
];

export default async function Home(){
  const [cats,services,settingRows,banner]=await Promise.all([
    db.category.findMany({where:{active:true},take:12,orderBy:{sortOrder:'asc'}}),
    db.service.findMany({where:{active:true},take:6,orderBy:{sortOrder:'asc'},include:{category:true}}),
    db.siteSetting.findMany(),
    db.banner.findMany({where:{active:true},orderBy:{sortOrder:'asc'}})
  ]);
  const settings=Object.fromEntries(settingRows.map(x=>[x.key,x.value]));
  const brand=settings.business_name||'The Royal Beauty';
  const city=settings.business_city||'Delhi-NCR';
  const hours=settings.opening_hours||'9:00 AM – 7:30 PM';
  const heroSlides = banner.length ? banner.map((b, index) => ({
    id: b.id,
    image: b.image || fallbackHero,
    title: b.title,
    subtitle: b.subtitle || settings.short_description || 'Professional beauty services delivered to your home. Relax, choose your service and let our professionals come to you.',
    link: b.link || '/booking',
    badge: index === 0 ? 'FREE PEDICURE' : 'BOOK YOUR SERVICE'
  })) : [];
  const phone=settings.phone||settings.business_phone||'+91 77038 29192';
  const promo=settings.promo_text||'₹100 OFF on Any Beauty Service | Code: BEAUTY100 | Minimum Service Value: ₹1,299';
  const categories = cats.length ? cats.slice(0,6).map(c=>({name:c.name,slug:c.slug,image:c.image||categoryImages[c.slug]||fallbackHero,href:'/services?category='+c.slug})) : defaultCategories.map(([name,slug,href])=>({name,slug,image:categoryImages[slug]||fallbackHero,href}));

  return (
    <main className="beauty-home">
      <BeautyHeroSlider slides={heroSlides} />

      <section className="beauty-rating-strip"><div className="container"><span>Excellent</span><span className="beauty-stars">★★★★★</span><b>4.9 Out Of 5</b><span>Based On 2000+ Google Review</span></div></section>

      <section className="beauty-section beauty-categories">
        <div className="container">
          <div className="beauty-section-heading"><div className="beauty-script-kicker">Our services</div><h2>Beauty Services At Home</h2></div>
          <div className="beauty-category-list">
            {categories.map(c=><Link className="beauty-category-card" href={c.href} key={c.slug}><img src={c.image} alt={c.name}/><div className="beauty-category-overlay"/><h3>{c.name}</h3></Link>)}
          </div>
          <Link href="/services" className="beauty-view-all">VIEW ALL SERVICES <span>→</span></Link>
        </div>
      </section>

      <section className="beauty-how">
        <div className="container">
          <div className="beauty-section-heading center"><div className="beauty-script-kicker">Easy booking</div><h2>How It Works</h2></div>
          <div className="beauty-how-grid">
            {[['✦','Select Your Service','Choose your beauty services or browse our services page.'],['◷','Choose A Time & Date','Choose a convenient date and time for your appointment.'],['♡','We Will Come To You','Sit back and relax. Our professional comes to your doorstep.']].map(([icon,title,text])=><div className="beauty-how-card" key={title}><div className="beauty-how-icon">{icon}</div><h3>{title}</h3><p>{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="beauty-services">
        <div className="container">
          <div className="beauty-section-heading"><div className="beauty-script-kicker">Popular picks</div><h2>Our Popular Services</h2></div>
          <div className="beauty-service-grid">
            {services.map(s=>{const image=s.image||categoryImages[s.category?.slug||'']||fallbackHero;return <Link className="beauty-service-card" href={'/services/'+s.slug} key={s.id}><img src={image} alt={s.name}/><div className="beauty-service-body"><h3>{s.name}</h3><p>{s.description||'Professional beauty service at your doorstep.'}</p><div><b>₹{s.price.toLocaleString('en-IN')}</b><span>{s.duration} mins</span></div></div></Link>})}
          </div>
          <div className="beauty-center"><Link href="/services" className="beauty-view-all">VIEW ALL SERVICES <span>→</span></Link></div>
        </div>
      </section>

      <section className="beauty-trust"><div className="container beauty-trust-grid">
        <div className="beauty-trust-stat"><div className="beauty-trust-number">{settings.review_count||'1,300+'}</div><div>Customer Reviews</div></div>
        <div className="beauty-trust-icon">☆</div>
        <div className="beauty-trust-stat"><div className="beauty-trust-number">{settings.services_completed||'20,000+'}</div><div>Services Completed</div></div>
        <div className="beauty-trust-icon">♕</div>
        <div className="beauty-trust-stat"><div className="beauty-trust-number">{settings.average_rating||'4.7+'}</div><div>Average Rating</div></div>
      </div></section>

      <section className="beauty-faq"><div className="container">
        <div className="beauty-section-heading"><div className="beauty-script-kicker">Need to know?</div><h2>Frequently Asked Question</h2></div>
        {[
          ['Why Choose Salon At Home Services?','Enjoy professional beauty care in the comfort of your home without travel, waiting rooms or salon queues.'],
          ['Which locations do you serve?','We currently focus on '+city+'. Available service areas and pincodes are managed by our team.'],
          ['What are your appointment timings?','Appointments are available every day during '+hours+'.'],
          ['How can I book a service?','Choose a service, select your date and time, add your details and confirm your booking online.']
        ].map(([q,a])=><details className="beauty-faq-item" key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}
      </div></section>

      <section className="beauty-contact-cta"><div className="container"><div><div className="beauty-script-kicker">Ready when you are</div><h2>Feel beautiful. Stay comfortable.</h2><p>Book professional beauty services at home across {city}.</p></div><div className="beauty-cta-actions"><a className="beauty-call-btn" href={'tel:'+phone.replace(/[^0-9+]/g,'')}>CALL US</a><Link className="beauty-book-btn light" href="/booking">BOOK NOW <span>›</span></Link></div></div></section>
    </main>
  );
}
