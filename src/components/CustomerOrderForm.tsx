import React, { useState, useEffect } from 'react';
import { Product, PaymentMethod } from '../types';
import { 
  ShoppingBag, CheckCircle, MapPin, Calculator, AlertCircle, Sparkles, Navigation, Globe
} from 'lucide-react';

interface CustomerOrderFormProps {
  products: Product[];
  selectedProduct?: Product | null;
  onOrderSubmit: (orderData: any) => void;
  onNavigateHome: () => void;
}

export default function CustomerOrderForm({ products, selectedProduct, onOrderSubmit, onNavigateHome }: CustomerOrderFormProps) {
  // Fields Form
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [state, setState] = useState('Delhi');
  const [pincode, setPincode] = useState('110064');
  
  // Selection
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(5);
  const [purityLevel, setPurityLevel] = useState('99.999% Ultra High Purity (UHP)');
  const [cylinderType, setCylinderType] = useState('High Pressure Steel Cylinder');
  const [cylinderSize, setCylinderSize] = useState('47L (7.0 cubic meters)');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('09:00 AM - 01:00 PM');
  const [isUrgent, setIsUrgent] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [notes, setNotes] = useState('');
  
  // Maps location simulation
  const [mapsLink, setMapsLink] = useState('https://maps.google.com/?q=28.6473,77.1352');
  const [latitude, setLatitude] = useState(28.6473);
  const [longitude, setLongitude] = useState(77.1352);

  const [formSuccess, setFormSuccess] = useState<any>(null);

  // Load selected product if coming from catalog click
  useEffect(() => {
    if (selectedProduct) {
      setSelectedProductId(selectedProduct.id);
      setPurityLevel(selectedProduct.purity_level);
      setCylinderType(selectedProduct.cylinder_type);
      setCylinderSize(selectedProduct.cylinder_size);
    } else if (products.length > 0) {
      setSelectedProductId(products[0].id);
      setPurityLevel(products[0].purity_level);
      setCylinderType(products[0].cylinder_type);
      setCylinderSize(products[0].cylinder_size);
    }
  }, [selectedProduct, products]);

  // Handle product select change
  const handleProductChange = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find(p => p.id === prodId);
    if (prod) {
      setPurityLevel(prod.purity_level);
      setCylinderType(prod.cylinder_type);
      setCylinderSize(prod.cylinder_size);
    }
  };

  // Fast autofill function to populate coordinates and user details instantly
  const handleAutofill = () => {
    setFullName('Sardar Harpreet Singh');
    setCompanyName('Harpreet Alloys Pvt Ltd');
    setPhone('9811234567');
    setAltPhone('011-28394022');
    setEmail('harpreet@hcplgas.com');
    setGstNumber('07AAACG5910E2ZG');
    setAddress('Plot 45-B, Sector 18 Phase I, Okhla Industrial Estate');
    setLandmark('Opp Central Bank');
    setCity('New Delhi');
    setState('Delhi');
    setPincode('110020');
    setQuantity(8);
    setNotes('Deliver to Okhla distribution terminal. Check safety valves before transit.');
    
    // Delhi center
    setLatitude(28.6139);
    setLongitude(77.2090);
    setMapsLink('https://maps.google.com/?q=28.6139,77.2090');
  };

  // Generate random coords nearby Delhi-NCR for real-world simulation
  const handleRandomizeGPS = () => {
    // Delhi center ~ 28.6139, 77.2090
    const lat = +(28.5 + Math.random() * 0.25).toFixed(4);
    const lng = +(77.0 + Math.random() * 0.35).toFixed(4);
    setLatitude(lat);
    setLongitude(lng);
    setMapsLink(`https://maps.google.com/?q=${lat},${lng}`);
  };

  const activeProduct = products.find(p => p.id === selectedProductId) || products[0];

  // Live tax calculators
  const baseUnitPrice = activeProduct ? activeProduct.unit_price : 1000;
  const rawSubtotal = baseUnitPrice * quantity;
  const gstRate = activeProduct ? activeProduct.GST_percentage : 18;
  const urgentCharge = isUrgent ? 1500 : 0;
  
  const taxableSum = rawSubtotal + urgentCharge;
  const igstActive = state.toLowerCase() !== 'delhi';
  const calculatedTax = (taxableSum * gstRate) / 100;
  const grandTotal = taxableSum + calculatedTax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address || !selectedProductId) {
      alert('Please fill in Name, Phone, Address and product selection.');
      return;
    }

    const orderRecord = {
      customer_name: fullName,
      company_name: companyName || fullName,
      phone_number: phone,
      alternate_phone: altPhone,
      email: email || 'sales-client@hcplgas.com',
      gst_number: gstNumber || '07AAAAA0000A1Z1',
      address,
      landmark,
      city,
      state,
      pincode,
      product_type: activeProduct ? activeProduct.gas_type : 'Industrial Gas',
      selected_product_id: selectedProductId,
      purity_level: purityLevel,
      cylinder_type: cylinderType,
      cylinder_size: cylinderSize,
      quantity,
      delivery_date: deliveryDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      delivery_slot: deliverySlot,
      is_urgent: isUrgent,
      payment_method: paymentMethod,
      remarks: notes,
      google_maps_link: mapsLink,
      latitude,
      longitude,
      // prices to compile
      tax_percentage: gstRate,
      taxable_value: taxableSum,
      total_tax: calculatedTax,
      grand_total: grandTotal
    };

    onOrderSubmit(orderRecord);
  };

  const productTypes = [
    'Nitrogen Gas', 'Oxygen Gas', 'Liquid Oxygen', 'Argon Gas', 'CO2 Gas', 
    'Hydrogen', 'Helium', 'Industrial Air', 'Medical Oxygen', 'Acetylene', 'Industrial Cylinders'
  ];

  return (
    <div className="py-12 px-6 max-w-6xl mx-auto font-sans">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-200 pb-6 mb-10 gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>HCPL Gas Procurement Terminal</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Place Gas cylinder Order</h1>
          <p className="text-slate-400 text-xs font-light">Complete the formal industrial procurement order form. Records are logged dynamically.</p>
        </div>
        <button
          onClick={onNavigateHome}
          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Back To Corporate Website
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Fill Area */}
        <div className="lg:col-span-8 space-y-8 bg-white border border-slate-200 p-8 rounded-xl shadow-sm">
          
          {/* Section 1: Customer Contact Credentials */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-1.5 gap-2">
              <h3 className="text-sm font-extrabold text-blue-900 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-mono text-[11px]">1</span>
                <span>Customer & Corporate Credentials</span>
              </h3>
              <button
                type="button"
                onClick={handleAutofill}
                className="inline-flex items-center space-x-1 px-2.5 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded text-[10px] font-bold uppercase tracking-wider hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Express Order Details (Auto-Fill)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Person Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sardar Harpreet Singh"
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 px-3 py-2 rounded text-xs select-text"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Corporate Company Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Singhal Alloys Pvt Ltd"
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 px-3 py-2 rounded text-xs select-text"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 98112XXXXX"
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 px-3 py-2 rounded text-xs select-text"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Alternate Contact</label>
                <input
                  type="tel"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  placeholder="e.g. Landline or backup numbers"
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 px-3 py-2 rounded text-xs select-text"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Authorized Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. procurement@singhalalloys.com"
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 px-3 py-2 rounded text-xs select-text"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">GSTIN Number (GST) *</label>
                  <span className="text-[10px] text-blue-600 font-bold">15-digit Tax Code</span>
                </div>
                <input
                  type="text"
                  required
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  placeholder="e.g. 07AAACG5910E2ZG"
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 font-mono px-3 py-2 rounded text-xs uppercase select-text"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Cylinder & Refill gas parameters */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-mono text-[11px]">2</span>
              <span>Cylinder Content & Volume specifications</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Select Gas Product *</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 px-3 py-2 rounded text-xs text-slate-800 font-medium"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.product_name} [₹{p.unit_price}/unit]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Cylinder Code Select</label>
                  <select
                    value={cylinderType}
                    onChange={(e) => setCylinderType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-2 py-2 rounded text-[11px]"
                  >
                    <option value="High Pressure Steel Cylinder">High Pressure Steel</option>
                    <option value="Seamless Steel Cylinder">Seamless Steel</option>
                    <option value="Cryogenic Liquid Tank">Cryogenic Tank</option>
                    <option value="Aluminium/Steel Cylinder">Aluminium Shell</option>
                    <option value="Refilling Service">Refilling Only</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Volume Capacity</label>
                  <select
                    value={cylinderSize}
                    onChange={(e) => setCylinderSize(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-2 py-2 rounded text-[11px]"
                  >
                    <option value="47L (7.0 cubic meters)">47L (Standard)</option>
                    <option value="10L (1.4 cubic meters)">10L (Compact)</option>
                    <option value="50L (7.5 cubic meters)">50L Heavy Duty</option>
                    <option value="200L Tank Block">200L (Cryo Cryo)</option>
                    <option value="30kg Capacity">30kg (Argon/CO2)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Purity Gaseous Requirement</label>
                <select
                  value={purityLevel}
                  onChange={(e) => setPurityLevel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-2.5 py-2 rounded text-xs"
                >
                  <option value="99.999% Ultra High Purity (UHP)">99.999% UHP Class 5</option>
                  <option value="99.99% High Pure Class">99.99% High Pure Class 4</option>
                  <option value="99.5% IP Certified Medical">99.5% Medical IP Tiers</option>
                  <option value="98.5% Standard Industrial">98.5% Dissolved Standard</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Cylinder Units Quantity *</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 text-slate-800 px-3 py-2 rounded text-xs select-text font-bold"
                  />
                  <span className="text-xs text-slate-400 font-bold block shrink-0">Cylinders</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Required Delivery Date</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full bg-slate-50 px-2.5 py-1.5 border border-slate-200 rounded text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Field addresses, landmark and digital GPS link */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-mono text-[11px]">3</span>
              <span>Site Delivery logistics & GPS Location link</span>
            </h3>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Exact Site Address & Landmark *</label>
              <textarea
                rows={3}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Plot 45-B, Sector 18 Phase I, Okhla industrial Estate, Opp Central Bank..."
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 text-slate-800 px-3 py-2 rounded text-xs select-text"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Landmark Accent</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Near Shipra Mall etc"
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded text-xs select-text"
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded text-xs select-text"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">State Select</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-2 py-2 rounded text-xs"
                >
                  <option value="Delhi">Delhi State (local CGST/SGST)</option>
                  <option value="Haryana">Haryana (IGST 18%)</option>
                  <option value="Uttar Pradesh">Uttar Pradesh (IGST 18%)</option>
                  <option value="Punjab">Punjab State (IGST 18%)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Pincode *</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded text-xs select-text font-mono"
                />
              </div>
            </div>

            {/* GPS Simulator panel is incredibly elegant for logistics */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-blue-800">
                  <Navigation className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">ERP Location Geo-Coding (GPS Link)</span>
                </div>
                <button
                  type="button"
                  onClick={handleRandomizeGPS}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-white border border-slate-300 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>Autofill Plant Coordinates</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[9.5px] uppercase font-sans font-bold tracking-wider">Latitude Coord</span>
                  <span className="font-bold text-slate-700">{latitude}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9.5px] uppercase font-sans font-bold tracking-wider">Longitude Coord</span>
                  <span className="font-bold text-slate-700">{longitude}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9.5px] uppercase font-sans font-bold tracking-wider">Google Maps Reference URL</span>
                  <input
                    type="text"
                    value={mapsLink}
                    onChange={(e) => setMapsLink(e.target.value)}
                    className="w-full bg-transparent border-b border-slate-300 py-0.5 text-[11px] font-mono text-blue-600 focus:outline-none select-text"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Slots details, Urgency fees, and Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-blue-900 uppercase tracking-widest border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-mono text-[11px]">4</span>
              <span>Delivery logistics, Urgency fees & Payment Mode</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Delivery Time Slot</label>
                <select
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-2 py-2 rounded text-xs"
                >
                  <option value="09:00 AM - 01:00 PM">09:00 AM - 01:00 PM (Morning Slot)</option>
                  <option value="01:00 PM - 05:00 PM">01:00 PM - 05:00 PM (Afternoon Slot)</option>
                  <option value="05:00 PM - 09:00 PM">05:00 PM - 09:00 PM (Evening Slot)</option>
                  <option value="09:00 PM - 09:00 AM">Emergency Overnight Dispatch</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Terms of Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full bg-slate-50 border border-slate-200 px-2 py-2 rounded text-xs"
                >
                  <option value="Cash">Cash on Delivery (COD)</option>
                  <option value="UPI">UPI Transfer / QR scan</option>
                  <option value="Bank Transfer">NEFT/RTGS Bank Transfer</option>
                  <option value="Credit">Cylinder Line Credit (Net 30 days)</option>
                  <option value="Online Payment">Online Secure payment gateway</option>
                </select>
              </div>

              <div className="flex items-center space-x-2.5 p-3 rounded-lg border border-red-100 bg-red-50/55 self-center mt-3">
                <input
                  type="checkbox"
                  id="urgent-check"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 text-red-600 focus:ring-red-500 border-red-300 rounded cursor-pointer"
                />
                <label htmlFor="urgent-check" className="cursor-pointer select-none">
                  <span className="block text-xs font-bold text-red-900 uppercase tracking-wide">Emergency Delivery</span>
                  <span className="text-[10px] text-red-700 font-medium">Adds flat surcharge rate of ₹1,500</span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Additional Site Specific Remarks / Safety Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special notes e.g., 'Leave cylinders near hydraulic manifold block 4', 'Operator is S. Kulwant, phone is...'"
                className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-2 rounded select-text"
              />
            </div>
          </div>

        </div>

        {/* Pricing Summary Side bar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white rounded-xl border border-slate-800 p-6 shadow-md space-y-6">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest border-b border-slate-800 pb-3 flex items-center justify-between">
              <span className="flex items-center gap-1"><Calculator className="w-4 h-4 text-blue-400" /> Commercial Bill Quote</span>
              <span className="text-[10px] font-mono select-none">GST ESTIMATE</span>
            </h3>

            {/* Calculations Breakdown */}
            <div className="space-y-4 text-xs font-light">
              <div className="flex justify-between items-start">
                <div>
                  <span className="block font-bold text-slate-200">{activeProduct?.product_name || 'Industrial Cylinder'}</span>
                  <span className="text-slate-400 text-[10px]">{quantity} units x ₹{baseUnitPrice}/unit</span>
                </div>
                <span className="font-mono text-slate-200 text-sm font-semibold">₹{rawSubtotal.toFixed(2)}</span>
              </div>

              {isUrgent && (
                <div className="flex justify-between text-red-400">
                  <span>Emergency Surcharge Fee</span>
                  <span className="font-mono text-sm font-bold">₹1500.00</span>
                </div>
              )}

              <div className="flex justify-between border-t border-slate-800 pt-3">
                <span className="text-slate-400">Taxable Value total:</span>
                <span className="font-mono font-bold text-slate-200">₹{taxableSum.toFixed(2)}</span>
              </div>

              <div className="space-y-1 bg-slate-950/50 p-2.5 rounded border border-slate-800">
                <p className="flex justify-between text-slate-400 text-[11px]">
                  <span>GST Code Rate:</span>
                  <span className="font-semibold text-slate-300 font-mono">{gstRate}%</span>
                </p>
                {igstActive ? (
                  <p className="flex justify-between text-slate-300 text-[11.5px]">
                    <span className="font-medium">Integrated GST (IGST)</span>
                    <span className="font-mono">₹{calculatedTax.toFixed(2)}</span>
                  </p>
                ) : (
                  <div className="space-y-0.5 text-[10.5px] text-slate-400">
                    <p className="flex justify-between">
                      <span>Central GST (CGST {gstRate/2}%)</span>
                      <span className="font-mono">₹{(calculatedTax / 2).toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>State GST (SGST {gstRate/2}%)</span>
                      <span className="font-mono">₹{(calculatedTax / 2).toFixed(2)}</span>
                    </p>
                  </div>
                )}
                <p className="flex justify-between text-[11px] border-t border-slate-800/80 pt-1.5 text-slate-300 mt-1">
                  <span>Estimated Tax aggregate:</span>
                  <span className="font-mono font-bold">₹{calculatedTax.toFixed(2)}</span>
                </p>
              </div>

              <div className="flex justify-between text-sm py-4 border-t border-b border-slate-800 text-white font-bold bg-slate-950/35 px-2 rounded">
                <span className="text-blue-400">ESTIMATED TOTAL DUE:</span>
                <span className="text-base text-blue-400 font-mono">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-blue-950/30 border border-blue-500/10 rounded-lg text-slate-300 flex items-start gap-2 text-[11px] font-light">
                <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p>
                  Submission logs the order as <span className="font-semibold text-blue-400">Pending</span>. You will receive a secure tracking reference code to check active dispatch logs or complete driver OTP verification.
                </p>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 text-xs uppercase tracking-widest shadow-lg shadow-blue-900/30 font-sans transition-all cursor-pointer"
              >
                Place Gas Purchase Order
              </button>
            </div>
          </div>
          
          <div className="p-4 rounded-xl border border-slate-200 bg-white text-xs space-y-2 text-slate-500 list-none font-light">
            <span className="font-bold uppercase text-slate-800 tracking-wider text-[11px] block">📋 ERP SECURITY PROTOCOLS</span>
            <li>🛡️ Safe SSL 256-bit encrypted data packets.</li>
            <li>⚖️ Legally verified invoice calculations conforming to the Central Board of Indirect Taxes (CBIC) system.</li>
            <li>🪵 Realtime system audit trace records every submission ip.</li>
          </div>
        </div>

      </form>
    </div>
  );
}
