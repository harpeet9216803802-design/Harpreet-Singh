import React, { useState } from 'react';
import { Driver } from '../types';
import { 
  Truck, ShieldCheck, UserPlus, Phone, MapPin, Mail, AlertCircle, RefreshCw, PenTool, Trash2, CheckCircle2
} from 'lucide-react';

interface DriverManagerProps {
  drivers: Driver[];
  onUpdateDrivers: (drivers: Driver[]) => void;
  onLogAudit: (action: string, desc: string) => void;
}

export default function DriverManager({ drivers, onUpdateDrivers, onLogAudit }: DriverManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [notification, setNotification] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [vehicleType, setVehicleType] = useState('TATA Ace Gold Mini-Truck');
  const [license, setLicense] = useState('');
  const [area, setArea] = useState('Okhla Industrial Area');

  const handleUpdateStatus = (driverId: string, nextStatus: Driver['availability_status']) => {
    const updated = drivers.map(d => {
      if (d.id === driverId) {
        return { ...d, availability_status: nextStatus };
      }
      return d;
    });

    onUpdateDrivers(updated);
    const matched = drivers.find(d => d.id === driverId);
    if (matched) {
      onLogAudit('DRIVER_STATUS_UPDATE', `Updated driver '${matched.driver_name}' availability status inside fleet database to ${nextStatus}.`);
    }
    triggerNotification(`Driver status successfully set to '${nextStatus}'.`);
  };

  const handleRegisterDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !vehicleNo) return;

    const newDriver: Driver = {
      id: 'drv-' + Date.now(),
      driver_name: name,
      phone_number: phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@hcplgas.com`,
      vehicle_number: vehicleNo,
      vehicle_type: vehicleType,
      license_number: license || 'DL-01' + Math.floor(Math.random() * 9000000),
      assigned_area: area,
      availability_status: 'Available',
      created_at: new Date().toISOString()
    };

    onUpdateDrivers([...drivers, newDriver]);
    onLogAudit('DRIVER_REGISTERED', `Registered new delivery contract driver '${name}' with vehicle '${vehicleNo}' in system database.`);

    // Clear
    setName('');
    setPhone('');
    setEmail('');
    setVehicleNo('');
    setLicense('');
    setShowAddForm(false);
    triggerNotification('New logistical driver contract successfully registered in ERP.');
  };

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const vehicleTypes = [
    'TATA Ace Gold Mini-Truck',
    'TATA 407 Cargo Industrial Truck',
    'Eicher Pro 2049 Heavy Duty cylinder Truck',
    'Eicher Pro Cryo-Container',
    'Mahindra Bolero Pickup Maxi-Truck'
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Page Title & Metrics */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" /> Logistics Fleet & Courier Control Centre
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Track commercial driver availability, license logs, assigned vehicle containers, and active zones.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Dispatcher</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-green-750 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Driver Registration Sheet Form */}
      {showAddForm && (
        <form onSubmit={handleRegisterDriver} className="bg-slate-50 p-6 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
          <div className="md:col-span-3 pb-2 border-b border-slate-200">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider">Register Operational Dispatch Contractor</h4>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600 uppercase">Driver Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sardar Gurpreet Singh"
              className="w-full bg-white border border-slate-205 px-3 py-2 rounded focus:outline-none select-text"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600 uppercase">Direct Mobile Contact *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +91 9911223344"
              className="w-full bg-white border border-slate-205 px-3 py-2 rounded focus:outline-none select-text"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600 uppercase">Contractor Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="driver-name@hcplgas.com"
              className="w-full bg-white border border-slate-205 px-3 py-2 rounded focus:outline-none select-text"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600 uppercase">Vehicle Register Number No. *</label>
            <input
              type="text"
              required
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              placeholder="e.g. DL-01-LCV-5511"
              className="w-full bg-white border border-slate-205 px-3 py-2 rounded font-mono uppercase focus:outline-none select-text"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600 uppercase">Vehicle Classification</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full bg-white border border-slate-205 px-2.5 py-2 rounded focus:outline-none"
            >
              {vehicleTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-600 uppercase">PESO / HGV Driving License No</label>
            <input
              type="text"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              placeholder="e.g. DL-01201824901A"
              className="w-full bg-white border border-slate-205 px-3 py-2 rounded font-mono uppercase focus:outline-none select-text"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 uppercase">Assigned Logistical Supply District</label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Mayapuri Industrial Phase II & Dwarka industrial yards"
              className="w-full bg-white border border-slate-205 px-3 py-2 rounded focus:outline-none select-text"
            />
          </div>

          <div className="md:col-span-3 flex justify-end space-x-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold cursor-pointer"
            >
              Register Contractor
            </button>
          </div>
        </form>
      )}

      {/* Grid of Drivers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((d) => (
          <div key={d.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all">
            <div className="p-5 space-y-4">
              
              {/* Header: Name and status badge */}
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <h3 className="font-extrabold text-slate-950 text-base">{d.driver_name}</h3>
                  <span className="text-[10px] text-slate-400 block font-bold font-sans">
                    CONTRACT CONTRACTOR: {d.id.toUpperCase()}
                  </span>
                </div>
                <span className={`text-[10px] uppercase px-2.5 py-1 rounded-full font-bold ${
                  d.availability_status === 'Available' 
                    ? 'bg-green-100 text-green-800' 
                    : d.availability_status === 'On Delivery' 
                    ? 'bg-blue-105 text-blue-800' 
                    : 'bg-slate-100 text-slate-800'
                }`}>
                  {d.availability_status}
                </span>
              </div>

              {/* Specifications: Contact, vehicle plates, licenses, assigned areas */}
              <div className="space-y-2.5 pt-3.5 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-mono font-semibold text-slate-800">{d.phone_number}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate text-slate-500">{d.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="font-mono font-bold text-slate-850 block">{d.vehicle_number}</span>
                    <span className="text-[10.5px] text-slate-400 block">{d.vehicle_type}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-slate-650 leading-tight block">{d.assigned_area}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-[10px] font-mono text-slate-500">HGV license: {d.license_number}</span>
                </div>
              </div>

            </div>

            {/* Actions PanelFooter: Changing statuses directly */}
            <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Set availability:</span>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleUpdateStatus(d.id, 'Available')}
                  className={`px-2 py-1 text-[10px] font-bold rounded cursor-pointer ${
                    d.availability_status === 'Available' ? 'bg-green-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => handleUpdateStatus(d.id, 'On Delivery')}
                  className={`px-2 py-1 text-[10px] font-bold rounded cursor-pointer ${
                    d.availability_status === 'On Delivery' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Transit
                </button>
                <button
                  onClick={() => handleUpdateStatus(d.id, 'Offline')}
                  className={`px-2 py-1 text-[10px] font-bold rounded cursor-pointer ${
                    d.availability_status === 'Offline' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Off
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
