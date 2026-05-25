export type AdminRole = 
  | 'Super Admin' 
  | 'Operations Manager' 
  | 'Delivery Manager' 
  | 'Billing Manager' 
  | 'Staff Member';

export interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  username: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login: string;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Approved' 
  | 'Packed' 
  | 'Ready for Dispatch' 
  | 'Assigned to Driver' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Failed Delivery';

export type DeliveryStatus = 
  | 'Assigned' 
  | 'Picked Up' 
  | 'In Transit' 
  | 'Near Destination' 
  | 'Delivered' 
  | 'Delivery Failed'
  | 'None';

export type PaymentStatus = 
  | 'Pending' 
  | 'Paid' 
  | 'Partial' 
  | 'Failed';

export type PaymentMethod = 
  | 'Cash' 
  | 'UPI' 
  | 'Bank Transfer' 
  | 'Credit' 
  | 'Online Payment';

export interface Product {
  id: string;
  product_name: string;
  gas_type: string;
  purity_level: string;
  cylinder_type: string;
  cylinder_size: string; // capacity (e.g. 10L, 47L, 50L)
  stock_quantity: number;
  refill_quantity: number;
  unit_price: number;
  GST_percentage: number;
  availability_status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  hsn_code: string;
}

export interface Order {
  id: string;
  uuid: string;
  order_number: string;
  customer_name: string;
  company_name: string;
  phone_number: string;
  alternate_phone?: string;
  email: string;
  gst_number: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  product_type: string;
  purity_level: string;
  cylinder_type: string;
  cylinder_size: string;
  quantity: number;
  delivery_date: string;
  delivery_slot: string;
  is_urgent: boolean;
  payment_method: PaymentMethod;
  remarks?: string;
  google_maps_link?: string;
  latitude?: number;
  longitude?: number;
  order_status: OrderStatus;
  delivery_status: DeliveryStatus;
  payment_status: PaymentStatus;
  delivery_otp: string;
  otp_verified: boolean;
  otp_attempts: number;
  otp_created_at: string;
  verified_at?: string;
  driver_id: string | null;
  invoice_generated: boolean;
  challan_generated?: boolean;
  customer_signature?: string;
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: string;
  driver_name: string;
  phone_number: string;
  email: string;
  vehicle_number: string;
  vehicle_type: string;
  license_number: string;
  assigned_area: string;
  availability_status: 'Available' | 'On Delivery' | 'Offline';
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  order_id: string;
  customer_name: string;
  company_name: string;
  invoice_date: string;
  due_date: string;
  taxable_value: number; // sum before GST
  cgst_amount: number;   // tax rate / 2
  sgst_amount: number;   // tax rate / 2
  igst_amount: number;   // if different state (e.g. state != Delhi)
  total_tax: number;
  grand_total: number;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
}

export interface DeliveryChallan {
  id: string;
  challan_number: string;
  order_id: string;
  customer_name: string;
  company_name: string;
  address: string;
  dispatch_date: string;
  driver_name: string;
  vehicle_number: string;
  cylinder_quantities: number;
  product_details: string;
  otp: string;
}

export interface AuditLog {
  id: string;
  action_type: string; // e.g. 'LOGIN', 'ORDER_CREATED', 'STATUS_CHANGE', 'STOCK_UPDATE', 'DRIVER_ASSIGNED', 'INVOICE_GENERATION'
  admin_id: string;
  admin_name: string;
  admin_role: AdminRole;
  timestamp: string;
  description: string;
  ip_address: string;
}
