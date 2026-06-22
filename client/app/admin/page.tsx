/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import API from "../api/axio";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faTrash,
  faCheckCircle,
  faExclamationCircle,
  faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";

interface Train {
  id: number;
  trainNumber: string;
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  arrivalTime: string;
}

interface StatusModal {
  isOpen: boolean;
  type: "success" | "error" | "confirm";
  message: string;
  targetId?: number;
}

export default function AdminPage() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingTrain, setEditingTrain] = useState<Train | null>(null);

  const [statusModal, setStatusModal] = useState<StatusModal>({
    isOpen: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    const fetchAllTrains = async () => {
      try {
        const response = await API.get("/trains/admin/all");
        setTrains(response.data);
        setError("");
      } catch (err: any) {
        console.error(err);
        setError(
          err.response?.data?.message || "Access denied. You are not an admin.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllTrains();
  }, []);

  const handleDeleteTrigger = (id: number) => {
    setStatusModal({
      isOpen: true,
      type: "confirm",
      message: "Are you sure you want to remove this train from the schedule?",
      targetId: id,
    });
  };

  const handleConfirmDelete = async () => {
    const id = statusModal.targetId;
    if (!id) return;

    try {
      await API.delete(`/trains/${id}`);
      setTrains(trains.filter((t) => t.id !== id));
      setStatusModal({
        isOpen: true,
        type: "success",
        message: "Train removed successfully!",
      });
    } catch {
      setStatusModal({
        isOpen: true,
        type: "error",
        message: "Error deleting train. Please try again.",
      });
    }
  };

  const handleEditClick = (train: Train) => {
    setEditingTrain({
      ...train,
      departureTime: new Date(train.departureTime).toISOString().slice(0, 16),
      arrivalTime: new Date(train.arrivalTime).toISOString().slice(0, 16),
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrain) return;

    try {
      const response = await API.patch(`/trains/${editingTrain.id}`, {
        trainNumber: editingTrain.trainNumber,
        departureStation: editingTrain.departureStation,
        arrivalStation: editingTrain.arrivalStation,
        departureTime: new Date(editingTrain.departureTime).toISOString(),
        arrivalTime: new Date(editingTrain.arrivalTime).toISOString(),
      });

      setTrains(
        trains.map((t) => (t.id === editingTrain.id ? response.data : t)),
      );
      setEditingTrain(null);

      setStatusModal({
        isOpen: true,
        type: "success",
        message: "Train data updated successfully!",
      });
    } catch {
      setStatusModal({
        isOpen: true,
        type: "error",
        message: "Failed to update train data. Please check your fields.",
      });
    }
  };

  const filteredTrains = trains.filter((train) => {
    const from = train.departureStation
      ? train.departureStation.toLowerCase()
      : "";
    const to = train.arrivalStation ? train.arrivalStation.toLowerCase() : "";
    const qFrom = searchFrom.toLowerCase();
    const qTo = searchTo.toLowerCase();
    return from.includes(qFrom) && to.includes(qTo);
  });

  if (loading) return <div className="loading">Loading the admin panel...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="admin-block">
        <h1>RailPlan admin panel</h1>
        <div className="admin-form">
          <form onSubmit={(e) => e.preventDefault()}>
            <div>
              <label>From:</label>
              <input
                type="text"
                placeholder="Example, Kyiv"
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
              />
            </div>
            <div>
              <label>To:</label>
              <input
                type="text"
                placeholder="Example, Lviv"
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
              />
            </div>
          </form>
        </div>

        <div>
          <table>
            <thead>
              <tr>
                <th>Number</th>
                <th>From</th>
                <th>To</th>
                <th>Departure Time</th>
                <th>Arrival Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrains.length > 0 ? (
                filteredTrains.map((train) => (
                  <tr key={train.id}>
                    <td>{train.trainNumber}</td>
                    <td>{train.departureStation}</td>
                    <td>{train.arrivalStation}</td>
                    <td>
                      {new Date(train.departureTime).toLocaleString("uk-UA")}
                    </td>
                    <td>
                      {new Date(train.arrivalTime).toLocaleString("uk-UA")}
                    </td>
                    <td className="admin-action">
                      <button
                        className="edit"
                        onClick={() => handleEditClick(train)}
                      >
                        <FontAwesomeIcon icon={faPencil} /> Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteTrigger(train.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="no-data-cell">
                    No trains found for the specified route.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editingTrain && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Train № {editingTrain.trainNumber}</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div>
                <label>Train Number:</label>
                <input
                  type="text"
                  required
                  value={editingTrain.trainNumber}
                  onChange={(e) =>
                    setEditingTrain({
                      ...editingTrain,
                      trainNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label>From:</label>
                <input
                  type="text"
                  required
                  value={editingTrain.departureStation}
                  onChange={(e) =>
                    setEditingTrain({
                      ...editingTrain,
                      departureStation: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label>To:</label>
                <input
                  type="text"
                  required
                  value={editingTrain.arrivalStation}
                  onChange={(e) =>
                    setEditingTrain({
                      ...editingTrain,
                      arrivalStation: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label>Departure Time:</label>
                <input
                  type="datetime-local"
                  required
                  value={editingTrain.departureTime}
                  onChange={(e) =>
                    setEditingTrain({
                      ...editingTrain,
                      departureTime: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label>Arrival Time:</label>
                <input
                  type="datetime-local"
                  required
                  value={editingTrain.arrivalTime}
                  onChange={(e) =>
                    setEditingTrain({
                      ...editingTrain,
                      arrivalTime: e.target.value,
                    })
                  }
                />
              </div>
              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditingTrain(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {statusModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content status-modal">
            <div className="status-icon-container">
              {statusModal.type === "success" && (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="icon-success"
                />
              )}
              {statusModal.type === "error" && (
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  className="icon-error"
                />
              )}
              {statusModal.type === "confirm" && (
                <FontAwesomeIcon
                  icon={faQuestionCircle}
                  className="icon-confirm"
                />
              )}
            </div>

            <h3
              className={
                statusModal.type === "success"
                  ? "title-success"
                  : statusModal.type === "error"
                    ? "title-error"
                    : "title-confirm"
              }
            >
              {statusModal.type === "success" && "Success!"}
              {statusModal.type === "error" && "Error!"}
              {statusModal.type === "confirm" && "Are you sure?"}
            </h3>

            <p className="status-text">{statusModal.message}</p>

            <div className="modal-buttons status-btn-container">
              {statusModal.type === "confirm" ? (
                <>
                  <button
                    type="button"
                    className="cancel"
                    onClick={() =>
                      setStatusModal({ ...statusModal, isOpen: false })
                    }
                  >
                    No, cancel
                  </button>
                  <button
                    type="button"
                    className="delete"
                    onClick={handleConfirmDelete}
                  >
                    Yes, delete
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="save-btn"
                  onClick={() =>
                    setStatusModal({ ...statusModal, isOpen: false })
                  }
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
