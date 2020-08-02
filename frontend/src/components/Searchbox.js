import React, { useState, useEffect } from "react";
import "./Searchbox.css";
import useDebounce from "../hooks/useDebounce";

const Searchbox = ({ filterResults }) => {
  const [term, setTerm] = useState("");
  const debouncedFilter = useDebounce(filterResults, 500);
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleChange = (e) => {
    setTerm(e.target.value);
  };

  useEffect(() => {
    debouncedFilter(term);
  }, [term, debouncedFilter]);

  return (
    <form className="Searchbox form-inline mt-3" onSubmit={handleSubmit}>
      <input
        className="form-control form-control-lg flex-grow-1"
        type="search"
        name="search"
        value={term}
        placeholder="Search..."
        onChange={handleChange}
      />
    </form>
  );
};
export default Searchbox;
