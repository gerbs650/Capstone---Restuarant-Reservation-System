import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationCard from "./ReservationCard";
import { mobileSearch } from "../utils/api";

// This search will look for reservation by mobile_number
//  All of the found reservations will be displayed in the ReservationCard
//  If no resy is found, error will alrt of "No Res Found"
export default function ReservationSearch() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [foundReservations, setFoundReservations] = useState([]);
  const [errors, setErrors] = useState(null);

  // This creates a ReservationCard for each found reservation.
  const reservationCards = foundReservations.map((foundReservation) => {
    return (
      <ReservationCard
        key={foundReservation.reservation_id}
        reservation={foundReservation}
      />
    );
  });

  const handleChange = ({ target }) => {
    setPhoneNumber(target.value);
  };

  const handleFind = async (event) => {
    event.preventDefault();

    const abortController = new AbortController();
    await mobileSearch(phoneNumber, abortController.signal)
      .then((reservations) => {
        setFoundReservations(reservations);
        if (reservationCards.length === 0) {
          setErrors({ message: "No reservations found" });
        } else {
          setErrors(null);
        }
      })
      .catch(setErrors);
  };

  return (
    <div>
      <h3 className="pt-2">Find Reservation</h3>
      <form onSubmit={handleFind}>
        <div className="form-row">
          <div className="form-group col-md-5">
            <label htmlFor="mobile_number"> Search: </label>
            <input
              className="form-control"
              name="mobile_number"
              placeholder="Enter a customer's phone number"
              onChange={handleChange}
            />
          </div>
        </div>
        <button className="btn btn-primary mr-2" type="submit">
          {" "}
          Find{" "}
        </button>
      </form>
      {reservationCards.length === 0 ? <ErrorAlert error={errors} /> : null}
      <div className="d-flex justify-content-center flex-wrap mb-5">
        {reservationCards}
      </div>
    </div>
  );
}
