export interface DataSource {
  id: string;
  name: string;
  role: string;
  cost: string;
  gives: string[];
  steps: string[];
  code?: { lang: string; text: string };
  catches: string[];
  docs: { label: string; url: string };
  feeds: string;
}

export const dataSources: DataSource[] = [
  {
    id: 'example', name: 'Example source', role: 'Base dataset', cost: 'Free',
    gives: ['What the source returns'],
    steps: ['Create an account if needed.', 'Run the example call.', 'Keep only the fields you need.'],
    code: { lang: 'bash', text: 'curl "https://example.com/api?key=$KEY"' },
    catches: ['Rate limits and licence terms.'],
    docs: { label: 'Example docs', url: 'https://example.com/docs' },
    feeds: 'field_a, field_b',
  },
];

export const venueColumns: { column: string; source: string; note: string }[] = [
  { column: 'field_a, field_b', source: 'Example source', note: 'Check the licence before storing' },
];
