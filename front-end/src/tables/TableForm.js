import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Input form to create a new Table.
 *
 * @returns {JSX.Element}
 */
export default function TableForm() {
  const history = useHistory();

  const initForm = {
    table_name: "",
    capacity: 0,
  };

  const [tableForm, setTableForm] = useState({ ...initForm });
  const [tableErrors, setTableErrors] = useState([]);

  const checkValidInputs = async () => {
    const { table_name, capacity } = tableForm;
    const errors = [];

    if (table_name.length < 2) {
      errors.push({ message: "Table name must be more than 2 characters" });
    }

    if (capacity < 1) {
      errors.push({ message: "Table capacity must be at least 1" });
    }

    setTableErrors(errors);
    if (errors.length > 0) {
      return false;
    } else {
      return true;
    }
  };

  const errorMessages = () => {
    return tableErrors.map((err, index) => (
      <ErrorAlert key={index} error={err} />
    ));
  };

  const handleChange = ({ target }) => {
    if (target.name === "capacity") {
      setTableForm({
        ...tableForm,
        [target.name]: Number(target.value),
      });
    } else {
      setTableForm({
        ...tableForm,
        [target.name]: target.value,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let valid = await checkValidInputs();

    if (valid) {
      await createTable(tableForm).then(() => history.push(`/dashboard`));
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  return (
    <div>
      <h3 className="pt-2">New Table</h3>
      {errorMessages()}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="table_name"> Table name: </label>
            <input
              className="form-control"
              id="table_name"
              type="text"
              name="table_name"
              placeholder="Table name..."
              onChange={handleChange}
              value={tableForm.table_name}
              required
            />
          </div>
          <div className="form-group col-md-2">
            <label htmlFor="capacity">Table capacity:</label>
            <input
              className="form-control"
              id="capacity"
              type="number"
              name="capacity"
              onChange={handleChange}
              value={tableForm.capacity}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mr-2">
          {" "}
          Submit{" "}
        </button>
        <button className="btn btn-secondary mr-2" onClick={handleCancel}>
          {" "}
          Cancel{" "}
        </button>
      </form>
    </div>
  );
}
