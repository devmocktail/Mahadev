export type GalleryCategory =
  | 'Birthday'
  | 'Anniversary'
  | 'Proposal'
  | 'Balloon Decoration'
  | 'Flower Decoration'
  | 'Festivals'
  | 'Corporate Events';

export interface GalleryItem {
  id: number;
  title: string;
  category: GalleryCategory;
  image: string;
  /** Optional masonry span hint (1 = normal, 2 = tall) */
  span?: 1 | 2;
}
