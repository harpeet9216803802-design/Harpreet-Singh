import React, { useState } from 'react';
import { Order, Driver, OrderStatus, AuditLog, Product, Invoice, DeliveryChallan as ChallanType } from '../types';
import { 
  Briefcase, Truck, Eye, CheckCircle, Clock, AlertCircle, FileText, FileBadge,
  ShieldAlert, RefreshCw, ClipboardList, Search, Filter, ShieldCheck, User, Users,
  Calculator, MapPin, Receipt, Star, Printer, Trash2
} from 'lucide-react';
import BillingInvoice from './BillingInvoice';
import DeliveryChallan from './DeliveryChallan';

interface AdminPanelProps {
  orders: Order[];
  drivers: Driver[];
  products: Product[];
  invoices: Invoice[];
  challans: ChallanType[];
  auditLogs: AuditLog[];
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  onAssignDriver: (orderId: string, driverId: string) => void;
  onGenerateInvoice: (orderId: string) => void;
  onGenerateChallan: (orderId: string) => void;
  onLogAudit: (action: string, desc: string) => void;
  onClearAllOrders?: () => void;
}

export default function AdminPanel({
  orders, drivers, products, invoices, challans, auditLogs,
  onUpdateOrderStatus, onAssignDriver, onGenerateInvoice, onGenerateChallan, onLogAudit,
  onClearAllOrders
}: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [confirmClear, setConfirmClear] = useState(false);
  
  // Selection details
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  // Modal toggles
  const [activeOverlay, setActiveOverlay] = useState<'invoice' | 'challan' | null>(null);

  // Compute master statistics card totals
  const totalInvoicedValue = invoices.reduce((sum, inv) => sum + inv.grand_total, 0);
  const outstandingCount = orders.filter(o => o.order_status !== 'Delivered' && o.order_status !== 'Cancelled').length;
  const activeFleetCount = drivers.filter(d => d.availability_status === 'On Delivery').length;

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone_number.includes(searchTerm);
    
    const matchesFilter = statusFilter === 'All' || o.order_status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const activeOrder = orders.find(o => o.id === selectedOrderId) || null;

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
    <div className="space-y-6 font-sans">
      
      {/* 1. Statistics Cards grids */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-205 p-4 rounded-xl flex items-center space-x-3 shadow-sm">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Total Registries</span>
            <span className="block text-xl font-bold text-slate-900">{orders.length} Orders</span>
          </div>
        </div>

        <div className="bg-white border border-slate-205 p-4 rounded-xl flex items-center space-x-3 shadow-sm">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg shrink-0">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Pending Fulfillments</span>
            <span className="block text-xl font-bold text-slate-900">{outstandingCount} Active</span>
          </div>
        </div>

        <div className="bg-white border border-slate-205 p-4 rounded-xl flex items-center space-x-3 shadow-sm">
          <div className="p-2.5 bg-green-50 text-green-600 rounded-lg shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Fleet on Transit</span>
            <span className="block text-xl font-bold text-slate-900">{activeFleetCount} Drivers On duty</span>
          </div>
        </div>

        <div className="bg-white border border-slate-205 p-4 rounded-xl flex items-center space-x-3 shadow-sm">
          <div className="p-2.5 bg-indigo-50 text-indigo-650 rounded-lg shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Gross Invoiced Sale</span>
            <span className="block text-xl font-bold text-slate-950 font-mono">₹{totalInvoicedValue.toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* 2. Operations Split: Invoices lists & interactive allocator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        
        {/* Left Column: Extensive Orders Ledger */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm space-y-4">
          
          <div className="p-4 bg-slate-50 border-b border-slate-210 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-slate-700 uppercase tracking-widest font-mono">Depot Dispatch Control Sheet</span>
              {onClearAllOrders && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirmClear) {
                      onClearAllOrders();
                      setConfirmClear(false);
                    } else {
                      setConfirmClear(true);
                      setTimeout(() => setConfirmClear(false), 4000);
                    }
                  }}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1 border ${
                    confirmClear 
                      ? 'bg-red-600 border-red-600 text-white animate-pulse shadow-sm' 
                      : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-600'
                  }`}
                >
                  <Trash2 className="w-2.5 h-2.5" />
                  <span>{confirmClear ? 'Click again to CONFIRM WIPE' : 'Clear All Orders'}</span>
                </button>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {/* Search Lookup */}
              <div className="relative text-xs">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Order No, Company, Person..."
                  className="bg-white border border-slate-250 px-2.5 py-1 text-xs rounded pl-7 select-text"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-250 py-1 px-2.5 text-xs rounded"
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Packed">Packed</option>
                <option value="Ready for Dispatch">Ready for Dispatch</option>
                <option value="Assigned to Driver">Assigned to Driver</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-500 font-bold uppercase text-[9.5px]">
                  <th className="p-3">Reference No</th>
                  <th className="p-3">Customer Company</th>
                  <th className="p-3">Gas Cylinder specification</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3">Logistics status</th>
                  <th className="p-3 text-center">Docs</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredOrders.map((o) => {
                  const isSelected = selectedOrderId === o.id;
                  const hasBill = o.invoice_generated;
                  const hasChallan = o.challan_generated;

                  return (
                    <tr 
                      key={o.id} 
                      className={`hover:bg-slate-50/50 transition-colors ${isSelected ? 'bg-blue-50/30 font-medium border-l-2 border-blue-600' : ''}`}
                    >
                      <td className="p-3">
                        <span className="font-mono font-bold text-slate-900 block">{o.order_number}</span>
                        <span className="text-[9.5px] text-slate-400 font-sans font-medium block">
                          OTP: {o.delivery_otp} 
                          {o.otp_verified && <span className="text-green-600 font-bold ml-1">✓ Verified</span>}
                        </span>
                      </td>

                      <td className="p-3">
                        <span className="block font-bold text-slate-850 leading-tight truncate max-w-[150px]">{o.company_name}</span>
                        <span className="text-[10px] text-slate-500 font-light block">{o.customer_name}</span>
                      </td>

                      <td className="p-3">
                        <span className="block font-medium text-slate-800">{o.product_type}</span>
                        <span className="text-[10px] text-slate-400 font-light">{o.cylinder_size} | {o.purity_level}</span>
                      </td>

                      <td className="p-3 text-center font-bold text-slate-900 font-mono">
                        {o.quantity} cyl
                      </td>

                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full font-bold uppercase text-[9.5px] ${
                          o.order_status === 'Delivered' 
                            ? 'bg-green-100 text-green-800' 
                            : o.order_status === 'Pending' 
                            ? 'bg-amber-100 text-amber-800' 
                            : o.order_status === 'Cancelled' 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-blue-100 text-blue-900'
                        }`}>
                          {o.order_status}
                        </span>
                      </td>

                      <td className="p-3 text-center">
                        <div className="flex justify-center space-x-1.5 text-slate-400">
                          <FileText className={`w-3.5 h-3.5 ${hasBill ? 'text-blue-600' : 'opacity-30'}`} title={hasBill ? 'Invoice PDF ready' : 'No Invoice'} />
                          <FileBadge className={`w-3.5 h-3.5 ${hasChallan ? 'text-indigo-600' : 'opacity-30'}`} title={hasChallan ? 'Challan PDF ready' : 'No Challan'} />
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        <button
                          onClick={() => setSelectedOrderId(isSelected ? null : o.id)}
                          className="px-2.5 py-1 text-[10.5px] font-bold bg-slate-100 border border-slate-205 text-slate-700 hover:bg-slate-200 rounded tracking-tight cursor-pointer"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Master allocation operator */}
        <div className="lg:col-span-4 space-y-6">
          {activeOrder ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 text-xs text-slate-800 relative">
              
              {/* Header */}
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Cylinder dispatch workflow controller</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5">{activeOrder.order_number}</h4>
                </div>
                <button 
                  onClick={() => setSelectedOrderId(null)}
                  className="p-1 px-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded text-[10px] font-bold uppercase text-slate-500 cursor-pointer"
                >
                  Clear selector
                </button>
              </div>

              {/* Status Update panel */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase">Transition supply Status</label>
                <div className="grid grid-cols-2 gap-1 text-[10.5px]">
                  <button
                    onClick={() => onUpdateOrderStatus(activeOrder.id, 'Approved')}
                    className={`p-1.5 text-center rounded border font-semibold cursor-pointer ${activeOrder.order_status === 'Approved' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                  >
                    1. Approve Order
                  </button>
                  <button
                    onClick={() => onUpdateOrderStatus(activeOrder.id, 'Packed')}
                    className={`p-1.5 text-center rounded border font-semibold cursor-pointer ${activeOrder.order_status === 'Packed' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                  >
                    2. Pack Cylinder
                  </button>
                  <button
                    onClick={() => onUpdateOrderStatus(activeOrder.id, 'Ready for Dispatch')}
                    className={`p-1.5 text-center rounded border font-semibold cursor-pointer ${activeOrder.order_status === 'Ready for Dispatch' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                  >
                    3. Ready / Loaded
                  </button>
                  <button
                    onClick={() => onUpdateOrderStatus(activeOrder.id, 'Out for Delivery')}
                    className={`p-1.5 text-center rounded border font-semibold cursor-pointer ${activeOrder.order_status === 'Out for Delivery' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                  >
                    4. Out For Deliv.
                  </button>
                  <button
                    onClick={() => onUpdateOrderStatus(activeOrder.id, 'Failed Delivery')}
                    className="p-1.5 text-center bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 rounded font-bold cursor-pointer"
                  >
                    Log Failed Delivery
                  </button>
                  <button
                    onClick={() => onUpdateOrderStatus(activeOrder.id, 'Cancelled')}
                    className="p-1.5 text-center bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-600 rounded font-bold cursor-pointer"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>

              {/* Driver allocation panel */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-500 uppercase">Allocate Delivery Driver & Plate No</label>
                
                {activeOrder.driver_id ? (
                  <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] text-indigo-500 uppercase font-bold tracking-wider">Assigned Contractor</span>
                      <span className="font-bold text-indigo-950">
                        {drivers.find(d => d.id === activeOrder.driver_id)?.driver_name || 'Assigned Driver'}
                      </span>
                    </div>

                    {/* Allow reassign */}
                    <select
                      value={activeOrder.driver_id || ''}
                      onChange={(e) => {
                        if (e.target.value) onAssignDriver(activeOrder.id, e.target.value);
                      }}
                      className="bg-white border border-indigo-300 py-1 px-1.5 text-[10.5px] rounded text-slate-800 font-medium"
                    >
                      {drivers.filter(d => d.availability_status === 'Available').map(d => (
                        <option key={d.id} value={d.id}>{d.driver_name}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[10.5px] text-slate-500 font-light">Assign an active, available heavy vehicle operator from our certified PESO dispatcher roster:</p>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {drivers.filter(d => d.availability_status === 'Available').map(drv => (
                        <button
                          key={drv.id}
                          type="button"
                          onClick={() => onAssignDriver(activeOrder.id, drv.id)}
                          className="w-full text-left p-2 border border-slate-200 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-300 rounded flex justify-between items-center transition-all cursor-pointer"
                        >
                          <div>
                            <span className="font-bold text-slate-800 block text-[11px]">{drv.driver_name}</span>
                            <span className="text-[9.5px] text-slate-400 block font-mono">{drv.vehicle_number} | {drv.vehicle_type}</span>
                          </div>
                          <span className="text-[9.5px] font-bold text-blue-600 uppercase tracking-wider font-sans">Dispatch →</span>
                        </button>
                      ))}
                      {drivers.filter(d => d.availability_status === 'Available').length === 0 && (
                        <p className="text-[10px] text-amber-700 italic font-medium p-1">No on-shift drivers are currently marked 'Available'. Please update their status inside the Drivers Shift tab.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Document builder trigger and print-out view panel */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-500 uppercase">Automated GST Files Generation</label>
                <div className="space-y-2 text-xs">
                  {/* Tax invoice controls */}
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                    <div>
                      <span className="block font-bold text-[11px]">GST Commercial Invoice</span>
                      <span className="text-[9.5px] text-slate-400">{activeOrder.invoice_generated ? 'Generated Successfully' : 'Not Generated'}</span>
                    </div>
                    {activeOrder.invoice_generated ? (
                      <button
                        onClick={() => setActiveOverlay('invoice')}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold uppercase transition-colors cursor-pointer"
                      >
                        Print Invoice
                      </button>
                    ) : (
                      <button
                        onClick={() => onGenerateInvoice(activeOrder.id)}
                        className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer"
                      >
                        Create Invoice
                      </button>
                    )}
                  </div>

                  {/* Delivery Challan controls */}
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                    <div>
                      <span className="block font-bold text-[11px]">Gate Clearance Challan</span>
                      <span className="text-[9.5px] text-slate-400">{activeOrder.challan_generated ? 'Generated Successfully' : 'Not Generated'}</span>
                    </div>
                    {activeOrder.challan_generated ? (
                      <button
                        onClick={() => setActiveOverlay('challan')}
                        className="px-2.5 py-1 bg-indigo-650 hover:bg-indigo-700 text-white rounded text-[10px] font-bold uppercase transition-colors cursor-pointer"
                      >
                        Print Gatepass
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (!activeOrder.driver_id) {
                            alert('Please assign an available delivery driver first to allocate vehicle registers.');
                            return;
                          }
                          onGenerateChallan(activeOrder.id);
                        }}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                          activeOrder.driver_id 
                            ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' 
                            : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                        }`}
                      >
                        Create Gate Pass
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* GPS Reference */}
              {activeOrder.latitude && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
                  <span className="font-semibold text-slate-500">Destination Geo-Coords:</span>
                  <span className="font-mono text-slate-700">{activeOrder.latitude}, {activeOrder.longitude}</span>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-205 rounded-xl p-8 text-center space-y-4 font-sans text-xs">
              <div className="w-12 h-12 rounded-full bg-slate-200/60 text-slate-400 flex items-center justify-center mx-auto">
                <User className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Cylinder Operations Desk</h4>
                <p className="text-slate-400 font-light mt-1 max-w-xs mx-auto">
                  Click the 'Manage' button on any active record inside our primary Okhla / Mayapuri logistical tables list to assign shift drivers, update progress timelines, or generate printable tax documents.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 text-left text-[11px] text-slate-500 space-y-2.5">
                <span className="font-bold text-slate-700 uppercase tracking-widest text-[9.5px] block font-mono">🛡️ CYLINDER SECURITY AUDITS LOG</span>
                <p className="leading-relaxed">All cylinder swaps and gas discharges require customer security clearances. Unverified logs raise alerts on administrative control sheets automatically.</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 3. Lower Console Audit Logs Dashboard listing */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 uppercase tracking-widest font-mono flex items-center gap-1">
            <ClipboardList className="w-4 h-4 text-slate-500" /> System Activity Audit ledger Logs
          </span>
          <span className="text-[10px] font-mono text-slate-400">Security Logging Module Enabled</span>
        </div>

        <div className="overflow-y-auto max-h-60 text-[11px] font-mono select-text divide-y divide-slate-150">
          {auditLogs.map((log) => {
            return (
              <div key={log.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50/50 transition-colors gap-1.5">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-700 font-bold">[{log.action_type}]</span>
                    <span className="text-slate-500">{log.timestamp}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold font-sans">
                      By: {log.admin_name} ({log.admin_role})
                    </span>
                  </div>
                  <p className="text-slate-700 font-sans leading-tight mt-0.5">{log.description}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 select-all">IP: {log.ip_address}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Document Overlay Frames */}
      {activeOverlay === 'invoice' && matchedInvoice && activeOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto no-print animate-fade-in">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl relative">
            <BillingInvoice
              order={activeOrder}
              invoice={matchedInvoice}
              product={matchedProduct}
              onClose={() => setActiveOverlay(null)}
            />
          </div>
        </div>
      )}

      {activeOverlay === 'challan' && matchedChallan && activeOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto no-print animate-fade-in">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl relative">
            <DeliveryChallan
              order={activeOrder}
              challan={matchedChallan}
              onClose={() => setActiveOverlay(null)}
            />
          </div>
        </div>
      )}

    </div>
  );
}
