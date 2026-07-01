export interface Stat {
  /** Numeric target the counter animates to */
  value: number;
  /** Suffix appended after the number, e.g. '+', '%' */
  suffix: string;
  label: string;
}
