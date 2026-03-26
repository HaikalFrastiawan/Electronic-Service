import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { BoltIcon, ShieldCheckIcon, ClockIcon, WrenchScrewdriverIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 selection:bg-brand-500/30 selection:text-brand-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-brand-600/10 blur-[120px] rounded-full -z-10" />
        <div className="absolute top-20 right-0 w-72 h-72 bg-purple-600/5 blur-[100px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            Premium Repair Service
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Revive Your Electronics <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">With Expert Precision.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            From consoles to high-end home appliances, we provide fast, reliable, and guaranteed repair services for all your favorite devices.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <Link to="/book" className="btn-primary py-4 px-10 text-lg font-bold shadow-2xl shadow-brand-600/30 w-full sm:w-auto hover:scale-105 transition-transform">
              Book a Repair Now
            </Link>
            <a href="#features" className="btn-ghost py-4 px-10 text-lg font-semibold w-full sm:w-auto hover:bg-slate-900">
              Explore Services
            </a>
          </div>

          {/* Trust Badges */}
          <div className="mt-20 pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center justify-center gap-2 font-bold text-xl tracking-tighter">SONY</div>
            <div className="flex items-center justify-center gap-2 font-bold text-xl tracking-tighter">SAMSUNG</div>
            <div className="flex items-center justify-center gap-2 font-bold text-xl tracking-tighter">LG</div>
            <div className="flex items-center justify-center gap-2 font-bold text-xl tracking-tighter">PANASONIC</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose ElektroServ?</h2>
            <p className="text-slate-400 max-w-xl mx-auto">We combine years of experience with modern tools to deliver the best repair quality in town.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 bg-slate-900 border-slate-800 hover:border-brand-500/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheckIcon className="w-7 h-7 text-brand-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Guaranteed Quality</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Every repair comes with a 3-month warranty. We stand by our work and ensure your device lasts.</p>
            </div>

            <div className="card p-8 bg-slate-900 border-slate-800 hover:border-brand-500/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ClockIcon className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Express Repair</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Most minor repairs are finished within 24 hours. We know your devices are essential to your daily life.</p>
            </div>

            <div className="card p-8 bg-slate-900 border-slate-800 hover:border-brand-500/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <WrenchScrewdriverIcon className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Certified Techs</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Our technicians are certified professionals who undergo regular training for the latest technology.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-600/10 -z-10" />
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Ready to fix your device?</h2>
          <p className="text-lg text-slate-400 mb-10">Start your repair journey today by booking online. It only takes 2 minutes and our team will get back to you immediately.</p>
          <Link to="/book" className="btn-primary py-4 px-12 text-lg font-bold shadow-xl shadow-brand-600/20 inline-flex items-center gap-3 active:scale-95 transition-all">
            Get Started Now <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <BoltIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">ElektroServ</span>
          </div>
          <p className="text-sm text-slate-500">&copy; 2024 Haikal Electronic Service. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
