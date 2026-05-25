import React, { useState } from 'react';
import { Product } from '../types';
import { 
  Boxes, AlertTriangle, Plus, RefreshCw, PenTool, CheckCircle, Trash2, ShieldCheck, Banknote
} from 'lucide-react';

interface InventoryManagerProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onLogAudit: (action: string, desc: string) => void;
}

export default function InventoryManager({ products, onUpdateProducts, onLogAudit }: InventoryManagerProps) {
  // Editing state toggles
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Fields State
  const [name, setName] = useState('');
  const [gasType, setGasType] = useState('Nitrogen Gas');
  const [purity, setPurity] = useState('99.999% Ultra High Purity (UHP)');
  const [cylinderType, setCylinderType] = useState('High Pressure Steel Cylinder');
  const [cylinderSize, setCylinderSize] = useState('47L (7.0 cubic meters)');
  const [stock, setStock] = useState(50);
  const [refill, setRefill] = useState(25);
  const [price, setPrice] = useState(1500);
  const [gst, setGst] = useState(18);
  const [hsn, setHsn] = useState('28040000');

  const [notification, setNotification] = useState('');

  const handleUpdateStockOrPrice = (prodId: string, updatedFields: Partial<Product>) => {
    const updated = products.map(p => {
      if (p.id === prodId) {
        const next = { ...p, ...updatedFields };
        // compute status
        if (next.stock_quantity <= 0) next.availability_status = 'Out of Stock';
        else if (next.stock_quantity <= 15) next.availability_status = 'Low Stock';
        else next.availability_status = 'In Stock';
        return next;
      }
      return p;
    });

    onUpdateProducts(updated);
    const matched = products.find(p => p.id === prodId);
    if (matched) {
      onLogAudit('STOCK_UPDATE', `Updated product stocks/prices for '${matched.product_name}'. Set stock=${updatedFields.stock_quantity ?? matched.stock_quantity}, price=₹${updatedFields.unit_price ?? matched.unit_price}.`);
    }
    triggerNotification('Product stock metrics successfully updated inside ERP.');
  };

  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const newProd: Product = {
      id: 'p-' + Date.now(),
      product_name: name,
      gas_type: gasType,
      purity_level: purity,
      cylinder_type: cylinderType,
      cylinder_size: cylinderSize,
      stock_quantity: stock,
      refill_quantity: refill,
      unit_price: price,
      GST_percentage: gst,
      availability_status: stock <= 0 ? 'Out of Stock' : stock <= 15 ? 'Low Stock' : 'In Stock',
      hsn_code: hsn
    };

    onUpdateProducts([...products, newProd]);
    onLogAudit('STOCK_CREATED', `Created new industrial product record '${name}' in HSN Category ${hsn}. Initial stock=${stock}.`);
    
    // Clear forms
    setName('');
    setStock(50);
    setPrice(1500);
    setShowAddForm(false);
    triggerNotification('New cylinder asset cataloged successfully.');
  };

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const gasTypesList = [
    'Nitrogen Gas', 'Oxygen Gas', 'Liquid Oxygen', 'Argon Gas', 'CO2 Gas', 
    'Hydrogen', 'Helium', 'Industrial Air', 'Medical Oxygen', 'Acetylene'
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Upper Alerts & Metrics */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-indigo-600" /> Stockpile & Refill Management Desk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Control live PESO certified high pressure gas cylinder assets, base rates, and refill queues.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Catalog New Cylinder</span>
        </button>
      </div>

      {notification && (
        <div className="p-3.5 bg-green-50 border border-green-200 text-green-800 rounded-lg text-xs font-semibold flex items-center space-x-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-green-700 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Add New Product Sheet */}
      {showAddForm && (
        <form onSubmit={handleAddNewProduct} className="bg-slate-50 p-6 rounded-xl border border-slate-205 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="md:col-span-3 pb-2 border-b border-slate-200">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide">Enter Cylinder Specifications</h4>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600 uppercase">Product Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ultra High Purity Nitrogen 10L"
              className="w-full bg-white border border-slate-200 px-3 py-2 rounded focus:outline-none select-text"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600 uppercase">Primary Gas Type</label>
            <select
              value={gasType}
              onChange={(e) => setGasType(e.target.value)}
              className="w-full bg-white border border-slate-200 px-2 py-2 rounded focus:outline-none"
            >
              {gasTypesList.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600 uppercase">HSN Code (8-digit)</label>
            <input
              type="text"
              value={hsn}
              onChange={(e) => setHsn(e.target.value)}
              className="w-full bg-white border border-slate-200 px-3 py-2 rounded font-mono select-text"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600 uppercase">Purity Target</label>
            <input
              type="text"
              value={purity}
              onChange={(e) => setPurity(e.target.value)}
              placeholder="e.g. 99.999% Ultra Pure"
              className="w-full bg-white border border-slate-200 px-3 py-2 rounded select-text"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600 uppercase">Encasement Type</label>
            <input
              type="text"
              value={cylinderType}
              onChange={(e) => setCylinderType(e.target.value)}
              className="w-full bg-white border border-slate-200 px-3 py-2 rounded select-text"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600 uppercase">Dry Volume Capacity</label>
            <input
              type="text"
              value={cylinderSize}
              onChange={(e) => setCylinderSize(e.target.value)}
              placeholder="e.g. 47L (7.0m³)"
              className="w-full bg-white border border-slate-200 px-3 py-2 rounded select-text"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600 uppercase">Base Price (INR) *</label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-white border border-slate-200 px-3 py-2 rounded select-text font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600 uppercase">GST Surcharge Pct (%)</label>
            <select
              value={gst}
              onChange={(e) => setGst(parseInt(e.target.value) || 18)}
              className="w-full bg-white border border-slate-200 px-2 py-2 rounded focus:outline-none font-bold"
            >
              <option value={18}>18% GST (Standard Gas)</option>
              <option value={12}>12% GST (Medical Oxygen)</option>
              <option value={5}>5% GST (Concession)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="block text-[10.5px] font-bold text-slate-600 uppercase">Stock Level</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-white border border-slate-200 px-1.5 py-2 rounded select-text"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10.5px] font-bold text-slate-600 uppercase">Hold Refills</label>
              <input
                type="number"
                value={refill}
                onChange={(e) => setRefill(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-white border border-slate-200 px-1.5 py-2 rounded select-text"
              />
            </div>
          </div>

          <div className="md:col-span-3 flex justify-end space-x-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-slate-600 border border-slate-200 hover:bg-slate-100 rounded text-xs font-bold font-sans cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded text-xs font-bold font-sans cursor-pointer"
            >
              Catalog Cylinder
            </button>
          </div>
        </form>
      )}

      {/* Database Warehouse Grid Sheet */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-widest font-mono">Cylinder Asset Records Ledger</span>
          <span className="text-[11px] text-slate-500">{products.length} catalog positions registered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="p-3.5">Product Name</th>
                <th className="p-3.5">Gas / Purity</th>
                <th className="p-3.5">Encasement & size</th>
                <th className="p-3.5 text-center">In Stock</th>
                <th className="p-3.5 text-center">Refill Hold</th>
                <th className="p-3.5 text-right">Base rate</th>
                <th className="p-3.5 text-right">Taxes (GST)</th>
                <th className="p-3.5 text-center w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {products.map((p) => {
                const isUnderStock = p.stock_quantity <= 15;
                const isEditing = editingProdId === p.id;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{p.product_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">HSN: {p.hsn_code}</div>
                    </td>
                    
                    <td className="p-3.5">
                      <span className="block font-medium text-slate-800">{p.gas_type}</span>
                      <span className="text-[10px] text-slate-500 font-serif italic">{p.purity_level}</span>
                    </td>

                    <td className="p-3.5 text-slate-500">
                      <span className="block text-[11px] font-semibold text-slate-700">{p.cylinder_type}</span>
                      <span className="text-[10px] font-mono">{p.cylinder_size}</span>
                    </td>

                    <td className="p-3.5 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          defaultValue={p.stock_quantity}
                          onBlur={(e) => handleUpdateStockOrPrice(p.id, { stock_quantity: Math.max(0, parseInt(e.target.value) || 0) })}
                          className="w-16 bg-slate-100 border border-slate-350 text-center font-bold px-1 py-0.5 rounded select-text"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center justify-center space-x-1.5">
                          <span className={`font-mono font-bold text-xs ${isUnderStock ? 'text-red-650' : 'text-slate-800'}`}>
                            {p.stock_quantity} units
                          </span>
                          {isUnderStock && (
                            <AlertTriangle className="w-3.5 h-3.5 text-red-500" title="Low Stocks!" />
                          )}
                        </div>
                      )}
                    </td>

                    <td className="p-3.5 text-center font-mono font-semibold text-slate-600">
                      {p.refill_quantity} exchange units
                    </td>

                    <td className="p-3.5 text-right font-mono font-bold text-slate-950">
                      {isEditing ? (
                        <input
                          type="number"
                          defaultValue={p.unit_price}
                          onBlur={(e) => handleUpdateStockOrPrice(p.id, { unit_price: Math.max(1, parseInt(e.target.value) || 1) })}
                          className="w-20 bg-slate-100 border border-slate-350 text-right font-bold px-1 py-0.5 rounded select-text"
                        />
                      ) : (
                        <span>₹{p.unit_price.toFixed(2)}</span>
                      )}
                    </td>

                    <td className="p-3.5 text-right font-semibold text-slate-500 font-mono">
                      {p.GST_percentage}% IGST
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="flex justify-center space-x-1">
                        <button
                          onClick={() => setEditingProdId(isEditing ? null : p.id)}
                          className="flex items-center space-x-1 px-2.5 py-1 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-600 rounded text-[10.5px] font-bold tracking-tight transition-all cursor-pointer"
                        >
                          <PenTool className="w-3 h-3 text-indigo-600" />
                          <span>{isEditing ? 'Save' : 'Update Pricing'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
