import { useEffect, useState } from "react";
import "./App.css";
import "./index.css";

const API_URL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2501-FTB-ET-WEB-FT/guests";

export default function App() {
  const [guests, setGuests] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchGuests() {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load the guest list.");
      }

      const result = await response.json();
      setGuests(result.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchGuestDetails(guestId) {
    try {
      setIsDetailLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/${guestId}`);

      if (!response.ok) {
        throw new Error("Unable to load this guest's details.");
      }

      const result = await response.json();
      setSelectedGuest(result.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsDetailLoading(false);
    }
  }

  useEffect(() => {
    fetchGuests();
  }, []);

  function handleGuestClick(guestId) {
    fetchGuestDetails(guestId);
  }

  function deselectGuest() {
    setSelectedGuest(null);
    setError("");
  }

  function handleBackClick() {
    deselectGuest();
  }

  if (isLoading) {
    return (
      <main className="app">
        <p className="message">Loading guests...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app">
        <section className="error-card">
          <h1>Something went wrong</h1>
          <p>{error}</p>
          <button type="button" onClick={fetchGuests}>
            Try Again
          </button>
        </section>
      </main>
    );
  }

  if (isDetailLoading) {
    return (
      <main className="app">
        <p className="message">Loading guest details...</p>
      </main>
    );
  }

  if (selectedGuest) {
    return (
      <main className="app">
        <section className="details-card">
          <p className="eyebrow">Guest details</p>

          <h1>{selectedGuest.name}</h1>

          <div className="detail-row">
            <span>Email</span>
            <a href={`mailto:${selectedGuest.email}`}>
              {selectedGuest.email}
            </a>
          </div>

          <div className="detail-row">
            <span>Phone</span>
            <a href={`tel:${selectedGuest.phone}`}>
              {selectedGuest.phone}
            </a>
          </div>

          <div className="detail-row">
            <span>Job</span>
            <p>{selectedGuest.job}</p>
          </div>

          <div className="detail-row bio">
            <span>Bio</span>
            <p>{selectedGuest.bio}</p>
          </div>

          <button
            className="back-button"
            type="button"
            onClick={handleBackClick}
          >
            ← Back to Guest List
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <section className="guest-list-card">
        <div className="header">
          <div>
            <p className="eyebrow">The Fullstack Convention Center</p>
            <h1>Guest List</h1>
            <p className="subtitle">
              Select a guest to view their contact details and profile.
            </p>
          </div>

          <div className="guest-count">
            <span>{guests.length}</span>
            Guests
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th aria-label="View guest details">View</th>
              </tr>
            </thead>

            <tbody>
              {guests.map((guest) => (
                <tr
                  key={guest.id}
                  className="guest-row"
                  onClick={() => handleGuestClick(guest.id)}
                  tabIndex="0"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      handleGuestClick(guest.id);
                    }
                  }}
                >
                  <td>{guest.name}</td>
                  <td>{guest.email}</td>
                  <td>
                    <button
                      className="view-button"
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleGuestClick(guest.id);
                      }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}