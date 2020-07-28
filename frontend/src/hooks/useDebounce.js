import { useRef } from "react";
const useDebounce = (func, delay = 1000) => {
  const timerRef = useRef();

  return (...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

export default useDebounce;
