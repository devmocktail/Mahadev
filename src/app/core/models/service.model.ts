export interface ServiceItem {
  /** URL-friendly identifier */
  slug: string;
  title: string;
  description: string;
  /** Emoji or short glyph shown on the card */
  icon: string;
  /** FontAwesome class for the luxury icon badge */
  faIcon: string;
  image: string;
  /** Highlight chips shown on the detail view */
  highlights: string[];
}
