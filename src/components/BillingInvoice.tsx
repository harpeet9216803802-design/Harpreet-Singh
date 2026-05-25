import React from 'react';
import { Order, Invoice, Product } from '../types';
import { Printer, Download, CheckCircle, FileText, Building2, User } from 'lucide-react';

interface BillingInvoiceProps {
  order: Order;
  invoice: Invoice | null;
  product?: Product;
  onClose: () => void;
}

export default function BillingInvoice({ order, invoice, product, onClose }: BillingInvoiceProps) {
  if (!invoice) {
    return (
      <div className="p-6 text-center text-slate-500 bg-white rounded-lg shadow-sm">
        <p>No invoice has been generated for this order yet. Please generate it from the admin console.</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const gstRate = product?.GST_percentage || 18;
  const isInterstate = order.state.toLowerCase() !== 'delhi';

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden max-w-4xl mx-auto my-6 print:my-0 print:shadow-none print:border-none">
      {/* Header Controls */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-250 flex items-center justify-between no-print print:hidden">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-slate-800">GST Invoice View</span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            invoice.payment_status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {invoice.payment_status}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 text-sm font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Invoice Printable Sheet */}
      <div id="invoice-print-area" className="p-8 print:p-2 text-slate-800 font-sans text-sm">
        {/* Company Branding */}
        <div className="flex justify-between items-start border-b-2 border-blue-600 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-blue-900">HCPL</h1>
            <p className="font-semibold text-slate-700 text-xs mt-0.5">HARPREET CYLINDERS PVT. LTD.</p>
            <p className="text-xs text-slate-500 mt-2 max-w-sm">
              Plot 12, Industrial Area, Mayapuri Phase II,<br />
              New Delhi, Delhi - 110064<br />
              Email: billing@hcplgas.com | Ph: +91 11 4987 2300
            </p>
            <p className="text-xs font-semibold text-slate-700 mt-2">
              GSTIN: <span className="font-mono text-blue-700">07AAACH9012A2Z5</span>
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-slate-700 tracking-wide uppercase">TAX INVOICE</h2>
            <div className="mt-4 text-xs space-y-1">
              <p><span className="text-slate-500 font-medium">Invoice No:</span> <span className="font-mono font-bold text-slate-900">{invoice.invoice_number}</span></p>
              <p><span className="text-slate-500 font-medium">Date:</span> <span className="font-medium">{invoice.invoice_date}</span></p>
              <p><span className="text-slate-500 font-medium">Due Date:</span> <span className="font-medium">{invoice.due_date}</span></p>
              <p><span className="text-slate-500 font-medium">Order Number:</span> <span className="font-mono">{order.order_number}</span></p>
            </div>
          </div>
        </div>

        {/* Client & Dispatch Details */}
        <div className="grid grid-cols-2 gap-8 my-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Billed To (Customer)
            </h3>
            <p className="font-bold text-slate-900 text-base">{order.company_name}</p>
            <p className="text-xs text-slate-600 mt-1">Con. Person: {order.customer_name}</p>
            <p className="text-xs text-slate-600 mt-1">{order.address}, {order.city}, {order.state} - {order.pincode}</p>
            <p className="text-xs text-slate-600 mt-1">Ph: {order.phone_number}</p>
            {order.gst_number && (
              <p className="text-xs font-semibold text-slate-800 mt-2 bg-slate-200/60 px-2 py-0.5 rounded inline-block font-mono">
                GSTIN: {order.gst_number}
              </p>
            )}
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2 flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Consignee / Ship To
              </h3>
              <p className="font-bold text-slate-900">{order.company_name}</p>
              <p className="text-xs text-slate-600 mt-1">Delivery Address: {order.address}, {order.city}, {order.state} - {order.pincode}</p>
              {order.landmark && <p className="text-xs text-slate-500 italic mt-0.5">Landmark: {order.landmark}</p>}
            </div>
            <div className="text-right text-xs mt-3 border-t border-slate-200/80 pt-2">
              <span className="text-slate-500 font-medium">Place of Supply:</span> <span className="font-bold text-slate-700">{order.state} ({order.city})</span>
            </div>
          </div>
        </div>

        {/* Product details table */}
        <table className="w-full text-left border-collapse border border-slate-200 mt-6 text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th className="p-3">#</th>
              <th className="p-3">Product Name & Description</th>
              <th className="p-3">HSN Code</th>
              <th className="p-3 text-right">Quantity</th>
              <th className="p-3 text-right">Unit Price (INR)</th>
              <th className="p-3 text-right">GST %</th>
              <th className="p-3 text-right">Taxable Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200 hover:bg-slate-50/50">
              <td className="p-3 font-mono">1</td>
              <td className="p-3">
                <p className="font-bold text-slate-900">{product?.product_name || order.product_type}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Type: {order.cylinder_type} | Capacity: {order.cylinder_size} | Purity: {order.purity_level}
                </p>
              </td>
              <td className="p-3 font-mono">{product?.hsn_code || '28040000'}</td>
              <td className="p-3 text-right font-semibold">{order.quantity} Cylinder(s)</td>
              <td className="p-3 text-right font-mono">₹{invoice.taxable_value / order.quantity}</td>
              <td className="p-3 text-right font-mono">{gstRate}%</td>
              <td className="p-3 text-right font-mono">₹{invoice.taxable_value.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Taxation Breakdown Block */}
        <div className="grid grid-cols-2 gap-8 mt-6">
          <div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-[11px]">
              <h4 className="font-bold text-slate-700 mb-2 uppercase tracking-wide">Bank Details For Payments</h4>
              <p className="mt-1"><span className="text-slate-500">Account Name:</span> <span className="font-bold text-slate-800">Harpreet Cylinders Private Limited</span></p>
              <p><span className="text-slate-500">Bank Name:</span> <span className="font-bold text-slate-800">HDFC Bank Ltd, Mayapuri Industrial Area Branch</span></p>
              <p><span className="text-slate-500">A/C Number:</span> <span className="font-bold text-slate-800 font-mono">50200049102450</span></p>
              <p><span className="text-slate-500">IFSC Code:</span> <span className="font-bold text-slate-800 font-mono">HDFC0000214</span></p>
              <p className="mt-2 text-slate-500">Note: Please quote our invoice number for electronic bank transfers.</p>
            </div>
            
            <div className="mt-4 text-[10px] text-slate-400">
              <p className="font-semibold uppercase tracking-wider mb-1 text-slate-500">Terms & Conditions:</p>
              <ol className="list-decimal pl-4.5 space-y-0.5">
                <li>Interest @18% p.a. will be charged for payment delayed beyond due date.</li>
                <li>Ensure all empty cylinders returned in proper working order. Empty holding cost is ₹50/day after 15 days.</li>
                <li>Goods once sold are strictly non-returnable.</li>
                <li>All disputes are subject to New Delhi Jurisdiction.</li>
              </ol>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Subtotal (Taxable Value):</span>
              <span className="font-mono font-semibold text-slate-950">₹{invoice.taxable_value.toFixed(2)}</span>
            </div>

            {isInterstate ? (
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Integrated GST (IGST {gstRate}%):</span>
                <span className="font-mono font-semibold text-slate-950">₹{invoice.igst_amount.toFixed(2)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Central GST (CGST {gstRate/2}%):</span>
                  <span className="font-mono font-semibold text-slate-950">₹{invoice.cgst_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">State GST (SGST {gstRate/2}%):</span>
                  <span className="font-mono font-semibold text-slate-950">₹{invoice.sgst_amount.toFixed(2)}</span>
                </div>
              </>
            )}

            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-600 font-semibold text-xs">Total Taxes:</span>
              <span className="font-mono font-bold text-slate-850">₹{invoice.total_tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-3 rounded-lg bg-blue-50/50 px-4 mt-2 border border-blue-100 font-bold text-sm">
              <span className="text-blue-900 uppercase tracking-wide">GRAND TOTAL:</span>
              <span className="font-mono text-blue-900 text-base">₹{invoice.grand_total.toFixed(2)}</span>
            </div>

            <div className="pt-8 text-center no-print">
              <div className="inline-block p-2 bg-slate-50 border border-slate-100 rounded-lg">
                {/* Simulated QR Code for GST portal */}
                <div className="w-24 h-24 bg-slate-200 flex flex-col items-center justify-center p-1 rounded border border-slate-300 mx-auto">
                  <div className="grid grid-cols-4 gap-1 w-full h-full opacity-70">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className={`rounded-sm ${(i % 3 === 0 || i % 5 === 0) ? 'bg-slate-800' : 'bg-transparent'}`} />
                    ))}
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mt-1 block">HCPL e-Verify QR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Signatures */}
        <div className="flex justify-between items-end border-t border-slate-250 mt-10 pt-8 text-xs">
          <div className="text-center w-48 flex flex-col items-center">
            <div className="h-10 flex items-end justify-center pb-1 w-full">
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
                <span className="text-[10px] text-slate-300 italic">No Signature Logged</span>
              )}
            </div>
            <p className="border-t border-slate-400 pt-1 font-medium text-slate-600 w-full">Receiver's Signature</p>
            <p className="text-[10px] text-slate-400">(Acceptance of gas & cylinder safety)</p>
          </div>
          <div className="text-right w-56 text-xs pb-3.5">
            <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">For HARPREET CYLINDERS PVT. LTD.</p>
            <div className="h-10 text-center font-serif text-blue-800 italic text-base leading-10 select-none">
              Harpreet Singh
            </div>
            <p className="border-t border-slate-400 pt-1 font-bold text-slate-700">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
}
