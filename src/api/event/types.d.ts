interface EventType {
  id: string;
  event_name: string;
  proposed_dates: string[];
  vendor_name: string;
  location: string;
  status: string;
  remark: string;
  user_id: string;
  user_name: string;
  confirmed_date: string | null;
  created_at: string;
  updated_at: string;
}

interface UpdateEventHrType {
  event_name: string | undefined;
  proposed_dates: string[] | undefined;
  vendor_name: string | undefined;
  location: string | undefined;
}

interface RejectEventVendorType {
  remark: string | undefined;
}

interface AcceptEventVendorType {
  confirmed_date: string | null | undefined;
}
