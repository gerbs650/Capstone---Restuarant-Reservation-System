import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, seatReservation, readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
/**
 * Seats the choosen Reservation to an available table.
 * Updates the Reservation to "seated"
 * Updates the table data with the reservation_id
 *
 * @returns {JSX.Element}
 */
export default function SeatRes() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState({});
  const [selectedTable, setSelectedTable] = useState("");
  const [tableError, setTableError] = useState(null);
  const [reservationError, setReservationError] = useState(null);
  const [capacityError, setCapacityError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    async function loadPage(id) {
      await readReservation(id, abortController.signal)
        .then(setReservation)
        .catch(setReservationError);
      await listTables(abortController.signal)
        .then(setTables)
        .catch(setTableError);
      return;
    }
    loadPage(reservation_id);
  }, [reservation_id]);

  // cannot seat a reservation party larger than the table capacity
  const validateCapacity = () => {
    const foundTable = tables.find(
      (table) => table.table_id === parseInt(selectedTable)
    );
    return reservation.people > foundTable.capacity;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateCapacity()) {
      setCapacityError({ message: "Too many people in reservation" }); //state was used instead of alert message.
      return;
    }
    const abortController = new AbortController();
    await seatReservation(
      reservation_id,
      selectedTable,
      abortController.signal
    );
    history.push("/");
  };

  const handleCancel = (e) => {
    e.preventDefault();
    history.goBack();
  };

  const handleChange = ({ target }) => {
    setSelectedTable(target.value);
  };

  const tableOptions = tables.map((table) => {
    if (table.reservation_id) return null;

    return (
      <option key={table.table_id} value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  return (
    <div className="m-2">
      <ErrorAlert error={reservationError} />
      <ErrorAlert error={tableError} />
      <ErrorAlert error={capacityError} />
      <h3>Seat Reservation #{reservation_id}</h3>
      <h5>
        - {reservation.last_name} party of {reservation.people} -{" "}
      </h5>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="table_id">
            <select
              id="table_id"
              name="table_id"
              onChange={handleChange}
              value={selectedTable}
            >
              <option>Please Select a Table</option>
              {tableOptions}
            </select>
          </label>
        </div>
        <br />
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
