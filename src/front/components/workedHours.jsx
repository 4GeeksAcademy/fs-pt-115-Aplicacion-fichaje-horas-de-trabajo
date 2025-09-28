export const formatHours = (decimalHours) => {
  const totalMinutes = Math.round(decimalHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};


const workedHours = (signings) => {
  if (!Array.isArray(signings)) return { hoursToday: 0, hoursWeek: 0 };

  let hoursToday = 0;
  let hoursWeek = 0;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const sorted = [...signings].sort((a, b) => new Date(a.datetime.replace(" ", "T")) - new Date(b.datetime.replace(" ", "T")));
  let lastClockIn = null;

  sorted.forEach(sign => {
    const dt = new Date(sign.datetime.replace(" ", "T"));
    const type = sign.sign_type_name?.toLowerCase();

    if (type === "in") lastClockIn = dt;
    else if (type === "out" && lastClockIn) {
      const duration = (dt - lastClockIn) / (1000 * 60 * 60);
      hoursWeek += duration;
      if (lastClockIn.toISOString().slice(0, 10) === todayStr) hoursToday += duration;
      lastClockIn = null;
    }
  });

  return {
    hoursToday,
    hoursWeek,
  };
};
export default workedHours;