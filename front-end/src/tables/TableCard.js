import React from "react";
import { unassignTable } from "../utils/api";

/**
 * Creates a single table card on the Dashboard page.
 *
 * Displays the table_name, and capacity.
 *
 * If the table status is occupied - displays a "finish" button. Otherwise, displays no buttons.
 *
 * @param Table props
 * the current table data object
 * @param loadDashboard props
 * reloads the dashboard page with the updated table information
 * @returns {JSX.Element}
 */
export default function TableCard({ table, loadDashboard }) {
  const tableStatus = table.reservation_id ? "Occupied" : "Free";

  const handleFinish = async (e) => {
    e.preventDefault();
    if (
      window.confirm(
        "Is this table ready to seat new guests? \n\n This cannot be undone"
      )
    ) {
      const returnedTable = await unassignTable(table.table_id);
      if (returnedTable) loadDashboard();
    }
    console.log(`finish ${table.table_name}`);
  };

  return (
    <>
      <div className="card m-2 " style={{ width: "12rem" }}>
        <div className="card-body p-2">
          <div className="d-flex justify-content-between">
            <h5 className="card-title">{table.table_name}</h5>
            <h6>
              <span className="oi oi-people mr-1"> </span>
              {table.capacity}
            </h6>
          </div>
          <div className="d-flex justify-content-between">
            <h6 data-table-id-status={table.table_id}>{tableStatus}</h6>
            {table.reservation_id ? (
              <button
                data-table-id-finish={table.table_id}
                className="btn btn-danger btn-sm"
                onClick={handleFinish}
              >
                Finish
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
