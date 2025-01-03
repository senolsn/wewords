import moment from 'moment';

export { }

declare global {
  interface DateConstructor {
    getNowDateOnly(): Date;
    getDatePart(date: Date): Date;
    equalDate(date1: Date, date2: Date): boolean;
    daysInMonth(year: any, month: any): number;
    daysCountBetweenDates(fromDate: Date, toDate: Date): number;
    minutesCountBetweenDates(fromDate: Date, toDate: Date): number;

    isAfterEqualDate(fromDate: Date, toDate: Date): boolean;
    isBeforeEqualDate(fromDate: Date, toDate: Date): boolean;
    isAfterDate(fromDate: Date, toDate: Date): boolean;
    isBeforeDate(fromDate: Date, toDate: Date): boolean;
    isBetweenDate(date: Date, fromDate: Date, toDate: Date): boolean;

    getDateString(date: Date): string;
    getDateTimeString(date: Date): string;
    parseFromJson(dateAsString: string): Date;
    getMomentFormat(date: Date): string;
    getMomentFormatForDate(date:Date): string;
  }
}

// remvoe the time section of the date
Date.getNowDateOnly = function (): Date {
  const now: Date = new Date();
  //return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
};

// compare the dates only, without considering the time
Date.equalDate = function (date1: Date, date2: Date): boolean {
  // if (!date1 && !date2)
  //   return true;

  // if (!date1 && date2)
  //   return false;

  // if (!date1 && date2)
  //   return false;

  // const year1: number = date1.getFullYear();
  // const month1: number = date1.getMonth();
  // const day1: number = date1.getDate();

  // const year2: number = date2.getFullYear();
  // const month2: number = date2.getMonth();
  // const day2: number = date2.getDate();

  // return (year1 === year2 && month1 === month2 && day1 === day2);

  if (!date1 && !date2) return true;

  if (!date1 && date2) return false;

  if (!date1 && date2) return false;

  return date1 === date2;
};

// return how many days exists in specific month of a year
Date.daysInMonth = function (year, month): number {
  // Use 1 for January, 2 for February, etc.
  return new Date(year, month, 0).getDate();
};

// get the numbers of days between tow days
Date.daysCountBetweenDates = function (fromDate: Date, toDate: Date): number {
  if (!fromDate || !toDate) return 0;

  const diff: number = Math.floor(toDate.getTime() - fromDate.getTime());
  const day: number = 1000 * 60 * 60 * 24;

  return Math.floor(diff / day) + 1;
};

Date.minutesCountBetweenDates = function (
  fromDate: Date,
  toDate: Date
): number {
  if (!fromDate || !toDate) return 0;

  const diff: number = Math.floor(toDate.getTime() - fromDate.getTime());
  const minute: number = 1000 * 60;

  return Math.floor(diff / minute) + 1;
};

Date.getDatePart = function (date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

Date.isAfterEqualDate = function (date1: Date, date2: Date): boolean {
  const d1 = Date.getDatePart(date1);
  const d2 = Date.getDatePart(date2);

  return d1 >= d2;
};

Date.isBeforeEqualDate = function (date1: Date, date2: Date): boolean {
  const d1 = Date.getDatePart(date1);
  const d2 = Date.getDatePart(date2);

  return d1 <= d2;
};

Date.isAfterDate = function (date1: Date, date2: Date): boolean {
  const d1 = Date.getDatePart(date1);
  const d2 = Date.getDatePart(date2);

  return d1 > d2;
};

Date.isBeforeDate = function (date1: Date, date2: Date): boolean {
  const d1 = Date.getDatePart(date1);
  const d2 = Date.getDatePart(date2);

  return d1 < d2;
};

Date.isBetweenDate = function (date: Date, date1: Date, date2: Date): boolean {
  const d = Date.getDatePart(date);
  const d1 = Date.getDatePart(date1);
  const d2 = Date.getDatePart(date2);

  return d >= d1 && d <= d2;
};

Date.getDateString = function (date: Date): string {
  if (!date) return '';

  // the value of 'tr-TR' is static right now, but this must be dynamic value
  return date.toLocaleDateString('tr-TR');
};

Date.getMomentFormat = function (date: Date): string {
  return moment(date).format('YYYY-MM-DDTHH:mm:ss');
};

Date.getMomentFormatForDate = function (date: Date): string {
  return moment(date).format('YYYY-MM-DD');
};

Date.getDateTimeString = function (date: Date): string {
  if (!date) return '';

  // the value of 'tr-TR' is static right now, but this must be dynamic value
  return date.toLocaleString('tr-TR');
};

Date.parseFromJson = function (dateAsString: string): Date {
  if (!dateAsString) return undefined;

  return new Date(parseInt(dateAsString.replace('/Date(', '')));
};
