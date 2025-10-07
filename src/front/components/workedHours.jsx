export const formatHours = (decimalHours) => {
  const totalMinutes = Math.round(decimalHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

export const calculateWorkedHours = (
  signings = [],
  now = new Date(),
  options = { countOpenUntilNow: false }
) => {
  if (!Array.isArray(signings)) {
    return {
      hoursTodayDecimal: 0,
      hoursMonthDecimal: 0,
      hoursWeekDecimal: 0,
      hoursToday: formatHours(0),
      hoursMonth: formatHours(0),
      hoursWeek: formatHours(0),
    };
  }

  const msPerHour = 1000 * 60 * 60;
  const sorted = [...signings].sort(
    (a, b) =>
      new Date(a.datetime.replace(" ", "T")) - new Date(b.datetime.replace(" ", "T"))
  );

  let lastClockIn = null;
  let hoursTodayDecimal = 0;
  let hoursMonthDecimal = 0;
  let hoursWeekDecimal = 0;

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const todayY = now.getFullYear();
  const todayM = now.getMonth();
  const todayD = now.getDate();

  
  const firstDayOfWeek = new Date(now);
  firstDayOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7)); // lunes
  firstDayOfWeek.setHours(0, 0, 0, 0);

  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  lastDayOfWeek.setHours(23, 59, 59, 999);

  sorted.forEach((sign) => {
    const dt = new Date(sign.datetime.replace(" ", "T"));
    const type = String(sign.sign_type_name || "").toLowerCase();

    if (type === "in") {
      lastClockIn = dt;
    } else if (type === "out" && lastClockIn) {
      const duration = (dt - lastClockIn) / msPerHour;

      if (dt.getFullYear() === currentYear && dt.getMonth() === currentMonth) {
        hoursMonthDecimal += duration;

        if (
          lastClockIn.getFullYear() === todayY &&
          lastClockIn.getMonth() === todayM &&
          lastClockIn.getDate() === todayD
        ) {
          hoursTodayDecimal += duration;
        }
      }

      if (lastClockIn >= firstDayOfWeek && dt <= lastDayOfWeek) {
        hoursWeekDecimal += duration;
      }

      lastClockIn = null;
    }
  });

  if (options.countOpenUntilNow && lastClockIn) {
    const duration = (now - lastClockIn) / msPerHour;
    if (now.getFullYear() === currentYear && now.getMonth() === currentMonth) {
      hoursMonthDecimal += duration;
      if (
        lastClockIn.getFullYear() === todayY &&
        lastClockIn.getMonth() === todayM &&
        lastClockIn.getDate() === todayD
      ) {
        hoursTodayDecimal += duration;
      }
    }

    if (lastClockIn >= firstDayOfWeek && now <= lastDayOfWeek) {
      hoursWeekDecimal += duration;
    }
  }

  const round2 = (n) => Math.round(n * 100) / 100;

  return {
    hoursTodayDecimal: round2(hoursTodayDecimal),
    hoursMonthDecimal: round2(hoursMonthDecimal),
    hoursWeekDecimal: round2(hoursWeekDecimal),
    hoursToday: formatHours(round2(hoursTodayDecimal)),
    hoursMonth: formatHours(round2(hoursMonthDecimal)),
    hoursWeek: formatHours(round2(hoursWeekDecimal)),
  };
};

export default calculateWorkedHours;