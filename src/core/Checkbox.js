import React, { useState, useEffect } from "react";

const Checkbox = ({ categories, handleFilters }) => {
  const [checked, setChecked] = useState([]);

  const handleToggle = (c) => () => {
    //return the first index or -1
    const currentCategotyId = checked.indexOf(c);
    const newCheckedCategoryId = [...checked];

    //if currently checked was not aleady in checked state then push
    //else pull/take off
    if (currentCategotyId === -1) {
      newCheckedCategoryId.push(c);
    } else {
      newCheckedCategoryId.splice(currentCategotyId, 1);
    }

    setChecked(newCheckedCategoryId);
    handleFilters(newCheckedCategoryId);
  };

  return categories.map((c, i) => {
    return (
      <li key={i} className="list-unstyled">
        <label className="form-check-label">
          <input
            onChange={handleToggle(c._id)}
            value={checked.indexOf(c._id === -1)}
            type="checkbox"
            className="form-check-input"
          />
          {c.name}
        </label>
      </li>
    );
  });
};

export default Checkbox;
