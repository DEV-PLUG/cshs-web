export default function formatedDate(dateStr:string) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth()+1;
  const day = date.getDate();
  return year+""+(("00"+month.toString()).slice(-2))+""+(("00"+day.toString()).slice(-2));
}