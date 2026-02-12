import { parseQuery } from '@/app/lib/utils';

describe('parseQuery', () => {
  it('parses a single equality field', () => {
    const result = parseQuery('status=paid');
    expect(result).toEqual({
      status: { val: 'paid', op: 'eq' },
    });
  });

  it('parses multiple fields', () => {
    const result = parseQuery('status=pending&contact_id=abc-123');
    expect(result).toEqual({
      status: { val: 'pending', op: 'eq' },
      contact_id: { val: 'abc-123', op: 'eq' },
    });
  });

  it('parses greater-than operator on amount', () => {
    const result = parseQuery('amount=>500');
    expect(result).toEqual({
      amount: { val: 500, op: 'gt' },
    });
  });

  it('parses less-than operator on amount', () => {
    const result = parseQuery('amount=<1000');
    expect(result).toEqual({
      amount: { val: 1000, op: 'lt' },
    });
  });

  it('parses not-equal operator on amount', () => {
    const result = parseQuery('amount=!0');
    expect(result).toEqual({
      amount: { val: 0, op: 'ne' },
    });
  });

  it('parses greater-than operator on created_at', () => {
    const result = parseQuery('created_at=>2024-06-01');
    expect(result).toEqual({
      created_at: { val: '2024-06-01', op: 'gt' },
    });
  });

  it('defaults to eq for fields without operator support', () => {
    const result = parseQuery('memo=>some text');
    expect(result).toEqual({
      memo: { val: 'some text', op: 'eq' },
    });
  });

  it('handles a complex multi-field query', () => {
    const result = parseQuery('status=paid&amount=>500&created_at=<2024-12-01');
    expect(result).toEqual({
      status: { val: 'paid', op: 'eq' },
      amount: { val: 500, op: 'gt' },
      created_at: { val: '2024-12-01', op: 'lt' },
    });
  });
});
