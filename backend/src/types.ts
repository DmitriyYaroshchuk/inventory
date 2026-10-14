export interface Price {
  value: number;
  symbol: string;
  isDefault: boolean;
}

export interface ProductDto {
  id: number;
  serialNumber: number;
  isNew: boolean;
  photo: string | null;
  title: string;
  type: string;
  specification: string | null;
  guarantee: { start: string; end: string };
  price: Price[];
  order: { id: number; title: string };
  date: string;
}

export interface OrderSummary {
  id: number;
  title: string;
  description: string | null;
  date: string;
  productsCount: number;
  /** Сумма цен всех продуктов прихода — по каждой валюте */
  total: Price[];
}

export interface OrderDetails extends OrderSummary {
  products: ProductDto[];
}
