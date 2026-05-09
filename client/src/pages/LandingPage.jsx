import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { 
  DevicePhoneMobileIcon, 
  ComputerDesktopIcon, 
  SpeakerWaveIcon, 
  TvIcon,
  WrenchScrewdriverIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'
import { BoltIcon, StarIcon } from '@heroicons/react/24/solid'

export default function LandingPage() {
  const [ticketId, setTicketId] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  const handleCheckStatus = (e) => {
    e.preventDefault()
    if (ticketId) {
      alert(`Pencarian tracking tiket: ${ticketId}\nFitur tracking akan diimplementasikan!`)
    }
  }

  // Desain layanan yang unik, tidak "plek ketiplek" dengan mockup, dan memasukkan "Sound"
  const services = [
    { name: 'Smartphone', icon: DevicePhoneMobileIcon },
    { name: 'PC & Laptop', icon: ComputerDesktopIcon },
    { name: 'Sound System', icon: SpeakerWaveIcon },
    { name: 'TV & Monitor', icon: TvIcon },
    { name: 'Home Appliance', icon: BoltIcon },
    { name: 'General Repair', icon: WrenchScrewdriverIcon },
  ]

  // Placeholder untuk gambar background (bisa diganti URL asli nanti)
  const backgroundSlides = [
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundSlides.length)
    }, 5000) // Ganti gambar setiap 5 detik
    return () => clearInterval(timer)
  }, [backgroundSlides.length])

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-500/30">
      <Navbar />

      {/* Hero Section - Background Slider */}
      {/* 
        Penyesuaian mobile: 
        1. Padding lebih proporsional di mobile (pt-28 pb-40).
        2. Teks dikecilkan sedikit di mobile agar tidak penuh.
      */}
      <section className="relative pt-28 pb-40 md:pt-32 md:pb-48 lg:pt-40 lg:pb-56 overflow-hidden flex flex-col items-center justify-center">
        
        {/* Background Slides */}
        {backgroundSlides.map((slide, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
          >
            {/* Overlay Gradient agar teks putih terbaca jelas */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-brand-900/90 z-10"></div>
            <img src={slide} alt={`Slide ${idx}`} className="w-full h-full object-cover" />
          </div>
        ))}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-4 md:px-5 py-1.5 md:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 md:mb-6 shadow-lg">
            <StarIcon className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" /> Pusat Servis Elektronik No.1
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 md:mb-8 leading-[1.2] drop-shadow-lg">
            Jangan khawatir dengan <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-brand-300">
              perawatan dan servis kami!
            </span>
          </h1>
          
          <div className="flex flex-col items-center mt-2">
             <p className="text-white/80 font-bold tracking-widest uppercase mb-1 md:mb-1.5 text-[10px] md:text-sm">Hubungi Hotline Kami</p>
             <p className="text-white/60 text-[10px] md:text-xs mb-3 md:mb-4 font-medium">(Satu nomor untuk semua)</p>
             <div className="inline-flex items-center gap-2 md:gap-3 bg-brand-600 border-2 border-brand-400/50 text-white rounded-full px-6 py-2.5 md:px-8 md:py-3 shadow-2xl hover:bg-brand-500 transition-colors cursor-pointer">
               <PhoneIcon className="w-5 h-5 md:w-6 md:h-6 text-brand-100" />
               <span className="text-xl md:text-3xl font-black tracking-wider">0800 111 4444</span>
             </div>
          </div>
        </div>
      </section>

      {/* Floating Overlapping Card */}
      {/* 
        Penyesuaian mobile: 
        1. -mt-24 di mobile agar overlap tidak terlalu tinggi.
        2. Padding dikurangi (p-5 md:p-12).
        3. Jarak grid lebih kecil.
      */}
      <section className="relative -mt-24 md:-mt-36 z-30 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-24">
        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-5 sm:p-8 md:p-12 border border-slate-100">
          
          {/* Services Grid inside card */}
          <div className="flex flex-col xl:flex-row gap-6 md:gap-8 items-center border-b border-slate-100 pb-8 md:pb-10">
            <h2 className="text-lg md:text-2xl font-bold text-slate-800 whitespace-nowrap text-center xl:text-left mb-2 xl:mb-0">
              Layanan kami
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 w-full">
               {services.map((svc, idx) => (
                 <Link to="/book" key={idx} className="flex flex-col items-center justify-center p-3 md:p-4 rounded-xl md:rounded-2xl border border-transparent bg-slate-50 hover:bg-brand-50 hover:border-brand-200 transition-all text-center group cursor-pointer">
                   <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                     <svc.icon className="w-5 h-5 md:w-6 md:h-6 text-brand-600" />
                   </div>
                   <span className="text-[10px] md:text-[11px] font-bold text-slate-700 leading-tight uppercase text-center w-full">
                     {svc.name}
                   </span>
                 </Link>
               ))}
            </div>
          </div>

          {/* Tracking Input inside card */}
          <div className="pt-6 md:pt-10 flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-center">
             <h3 className="text-xs md:text-sm font-bold text-slate-500 whitespace-nowrap uppercase tracking-widest text-center">
               Cek status servis kamu
             </h3>
             <form onSubmit={handleCheckStatus} className="flex flex-col sm:flex-row w-full max-w-2xl gap-2 md:gap-3">
               <input 
                 type="text" 
                 value={ticketId}
                 onChange={(e) => setTicketId(e.target.value)}
                 placeholder="Masukkan kode tiket (GT-XXX...)" 
                 className="flex-1 py-3 px-4 md:py-4 md:px-6 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-slate-400 text-slate-800"
               />
               <button type="submit" className="btn-primary py-3 px-8 md:py-4 md:px-10 text-xs md:text-sm font-bold rounded-lg md:rounded-xl shadow-lg shadow-brand-500/30 whitespace-nowrap justify-center">
                 CEK STATUS
               </button>
             </form>
          </div>

        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200 bg-slate-50">
        &copy; 2024 AYOO SERVIS. All rights reserved.
      </footer>
    </div>
  )
}
