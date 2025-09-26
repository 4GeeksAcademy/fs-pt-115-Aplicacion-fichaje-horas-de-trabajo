
const workedHours = (signings) => {
  if (!Array.isArray(signings)) return { hoursToday: "0.00", hoursWeek: "0.00" };

  let hoursToday = 0;
  let hoursWeek = 0;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const sorted = [...signings].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
  let lastClockIn = null;

  sorted.forEach(sign => {
    const dt = new Date(sign.datetime);

    if (sign.sign_type_name?.toLowerCase() === "clock in") {
      lastClockIn = dt;
    } else if (sign.sign_type_name?.toLowerCase() === "clock out" && lastClockIn) {
      const duration = (dt - lastClockIn) / (1000 * 60 * 60); // horas decimales
      hoursWeek += duration;
      if (lastClockIn.toISOString().slice(0, 10) === todayStr) hoursToday += duration;
      lastClockIn = null;
    }
  });

  return {
    hoursToday: hoursToday.toFixed(2),
    hoursWeek: hoursWeek.toFixed(2),
  };
};
export default workedHours