export type ProductFeature = Record<string, string>;

export interface ShortDescription {
  name?: string | null;
  name_fa?: string | null;
  features?: ProductFeature[] | null;
  description?: string | null;
  features_fa?: ProductFeature[] | null;
  description_fa?: string | null;
}

export interface ProductItem {
  id: string;
  category_id?: string | null;
  sku?: string | null;
  name?: string | null;
  slug: string; 
  short_description?: ShortDescription | null;
  price?: number | null;
  discount_price?: number | null;
  stock_quantity?: number | null;
  sort_order?: number | null;
  is_active?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ProductApiResponse {
  code?: number;
  success: boolean;
  message?: string | null;
  data?: ProductItem[] | null;
}
