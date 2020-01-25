export default function getStartDate() {
  return new Date().toJSON().slice(0, 10);
}
