export type Price = {
  value: number;
  symbol: string;
  isDefault: boolean;
};

export type Guarantee = {
  start: string;
  end: string;
};

export type Order = {
  id: number;
  title: string;
};

export type Product = {
  id: number;
  serialNumber: number;
  isNew: boolean;
  photo: string | null;
  title: string;
  type: string;
  specification: string | null;
  guarantee: Guarantee;
  price: Price[];
  order: Order;
  date: string;
};

export type OrderSummary = {
  id: number;
  title: string;
  description: string | null;
  date: string;
  productsCount: number;
  total: Price[];
};

export type OrderDetails = OrderSummary & {
  products: Product[];
};

export type NavigationItem = { href?: string; label: string };

export type User = {
  id: number;
  name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};
