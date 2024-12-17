interface User {
  id: string;
  name: string;
  role_id: number;
}

interface LoginType {
  name: string;
  password: string;
}

interface Token {
  value: string;
  exp: number;
}

interface VendorType {
  id: string;
  name: string;
}
