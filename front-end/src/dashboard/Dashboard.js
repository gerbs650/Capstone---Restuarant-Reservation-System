import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, next, previous } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import ReservationCard from "../reservations/ReservationCard";
import TableCard from "../tables/TableCard";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ defaultDate }) {
  const query = useQuery();
  const queryDate = query.get("date");

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [date, setDate] = useState(queryDate || defaultDate);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  return (
    <main className="text-center">
      <h1 className="my-2">Dashboard</h1>
      <button
        onClick={() => setDate(previous(date))}
        className="btn btn-secondary btn-lg"
      >
        Previous Day
      </button>
      <button
        className="m-3 btn btn-success btn-lg"
        onClick={() => setDate(today())}
      >
        Today
      </button>
      <button
        onClick={() => setDate(next(date))}
        className="btn btn-secondary btn-lg"
      >
        Next Day
      </button>
      <br />
      <label className="form-label pb-4">
        <input
          type="date"
          pattern="\d{4}-\d{2}-\d{2}"
          name="reservation_date"
          onChange={handleDateChange}
          value={date}
        />
      </label>
      <h4 className="mb-1">
        Reservations for {new Date(next(date)).toDateString()}
      </h4>
      <ErrorAlert error={reservationsError} />
      <br />
      {reservations.length ? null : <h5 className="lead">No Reservations</h5>}
      <div className="d-flex justify-content-center flex-wrap">
        {reservations.map((reservation) => (
          <ReservationCard
            key={reservation.reservation_id}
            reservation={reservation}
          />
        ))}
      </div>
      <hr />
      <h4 className="mb-2">Tables</h4>
      <ErrorAlert error={tablesError} />
      <div className="d-flex justify-content-center flex-wrap">
        {tables.map((table) => (
          <TableCard
            key={table.table_id}
            table={table}
            loadDashboard={loadDashboard}
          />
        ))}
      </div>
    </main>
  );
}

export default Dashboard;
