import { useReducer } from "react";
import {formatCurrency, parseQuery, QueryObject} from './utils';
import {contacts, pays, activity} from "@/app/lib/placeholder-data";
import moment from "moment";
import { Contact, Pay } from "./definitions";

// ran into problem where suspense stayed on loading state. Created this function for debugging
async function logPromiseResolution(func: string, time: number = 3) {
    console.log('Resolving', func, '...');
    await new Promise((resolve) => setTimeout(resolve, getRandomMillis(time)));
    console.log('Resolved', func, '...');
}

export async function fetchActivity() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)
    await logPromiseResolution('fetchActivity', 1.2)

    return activity;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch activity data.');
  }
}

export async function fetchLatestPays() {
  try {
    await logPromiseResolution('fetchLatestPayments', 3)
    return pays.sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest pays.');
  }
}

export async function fetchCardData() {
  try {

    const payCountPromise = logPromiseResolution('payCountPromise', 3);
    const contactCountPromise = logPromiseResolution('contactCountPromise', 3);
    const payStatusPromise = logPromiseResolution('payStatusPromise', 3);

    await Promise.all([
      payCountPromise,
      contactCountPromise,
      payStatusPromise,
    ]);
    const paysByStatus = pays.reduce((accum, pay) => { 
      accum[pay.status].push(pay)
      return accum;
    }, { 'paid': [] as Pay[], 'pending': [] as Pay[], 'refunded': [] as Pay[]});

    const numberOfPays = pays.length;
    const numberOfContacts = contacts.length;
    const totalPaidPays = paysByStatus['paid'].length;
    const totalPendingPays = paysByStatus['pending'].length;
    const totalReceivedPays = pays.filter((pay) => pay.direction === 'request').length;

    return {
      numberOfContacts,
      numberOfPays,
      totalPaidPays,
      totalPendingPays,
      totalReceivedPays
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
// could make more generic to accept either pays or contacts, but leave as is for readability
export async function filterPaysByFilter(queryObj: QueryObject<Pay>, pays: Pay[]) {
  return pays.filter((pay) => {
    return (Object.keys(queryObj) as (keyof Pay)[]).every((fld) => {
      if (!queryObj[fld]) {
        return true;
      }
      let value = queryObj[fld].val;
      let isDateTimeEqual = false;
      if ('created_at' === fld) {
        value = moment(value);
        isDateTimeEqual = value.isSame(pay[fld]);
      }

      const op = queryObj[fld].op;
      switch(op) {
        case 'eq':
          // this function ended up a bit bloated, but moment overloads the valueOf prototype which lets us get away
          //   with the other comparison operators. However, === wouldn't work since it would check the pointer value
          if (fld === 'created_at') return isDateTimeEqual;
          // value is the query value, so "amount=>5000" should include amount values > 5000
          return  pay[fld] === value;
        case 'ne':
          if (fld === 'created_at') return isDateTimeEqual;
          return pay[fld] !== value;
        case 'lt':
          return pay[fld] < value;
        case 'gt':

          return pay[fld] > value;
        default:
          throw new Error("Non supported comparison operation while filtering Pays");
      }
    })
  });
}
export async function fetchFilteredPays(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    return (await filterPaysByFilter(parseQuery(query), pays)).slice(offset);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch pays.');
  }
}

export async function fetchPaysPages(query: string) {
  try {
    return Math.floor((await filterPaysByFilter(parseQuery(query), pays)).length / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of pays.');
  }
}

export async function fetchPayById(id: string) {
  try {
    await waitRandomMilis(1.5);
    return pays.find((pay) => pay.id === id);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch pay.');
  }
}

export async function fetchContactById(contactId: string) {
    return (await fetchContacts())
      .find((contact) => contact.id === contactId);
}
export async function fetchContacts() {
  try {
    return contacts;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all contacts.');
  }
}

export async function fetchFilteredContacts(query: string) {
  try {
    const qryObject = parseQuery<Contact>(query);
    
    return contacts.filter((contact) => {
      // ineffecient, but FE will only load X amount of contacts
      //   before it goes to BE to query
      return (Object.keys(qryObject) as (keyof Contact)[]).every((fld) => {
        if (!qryObject[fld]) {
          return true;
        }
        return qryObject[fld].val === contact[fld];
      })

    });
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch contact table.');
  }
}

async function waitRandomMilis(max: number) {
  await new Promise(resolve => setTimeout(resolve, getRandomMillis(max)));
}
function getRandomMillis(max: number) {
  return Math.random() * max * 100;
}
