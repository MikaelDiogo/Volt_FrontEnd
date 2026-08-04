export interface CatalogItem {
  id: string;
  productId: string;
  displayName: string;
  displayPrice: number;
  photoUrl: string | null;
  published: boolean;
}
