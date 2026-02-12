import { useReducer } from "react";
import {formatCurrency, parseQuery, QueryObject} from './utils';
import {contacts, pays, activity} from "@/app/lib/placeholder-data";
import moment from "moment";
import { Contact, Pay } from "./definitions";

export async function fetchActivity() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)
    await new Promise((resolve) => setTimeout(resolve, getRandomMillis(3)));

    return activity;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch activity data.');
  }
}

export async function fetchLatestPays() {
  try {
    await new Promise((resolve) => setTimeout(resolve, getRandomMillis(3)));

    // TODO: return latest pays data joined with contacts
    //  what does latest mean?
    return pays.filter((pay) => moment(pay.created_at).isAfter(moment().subtract(3, 'months')));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest pays.');
  }
}

export async function fetchCardData() {
  try {
    const payCountPromise = new Promise((resolve) => setTimeout(resolve, getRandomMillis(3)));
    const contactCountPromise = new Promise((resolve) => setTimeout(resolve, getRandomMillis(3)));
    const payStatusPromise = new Promise((resolve) => setTimeout(resolve, getRandomMillis(3)));

    const data = await Promise.all([
      payCountPromise,
      contactCountPromise,
      payStatusPromise,
    ]);
    // @mark: will this be usefuul elsewhere
    const paysByStatus = pays.reduce((accum, pay) => { 
      accum[pay.status].push(pay)
      return accum;
    }, { 'paid': [] as Pay[], 'pending': [] as Pay[]});

    const numberOfPays = pays.length;
    const numberOfContacts = contacts.length;
    const totalPaidPays = paysByStatus['paid'].length;
    const totalPendingPays = paysByStatus['pending'].length;

    return {
      numberOfContacts,
      numberOfPays,
      totalPaidPays,
      totalPendingPays,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
// could make more generic to accept either pays or contacts, but leave as if for readability
export async function filterPaysByFilter(queryObj: QueryObject<Pay>, pays: Pay[]) {
  return pays.filter((pay) => {
    // ineffecient, but FE will only load X amount of contacts
    //   before it goes to BE to query
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

          console.log(pay[fld], value, queryObj[fld].op, pay[fld] > value)
        console.log({f: pay[fld], v: value})
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
  return Math.random() * max * 1000;
}
