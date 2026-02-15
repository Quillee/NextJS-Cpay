import moment from 'moment';
import { Activity, Contact, Pay } from './definitions';

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (activity: Activity[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...activity.map((month) => month.activity)) / 100;
  // label should just only have thousand's place ex. 1K, 2K, 3K
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

const QUERY_FIELD_MAP = {
  created_at: 'created_at'
};

type CompareOperator = 'eq' | 'lt' | 'gt' | 'ne'; // stretch goals; 'con'? | 'leq' | 'geq'
export type QueriableKind = Pay | Contact;

export type QueryObject<T extends QueriableKind> = { [k in keyof T]?: { val: string | number | moment.Moment, op: CompareOperator } };

const COMPARE_OPERATOR_MAP: Record<string, CompareOperator> = {
  '=': 'eq',
  '!': 'ne',
  '>': 'gt',
  '<': 'lt',
};

/**
 * @param query : string that composes a param described by the following format
 *  => created_at=&amount=&status=&contact_id=&direction=&memo=
 *  All params are optional
 *  if query
 *
 *  @returns QueryObject that holds the field, the compare op and the value
 *    => { created_at: { op: 'gt', val: '2024-10-02'}, amount: { op: 'eq', val: 89023 } }
 */
export function parseQuery<T extends QueriableKind>(query: string): QueryObject<T> {
  if (!query || query === '') return {};
  const partials = query.split('&');
  return partials.reduce((acc, part) => {
    let [fld, val] = part.split('=') as [keyof T, string]
    let op: CompareOperator = 'eq';
    const isNotEq = ['<', '!', '>'].includes(val.charAt(0));
    switch (fld) {
      case 'created_at': // do I want to support this?
      case 'amount':
        if (isNotEq) {
          op = COMPARE_OPERATOR_MAP[val.charAt(0)];
        }
      default:
        // remove comparison from the front whether its supported or not
        if (isNotEq) {
          val = val.substring(1,);
        }
        break;
    }

    acc[fld] = {
      val: fld === 'amount' ? parseInt(val) : val,
      op
    };
    return acc;
  }, {} as QueryObject<T>)
}
