import { GalleryCategory, GalleryItem } from '../models';

const PHOTOS = 'assets/images/gallery/photos';

/**
 * Real Mahadev Eventz event photos. Each item has one primary category;
 * the visible filter chips are derived from the categories actually present.
 */
export const GALLERY: GalleryItem[] = [
  { id: 1, title: 'Golden 60th Celebration', category: 'Birthday', image: `${PHOTOS}/photo-01.jpeg`, span: 1 },
  { id: 2, title: 'Lion King First Birthday', category: 'Birthday', image: `${PHOTOS}/photo-02.jpeg`, span: 1 },
  { id: 3, title: 'Gold Sequin Glam Backdrop', category: 'Balloon Decoration', image: `${PHOTOS}/photo-03.jpeg`, span: 1 },
  { id: 4, title: 'Burgundy & Gold Ring Arch', category: 'Balloon Decoration', image: `${PHOTOS}/photo-04.jpeg`, span: 1 },
  { id: 5, title: 'Blush & Gold Birthday', category: 'Birthday', image: `${PHOTOS}/photo-05.jpeg`, span: 2 },
  { id: 6, title: 'Purple Butterfly First Birthday', category: 'Birthday', image: `${PHOTOS}/photo-07.jpeg`, span: 1 },
  { id: 7, title: 'Pastel Rainbow Birthday', category: 'Birthday', image: `${PHOTOS}/photo-08.jpeg`, span: 1 },
  { id: 8, title: 'Jungle Safari First Birthday', category: 'Birthday', image: `${PHOTOS}/photo-09.jpeg`, span: 2 },
  { id: 9, title: 'Under-the-Sea Mermaid Party', category: 'Birthday', image: `${PHOTOS}/photo-10.jpeg`, span: 1 },
  { id: 10, title: 'Mermaid Wonderland Stage', category: 'Birthday', image: `${PHOTOS}/photo-11.jpeg`, span: 1 },
  { id: 11, title: 'Safari Cub First Birthday', category: 'Birthday', image: `${PHOTOS}/photo-12.jpeg`, span: 1 },
  { id: 12, title: 'Rose Gold Shimmer Wall', category: 'Balloon Decoration', image: `${PHOTOS}/photo-13.jpeg`, span: 2 },
  { id: 13, title: 'Winter Penguin Celebration', category: 'Birthday', image: `${PHOTOS}/photo-14.jpeg`, span: 1 },
  { id: 14, title: 'Baby Blue Welcome Arch', category: 'Balloon Decoration', image: `${PHOTOS}/photo-15.jpeg`, span: 2 },
  { id: 15, title: 'Rose Gold 25th Birthday', category: 'Birthday', image: `${PHOTOS}/photo-16.jpeg`, span: 1 },
  { id: 16, title: 'Ivory & Gold Balloon Ring', category: 'Birthday', image: `${PHOTOS}/photo-17.jpeg`, span: 2 },
  { id: 17, title: 'Fairy-Light Butterfly Party', category: 'Birthday', image: `${PHOTOS}/photo-18.jpeg`, span: 1 },
  { id: 18, title: 'Twins First Birthday', category: 'Birthday', image: `${PHOTOS}/photo-19.jpeg`, span: 1 },
  { id: 19, title: 'Little Princess First Birthday', category: 'Birthday', image: `${PHOTOS}/photo-20.jpeg`, span: 1 },
  { id: 20, title: 'Hot Air Balloon First Birthday', category: 'Birthday', image: `${PHOTOS}/photo-21.jpeg`, span: 1 },
];

/** Preferred display order for filter chips. */
const CATEGORY_ORDER: GalleryCategory[] = [
  'Birthday',
  'Anniversary',
  'Proposal',
  'Balloon Decoration',
  'Flower Decoration',
  'Festivals',
  'Corporate Events',
];

/** Only show filter chips for categories that actually have photos. */
export const GALLERY_CATEGORIES: ('All' | GalleryCategory)[] = [
  'All',
  ...CATEGORY_ORDER.filter((cat) => GALLERY.some((item) => item.category === cat)),
];
