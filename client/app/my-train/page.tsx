"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import API from '../api/axio';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface Train {
  id: number;
  trainNumber: string;
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  arrivalTime: string;
}

export default function MyTrainsPage() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [formData, setFormData] = useState({
    trainNumber: '',
    departureStation: '',
    arrivalStation: '',
    departureTime: '',
    arrivalTime: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMyTrains();
  }, []);

  async function fetchMyTrains() {
    try {
      const response = await API.get('/trains/my');
      setTrains(response.data);
    } catch (err) {
      console.error('Train loading error', err);
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await API.post('/trains', formData);
      setSuccess('Train successfully created!');
      setFormData({
        trainNumber: '',
        departureStation: '',
        arrivalStation: '',
        departureTime: '',
        arrivalTime: '',
      });
      fetchMyTrains();
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Error creating train');
    }
  };

  return (
    <div className="login-block train">
      <h2>Create New Train Route</h2>
      <form onSubmit={handleSubmit}>
        <div className="train-form">
          <div>
            <label>Train Number:</label>
            <input type="text" name="trainNumber" value={formData.trainNumber} onChange={handleChange} required placeholder="e.g. 706К" />
          </div>
          <div>
            <label>Departure Station:</label>
            <input type="text" name="departureStation" value={formData.departureStation} onChange={handleChange} required placeholder="Kyiv" />
          </div>
          <div>
            <label>Arrival Station:</label>
            <input type="text" name="arrivalStation" value={formData.arrivalStation} onChange={handleChange} required placeholder="Lviv" />
          </div>
          <div>
            <label>Departure Time:</label>
            <input type="datetime-local" name="departureTime" value={formData.departureTime} onChange={handleChange} required />
          </div>
          <div>
            <label>Arrival Time:</label>
            <input type="datetime-local" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} required />
          </div>
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p style={{ color: '#2ec4b6', fontWeight: 'bold' }}>{success}</p>}
        
        <button type="submit" className="login-button">Add Train</button>
      </form>
      <h2>My Added Trains</h2>
      {trains.length === 0 ? (
        <p>You haven&apos;t added any trains yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Number</th>
              <th>Route</th>
              <th>Departure</th>
              <th>Arrival</th>
            </tr>
          </thead>
          <tbody>
            {trains.map((train) => (
              <tr key={train.id}>
                <td>{train.trainNumber}</td>
                <td>{train.departureStation} <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon> {train.arrivalStation}</td>
                <td>{new Date(train.departureTime).toLocaleString('uk-UA')}</td>
                <td>{new Date(train.arrivalTime).toLocaleString('uk-UA')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}