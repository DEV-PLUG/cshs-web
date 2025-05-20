export function isWeekend() {
  const today = new Date();
  const day = today.getDay();
  return day === 0 || day === 6; // 0: 일요일, 6: 토요일
};

export default function displayPerio(perio:number, type?:number):string {
  if (isWeekend()) {
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