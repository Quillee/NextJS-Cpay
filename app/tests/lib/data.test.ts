import { parseQuery, QueryObject } from '../../lib/utils';
import { Pay } from '../../lib/definitions';
import { filterPaysByFilter } from '@/app/lib/data';

const pays: Pay[] = [
  {
    id: 'pay-001',
    contact_id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    created_at: '2024-03-15',
    status: 'paid',
    amount: 8500,
    direction: 'send',
    memo: 'dinner',
  },
  {
    id: 'pay-002',
    contact_id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    created_at: '2024-08-20',
    status: 'pending',
    amount: 3200,
    direction: 'request',
    memo: 'groceries',
  },
  {
    id: 'pay-003',
    contact_id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    created_at: '2024-05-10',
    status: 'paid',
    amount: 15000,
    direction: 'send',
    memo: 'dinner',
  },
]

describe('parseQuery<Pay>', () => {
  it('parses a composite Pay query and produces a filterable QueryObject', async () => {
    const query = 'status=paid&amount=>500';
    const result = parseQuery<Pay>(query);

    const f = await filterPaysByFilter(result, pays);
    expect(f.length).toEqual(2);


    const query2 = 'memo=dinner';
    const result2 = parseQuery<Pay>(query2);
    const f2 = await filterPaysByFilter(result2, pays);
    expect(f2.length).toEqual(2);
  });

  
  it('parses a composite Pay query and if fields are not supported, ignore', async () => {
    const query = 'fstatus=paid&famount=>5000';
    const result = parseQuery<Pay>(query);

    const f = await filterPaysByFilter(result, pays);
    expect(f.length).toEqual(0);
  });
});
