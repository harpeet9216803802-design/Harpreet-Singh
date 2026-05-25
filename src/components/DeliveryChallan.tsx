import React from 'react';
import { Order, DeliveryChallan as ChallanType } from '../types';
import { Printer, FileBadge, Truck, Calendar, ShieldCheck, Signpost, HelpCircle } from 'lucide-react';

interface DeliveryChallanProps {
  order: Order;
  challan: ChallanType | null;
  onClose: () => void;
}

export default function DeliveryChallan({ order, challan, onClose }: DeliveryChallanProps) {
  if (!challan) {
    return (
      <div className="p-6 text-center text-slate-500 bg-white rounded-lg shadow-sm">
        <p>No delivery challan has been generated for this dispatch yet. Please generate it from the admin console.</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden max-w-4xl mx-auto my-6 print:my-0 print:shadow-none print:border-none">
      {/* Header Controls */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-250 flex items-center justify-between no-print print:hidden">
        <div className="flex items-center space-x-2">
          <FileBadge className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-slate-800">Delivery Challan / Gate Pass</span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            order.delivery_status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            Status: {order.delivery_status}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Challan</span>
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 text-sm font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Challan printable sheet */}
      <div id="challan-print-area" className="p-8 print:p-2 text-slate-800 font-sans text-sm">
        
        {/* Company Identity */}
        <div className="flex justify-between items-start border-b-2 border-indigo-600 pb-5">
          <div>
            <h1 className="text-2xl font-black text-indigo-900 tracking-tight">HCPL</h1>
            <p className="font-bold text-slate-700 text-xs mt-0.5">HARPREET CYLINDERS PVT. LTD.</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Industrial Cylinder Logistics & Cryo-Gases<br />
              Plot 12, Industrial Area, Mayapuri Phase II, New Delhi - 110064<br />
              PH: +91 11 4987 2300 | Email: dispatch@hcplgas.com
            </p>
            <span className="text-xs font-semibold text-indigo-800 mt-2 bg-indigo-50 px-2 py-0.5 rounded inline-block font-mono">
              GSTIN: 07AAACH9012A2Z5
            </span>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-slate-700 tracking-wider">DELIVERY CHALLAN</h2>
            <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wide">(Goods in Transit / Supply Pass)</p>
            <div className="mt-4 text-xs space-y-1">
              <p><span className="text-slate-500 font-medium">Challan No:</span> <span className="font-mono font-bold text-slate-900">{challan.challan_number}</span></p>
              <p><span className="text-slate-500 font-medium">Dispatch Date:</span> <span className="font-medium">{challan.dispatch_date}</span></p>
              <p><span className="text-slate-500 font-medium">Order Number:</span> <span className="font-mono">{order.order_number}</span></p>
            </div>
          </div>
        </div>

        {/* Consignee and Security Code details */}
        <div className="grid grid-cols-2 gap-8 my-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2 flex items-center gap-1">
              <Signpost className="w-3.5 h-3.5" /> Consignee Delivery Address
            </h3>
            <p className="font-bold text-slate-900">{challan.company_name}</p>
            <p className="text-xs text-slate-700 mt-1">{order.customer_name}</p>
            <p className="text-xs text-slate-600 mt-1">{challan.address}</p>
            <p className="text-xs text-slate-600 mt-1">{order.city}, {order.state} - {order.pincode}</p>
            <p className="text-xs text-slate-600 mt-1">Con: {order.phone_number}</p>
            {order.gst_number && (
              <p className="text-xs text-slate-500 mt-1.5 font-mono">GST: {order.gst_number}</p>
            )}
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase text-indigo-600 tracking-wider mb-2 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Logistics & Dispatch Details
              </h3>
              <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-xs">
                <div>
                  <span className="text-slate-500 block">Assigned Driver</span>
                  <span className="font-bold text-slate-800">{challan.driver_name || 'Unassigned'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Vehicle Number</span>
                  <span className="font-bold text-slate-800 font-mono">{challan.vehicle_number || 'Pending Assignment'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Delivery Date Limit</span>
                  <span className="font-medium text-slate-800">{order.delivery_date}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Delivery Time Slot</span>
                  <span className="font-medium text-slate-800">{order.delivery_slot}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200/80 pt-3 flex items-center justify-between mt-3">
              <div className="flex items-center space-x-1 text-indigo-700">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Security Access OTP</span>
              </div>
              <span className="bg-indigo-650 text-white font-mono px-3 py-1 rounded text-sm font-bold tracking-widest no-print">
                {order.delivery_otp}
              </span>
              <span className="hidden print:inline bg-indigo-150 border border-indigo-200 text-indigo-900 font-mono px-2 py-0.5 rounded text-xs">
                OTP REQUIRED ON APP
              </span>
            </div>
          </div>
        </div>

        {/* Cylinder cargo logistics tables */}
        <div className="my-6">
          <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-widest border-b border-indigo-100 pb-1 mb-2">
            LOGISTICS MATERIAL CARGO MANIFEST
          </h4>
          <table className="w-full text-left border-collapse border border-slate-200 text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3 w-12">#</th>
                <th className="p-3">Cylinder Content & Specifications</th>
                <th className="p-3">Cylinder Encasement Specification</th>
                <th className="p-3">Volume Capacity</th>
                <th className="p-3 text-right">Qty Sent</th>
                <th className="p-3 text-right">Qty Empty Returned</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-3 font-mono">1</td>
                <td className="p-3 font-bold text-slate-900">
                  {order.product_type} 
                  <span className="text-slate-500 block font-normal text-[11px] mt-0.5">Purity: {order.purity_level}</span>
                </td>
                <td className="p-3 text-slate-600">{order.cylinder_type}</td>
                <td className="p-3 font-mono">{order.cylinder_size}</td>
                <td className="p-3 text-right font-bold text-slate-900">{challan.cylinder_quantities} cyl</td>
                <td className="p-3 text-right border-l border-slate-250 font-mono text-slate-400">
                  [ &nbsp; &nbsp; &nbsp; ]
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Core safety checklist is crucial for cylinder delivery dispatch passes */}
        <div className="grid grid-cols-2 gap-8 mt-8">
          <div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-[11px] text-amber-900">
              <h5 className="font-bold flex items-center gap-1 uppercase tracking-wide text-amber-950 mb-1">
                ⚠️ MANDATORY CYLINDER HANDLING & SAFETY
              </h5>
              <ul className="list-disc pl-4.5 space-y-1">
                <li>Verify cylinder pressure rating and valve guards before accepting cargo.</li>
                <li>Ensure vertical storage under constant shelter. Protect from direct solar radiation.</li>
                <li>Do NOT drag physical cylinders. Always use custom cylinder trolley tools.</li>
                <li>Keep dynamic valve seals moisture and grease-free to eliminate oxygen flashing risks.</li>
              </ul>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 space-y-2">
            <h5 className="font-bold text-slate-700 uppercase tracking-widest text-[11px]">DISPATCH RESOLUTIONS & DECLARATION</h5>
            <p>
              I / We hereby acknowledge received the aforementioned high-pressure cylinder units in perfect functional
              and leak-free condition, satisfying the safety protocols declared. Empty units to be collected or booked via the ERP.
            </p>
            <div className="border border-slate-200 p-2.5 rounded flex items-center space-x-2 bg-slate-50">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <div>
                <span className="text-[10px] block text-slate-400 font-bold uppercase tracking-wide">OTP Validation Code</span>
                <span className="font-mono text-xs font-bold text-slate-800">Verified status: {order.otp_verified ? 'VERIFIED ✓' : 'PENDING FIELD VALIDATION'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Box */}
        <div className="grid grid-cols-3 gap-8 mt-12 pt-10 border-t border-slate-200 text-xs">
          <div className="text-center">
            <div className="h-12 border-dashed border-b border-slate-300"></div>
            <p className="mt-2 font-semibold text-slate-600">Gate Outpass Officer</p>
            <p className="text-[10px] text-slate-400">Security / Gate Clearance</p>
          </div>
          <div className="text-center flex flex-col items-center">
            <div className="h-12 flex items-end justify-center pb-1 w-full border-b border-dashed border-slate-300">
              {order.customer_signature ? (
                order.customer_signature.startsWith('text:') ? (
                  <span className="font-serif italic font-extrabold text-[#111827] text-sm tracking-wide">
                    {order.customer_signature.substring(5)}
                  </span>
                ) : (
                  <img 
                    src={order.customer_signature} 
                    alt="Receiver Signature" 
                    className="h-10 object-contain" 
                    referrerPolicy="no-referrer"
                  />
                )
              ) : (
                <span className="text-[10px] text-slate-300 italic">Signature Pending</span>
              )}
            </div>
            {order.otp_verified && (
              <p className="text-[10px] text-green-700 font-mono font-bold mt-1">Verified OTP: {order.delivery_otp}</p>
            )}
            <p className="mt-2 font-semibold text-slate-600">Customer Receiver Signature</p>
            <p className="text-[10px] text-slate-400">Name & Rubber Stamp</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-slate-400">For HARPREET CYLINDERS PVT. LTD.</p>
            <div className="h-12 flex items-end justify-end">
              <span className="font-serif italic font-bold text-slate-800 pr-4">Kuldeep Y.</span>
            </div>
            <p className="border-t border-slate-300 pt-1.5 font-bold text-slate-700">Dispatcher / Driver Sign</p>
          </div>
        </div>

      </div>
    </div>
  );
}
