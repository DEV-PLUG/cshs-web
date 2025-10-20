export function isWeekend(date?: Date | string) {
  let targetDate: Date;
  
  if (date) {
    if (typeof date === 'string' && /^\d{8}$/.test(date)) {
      // YYYYMMDD 형식을 YYYY-MM-DD로 변환
      const formatted = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
      targetDate = new Date(formatted);
    } else {
      targetDate = new Date(date);
    }
  } else {
    targetDate = new Date();
  }
  
  const day = targetDate.getDay();
  return day === 0 || day === 6; // 0: 일요일, 6: 토요일
};

export default function displayPerio(perio:number, type?:number, date?:Date | string):string {
  if (isWeekend(date)) {
    // 주말: perio 1~4
    const weekendLabels = ['1교시', '2교시', '3교시', '4교시'];
    return weekendLabels[perio - 1] || '';
  } else {
    // 평일: perio 1~5
    let weekdayLabels = ['7교시', '8교시', '야자 1교시', '야자 2교시', '야자 3교시']; // type 1
    if(type === 2) weekdayLabels = ['7교시', '8교시', '야자 1', '야자 2', '야자 3']; // type 2
    if(type === 3) weekdayLabels = ['7교시', '8교시', '야1', '야2', '야3']; // type 3
    return weekdayLabels[perio - 1] || '';
  }
}