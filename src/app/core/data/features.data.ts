import { Feature, Stat, Faq } from '../models';

export const FEATURES: Feature[] = [
  { title: '5+ Years Experience', description: 'Half a decade of crafting flawless, memorable celebrations.', icon: 'fa-solid fa-award' },
  { title: 'Premium Decorations', description: 'Only the finest materials, blooms and luxe finishes.', icon: 'fa-solid fa-gem' },
  { title: 'Affordable Pricing', description: 'Luxury that respects your budget — transparent and fair.', icon: 'fa-solid fa-tags' },
  { title: 'Professional Team', description: 'A passionate crew obsessed with perfect execution.', icon: 'fa-solid fa-people-group' },
  { title: 'Creative Ideas', description: 'Fresh, original concepts tailored to your story.', icon: 'fa-solid fa-lightbulb' },
  { title: '100% Satisfaction', description: 'We are not done until your smile says it all.', icon: 'fa-solid fa-face-smile' },
  { title: 'On-Time Delivery', description: 'Punctual setups, every single time. No surprises.', icon: 'fa-solid fa-clock' },
  { title: 'Quality You Can Trust', description: 'Consistent, dependable, premium quality always.', icon: 'fa-solid fa-shield-halved' },
];

export const STATS: Stat[] = [
  { value: 5, suffix: '+', label: 'Years Experience' },
  { value: 500, suffix: '+', label: 'Happy Clients' },
  { value: 1000, suffix: '+', label: 'Events Completed' },
  { value: 100, suffix: '%', label: 'Customer Satisfaction' },
];

export const FAQS: Faq[] = [
  {
    question: 'How far in advance should I book?',
    answer:
      'We recommend booking at least 2–3 weeks in advance for the best availability, though we happily accommodate last-minute surprises whenever possible.',
  },
  {
    question: 'Do you travel outside the city?',
    answer:
      'Yes! We serve events across the region. Travel and logistics for outstation events are discussed during booking.',
  },
  {
    question: 'Can you work within my budget?',
    answer:
      'Absolutely. We craft tailored packages for every budget without compromising on the premium Mahadev Eventz finish.',
  },
  {
    question: 'Do you provide custom themes?',
    answer:
      'Custom themes are our specialty. Share your vision or inspiration and our creative team will design something uniquely yours.',
  },
  {
    question: 'How do I confirm my booking?',
    answer:
      'Simply fill out the booking form or call us at 9030630508. A confirmation and quote follow shortly after we discuss your event.',
  },
];
