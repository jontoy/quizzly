import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const ResultsList = ({ items = [], correct = true }) => {
  const icon = correct ? (
    <FontAwesomeIcon className="text-success" icon={faCheck} />
  ) : (
    <FontAwesomeIcon className="text-danger" icon={faTimes} />
  );
  const message = correct ? "What you know" : "What you should review";
  return (
    <div className="mt-4">
      <ul className="list-group list-group-flush">
        <li
          key={`title-${correct}`}
          className="list-group-item list-group-item-secondary"
        >
          {icon} {message}
        </li>
        {items.map(({ id, text }) => (
          <li key={id} className="list-group-item text-black-50">
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(ResultsList);
