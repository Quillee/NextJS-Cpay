import moment from 'moment';
import { openSync, writeSync, closeSync } from 'fs';

export type Activity = {
  month: string;
  activity: number;
};

