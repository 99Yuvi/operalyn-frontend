import { Link } from 'react-router-dom'

const STEPS = [
  { n: '01', title: 'Post a project',        desc: 'Describe what you need. Set your budget. Choose the skills required.', role: 'client' },
  { n: '02', title: 'Receive proposals',     desc: 'Skilled freelancers submit bids with cover letters and timelines.', role: 'client' },
  { n: '03', title: 'Hire with confidence',  desc: 'Review profiles, ratings, and portfolios. Hire the right person.', role: 'both' },
  { n: '04', title: 'Work & get paid',        desc: 'Milestones keep work on track. Payment releases when you approve.', role: 'both' },
]

const CATEGORIES = [
  { icon: '⚙️', name: 'Development' },
  { icon: '🎨', name: 'Design' },
  { icon: '📣', name: 'Marketing' },
  { icon: '✍️', name: 'Writing' },
  { icon: '💼', name: 'Business' },
  { icon: '🎬', name: 'Media' },
  { icon: '🏗️', name: 'Architecture' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Nav */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-slate-800" style={{ fontFamily: 'Georgia, serif' }}>Operalyn</span>
          <div className="flex items-center gap-3">
            <Link to="/auth/login" className="text-sm text-slate-600 hover:text-slate-800 font-medium">Sign in</Link>
            <Link to="/auth/register" className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200 mb-6">
          India's professional freelance marketplace
        </div>
        <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6" style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.03em' }}>
          Hire skilled freelancers.<br />
          <span className="text-slate-400">Get paid for great work.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Operalyn connects businesses with India's top independent professionals — developers, designers, marketers, and more.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/auth/register" className="rounded-xl bg-slate-700 px-7 py-3.5 text-base font-semibold text-white hover:bg-slate-800 transition-colors">
            Post a project — free
          </Link>
          <Link to="/auth/register" className="rounded-xl border border-slate-300 px-7 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Browse projects
          </Link>
        </div>
        <p className="text-xs text-slate-400 mt-4">No setup fee · 12% platform commission on completed contracts only</p>
      </section>

      {/* Categories */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-center mb-6">Browse by category</p>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map(c => (
              <div key={c.name} className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:border-slate-300 cursor-pointer transition-colors">
                <span className="text-xl">{c.icon}</span>{c.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-3" style={{ fontFamily: 'Georgia, serif' }}>How it works</h2>
        <p className="text-slate-500 text-center mb-12">From posting to payment in four steps.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map(s => (
            <div key={s.n} className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="text-4xl font-bold text-slate-100 mb-3" style={{ fontFamily: 'Georgia, serif' }}>{s.n}</div>
              <h3 className="text-base font-bold text-slate-800 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              ['7', 'Service categories'],
              ['12%', 'Platform commission'],
              ['₹0', 'Setup fee'],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>{v}</p>
                <p className="text-sm text-slate-400">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>Ready to get started?</h2>
        <p className="text-slate-500 mb-8">Join as a client to post projects, or as a freelancer to find your next engagement.</p>
        <Link to="/auth/register" className="inline-block rounded-xl bg-slate-700 px-8 py-4 text-base font-semibold text-white hover:bg-slate-800 transition-colors">
          Create a free account
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <span className="text-sm font-semibold text-slate-700" style={{ fontFamily: 'Georgia, serif' }}>Operalyn</span>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Operalyn Freelance Network Services Pvt. Ltd.</p>
          <div className="flex gap-4 text-xs text-slate-400">
            <span className="cursor-pointer hover:text-slate-600">Terms</span>
            <span className="cursor-pointer hover:text-slate-600">Privacy</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
