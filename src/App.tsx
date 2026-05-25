import React, { useState, useEffect } from 'react';
import { 
  AdminUser, Order, Driver, Invoice, DeliveryChallan, AuditLog, Product, OrderStatus, PaymentStatus, PaymentMethod 
} from './types';
import { 
  initialProducts, initialDrivers, initialOrders, initialInvoices, initialChallans, initialAuditLogs 
} from './data/mockData';
import LandingPage from './components/LandingPage';
import CustomerOrderForm from './components/CustomerOrderForm';
import TrackingPortal from './components/TrackingPortal';
import AdminPanel from './components/AdminPanel';
import InventoryManager from './components/InventoryManager';
import DriverManager from './components/DriverManager';
import PaymentTracker from './components/PaymentTracker';
import ReportsView from './components/ReportsView';
import { 
  Layers, LogIn, LogOut, LayoutDashboard, Truck, Shield, ShieldCheck, Heart, Sparkles, Building2, Globe2, ShoppingBag, Eye, AlertCircle 
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'order' | 'track' | 'admin'>('home');
  const [adminSubTab, setAdminSubTab] = useState<'overview' | 'inventory' | 'drivers' | 'payments' | 'reports'>('overview');
  const [initialTrackingOrderId, setInitialTrackingOrderId] = useState<string | null>(null);

  // Database States (Headed from LocalStorage or mock fallbacks)
  const [products, setProducts] = useState<Product[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [challans, setChallans] = useState<DeliveryChallan[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Selected product passed directly to Order Form catalog buy triggers
  const [selectedProductToOrder, setSelectedProductToOrder] = useState<Product | null>(null);

  // Authenticated Admin User
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showCredsHint, setShowCredsHint] = useState(false);
  const [loginRole, setLoginRole] = useState<'Super Admin' | 'Operations Manager' | 'Delivery Manager' | 'Billing Manager' | 'Staff Member'>('Super Admin');

  // Load from local storage on mount
  useEffect(() => {
    const storedProds = localStorage.getItem('hcpl_products');
    const storedDrivers = localStorage.getItem('hcpl_drivers');
    const storedOrders = localStorage.getItem('hcpl_orders');
    const storedInvoices = localStorage.getItem('hcpl_invoices');
    const storedChallans = localStorage.getItem('hcpl_challans');
    const storedLogs = localStorage.getItem('hcpl_auditlogs');

    if (storedProds) setProducts(JSON.parse(storedProds));
    else {
      setProducts(initialProducts);
      localStorage.setItem('hcpl_products', JSON.stringify(initialProducts));
    }

    if (storedDrivers) setDrivers(JSON.parse(storedDrivers));
    else {
      setDrivers(initialDrivers);
      localStorage.setItem('hcpl_drivers', JSON.stringify(initialDrivers));
    }

    if (storedOrders) setOrders(JSON.parse(storedOrders));
    else {
      setOrders([]);
      localStorage.setItem('hcpl_orders', JSON.stringify([]));
    }

    if (storedInvoices) setInvoices(JSON.parse(storedInvoices));
    else {
      setInvoices([]);
      localStorage.setItem('hcpl_invoices', JSON.stringify([]));
    }

    if (storedChallans) setChallans(JSON.parse(storedChallans));
    else {
      setChallans([]);
      localStorage.setItem('hcpl_challans', JSON.stringify([]));
    }

    if (storedLogs) setAuditLogs(JSON.parse(storedLogs));
    else {
      setAuditLogs(initialAuditLogs);
      localStorage.setItem('hcpl_auditlogs', JSON.stringify(initialAuditLogs));
    }
  }, []);

  // Sync helpers
  const saveProducts = (prods: Product[]) => {
    setProducts(prods);
    localStorage.setItem('hcpl_products', JSON.stringify(prods));
  };

  const saveDrivers = (drvs: Driver[]) => {
    setDrivers(drvs);
    localStorage.setItem('hcpl_drivers', JSON.stringify(drvs));
  };

  const saveOrders = (ords: Order[]) => {
    setOrders(ords);
    localStorage.setItem('hcpl_orders', JSON.stringify(ords));
  };

  const saveInvoices = (invs: Invoice[]) => {
    setInvoices(invs);
    localStorage.setItem('hcpl_invoices', JSON.stringify(invs));
  };

  const saveChallans = (chls: DeliveryChallan[]) => {
    setChallans(chls);
    localStorage.setItem('hcpl_challans', JSON.stringify(chls));
  };

  const saveLogs = (logs: AuditLog[]) => {
    setAuditLogs(logs);
    localStorage.setItem('hcpl_auditlogs', JSON.stringify(logs));
  };

  // Helper inside logging auditor events
  const handleLogAudit = (action: string, desc: string) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now() + Math.random().toString(36).substring(3, 7),
      action_type: action,
      admin_id: currentUser ? currentUser.id : 'anonymous_client',
      admin_name: currentUser ? currentUser.full_name : 'Public Client Portal',
      admin_role: currentUser ? currentUser.role : 'Staff Member',
      timestamp: new Date().toISOString(),
      description: desc,
      ip_address: '192.168.1.' + Math.floor(2 + Math.random() * 250)
    };
    saveLogs([newLog, ...auditLogs]);
  };

  // Login handler
  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername || !loginPassword) return;

    if (loginUsername.trim().toLowerCase() !== 'harpreet' || loginPassword !== 'password') {
      setLoginError('Access Denied: Invalid Administrative Operator Username or Password.');
      handleLogAudit('LOGIN_FAILED', `Failed login attempt with username: "${loginUsername}"`);
      return;
    }

    setLoginError('');
    const loggedInAdmin: AdminUser = {
      id: 'adm-' + Date.now(),
      full_name: loginUsername.charAt(0).toUpperCase() + loginUsername.slice(1) + ' Singh',
      email: `${loginUsername}@hcplgas.com`,
      username: loginUsername,
      role: loginRole,
      is_active: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: new Date().toISOString(),
      last_login: new Date().toISOString()
    };

    setCurrentUser(loggedInAdmin);
    handleLogAudit('LOGIN', `Admin user ${loggedInAdmin.full_name} (${loggedInAdmin.role}) logged in from console portal.`);
  };

  const handleAdminSignOut = () => {
    if (currentUser) {
      handleLogAudit('LOGOUT', `Admin ${currentUser.full_name} logged out.`);
    }
    setCurrentUser(null);
  };

  // Customer Orders Place handler
  const handleCustomerOrderPlaced = (orderData: any) => {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const ordNum = `ORD-${today}-${Math.floor(100 + Math.random() * 900)}`;
    const uuidStr = 'ord-' + Math.random().toString(36).substring(2, 11) + '-' + Math.floor(1000 + Math.random() * 9000);

    const newOrder: Order = {
      ...orderData,
      id: 'o-' + Date.now(),
      uuid: uuidStr,
      order_number: ordNum,
      order_status: 'Pending',
      delivery_status: 'None',
      payment_status: 'Pending',
      delivery_otp: Math.floor(1000 + Math.random() * 9000).toString(),
      otp_verified: false,
      otp_attempts: 0,
      otp_created_at: new Date().toISOString(),
      driver_id: null,
      invoice_generated: false,
      challan_generated: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const newOrdersList = [newOrder, ...orders];
    saveOrders(newOrdersList);
    handleLogAudit('ORDER_CREATED', `New gas order ${newOrder.order_number} submitted online by company '${newOrder.company_name}' for ${newOrder.quantity} cyl of ${newOrder.product_type}.`);

    // Redirect to tracking page with initial load target
    setInitialTrackingOrderId(newOrder.id);
    setSelectedProductToOrder(null);
    setActiveTab('track');
  };

  // Verification helper for delivery OTP
  const handleVerifyDeliveryOTP = (orderId: string, otp: string): boolean => {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return false;
    
    const targetOrder = orders[orderIndex];
    if (targetOrder.delivery_otp === otp) {
      const updatedOrders = [...orders];
      updatedOrders[orderIndex] = {
        ...targetOrder,
        order_status: 'Delivered',
        delivery_status: 'Delivered',
        otp_verified: true,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      saveOrders(updatedOrders);
      handleLogAudit('DELIVERY_CONFIRMED', `Cylinder delivery verified with customer OTP code ${otp} for Order ${targetOrder.order_number}. Cylinders released.`);
      
      // Update assigned driver back to Available
      if (targetOrder.driver_id) {
        const updatedDrivers = drivers.map(d => {
          if (d.id === targetOrder.driver_id) {
            return { ...d, availability_status: 'Available' as const };
          }
          return d;
        });
        saveDrivers(updatedDrivers);
      }

      return true;
    } else {
      const updatedOrders = [...orders];
      updatedOrders[orderIndex] = {
        ...targetOrder,
        otp_attempts: targetOrder.otp_attempts + 1,
        updated_at: new Date().toISOString()
      };
      saveOrders(updatedOrders);
      return false;
    }
  };

  // Change order statuses in admin panel
  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        const statusMapList: { [key: string]: Order['delivery_status'] } = {
          'Assigned to Driver': 'Assigned',
          'Out for Delivery': 'In Transit',
          'Delivered': 'Delivered',
          'Failed Delivery': 'Delivery Failed',
          'Cancelled': 'None'
        };
        const ds = statusMapList[nextStatus] || o.delivery_status;

        return { 
          ...o, 
          order_status: nextStatus,
          delivery_status: ds,
          updated_at: new Date().toISOString() 
        };
      }
      return o;
    });

    saveOrders(updated);
    const matched = orders.find(o => o.id === orderId);
    if (matched) {
      handleLogAudit('ORDER_STATUS_UPDATE', `Order ${matched.order_number} status manually updated to: ${nextStatus}.`);
    }
  };

  // Assign drivers to order
  const handleAssignDriver = (orderId: string, driverId: string) => {
    const selectedDriver = drivers.find(d => d.id === driverId);
    if (!selectedDriver) return;

    // 1. Update order assignments
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          driver_id: driverId,
          order_status: 'Assigned to Driver' as const,
          delivery_status: 'Assigned' as const,
          updated_at: new Date().toISOString()
        };
      }
      return o;
    });
    saveOrders(updatedOrders);

    // 2. Set driver shift status "On Delivery"
    const updatedDrivers = drivers.map(d => {
      if (d.id === driverId) {
        return { ...d, availability_status: 'On Delivery' as const };
      }
      return d;
    });
    saveDrivers(updatedDrivers);

    const matchedOrd = orders.find(o => o.id === orderId);
    if (matchedOrd) {
      handleLogAudit('DRIVER_ASSIGNED', `Assigned logistical driver '${selectedDriver.driver_name}' to Order ${matchedOrd.order_number}. Transferred vehicle plates: ${selectedDriver.vehicle_number}.`);
    }
  };

  // Generate commercial bill
  const handleGenerateInvoice = (orderId: string) => {
    const matchedOrder = orders.find(o => o.id === orderId);
    if (!matchedOrder) return;

    const code = `HCPL-GST-2627-${Math.floor(100 + Math.random() * 900)}`;
    const matchedProduct = products.find(p => p.gas_type === matchedOrder.product_type) || products[0];
    const basePrice = matchedProduct.unit_price * matchedOrder.quantity;
    const gstRate = matchedProduct.GST_percentage;
    const calcTax = (basePrice * gstRate) / 100;
    const gTotal = basePrice + calcTax;

    const newInvoice: Invoice = {
      id: 'inv-' + Date.now(),
      invoice_number: code,
      order_id: orderId,
      customer_name: matchedOrder.customer_name,
      company_name: matchedOrder.company_name,
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0], // credit term Net-30
      taxable_value: basePrice,
      cgst_amount: matchedOrder.state.toLowerCase() === 'delhi' ? calcTax / 2 : 0,
      sgst_amount: matchedOrder.state.toLowerCase() === 'delhi' ? calcTax / 2 : 0,
      igst_amount: matchedOrder.state.toLowerCase() !== 'delhi' ? calcTax : 0,
      total_tax: calcTax,
      grand_total: gTotal,
      payment_status: matchedOrder.payment_status,
      payment_method: matchedOrder.payment_method
    };

    saveInvoices([...invoices, newInvoice]);

    // Update order status toggle
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, invoice_generated: true };
      }
      return o;
    });
    saveOrders(updatedOrders);

    handleLogAudit('INVOICE_GENERATION', `Generated tax invoice ${code} for customer ${matchedOrder.company_name}. Base taxable ₹${basePrice}, GST ₹${calcTax}.`);
  };

  // Generate delivery challan pass
  const handleGenerateChallan = (orderId: string) => {
    const matchedOrder = orders.find(o => o.id === orderId);
    if (!matchedOrder || !matchedOrder.driver_id) return;

    const matchedDriver = drivers.find(d => d.id === matchedOrder.driver_id);
    if (!matchedDriver) return;

    const code = `HCPL-DC-2026-${Math.floor(100 + Math.random() * 900)}`;
    
    const newChallan: DeliveryChallan = {
      id: 'chl-' + Date.now(),
      challan_number: code,
      order_id: orderId,
      customer_name: matchedOrder.customer_name,
      company_name: matchedOrder.company_name,
      address: matchedOrder.address,
      dispatch_date: new Date().toISOString().split('T')[0],
      driver_name: matchedDriver.driver_name,
      vehicle_number: matchedDriver.vehicle_number,
      cylinder_quantities: matchedOrder.quantity,
      product_details: `${matchedOrder.product_type}ylinder container (${matchedOrder.cylinder_size})`,
      otp: matchedOrder.delivery_otp
    };

    saveChallans([...challans, newChallan]);

    // Update order status toggle
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, challan_generated: true };
      }
      return o;
    });
    saveOrders(updatedOrders);

    handleLogAudit('CHALLAN_GENERATED', `Generated warehouse gate outpass Delivery Challan ${code} for Order ${matchedOrder.order_number}. Assigned truck: ${matchedDriver.vehicle_number}.`);
  };

  // Bookkeeping adjusters
  const handleUpdateInvoicePayment = (invoiceId: string, status: PaymentStatus, method?: PaymentMethod) => {
    const updatedInvoices = invoices.map(inv => {
      if (inv.id === invoiceId) {
        return { 
          ...inv, 
          payment_status: status,
          payment_method: method ? method : inv.payment_method
        };
      }
      return inv;
    });
    saveInvoices(updatedInvoices);

    // Sync back order payment state
    const targetInvoice = invoices.find(inv => inv.id === invoiceId);
    if (targetInvoice) {
      const updatedOrders = orders.map(o => {
        if (o.id === targetInvoice.order_id) {
          return { 
            ...o, 
            payment_status: status, 
            payment_method: method ? method : o.payment_method 
          };
        }
        return o;
      });
      saveOrders(updatedOrders);
    }
  };

  // Nav trigger buy directly from catalog list
  const handleSelectProductToProcure = (prod: Product) => {
    setSelectedProductToOrder(prod);
    setActiveTab('order');
  };

  const handleClearAllOrders = () => {
    saveOrders([]);
    saveInvoices([]);
    saveChallans([]);
    handleLogAudit('DATABASE_RESET', 'All registered customer orders, generated invoices, and logistic dispatch outpasses were cleared to start fresh.');
  };

  const handleSaveSignature = (orderId: string, signatureData: string) => {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;
    
    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = {
      ...updatedOrders[orderIndex],
      customer_signature: signatureData,
      updated_at: new Date().toISOString()
    };
    saveOrders(updatedOrders);
    if (signatureData) {
      handleLogAudit('SIGNATURE_SAVED', `Customer digital signature registered successfully for Order ${updatedOrders[orderIndex].order_number}.`);
    } else {
      handleLogAudit('SIGNATURE_REMOVED', `Logged customer signature reset for Order ${updatedOrders[orderIndex].order_number}.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white no-print">
      
      {/* Dynamic Header Toolbar */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Slogan */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setActiveTab('home'); setSelectedProductToOrder(null); }}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl tracking-tighter shadow-lg shadow-blue-900/30">
              H
            </div>
            <div>
              <span className="font-black tracking-wide text-md text-white block">HCPL INDUSTRIAL ERP</span>
              <span className="text-[10px] text-blue-400 font-bold block uppercase tracking-widest leading-none">Harpreet Cylinders Pvt. Ltd.</span>
            </div>
          </div>

          {/* Navigation Items Tabs */}
          <nav className="flex items-center space-x-1 text-xs uppercase font-bold tracking-wider">
            <button
              onClick={() => { setActiveTab('home'); setSelectedProductToOrder(null); }}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${activeTab === 'home' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-300 hover:text-white'}`}
            >
              Company Website
            </button>
            <button
              onClick={() => { setActiveTab('order'); setSelectedProductToOrder(null); }}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${activeTab === 'order' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-300 hover:text-white'}`}
            >
              Procures Cylinder Online
            </button>
            <button
              onClick={() => { setActiveTab('track'); setSelectedProductToOrder(null); }}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${activeTab === 'track' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-300 hover:text-white'}`}
            >
              Logistics Timelines & OTP
            </button>
            <button
              onClick={() => { setActiveTab('admin'); }}
              className={`px-3.5 py-1.5 rounded transition-all flex items-center space-x-1.5 cursor-pointer ${activeTab === 'admin' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 border border-slate-750 hover:bg-slate-750 hover:text-white'}`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          </nav>

        </div>
      </header>

      {/* Main Core Router View Panels */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <LandingPage 
            products={products} 
            onNavigate={setActiveTab}
            onSelectProductToOrder={handleSelectProductToProcure}
          />
        )}

        {activeTab === 'order' && (
          <CustomerOrderForm
            products={products}
            selectedProduct={selectedProductToOrder}
            onOrderSubmit={handleCustomerOrderPlaced}
            onNavigateHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'track' && (
          <TrackingPortal
            orders={orders}
            invoices={invoices}
            challans={challans}
            products={products}
            drivers={drivers}
            initialOrderId={initialTrackingOrderId}
            onClearInitialOrderId={() => setInitialTrackingOrderId(null)}
            onVerifyDeliveryOTP={handleVerifyDeliveryOTP}
            onSaveSignature={handleSaveSignature}
            onClose={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'admin' && (
          <div>
            {!currentUser ? (
              /* Professional Flask authenticator simulation */
              <div className="max-w-sm mx-auto my-20 p-8 bg-white border border-slate-200 rounded-xl shadow-md font-sans space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 border border-blue-105 rounded-xl flex items-center justify-center mx-auto text-center">
                    <LogIn className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">ERP Operator Portal Sign in</h2>
                  <p className="text-xs text-slate-400 font-light">Secure login for certified HCPL administrative offices.</p>
                </div>

                {loginError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-xs flex items-start space-x-2 font-medium leading-normal animate-pulse">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleAdminSignIn} className="space-y-4 text-xs font-sans">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase">Certified Admin Username</label>
                    <input
                      type="text"
                      required
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-205 focus:border-blue-500 rounded px-3 py-2 focus:outline-none select-text font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase">Password Key</label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-205 focus:border-blue-500 rounded px-3 py-2 focus:outline-none select-text"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600 uppercase">Operational Role Allocation</label>
                    <select
                      value={loginRole}
                      onChange={(e) => setLoginRole(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-205 py-2 px-2.5 rounded focus:outline-none font-bold text-slate-800"
                    >
                      <option value="Super Admin">Super Admin (Harpreet Singh)</option>
                      <option value="Operations Manager">Operations Manager (Devinder Kumar)</option>
                      <option value="Delivery Manager">Delivery Manager (Sardar Kulwant S.)</option>
                      <option value="Billing Manager">Billing Manager (Finance Desk)</option>
                      <option value="Staff Member">Cylinder Staff Operator</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-2.5 rounded hover:bg-blue-700 uppercase tracking-widest text-xs transition-colors cursor-pointer shadow-sm shadow-blue-900/10"
                  >
                    Authorize Session Gate Lock
                  </button>

                  <div className="pt-2 border-t border-slate-100 flex flex-col items-center">
                    {!showCredsHint ? (
                      <button
                        type="button"
                        onClick={() => setShowCredsHint(true)}
                        className="text-[10px] text-slate-400 hover:text-slate-600 underline uppercase tracking-wider font-semibold cursor-pointer"
                      >
                        Show Authorized Operator Credentials Code
                      </button>
                    ) : (
                      <div className="w-full bg-amber-100/80 border border-amber-200 p-3 rounded text-[11px] text-amber-900 leading-normal flex items-start space-x-2 font-mono">
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-800 mt-0.5" />
                        <div className="flex-grow">
                          <p className="font-bold uppercase tracking-wider text-[9.5px]">Authorized Security Access Credentials:</p>
                          <p className="mt-0.5 font-light">Username: <span className="font-bold underline">harpreet</span> | Password: <span className="font-bold underline">password</span></p>
                          <button
                            type="button"
                            onClick={() => setShowCredsHint(false)}
                            className="mt-1.5 block text-[9px] text-slate-400 hover:text-slate-600 underline font-semibold uppercase cursor-pointer"
                          >
                            Hide Key Credentials
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            ) : (
              /* Administrative Dashboard Console Shell */
              <div className="bg-slate-50 min-h-screen">
                
                {/* Admin Status bar */}
                <div className="bg-slate-900 text-slate-300 px-6 py-2 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs font-mono gap-2 rounded-t-none rounded-b-xl max-w-7xl mx-auto shadow-sm">
                  <div className="flex items-center space-x-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-bold text-white">Session Clear:</span>
                    <span>{currentUser.full_name} | Role: <span className="text-blue-400 font-bold">{currentUser.role}</span></span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>Depot Clock: <span className="text-white font-bold">2026-05-25 08:15 UTC</span></span>
                    <button
                      onClick={handleAdminSignOut}
                      className="flex items-center space-x-1 px-2.5 py-0.5 bg-rose-950 hover:bg-rose-900 border border-rose-900 text-rose-300 rounded font-bold uppercase text-[10px] tracking-wide transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Lock Portal</span>
                    </button>
                  </div>
                </div>

                {/* Main Tab Controller navigation */}
                <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                  
                  {/* Tabs menu bar */}
                  <div className="flex items-center space-x-1 border-b border-slate-200 overflow-x-auto text-xs font-bold uppercase tracking-wider no-print pb-0.5">
                    <button
                      onClick={() => setAdminSubTab('overview')}
                      className={`px-4 py-2 border-b-2 text-slate-800 transition-all cursor-pointer ${adminSubTab === 'overview' ? 'border-blue-600 text-blue-600 bg-blue-50/15 font-extrabold' : 'border-transparent hover:text-black'}`}
                    >
                      Cylinder Orders Control Desk
                    </button>
                    <button
                      onClick={() => setAdminSubTab('inventory')}
                      className={`px-4 py-2 border-b-2 text-slate-800 transition-all cursor-pointer ${adminSubTab === 'inventory' ? 'border-blue-600 text-blue-600 bg-blue-50/15 font-extrabold' : 'border-transparent hover:text-black'}`}
                    >
                      Inventory Stockpile refilling
                    </button>
                    <button
                      onClick={() => setAdminSubTab('drivers')}
                      className={`px-4 py-2 border-b-2 text-slate-800 transition-all cursor-pointer ${adminSubTab === 'drivers' ? 'border-blue-600 text-blue-600 bg-blue-50/15 font-extrabold' : 'border-transparent hover:text-black'}`}
                    >
                      Logisticians Logistics & Drivers fleet
                    </button>
                    <button
                      onClick={() => setAdminSubTab('payments')}
                      className={`px-4 py-2 border-b-2 text-slate-800 transition-all cursor-pointer ${adminSubTab === 'payments' ? 'border-blue-600 text-blue-600 bg-blue-50/15 font-extrabold' : 'border-transparent hover:text-black'}`}
                    >
                      Payments & billing accounting ledger
                    </button>
                    <button
                      onClick={() => setAdminSubTab('reports')}
                      className={`px-4 py-2 border-b-2 text-slate-800 transition-all cursor-pointer ${adminSubTab === 'reports' ? 'border-blue-600 text-blue-600 bg-blue-50/15 font-extrabold' : 'border-transparent hover:text-black'}`}
                    >
                      BI reports Charts & spreadsheets Export
                    </button>
                  </div>

                  {/* Render Nested Tab Sections */}
                  {adminSubTab === 'overview' && (
                    <AdminPanel
                      orders={orders}
                      drivers={drivers}
                      products={products}
                      invoices={invoices}
                      challans={challans}
                      auditLogs={auditLogs}
                      onUpdateOrderStatus={handleUpdateOrderStatus}
                      onAssignDriver={handleAssignDriver}
                      onGenerateInvoice={handleGenerateInvoice}
                      onGenerateChallan={handleGenerateChallan}
                      onLogAudit={handleLogAudit}
                      onClearAllOrders={handleClearAllOrders}
                    />
                  )}

                  {adminSubTab === 'inventory' && (
                    <InventoryManager
                      products={products}
                      onUpdateProducts={saveProducts}
                      onLogAudit={handleLogAudit}
                    />
                  )}

                  {adminSubTab === 'drivers' && (
                    <DriverManager
                      drivers={drivers}
                      onUpdateDrivers={saveDrivers}
                      onLogAudit={handleLogAudit}
                    />
                  )}

                  {adminSubTab === 'payments' && (
                    <PaymentTracker
                      invoices={invoices}
                      onUpdateInvoiceStatus={handleUpdateInvoicePayment}
                      onLogAudit={handleLogAudit}
                    />
                  )}

                  {adminSubTab === 'reports' && (
                    <ReportsView
                      orders={orders}
                      products={products}
                      invoices={invoices}
                    />
                  )}

                </div>

              </div>
            )}
          </div>
        )}
      </main>

      {/* Corporate footer details block */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 py-10 font-sans text-xs mt-16 no-print">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-3">
            <span className="font-extrabold text-white text-base">HCPL CORP SUPPLY DESK</span>
            <p className="text-slate-400 font-light leading-relaxed">
              Serving the capital's medical and high pressure fabrication gas corridors under licensed safety constraints since early operations. certified clean cylinder purgers.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-extrabold text-white text-[11px] block uppercase tracking-wider">PESO COMPLIANCES ASSURANCES</span>
            <p className="text-slate-400 font-light">
              Compliance licensing checked and logged weekly: <br />
              • PESO Cylindrical Valve Guards inspection <br />
              • Hydraulic testing checks validity indices <br />
              • FDA licensed Medical IP Certified Nitrogen purgers
            </p>
          </div>

          <div className="space-y-3 font-mono">
            <span className="font-extrabold text-white text-[11px] block uppercase tracking-wider font-sans">HCPL LOGISTICS YARDS</span>
            <p className="text-slate-400 leading-relaxed font-light font-sans">
              Plot 12, Industrial Area Mayapuri Phase II, New Delhi - 110064 <br />
              Email: tech-support@hcplgas.com | Ph: +91 11 4987 2300
            </p>
            <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mt-2 block">
              © 2026 HARPREET CYLINDERS PVT. LTD. ALL RIGHTS RESERVED
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
