import Link from 'next/link';
import { db } from '@/lib/db';

const categoryImages: Record<string,string> = {
  'face-wax':'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=900&q=85',
  'threading':'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85',
  'facial':'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=900&q=85',
  'honey-wax':'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=900&q=85',
  'rica-wax':'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=85',
  'mani-pedi':'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85',
  'pedicure':'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=900&q=85',
  'manicure':'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=85',
  'raaga':'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=85',
  'bleach':'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=900&q=85',
  'massage':'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=85',
  'polishing':'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=85'
};

const serviceImages: Record<string,string> = {
  'korean-facial':'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=1000&q=85',
  'red-wine-facial':'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1000&q=85',
  'full-body-massage':'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=85',
  'full-body-polishing':'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85',
  'classic-mani-pedi':'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1000&q=85',
  'full-face-wax':'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1000&q=85'
};

const fallbackHero='https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1400&q=88';

export default async function Home(){
  const [cats,services,settingRows,banner]=await Promise.all([
    db.category.findMany({where:{active:true},take:12,orderBy:{sortOrder:'asc'}}),
    db.service.findMany({where:{active:true},take:8,orderBy:{sortOrder:'asc'},include:{category:true}}),
    db.siteSetting.findMany(),
    db.banner.findFirst({where:{active:true},orderBy:{sortOrder:'asc'}})
  ]);

  const settings=Object.fromEntries(settingRows.map(x=>[x.key,x.value]));
  const brand=settings.business_name||'The Royal Beauty';
  const city=settings.business_city||'Delhi-NCR';
  const whatsapp=settings.whatsapp_url||'/booking';
  const hours=settings.opening_hours||'9:00 AM – 7:30 PM';
  const tagline=settings.hero_tagline||'Your beauty. Your home. Your time.';
  const description=settings.short_description||'Professional beauty and self-care services delivered to your home. Pick a service, choose your slot and relax.';
  const heroImage=banner?.image||fallbackHero;

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Salon services at your doorstep</div>
            <h1>{tagline.split('.').filter(Boolean).map((x,i)=><span key={i}>{x.trim()}.<br/></span>)}</h1>
            <p>{description}</p>
            <div className="hero-actions">
              <Link className="btn" href="/services">Explore services</Link>
              <Link className="btn secondary" href="/booking">Book now</Link>
            </div>
          </div>
          <div className="hero-photo">
            <img src={heroImage} alt={banner?.title||brand+' home beauty service'}/>
            <div className="hero-rating">
              <b>4.9/5 customer rating</b>
              <span>Trusted home beauty professionals · {city}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="eyebrow">Popular categories</div>
          <h2>Everything you need, at home</h2>
          <p className="muted">Real salon services, delivered to your doorstep.</p>
          <div className="cats" style={{marginTop:25}}>
            {cats.map(c=>{
              const image=c.image||categoryImages[c.slug]||fallbackHero;
              return (
                <Link className="cat" href={'/services?category='+c.slug} key={c.id}>
                  <div className="cat-img"><img src={image} alt={c.name}/></div>
                  <b>{c.name}</b>
                  <p className="muted">Browse services <span aria-hidden>→</span></p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section services-section">
        <div className="container">
          <div className="eyebrow">Bestsellers</div>
          <h2>Popular home services</h2>
          <p className="muted">Book trusted beauty treatments without leaving home.</p>
          <div className="cards" style={{marginTop:25}}>
            {services.map(s=>{
              const image=s.image||serviceImages[s.slug]||categoryImages[s.category?.slug||'']||fallbackHero;
              return (
                <Link className="card" href={'/services/'+s.slug} key={s.id}>
                  <div className="card-img"><img src={image} alt={s.name}/></div>
                  <b>{s.name}</b>
                  <p className="muted">{s.description}</p>
                  <div className="service-bottom">
                    <div>
                      <div className="price">₹{s.price.toLocaleString('en-IN')}</div>
                      <div className="meta">{s.duration} mins · At home</div>
                    </div>
                    <span className="service-arrow">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="eyebrow">How it works</div>
          <h2>Simple from start to finish</h2>
          <div className="steps" style={{marginTop:25}}>
            {[['1','Select your service','Choose a beauty service or package.'],['2','Choose date & time','Pick an available slot that works for you.'],['3','We come to you','A verified professional arrives at your doorstep.']].map(x=>
              <div className="step" key={x[0]}>
                <div className="num">{x[0]}</div>
                <h3>{x[1]}</h3>
                <p className="muted">{x[2]}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container">
          <div className="eyebrow">FAQs</div>
          <h2>Frequently asked questions</h2>
          {['Why choose salon-at-home services?','Which locations do you serve?','Can I request a specific beauty professional?','How do you ensure client safety?'].map(q=>
            <div className="faq" key={q}>
              <b>{q}</b>
              <p className="muted">Our team focuses on convenience, verified professionals, hygiene and a smooth booking experience at home.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
