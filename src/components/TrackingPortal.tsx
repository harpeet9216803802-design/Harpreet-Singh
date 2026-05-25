import React, { useState, useEffect, useRef } from 'react';
import { Order, Invoice, DeliveryChallan as ChallanType, Product, Driver } from '../types';
import { 
  Search, ShieldCheck, FileText, FileBadge, CheckCircle, Truck, PackageCheck, AlertCircle, MapPin
} from 'lucide-react';
import BillingInvoice from './BillingInvoice';
import DeliveryChallan from './DeliveryChallan';

interface TrackingPortalProps {
  orders: Order[];
  invoices: Invoice[];
  challans: ChallanType[];
  products: Product[];
  drivers: Driver[];
  initialOrderId?: string | null;
  onClearInitialOrderId?: () => void;
  onVerifyDeliveryOTP: (orderId: string, otp: string) => boolean;
  onSaveSignature: (orderId: string, signatureData: string) => void;
  onClose: () => void;
}

export default function TrackingPortal({ 
  orders, 
  invoices, 
  challans, 
  products, 
  drivers, 
  initialOrderId,
  onClearInitialOrderId,
  onVerifyDeliveryOTP, 
  onSaveSignature,
  onClose 
}: TrackingPortalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  // Derive the active order live from orders state to prevent stale state issues in React
  const activeOrder = selectedOrder 
    ? (orders.find(o => o.id === selectedOrder.id) || selectedOrder)
    : null;

  // Signature pad states and handlers
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Synchronize typedName with activeOrder customer_name when activeOrder changes
  useEffect(() => {
    if (activeOrder) {
      setTypedName(activeOrder.customer_name);
    }
  }, [activeOrder?.id]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw canvas baseline grid background
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  useEffect(() => {
    if (signatureMode === 'draw' && activeOrder) {
      setTimeout(initCanvas, 100);
    }
  }, [signatureMode, activeOrder?.id]);

  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Support Touch Events as well as Mouse Events
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Prevent scrolling on touch screens
    if (e.cancelable) e.preventDefault();

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#1e3a8a'; // beautiful slate navy sign ink
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (e.cancelable) e.preventDefault();

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSaveSignatureData = () => {
    if (!activeOrder) return;
    let signatureValue = '';
    
    if (signatureMode === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        signatureValue = canvas.toDataURL('image/png');
      }
    } else {
      signatureValue = `text:${typedName.trim()}`;
    }

    if (!signatureValue || signatureValue === 'text:') {
      alert('Please draw a signature or type your name first!');
      return;
    }

    onSaveSignature(activeOrder.id, signatureValue);
  };

  // React effect to auto-load the newly submitted order, or default to newest
  useEffect(() => {
    if (initialOrderId) {
      const found = orders.find(o => o.id === initialOrderId);
      if (found) {
        setSelectedOrder(found);
        setSearchQuery(found.order_number);
        setOtpError('');
        setOtpSuccess(false);
        setOtpInput('');
        setShowSuccessBanner(true);
      }
      if (onClearInitialOrderId) {
        onClearInitialOrderId();
      }
    } else if (orders.length > 0 && !selectedOrder) {
      setSelectedOrder(orders[0]);
      setSearchQuery(orders[0].order_number);
    }
  }, [initialOrderId, orders, onClearInitialOrderId, selectedOrder]);

  // Modal Views
  const [activeModal, setActiveModal] = useState<'invoice' | 'challan' | null>(null);

  // Quick lookup filters for active selection
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const term = searchQuery.trim().toLowerCase();
    const found = orders.find(o => 
      o.order_number.toLowerCase() === term || 
      o.uuid.toLowerCase() === term ||
      o.phone_number.includes(term) ||
      o.customer_name.toLowerCase().includes(term) ||
      o.company_name.toLowerCase().includes(term)
    );

    if (found) {
      setSelectedOrder(found);
      setOtpError('');
      setOtpSuccess(false);
      setOtpInput('');
    } else {
      alert('No matching order or logistics tracking ID found in HCPL database.');
    }
  };

  const handleSelectActiveLog = (order: Order) => {
    setSelectedOrder(order);
    setSearchQuery(order.order_number);
    setOtpError('');
    setOtpSuccess(false);
    setOtpInput('');
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    const orderToVerify = activeOrder || selectedOrder;
    if (!orderToVerify) return;
    
    if (otpInput === orderToVerify.delivery_otp) {
      const verified = onVerifyDeliveryOTP(orderToVerify.id, otpInput);
      if (verified) {
        setOtpSuccess(true);
        setOtpError('');
        // Immediately set local selectedOrder to have the updated parameters 
        // to render instantly before the async parent prop propagation finishes
        const updated: Order = {
          ...orderToVerify,
          order_status: 'Delivered',
          delivery_status: 'Delivered',
          otp_verified: true,
          verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setSelectedOrder(updated);
      }
    } else {
      setOtpError('Error: Invalid 4-digit Security code. OTP attempt incremented. Please consult the dispatcher challan sheet.');
    }
  };

  // Obtain timeline index levels based on current status
  const statuses: Order['order_status'][] = [
    'Pending', 'Approved', 'Packed', 'Ready for Dispatch', 'Assigned to Driver', 'Out for Delivery', 'Delivered'
  ];

  const getStatusIndex = (current: Order['order_status']) => {
    if (current === 'Cancelled') return -1;
    if (current === 'Failed Delivery') return 5; // near transit failure
    return statuses.indexOf(current);
  };

  const activeIndex = activeOrder ? getStatusIndex(activeOrder.order_status) : -1;

  // Retrieve files matched
  const matchedInvoice = activeOrder 
    ? invoices.find(inv => inv.order_id === activeOrder.id) || null 
    : null;

  const matchedChallan = activeOrder 
    ? challans.find(ch => ch.order_id === activeOrder.id) || null 
    : null;

  const matchedProduct = activeOrder
    ? products.find(p => p.gas_type === activeOrder.product_type) || undefined
    : undefined;

  return (
    <div className="py-12 px-6 max-w-5xl mx-auto font-sans">
      
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-200 pb-5 mb-10 gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">HCPL Cylinder Logistics Tracking</h1>
          <p className="text-slate-400 text-xs font-light">Inspect active logistics dispatches, verify secure 4-digit fields OTPs, and access electronic GST details. </p>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-slate-250 text-slate-700 bg-white rounded-lg hover:bg-slate-50 text-xs font-bold uppercase transition-colors cursor-pointer"
        >
          Return to Hub Home
        </button>
      </div>

      {/* Success Alert Banner for newly submitted procurement orders */}
      {showSuccessBanner && activeOrder && (
        <div className="mb-8 p-5 bg-emerald-55 border border-emerald-250 text-slate-900 rounded-xl flex items-start gap-4 shadow-sm animate-fade-in">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6 shrink-0" />
          </div>
          <div className="space-y-1 flex-grow">
            <h3 className="text-sm font-extrabold text-emerald-900 uppercase tracking-wider">🎉 Cylinder Order Placed Successfully! (ऑर्डर दर्ज हो गया है!)</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-light">
              Your industrial gas cylinder procurement order has been logged instantly in the Central ERP Registry as <span className="font-bold font-mono text-slate-800">{activeOrder.order_number}</span>.
            </p>
            <div className="pt-2 flex flex-wrap gap-x-6 gap-y-1.5 text-xs">
              <div>
                <span className="text-emerald-805 font-bold uppercase text-[9.5px]">Logistical Verification OTP: </span>
                <span className="font-mono font-extrabold bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded tracking-widest text-[11px]">{activeOrder.delivery_otp}</span>
              </div>
              <div>
                <span className="text-emerald-805 font-bold uppercase text-[9.5px]">Amount Payable: </span>
                <span className="font-mono font-bold text-slate-850">₹{((activeOrder as any).grand_total ?? matchedInvoice?.grand_total ?? (activeOrder.quantity * (matchedProduct?.unit_price ?? 1200) * 1.18)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div>
                <span className="text-emerald-805 font-bold uppercase text-[9.5px]">Assigned Destination: </span>
                <span className="font-medium text-slate-850">{activeOrder.city}, {activeOrder.state}</span>
              </div>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setShowSuccessBanner(false)}
            className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-100 hover:bg-emerald-200 transition-colors uppercase tracking-wider py-1 px-2.5 rounded cursor-pointer shrink-0"
          >
            Got It
          </button>
        </div>
      )}

      {/* Main Track Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Search side controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-950 text-sm tracking-tight">Search Dispatch Registry</h3>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Order Number, Co. Name or Phone"
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded px-3 py-2 text-xs font-medium pl-8 focus:outline-none focus:ring-1 focus:ring-blue-500 select-text"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded text-[11px] font-bold py-2 mt-2 uppercase tracking-wider hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Search HCPL Depot Records
              </button>
            </form>
          </div>

          {/* Quick lookup registry of active dispatches */}
          <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 space-y-4">
            <div>
              <span className="block text-[10px] font-bold text-blue-400 uppercase tracking-widest font-mono">ERP Terminal Live Feed</span>
              <h4 className="font-bold text-sm tracking-tight mt-0.5 text-slate-200">Registered Order Inventory</h4>
              <p className="text-[11px] text-slate-400 font-light mt-1">Select from real recorded transactions to review different dispatch workflow logs:</p>
            </div>

            <div className="space-y-2 text-xs">
              {orders.map((o) => (
                <button
                   key={o.id}
                   onClick={() => handleSelectActiveLog(o)}
                   className={`w-full text-left p-3 rounded border text-slate-300 flex items-center justify-between hover:bg-slate-800/60 hover:border-slate-700 transition-all cursor-pointer ${
                     activeOrder?.id === o.id ? 'bg-slate-850 border-blue-500 text-white font-semibold' : 'bg-slate-950/60 border-slate-800/80'
                   }`}
                >
                   <div className="space-y-0.5">
                     <span className="font-mono block tracking-wider text-slate-300 font-bold text-[10px]">{o.order_number}</span>
                     <span className="block text-[10.5px] truncate max-w-[150px]">{o.company_name}</span>
                   </div>
                   <span className={`text-[9.5px] px-1.5 py-0.5 rounded font-bold uppercase ${
                     o.order_status === 'Delivered' 
                       ? 'bg-green-500/15 text-green-400' 
                       : o.order_status === 'Pending' 
                       ? 'bg-amber-500/15 text-amber-400' 
                       : 'bg-blue-500/15 text-blue-400'
                   }`}>
                     {o.order_status}
                   </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Timeline representation details */}
        <div className="lg:col-span-8 space-y-6">
          {activeOrder ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-8">
              
              {/* Order Status Core header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 gap-3">
                <div className="space-y-1">
                  <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-widest font-bold">LOGISTICS BILL OF LADING</span>
                  <h3 className="text-xl font-bold text-slate-950">{activeOrder.order_number}</h3>
                  <p className="text-xs text-slate-500 font-medium">{activeOrder.company_name} | {activeOrder.customer_name}</p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] block text-slate-400 uppercase font-bold text-xs tracking-wider">SUPPLY STATUS</span>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-extrabold mt-1 uppercase">
                    {activeOrder.order_status}
                  </span>
                </div>
              </div>

              {/* Order Specifications details card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 uppercase block text-[10px] font-medium font-sans">Required Gas cylinder</span>
                  <span className="font-extrabold text-slate-900">{activeOrder.product_type}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase block text-[10px] font-medium font-sans">Quantity Ordered</span>
                  <span className="font-bold text-slate-800">{activeOrder.quantity} Units</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase block text-[10px] font-medium font-sans">Payment Mode</span>
                  <span className="font-bold text-slate-800">{activeOrder.payment_method}</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase block text-[10px] font-medium font-sans">Payment status</span>
                  <span className={`font-bold ${activeOrder.payment_status === 'Paid' ? 'text-green-700' : 'text-amber-700'}`}>
                    {activeOrder.payment_status}
                  </span>
                </div>
              </div>

              {/* Graphical Timeline and Milestones */}
              <div className="space-y-6">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">DEPOT DISPATCH WORKFLOW TIMELINE</h4>
                
                <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
                  {statuses.map((step, idx) => {
                    const isCompleted = idx <= activeIndex;
                    const isActive = idx === activeIndex;

                    return (
                      <div key={idx} className="relative">
                        {/* Dot indicator marker */}
                        <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 bg-white ${
                          isCompleted ? 'border-blue-600' : 'border-slate-300'
                        }`}>
                          {isCompleted && (
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mx-auto mt-0.5 animate-pulse" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <h5 className={`text-xs font-bold ${
                            isActive ? 'text-blue-600' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                          }`}>
                            {step}
                          </h5>
                          {step === 'Pending' && (
                            <p className="text-[11px] text-slate-500 font-light">Order has been logged in portal. Base price computed. Pending manager review.</p>
                          )}
                          {step === 'Approved' && (
                            <p className="text-[11px] text-slate-500 font-light">Operations manager verified commercial details and GST code credentials.</p>
                          )}
                          {step === 'Packed' && (
                            <p className="text-[11px] text-slate-500 font-light">High pressure gas cylinder cylinders checked, tested, and sealed at terminal yard.</p>
                          )}
                          {step === 'Ready for Dispatch' && (
                            <p className="text-[11px] text-slate-500 font-light">Cylinders cataloged on logistics yard and loaded into local distribution truck.</p>
                          )}
                          {step === 'Assigned to Driver' && (
                            <p className="text-[11px] text-slate-500 font-light">Logistics manager assigned dispatch vehicle. Deliverer is on duty.</p>
                          )}
                          {step === 'Out for Delivery' && (
                            <p className="text-[11px] text-slate-500 font-light">Dispatcher is in transit to site destination. Realtime OTP verification triggered.</p>
                          )}
                          {step === 'Delivered' && (
                            <p className="text-[11px] text-slate-500 font-light">Cylinders exchanged, safety checks and handshakes completed. OTP code verified at {activeOrder.verified_at || 'Recently'}.</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Action Controls: Downloads and OTP verification inputs */}
              <div className="border-t border-slate-150 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start font-sans">
                
                {/* PDF and printable documents download panel */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">AUTHORIZED TRANSACTION RECORDS</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        if (activeOrder.invoice_generated) {
                          setActiveModal('invoice');
                        } else {
                          alert('Invoice has not been generated by billing manager yet.');
                        }
                      }}
                      className={`w-full flex items-center justify-between text-xs p-3 rounded-lg border font-medium transition-colors cursor-pointer ${
                        activeOrder.invoice_generated 
                          ? 'bg-blue-50/55 border-blue-200 text-blue-800 hover:bg-blue-100/60' 
                          : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <span className="flex items-center space-x-1.5">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>Download GST Tax Invoice</span>
                      </span>
                      <span className="text-[10px] font-bold text-blue-600 uppercase">
                        {activeOrder.invoice_generated ? 'VIEW PDF' : 'LOCKED'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        if (activeOrder.challan_generated) {
                          setActiveModal('challan');
                        } else {
                          alert('Delivery challan gate pass has not been initialized yet.');
                        }
                      }}
                      className={`w-full flex items-center justify-between text-xs p-3 rounded-lg border font-medium transition-colors cursor-pointer ${
                        activeOrder.challan_generated 
                          ? 'bg-indigo-50/55 border-indigo-200 text-indigo-800 hover:bg-indigo-100/60' 
                          : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <span className="flex items-center space-x-1.5">
                        <FileBadge className="w-4 h-4 text-indigo-600" />
                        <span>Download Gate Pass Delivery Challan</span>
                      </span>
                      <span className="text-[10px] font-bold text-indigo-605 uppercase">
                        {activeOrder.challan_generated ? 'VIEW PDF' : 'LOCKED'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Field OTP Verification Panel block */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" /> Security Delivery OTP Code
                  </h4>

                  {activeOrder.order_status === 'Delivered' ? (
                    <div className="p-3 bg-green-100 border border-green-200 text-green-800 rounded-lg text-xs space-y-1">
                      <p className="font-bold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-700" /> OTP Verified Successfully!
                      </p>
                      <p className="font-light">Cylinders cleared at transit checkpost. Delivery audit complete.</p>
                    </div>
                  ) : (activeOrder.order_status !== 'Delivered' && activeOrder.order_status !== 'Cancelled') ? (
                    <div className="space-y-3">
                      <p className="text-[11px] text-slate-500 font-light">
                        A secure 4-digit code was sent to the customer coordinates. Give this code to driver <span className="font-bold text-slate-800">{
                          activeOrder.driver_id ? (drivers.find(d => d.id === activeOrder.driver_id)?.driver_name || 'Kuldeep') : 'Kuldeep'
                        }</span> or type it below to clear cylinders exchange.
                      </p>
                      <form onSubmit={handleVerifyOTP} className="space-y-2">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            maxLength={4}
                            required
                            placeholder="e.g. 7842"
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                            className="bg-white border border-slate-250 focus:border-blue-500 text-center font-mono font-bold tracking-widest text-slate-900 px-3 py-1.5 rounded text-xs w-24 focus:outline-none focus:ring-1 focus:ring-blue-500 select-text"
                          />
                          <button
                            type="submit"
                            className="bg-indigo-600 text-white rounded text-xs px-3 font-bold uppercase transition-colors hover:bg-indigo-700 cursor-pointer"
                          >
                            Verify Delivery
                          </button>
                        </div>
                        {otpError && (
                          <p className="text-[10px] text-red-600 font-semibold">{otpError}</p>
                        )}
                        <div className="bg-amber-100/60 p-2 border border-amber-200 rounded text-[10px] text-amber-850 flex items-center space-x-1 font-mono">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Secure Transport & Verification Key: <span className="font-bold text-amber-900 underline">{activeOrder.delivery_otp}</span></span>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 text-[11px] font-light flex items-center space-x-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-slate-400" />
                      <span>OTP verification will unlock automatically once dispatch is configured.</span>
                    </div>
                  )}

                </div>
              </div>

              {/* Digital Handshake & Customer Signature Block */}
              {['Assigned to Driver', 'Out for Delivery', 'Delivered'].includes(activeOrder.order_status) && (
                <div className="border-t border-slate-150 pt-6 space-y-4 font-sans">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Customer Delivery Handshake & Electronic Signature (दस्तखत)
                      </h4>
                      <p className="text-[11px] text-slate-400 font-light mt-0.5">Please provide an authorized digital seal or signature to confirm physical delivery of cylinder cargo.</p>
                    </div>
                    {activeOrder.customer_signature && (
                      <span className="bg-green-100 text-green-800 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                        Signed & Logged ✓
                      </span>
                    )}
                  </div>

                  {activeOrder.customer_signature ? (
                    // Render saved signature
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] block text-slate-400 font-semibold uppercase">Logged Customer Signature</span>
                        <div className="bg-white border border-slate-150 rounded-lg p-4 inline-block shadow-inner">
                          {activeOrder.customer_signature.startsWith('text:') ? (
                            <span className="font-serif italic font-extrabold text-[#191970] text-lg tracking-wider px-4 py-1 block">
                              {activeOrder.customer_signature.substring(5)}
                            </span>
                          ) : (
                            <img 
                              src={activeOrder.customer_signature} 
                              alt="Customer Signature" 
                              className="h-12 object-contain filter brightness-95" 
                              referrerPolicy="no-referrer"
                            />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-1">Logged: {activeOrder.verified_at || activeOrder.updated_at || 'Recently'}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          // Allow editing/re-signing
                          onSaveSignature(activeOrder.id, '');
                        }}
                        className="text-xs px-3 py-1.5 border border-slate-250 text-slate-600 rounded bg-white hover:bg-slate-50 transition-colors uppercase font-bold cursor-pointer"
                      >
                        Change / Sign Again
                      </button>
                    </div>
                  ) : (
                    // Signature Pad Interactive UI
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                      {/* Tabs to select Paint vs Type */}
                      <div className="flex border-b border-slate-200">
                        <button
                          type="button"
                          onClick={() => setSignatureMode('draw')}
                          className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer border-b-2 -mb-[1px] ${
                            signatureMode === 'draw' 
                              ? 'border-indigo-600 text-indigo-600' 
                              : 'border-transparent text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          ✍️ Draw Custom Sign
                        </button>
                        <button
                          type="button"
                          onClick={() => setSignatureMode('type')}
                          className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer border-b-2 -mb-[1px] ${
                            signatureMode === 'type' 
                              ? 'border-indigo-600 text-indigo-600' 
                              : 'border-transparent text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          🔤 Type Full Name
                        </button>
                      </div>

                      {signatureMode === 'draw' ? (
                        <div className="space-y-2">
                          <div className="relative border border-dashed border-slate-300 rounded-lg overflow-hidden bg-white">
                            <canvas
                              ref={canvasRef}
                              width={450}
                              height={120}
                              onMouseDown={startDrawing}
                              onMouseMove={draw}
                              onMouseUp={stopDrawing}
                              onMouseLeave={stopDrawing}
                              onTouchStart={startDrawing}
                              onTouchMove={draw}
                              onTouchEnd={stopDrawing}
                              className="w-full h-[120px] bg-white cursor-crosshair touch-none"
                            />
                            <div className="absolute bottom-2 right-2 flex space-x-2">
                              <button
                                type="button"
                                onClick={clearCanvas}
                                className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 uppercase font-bold tracking-wider cursor-pointer shadow-sm transition-colors"
                              >
                                Clear Pad
                              </button>
                            </div>
                            <div className="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none opacity-20 text-[10px] font-mono tracking-widest text-slate-400 uppercase select-none">
                              Draw Handshake Sign Here
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-400 font-light italic">💡 Use your touch screen or mouse pointer to scribble your signature above.</p>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Enter your full receiving name</label>
                            <input
                              type="text"
                              value={typedName}
                              onChange={(e) => setTypedName(e.target.value)}
                              placeholder="e.g. Sardar Harpreet Singh"
                              className="w-full sm:max-w-md bg-white border border-slate-200 focus:border-indigo-500 rounded px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 select-text"
                            />
                          </div>
                          
                          {typedName.trim() && (
                            <div className="space-y-1">
                              <span className="text-[9px] text-slate-400 font-bold uppercase">Handwritten Signature Preview</span>
                              <div className="bg-white border border-slate-200 rounded p-4 font-serif italic text-[#191970] text-lg tracking-wider font-extrabold max-w-sm shadow-inner">
                                {typedName.trim()}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex justify-end pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={handleSaveSignatureData}
                          className="px-4 py-2 bg-indigo-600 text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 active:scale-95 shadow-sm transition-all cursor-pointer"
                        >
                          ✓ Confirm & Register Digital Signature
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white border border-slate-250 rounded-xl p-12 text-center text-slate-400 space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">No Cylinder Selected for Tracking</h3>
              <p className="text-xs max-w-sm mx-auto">
                Search using an active order number above, or click one from the active dispatch log at the left to track real-time logistics progress.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Printable Overlays for GST Invoice and Delivery Challan PDFs */}
      {activeModal === 'invoice' && matchedInvoice && activeOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto no-print">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl relative">
            <BillingInvoice
              order={activeOrder}
              invoice={matchedInvoice}
              product={matchedProduct}
              onClose={() => setActiveModal(null)}
            />
          </div>
        </div>
      )}

      {activeModal === 'challan' && matchedChallan && activeOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto no-print">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl relative">
            <DeliveryChallan
              order={activeOrder}
              challan={matchedChallan}
              onClose={() => setActiveModal(null)}
            />
          </div>
        </div>
      )}

    </div>
  );
}
