import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'
import { bookingsAPI } from '../api/services'
import { 
  SpeakerWaveIcon, 
  TvIcon,
  WrenchScrewdriverIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon as CheckCircleOutline
} from '@heroicons/react/24/outline'
import { BoltIcon, StarIcon, CheckCircleIcon } from '@heroicons/react/24/solid'

export default function LandingPage() {
  const [ticketId, setTicketId] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTracking, setIsTracking] = useState(false)
  const [trackingResult, setTrackingResult] = useState(null)
  const navigate = useNavigate()

  const handleCheckStatus = async (e) => {
    e.preventDefault()
    if (!ticketId) return
    setIsTracking(true)
    setTrackingResult(null)
    try {
      const res = await bookingsAPI.trackPublic(ticketId)
      setTrackingResult(res.data.data)
      toast.success('Tiket ditemukan!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Tiket tidak ditemukan')
    } finally {
      setIsTracking(false)
    }
  }

  // Desain layanan yang berfokus pada TV, Kipas Angin, Magicom, Mesin Cuci, Speaker
  const services = [
    { name: 'TV & Monitor', icon: TvIcon },
    { name: 'Kipas Angin', icon: BoltIcon },
    { name: 'Magicom / Rice Cooker', icon: WrenchScrewdriverIcon },
    { name: 'Mesin Cuci', icon: WrenchScrewdriverIcon },
    { name: 'Speaker / Audio', icon: SpeakerWaveIcon },
    { name: 'Elektronik Lainnya', icon: BoltIcon },
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
               <button type="submit" disabled={isTracking} className="btn-primary py-3 px-8 md:py-4 md:px-10 text-xs md:text-sm font-bold rounded-lg md:rounded-xl shadow-lg shadow-brand-500/30 whitespace-nowrap justify-center">
                 {isTracking ? 'MENCARI...' : 'CEK STATUS'}
               </button>
             </form>
          </div>

          {/* Tracking Result */}
          {trackingResult && (
            <div className="mt-8 p-6 md:p-8 bg-slate-50 border border-slate-200 rounded-2xl w-full max-w-2xl mx-auto flex flex-col gap-4 shadow-sm animate-in fade-in zoom-in duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Perangkat</p>
                  <p className="text-lg md:text-xl font-black text-slate-800 capitalize">{trackingResult.device_name}</p>
                  <p className="text-xs text-slate-500 mt-1">{trackingResult.device_type || 'Umum'}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Status Servis</p>
                  <div className={`mt-1 inline-block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    trackingResult.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                    trackingResult.status?.toLowerCase() === 'in repair' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                    trackingResult.status?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                    trackingResult.status?.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                    'bg-slate-200 text-slate-700 border-slate-300'
                  }`}>
                    {trackingResult.status}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Keluhan / Kerusakan</p>
                  <p className="text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                    {trackingResult.issue_description || 'Tidak ada deskripsi.'}
                  </p>
                </div>
                {trackingResult.estimated_cost > 0 && (
                  <div className="sm:text-right flex-shrink-0">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Estimasi Biaya</p>
                    <p className="text-lg font-bold text-brand-600">
                      Rp {Number(trackingResult.estimated_cost).toLocaleString('id-ID')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Layanan Services Detail Section */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Layanan Services</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Berikut ini beberapa layanan service elektronik oleh AYOO SERVIS.</p>
          </div>

          <div className="space-y-12">
            {/* Service 1: TV & Speaker */}
            <div className="bg-white rounded-[2rem] p-6 md:p-10 border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-10 items-center">
              <div className="w-full lg:w-2/5 relative">
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-md z-10 shadow-lg">Layanan</div>
                <img src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80" alt="Service TV & Speaker" className="w-full h-[300px] object-cover rounded-2xl shadow-inner" />
              </div>
              <div className="w-full lg:w-3/5">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Service TV & Speaker</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  AYOO SERVIS menyediakan layanan service TV LED, LCD, Smart TV, dan berbagai jenis Speaker / Sound System. Kami memiliki teknisi handal yang siap menangani kerusakan layar, suara, hingga masalah komponen mati total.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mb-8">
                  {['Layar TV bergaris / gelap', 'TV tidak ada suara', 'TV mati total', 'Speaker sember / pecah', 'Speaker Bluetooth mati', 'Ganti komponen / panel'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircleOutline className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      <span className="text-sm text-slate-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                <a href="https://wa.me/628001114444?text=Halo%20AYOO%20SERVIS,%20saya%20ingin%20memesan%20layanan%20Service%20TV%20Atau%20Speaker." target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 py-3 px-8 text-sm font-bold rounded-full shadow-lg shadow-brand-500/30">
                  <ChatBubbleLeftRightIcon className="w-5 h-5" /> Pesan via WhatsApp
                </a>
              </div>
            </div>

            {/* Service 2: Mesin Cuci */}
            <div className="bg-white rounded-[2rem] p-6 md:p-10 border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-10 items-center">
              <div className="w-full lg:w-2/5 relative lg:order-2">
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-md z-10 shadow-lg">Layanan</div>
                <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80" alt="Service Mesin Cuci" className="w-full h-[300px] object-cover rounded-2xl shadow-inner" />
              </div>
              <div className="w-full lg:w-3/5 lg:order-1">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Service Mesin Cuci</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Perbaikan mesin cuci 1 tabung (Top Load/Front Load) maupun 2 tabung. Kami memastikan mesin cuci Anda berfungsi optimal kembali tanpa harus repot membawanya ke bengkel, teknisi kami akan datang ke tempat Anda.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mb-8">
                  {['Mesin cuci bocor / air merembes', 'Air tidak mau keluar/masuk', 'Pengering tidak berputar', 'Mesin mati total / Error', 'Bunyi bising / bergetar', 'Modul kontrol rusak'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircleOutline className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      <span className="text-sm text-slate-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                <a href="https://wa.me/628001114444?text=Halo%20AYOO%20SERVIS,%20saya%20ingin%20memesan%20layanan%20Service%20Mesin%20Cuci." target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 py-3 px-8 text-sm font-bold rounded-full shadow-lg shadow-brand-500/30">
                  <ChatBubbleLeftRightIcon className="w-5 h-5" /> Pesan via WhatsApp
                </a>
              </div>
            </div>

            {/* Service 3: Kipas Angin & Magicom */}
            <div className="bg-white rounded-[2rem] p-6 md:p-10 border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-10 items-center">
              <div className="w-full lg:w-2/5 relative">
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-md z-10 shadow-lg">Layanan</div>
                <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80" alt="Service Kipas Angin & Magicom" className="w-full h-[300px] object-cover rounded-2xl shadow-inner" />
              </div>
              <div className="w-full lg:w-3/5">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Service Kipas Angin & Magicom</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Kami juga melayani perbaikan peralatan rumah tangga sehari-hari seperti Kipas Angin berbagai jenis (berdiri, dinding, gantung) dan Magicom / Rice Cooker agar bisa digunakan kembali dengan aman.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mb-8">
                  {['Kipas angin mati / putus', 'Putaran kipas lemah', 'Kipas angin berisik', 'Magicom tidak panas', 'Nasi cepat basi', 'Mati total / Error'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircleOutline className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      <span className="text-sm text-slate-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                <a href="https://wa.me/628001114444?text=Halo%20AYOO%20SERVIS,%20saya%20ingin%20memesan%20layanan%20Service%20Kipas%20Angin/Magicom." target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 py-3 px-8 text-sm font-bold rounded-full shadow-lg shadow-brand-500/30">
                  <ChatBubbleLeftRightIcon className="w-5 h-5" /> Pesan via WhatsApp
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Tentang Kami Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Tentang <span className="text-brand-600">AYOO SERVIS</span></h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                AYOO SERVIS adalah platform perbaikan elektronik terpercaya yang menghubungkan pelanggan dengan teknisi profesional. Kami berdedikasi untuk memberikan layanan perbaikan yang cepat, transparan, dan berkualitas tinggi.
              </p>
              <ul className="space-y-4">
                {['Teknisi Tersertifikasi', 'Suku Cadang Original', 'Garansi Layanan', 'Antar Jemput Gratis'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center">
                      <CheckCircleIcon className="w-4 h-4 text-brand-600" />
                    </div>
                    <span className="font-medium text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500 rounded-3xl transform translate-x-4 translate-y-4 opacity-20"></div>
              <img src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80" alt="Tentang Kami" className="rounded-3xl shadow-2xl relative z-10 w-full object-cover h-[400px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Promo Section */}
      <section id="promo" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Promo Spesial Bulan Ini</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Nikmati berbagai penawaran menarik khusus untuk Anda.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Diskon 20%', desc: 'Untuk servis TV dan Monitor layar lebar', code: 'TV20OFF' },
              { title: 'Gratis Biaya Cek', desc: 'Promo akhir pekan untuk semua perangkat', code: 'WEEKEND' },
              { title: 'Cashback 50K', desc: 'Minimal transaksi Rp 500.000', code: 'CASH50' }
            ].map((promo, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="font-extrabold text-xl">%</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{promo.title}</h3>
                <p className="text-slate-600 mb-6">{promo.desc}</p>
                <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-center border-dashed">
                  <span className="font-mono font-bold text-slate-800 tracking-wider">{promo.code}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Panduan Pengguna Section */}
      <section id="guide" className="py-20 bg-brand-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620288627223-53302f4e8c74?auto=format&fit=crop&w=1200&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold">Cara Kerja AYOO SERVIS</h2>
            <p className="text-brand-200 mt-4 max-w-2xl mx-auto">Proses mudah dari pemesanan hingga perangkat kembali normal.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center relative">
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-brand-700/50"></div>
            {[
              { step: '1', title: 'Booking Servis', desc: 'Isi formulir kerusakan secara online.' },
              { step: '2', title: 'Penjemputan', desc: 'Kurir kami mengambil perangkat Anda.' },
              { step: '3', title: 'Perbaikan', desc: 'Teknisi profesional kami bekerja.' },
              { step: '4', title: 'Pengembalian', desc: 'Perangkat sehat diantar kembali.' }
            ].map((g, i) => (
              <div key={i} className="relative z-10">
                <div className="w-20 h-20 mx-auto bg-brand-800 border-4 border-brand-500 rounded-full flex items-center justify-center text-2xl font-black mb-6 shadow-xl shadow-brand-900/50">
                  {g.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{g.title}</h3>
                <p className="text-brand-300 text-sm">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ & Informasi Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Pertanyaan Umum (FAQ)</h2>
            <p className="text-slate-500 mt-4">Temukan jawaban atas pertanyaan yang sering diajukan pelanggan.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Berapa lama proses perbaikan biasanya selesai?', a: 'Tergantung tingkat kerusakan, rata-rata memakan waktu 1-3 hari kerja. Jika butuh sparepart khusus, estimasi akan kami informasikan lebih lanjut.' },
              { q: 'Apakah ada garansi purna servis?', a: 'Ya, kami memberikan garansi perbaikan selama 30 hari untuk kerusakan yang sama.' },
              { q: 'Bagaimana cara membatalkan booking?', a: 'Anda dapat menghubungi layanan pelanggan kami melalui nomor hotline sebelum perangkat dijemput.' },
              { q: 'Metode pembayaran apa saja yang diterima?', a: 'Kami menerima transfer bank, e-wallet (OVO, GoPay, Dana), dan tunai saat pengembalian barang.' }
            ].map((faq, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h3 className="font-bold text-slate-800 text-lg mb-2 flex items-start gap-3">
                  <span className="text-brand-500">Q:</span> {faq.q}
                </h3>
                <p className="text-slate-600 leading-relaxed pl-7">
                  <span className="font-bold text-slate-400 mr-2">A:</span> {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="info" className="py-16 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Area Layanan & Jam Operasional</h3>
            <p className="text-slate-600">Saat ini kami melayani wilayah Jabodetabek.<br/>Buka: Senin - Sabtu (08.00 - 17.00 WIB)</p>
          </div>
          <div className="flex gap-4 justify-center md:justify-start">
            <Link to="/book" className="btn-primary py-3 px-8 text-lg font-bold shadow-lg shadow-brand-500/30">Pesan Layanan Sekarang</Link>
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
