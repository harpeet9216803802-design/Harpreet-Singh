import React, { useState } from 'react';
import { Invoice, PaymentStatus, PaymentMethod } from '../types';
import { 
  Banknote, Calendar, CheckCircle, Clock, Search, ShieldCheck, DollarSign, Receipt, CreditCard, ChevronDown, Check, AlertCircle, Building, BookOpen
} from 'lucide-react';

interface PaymentTrackerProps {
  invoices: Invoice[];
  onUpdateInvoiceStatus: (invoiceId: string, status: PaymentStatus, method?: PaymentMethod) => void;
  onLogAudit: (action: string, desc: string) => void;
}

export default function PaymentTracker({ invoices, onUpdateInvoiceStatus, onLogAudit }: PaymentTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Bank Transfer');
  const [statusSelect, setStatusSelect] = useState<PaymentStatus>('Paid');
  const [remarks, setRemarks] = useState('');

  // Settle calculations
  const totalRevenue = invoices
    .filter(inv => inv.payment_status === 'Paid')
    .reduce((sum, inv) => sum + inv.grand_total, 0);

  const outstandingBalance = invoices
    .filter(inv => inv.payment_status === 'Pending' || inv.payment_status === 'Partial')
    .reduce((sum, inv) => sum + inv.grand_total, 0);

  const totalInvoicedTax = invoices
    .reduce((sum, inv) => sum + inv.total_tax, 0);

  const filteredInvoices = invoices.filter(inv => 
    inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProcessPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    onUpdateInvoiceStatus(selectedInvoice.id, statusSelect, payMethod);
    onLogAudit('PAYMENT_RECORDED', `Recorded payment for ${selectedInvoice.company_name} on Invoice ${selectedInvoice.invoice_number}. Status updated to: ${statusSelect}, Method: ${payMethod}. Remarks: ${remarks || 'None'}`);

    alert(`Payment recorded successfully for invoice ${selectedInvoice.invoice_number}!`);
    setSelectedInvoice(null);
    setRemarks('');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Upper Cards showing balance logs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center opacity-85 text-xs uppercase font-extrabold tracking-wider">
            <span>Collected Revenue</span>
            <CheckCircle className="w-4 h-4 text-emerald-300" />
          </div>
          <p className="text-3xl font-black text-white font-mono">₹{totalRevenue.toFixed(2)}</p>
          <p className="text-[10px] text-emerald-250 italic">Cleared payments stored inside local server files</p>
        </div>

        <div className="bg-gradient-to-r from-amber-700 to-orange-800 text-white rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center opacity-85 text-xs uppercase font-extrabold tracking-wider">
            <span>Outstanding Dues Receivables</span>
            <Clock className="w-4 h-4 text-amber-300" />
          </div>
          <p className="text-3xl font-black text-white font-mono font-sans">₹{outstandingBalance.toFixed(2)}</p>
          <p className="text-[10px] text-amber-200">Pending Credit lines & terms Net-30 dispatches</p>
        </div>

        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center opacity-85 text-xs uppercase font-extrabold tracking-wider">
            <span>Aggregated Indirect tax GST</span>
            <Receipt className="w-4 h-4 text-blue-300" />
          </div>
          <p className="text-3xl font-black text-white font-mono">₹{totalInvoicedTax.toFixed(2)}</p>
          <p className="text-[10px] text-blue-200">Total logged SGST + CGST + IGST liability</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Ledger table */}
        <div className="lg:col-span-8 bg-white border border-slate-205 rounded-xl overflow-hidden shadow-sm space-y-4">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" /> Customer Invoice Book Ledger
              </span>
            </div>
            
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Client or Invoice No..."
                className="bg-white border border-slate-250 px-2.5 py-1 text-xs rounded pl-7 select-text"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                  <th className="p-3">Invoice Number</th>
                  <th className="p-3">Customer (Company)</th>
                  <th className="p-3">Invoiced Date</th>
                  <th className="p-3 text-right">Taxable Value</th>
                  <th className="p-3 text-right">Invoice Total (GST)</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">{inv.invoice_number}</td>
                    <td className="p-3 font-bold">
                      <span className="block text-slate-800">{inv.company_name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">Contact: {inv.customer_name}</span>
                    </td>
                    <td className="p-3 text-slate-500 font-medium">{inv.invoice_date}</td>
                    <td className="p-3 text-right font-mono text-slate-600">₹{inv.taxable_value.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">₹{inv.grand_total.toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${
                        inv.payment_status === 'Paid' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : inv.payment_status === 'Pending' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {inv.payment_status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-2.5 py-1 text-[10px] font-bold uppercase bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                      >
                        Adjust / Pay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment entry processing panel */}
        <div className="lg:col-span-4 space-y-6">
          {selectedInvoice ? (
            <form onSubmit={handleProcessPaymentSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5 text-xs text-slate-800">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Adjustment Board</span>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5">Settle Invoice Outstanding</h4>
                <p className="text-[11px] text-slate-400 mt-1">Invoice: <span className="font-mono font-bold text-slate-900">{selectedInvoice.invoice_number}</span></p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-700">
                <p className="flex justify-between">
                  <span className="text-slate-400">Total Billed Amt:</span>
                  <span className="font-mono font-bold text-slate-900">₹{selectedInvoice.grand_total.toFixed(2)}</span>
                </p>
                <p className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-400">Billed to:</span>
                  <span className="font-semibold text-slate-800">{selectedInvoice.company_name}</span>
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase">Acknowledge Status</label>
                <select
                  value={statusSelect}
                  onChange={(e) => setStatusSelect(e.target.value as PaymentStatus)}
                  className="w-full bg-slate-50 border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none text-xs text-slate-800"
                >
                  <option value="Paid">Mark as FULLY PAID (Receipt Settled)</option>
                  <option value="Partial">Mark as PARTIALLY PAID</option>
                  <option value="Pending">Mark as PENDING (Invoiced Credit Line)</option>
                  <option value="Failed">Mark as FAILED TRANSACTION</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase">Payment Settlement Mode</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                  className="w-full bg-slate-50 border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none text-xs text-slate-800"
                >
                  <option value="Bank Transfer">NEFT/RTGS Electronic Bank Transfer</option>
                  <option value="UPI">UPI Transaction (G-Pay/PhonePe Code)</option>
                  <option value="Cash">Cash Handover (On-site Delivery Collection)</option>
                  <option value="Credit">Registered Cylinder General Credit Term</option>
                  <option value="Online Payment">Online secure Stripe/Razorpay Portal</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase">Receipt Adjustment remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Cleared via HDFC Bank NEFT UTIN004819..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-250 rounded px-3 py-1.5 focus:outline-none text-xs text-slate-850 select-text"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="w-2/5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-750 font-bold uppercase py-2 rounded text-[10px] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-3/5 bg-emerald-650 hover:bg-emerald-700 text-white font-bold uppercase py-2 rounded text-[10px] tracking-wide transition-all cursor-pointer"
                >
                  File Ledger Adjustment
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-slate-50 border border-slate-205 rounded-xl p-6 text-center space-y-4 font-sans text-xs">
              <div className="w-12 h-12 rounded-full bg-slate-200/60 text-slate-400 flex items-center justify-center mx-auto">
                <Banknote className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Process Bank receipts</h4>
                <p className="text-slate-400 font-light mt-1 max-w-xs mx-auto">
                  Click 'Adjust/Pay' on any customer invoice from the ledger block on the left to write off balances or settle payments with corporate banks.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 text-left text-[11px] text-slate-500 space-y-2.5">
                <span className="font-bold text-slate-700 uppercase tracking-widest text-[9.5px] block">🏢 RECORDED ESCROW DETAILS</span>
                <p>All credits and pay cycles are audited. Discrepancies generate warning flags on the principal ERP metrics board.</p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
