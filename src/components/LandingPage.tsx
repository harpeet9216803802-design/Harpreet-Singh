import React, { useState } from 'react';
import { Product } from '../types';
import { 
  Truck, ShieldCheck, Zap, Award, Star, Phone, Mail, MapPin, 
  ArrowRight, Sparkles, Building, ChevronRight, CheckCircle2, Factory, Clock
} from 'lucide-react';

interface LandingPageProps {
  products: Product[];
  onNavigate: (view: 'home' | 'order' | 'track' | 'admin' | 'driver' | 'products') => void;
  onSelectProductToOrder?: (product: Product) => void;
}

export default function LandingPage({ products, onNavigate, onSelectProductToOrder }: LandingPageProps) {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone) return;
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryPhone('');
      setInquiryMsg('');
    }, 4000);
  };

  const handleProductOrder = (prod: Product) => {
    if (onSelectProductToOrder) {
      onSelectProductToOrder(prod);
    }
  };

  const trustBadges = [
    { title: 'ISO 9001:2015 Approved', desc: 'Certified gas quality standards assurance' },
    { title: 'PESO Licensed Plant', desc: 'Petroleum and Explo. Safety certified' },
    { title: 'FDA Licensed Medical Grade', desc: 'Certified purity for hospitals' },
    { title: 'GPS Logistical Tracking', desc: 'Realtime dispatch dispatch & OTP safety' }
  ];

  const featuredGasBadges = [
    { name: 'Nitrogen Gas Supply', purity: 'UHP 99.999%', flow: 'High Pressure Steel' },
    { name: 'Oxygen Gas Supply', purity: '99.5% Certified', flow: 'IP Certified Medical' },
    { name: 'Liquid Oxygen (LOX)', purity: '99.9% Cryo Flow', flow: 'Cryogenic Tank' },
    { name: 'Argon Shielding Gas', purity: 'Welding Grade 99.99%', flow: 'MIG/TIG Shielding' },
    { name: 'Carbon Dioxide Gas', purity: 'Food & Beverage Grade', flow: 'Dispense Approved' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      
      {/* Premium Hero Banner */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-400/20 text-blue-400 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />
              <span>An ISO 9001:2015 Certified Supplier</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Reliable Industrial Gas <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
                Supply at Your Doorstep
              </span>
            </h1>
            
            <p className="text-slate-300 text-lg sm:text-xl max-w-2xl font-light">
              HCPL (Harpreet Cylinders Pvt. Ltd.) delivers ultra-high purity nitrogen, industrial oxygen, cryogenic liquid gases, shielding argon, and beverage-grade CO2 to hospitals, fabrication yards, and production centers across Delhi-NCR.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => onNavigate('order')}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-base font-semibold shadow-xl shadow-blue-900/20 hover:shadow-blue-900/45 transform hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>Order Gas Cylinder Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('track')}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white rounded-lg text-base font-semibold transition-all cursor-pointer"
              >
                <Truck className="w-5 h-5 text-blue-400" />
                <span>Track Cylinder Delivery</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 pt-10 border-t border-slate-800/80">
              <div className="space-y-1">
                <span className="block text-2xl font-bold text-white tracking-tight">30+ Years</span>
                <span className="block text-slate-400 text-xs uppercase tracking-wider">Industrial Legacy</span>
              </div>
              <div className="space-y-1">
                <span className="block text-2xl font-bold text-white tracking-tight">24/7 Supply</span>
                <span className="block text-slate-400 text-xs uppercase tracking-wider">Dedicated Logistics</span>
              </div>
              <div className="space-y-1">
                <span className="block text-2xl font-bold text-white tracking-tight">99.999%</span>
                <span className="block text-slate-400 text-xs uppercase tracking-wider">Gas Purity Max</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="font-bold uppercase text-xs tracking-wider text-slate-400">Current Pipeline Allocations</span>
                <span className="flex items-center space-x-1.5 text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                  <span>PLANT ONLINE</span>
                </span>
              </div>

              <div className="space-y-4">
                {featuredGasBadges.map((gas, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-slate-950/40 border border-slate-800 rounded-lg hover:border-slate-700/80 transition-all">
                    <div>
                      <span className="block font-bold text-sm text-slate-200">{gas.name}</span>
                      <span className="text-[11px] text-slate-400">{gas.flow}</span>
                    </div>
                    <span className="bg-blue-950 border border-blue-500/20 text-blue-400 font-mono text-[11px] font-semibold px-2 py-1 rounded">
                      {gas.purity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="bg-white border-b border-slate-200 py-10 relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustBadges.map((badge, idx) => (
            <div key={idx} className="flex items-start space-x-3.5 p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{badge.title}</h4>
                <p className="text-slate-500 text-xs mt-0.5">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Catalog/Services highlights */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block font-mono">SUPPLY DIRECTORY</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Certified Gas Cylinders & Cryogenic Products
          </h2>
          <p className="text-slate-500 text-base sm:text-lg">
            Compare cylinders, unit prices, and certified purity tiers. Order with automatic invoice generation and secure OTP delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((p) => (
            <div key={p.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all flex flex-col justify-between">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    HSN: {p.hsn_code}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                    p.availability_status === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {p.availability_status}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-950 text-base line-clamp-2 min-h-[3rem]">
                    {p.product_name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Type: {p.gas_type}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <p className="flex justify-between">
                    <span className="text-slate-400">Purity Guarantee:</span>
                    <span className="font-semibold text-slate-800">{p.purity_level}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Cylinder Fitment:</span>
                    <span className="font-semibold text-slate-700">{p.cylinder_type}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Volume Capacity:</span>
                    <span className="font-mono font-medium text-slate-800">{p.cylinder_size}</span>
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-6 border-t border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">UNIT PRICE (NET)</span>
                  <span className="text-lg font-black text-slate-900 font-mono">₹{p.unit_price}</span>
                  <span className="text-[10px] text-slate-400 block font-normal">+ {p.GST_percentage}% GST</span>
                </div>
                <button
                  onClick={() => handleProductOrder(p)}
                  className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                  title="Buy Cylinder"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Secondary Products view link */}
        <div className="text-center pt-8">
          <button 
            onClick={() => onNavigate('order')}
            className="inline-flex items-center space-x-1.5 text-blue-600 font-bold text-sm tracking-wide hover:text-blue-800 hover:underline transition-colors cursor-pointer"
          >
            <span>View All Cylinders and Customized Pure Refining Services</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* About Operations Section representing HCPL Infrastructure */}
      <section className="bg-slate-900 text-white overflow-hidden py-20 relative">
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-blue-950/20" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block font-mono">INFRASTRUCTURE EXCELLENCE</span>
            <h3 className="text-3xl font-black tracking-tight leading-tight">
              A Pioneers' Legacy in Commercial Cylinder Refill & Logistics
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              Since our early inception, HCPL (Harpreet Cylinders Pvt. Ltd.) has evolved from raw gas filling into a multi-city high-reliability industrial gas network. We deploy our own heavy cylinder trucks under rigorous PESO security guidelines to satisfy emergency supply and daily cycles.
            </p>
            <div className="space-y-3.5 pt-4 text-sm text-slate-300">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Heavy duty Eicher & TATA cryo-cylindrical fleets</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Dual-stage gas filtration purging line setup</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Pressure-vacuum helium leak certifications on cylinders</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl hover:border-slate-700/80 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="p-3 bg-blue-950/50 text-blue-400 border border-blue-500/10 rounded-lg w-12 h-12 flex items-center justify-center">
                  <Factory className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base">Industrial Gases</h4>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed font-light">
                    Heavy manufacturing, structural metal welding, semiconductor process chambers, and food chemical cryogenic preservation.
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-blue-400 font-bold block mt-6 uppercase tracking-wider font-mono">Nitrogen, Argon, Acetylene, CO2</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl hover:border-slate-700/80 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="p-3 bg-blue-950/50 text-blue-400 border border-blue-500/10 rounded-lg w-12 h-12 flex items-center justify-center">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base">FDA Medical Supplies</h4>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed font-light">
                    Continuous oxygen supplies and direct multi-manifold support services for private hospitals, emergency ICUs, and health camps.
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-blue-400 font-bold block mt-6 uppercase tracking-wider font-mono">IP Certified Medical Purity O2</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-6 border-b border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block font-mono">CLIENT DIRECTORY VOUCHERS</span>
          <h2 className="text-3xl font-extrabold text-slate-950">Trusted by Northern India’s Giants</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-slate-500 font-light text-sm italic">
              "Apollo ICU backup requires continuous oxygen levels. HCPL is our trusted supply partner. Their GPS notifications and quick driver OTP confirmation make billing audits extremely straightforward."
            </p>
            <div className="border-t border-slate-100 pt-3">
              <span className="block font-bold text-slate-800 text-xs uppercase tracking-wide">Rajinder Kumar</span>
              <span className="text-slate-400 text-[10px]">Senior Materials Controller, Apollo Hospitals Delhi</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-slate-500 font-light text-sm italic">
              "We run high-precision automated laser tooling and stainless MIG welding. High purity shielding argon is absolutely critical. HCPL delivers 99.995% argon Cylinders within 24 hours on demand."
            </p>
            <div className="border-t border-slate-100 pt-3">
              <span className="block font-bold text-slate-800 text-xs uppercase tracking-wide">Manish Malhotra</span>
              <span className="text-slate-400 text-[10px]">Head of Logistics, Apex Metal Fab</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-slate-500 font-light text-sm italic">
              "Their online customer ordering portal is outstanding. No back-and-forth calls needed: input GSTIN, addresses, and choose product quantities. Track progress seamlessly, instantly downloading GST invoices on delivery."
            </p>
            <div className="border-t border-slate-100 pt-3">
              <span className="block font-bold text-slate-800 text-xs uppercase tracking-wide">Sanjay Aggarwal</span>
              <span className="text-slate-400 text-[10px]">Managing Director, Aggarwal Breweries</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Operational Contact & Inquiry Form */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 font-sans">
          
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold text-blue-600 block uppercase tracking-widest font-mono">HCPL CONTACT INFO</span>
              <h3 className="text-3xl font-extrabold text-slate-900">Commercial Gas Hub Headquarters</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-light">
                Reach our corporate office or logistics terminal for bulk pipelines, high pressure manifold setup inquiries, and customized gas blending contracts.
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start space-x-3.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-slate-800 uppercase tracking-wide">Main Warehouse & Filling Yard</span>
                  <p className="mt-0.5 font-light">Plot 12, Industrial Area, Mayapuri Phase II, New Delhi, 110064</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-slate-800 uppercase tracking-wide">Business Sales & Logistics Desk</span>
                  <p className="mt-0.5 font-mono">+91 11 4987 2300 | +91 92 1680 3802</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-slate-800 uppercase tracking-wide">Logistics & Supply Enquiries</span>
                  <p className="mt-0.5 font-mono">support@hcplgas.com | billing@hcplgas.com</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold flex items-center gap-1 text-slate-800 uppercase tracking-wide mb-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> Plant Operational Hours
              </span>
              <p className="text-slate-500 font-light">
                Filling yard is open for cylinder exchange and collection 24 hours. Administrative billing is open Monday through Saturday: <span className="font-semibold text-slate-700">09:00 AM - 06:00 PM</span>. Critical oxygen logistics run continuously without interruption.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 shadow-sm">
              <h4 className="text-lg font-bold text-slate-900 tracking-tight">Submit a Gas Refilling Inquiry</h4>
              <p className="text-slate-500 text-xs font-light mt-1">Our customer operations manager responds to online corporate requests within 15 minutes.</p>
              
              <form onSubmit={handleSubmitInquiry} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Company / Individual Name *</label>
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="e.g. Apollo Procurement"
                      className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 px-3 py-2 rounded text-xs select-text"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Contact Phone *</label>
                    <input
                      type="text"
                      required
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      placeholder="e.g. +91 9911223344"
                      className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 px-3 py-2 rounded text-xs select-text"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="e.g. logistics@clientcompany.com"
                    className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 px-3 py-2 rounded text-xs select-text"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Describe Gas/Cylinder Needs</label>
                  <textarea
                    rows={4}
                    value={inquiryMsg}
                    onChange={(e) => setInquiryMsg(e.target.value)}
                    placeholder="Describe gaseous purity (e.g. Nitrogen 99.999%), cylinder size needs, daily usage levels, and contract expectations..."
                    className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 px-3 py-2 rounded text-xs select-text"
                  />
                </div>

                {inquirySent ? (
                  <div className="p-3 bg-green-100 text-green-800 text-xs font-bold rounded flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-700" />
                    <span>Inquiry logged successfully! Corporate Desk will email/sms you shortly.</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white rounded py-2.5 font-bold text-xs uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                  >
                    Send Commercial Request Enquiry
                  </button>
                )}
              </form>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
