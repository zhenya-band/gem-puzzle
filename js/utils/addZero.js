export default function addZero(n) {
  return (parseInt(n, 10) < 10 ? '0' : '') + n;
}