import fs from 'fs';
import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  Qibla,
} from 'adhan';

const DEFAULT_COORDINATES = new Coordinates(35.7897507, -78.6912485);
const DEFAULT_METHOD_KEY = 'MoonsightingCommittee';

const params = CalculationMethod[DEFAULT_METHOD_KEY]();

function serializePrayerTimes(prayerTimes) {
  return {
    fajr: prayerTimes.fajr.toISOString(),
    sunrise: prayerTimes.sunrise.toISOString(),
    dhuhr: prayerTimes.dhuhr.toISOString(),
    asr: prayerTimes.asr.toISOString(),
    maghrib: prayerTimes.maghrib.toISOString(),
    isha: prayerTimes.isha.toISOString(),
  };
}

function buildMonthlySchedule(year, monthIndex, coordinates, calculationParams) {
  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 0);
  const cursor = new Date(start);
  const days = [];

  while (cursor <= end) {
    const dateLabel = cursor.toISOString().split('T')[0];
    const prayerTimes = new PrayerTimes(coordinates, cursor, calculationParams);
    days.push({
      date: dateLabel,
      prayers: serializePrayerTimes(prayerTimes),
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

function buildYearSchedule(year, coordinates, calculationParams) {
  const months = [];
  for (let month = 0; month < 12; month += 1) {
    months.push({
      month: `${year}-${String(month + 1).padStart(2, '0')}`,
      days: buildMonthlySchedule(year, month, coordinates, calculationParams),
    });
  }
  return months;
}

const today = new Date();
const targetYear = Number(process.env.YEAR) || today.getFullYear();
const scheduleCoordinates = DEFAULT_COORDINATES;
const yearlySchedule = buildYearSchedule(targetYear, scheduleCoordinates, params);
const qibla = new Qibla(scheduleCoordinates);

fs.writeFileSync(
  'prayerTimes.json',
  JSON.stringify(
    {
      year: targetYear,
      coordinates: {
        latitude: scheduleCoordinates.latitude,
        longitude: scheduleCoordinates.longitude,
      },
      calculationMethod: DEFAULT_METHOD_KEY,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      qiblaDegreesFromNorth: qibla.direction,
      months: yearlySchedule,
    },
    null,
    2,
  ),
);

console.log('Saved prayerTimes.json with the full year schedule.');