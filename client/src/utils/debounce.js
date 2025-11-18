// utils/debounce.js
export function debounce(fn, delay = 5000) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
