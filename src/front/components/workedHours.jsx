

const workedHours = (signings = []) => {
  let hoursToday = 0;
  let hoursWeek = 0;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  signings.forEach(sign => {
    if (!sign.start || !sign.end) return;

    const start = new Date(sign.start);
    const end = new Date(sign.end);

    const duration = (end - start) / (1000 * 60 * 60);
    hoursWeek += duration;

    if (start.toISOString().slice(0, 10) === todayStr) {
      hoursToday += duration;
    }
  });

  return {
    hoursToday: hoursToday.toFixed(2),
    hoursWeek: hoursWeek.toFixed(2),
  };
};

export default workedHours;