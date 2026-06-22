"use client";

import { useEffect, useState } from 'react';
import API from './api/axio.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface Train {
  id: number;
  number: string;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  
  trainNumber?: string;
  departureStation?: string;
  arrivalStation?: string;
}

export default function HomePage() {

  const [trains, setTrains] = useState<Train[]>([]);
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchTrains = async () => {
      try {
        const response = await API.get(`/trains?_t=${new Date().getTime()}`);
        if (isMounted) {
          setTrains(response.data);
        }
      } catch (err) {
        console.error('Error with fetching trains:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTrains();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTrains = trains ? trains.filter((train: Train) => {
  const trainFrom = train?.fromStation ? String(train.fromStation).toLowerCase() : '';
  const trainTo = train?.toStation ? String(train.toStation).toLowerCase() : '';
  
  const queryFrom = typeof searchFrom !== 'undefined' ? searchFrom.toLowerCase() : '';
  const queryTo = typeof searchTo !== 'undefined' ? searchTo.toLowerCase() : '';

  return trainFrom.includes(queryFrom) && trainTo.includes(queryTo);
}) : [];

  return (
    <div className="body">
      <div className="main">
        <div className="searching-block">
          <div className="searching">
          <h3>Searching for train</h3>
          <div className="search-form">
            <form>
              <label>From:</label>
              <input 
                type="text" 
                placeholder="Example, Kyiv" 
                value={searchFrom} 
                onChange={(e) => setSearchFrom(e.target.value)}
              />
            </form>
            <form>
              <label>To:</label>
              <input 
                type="text" 
                placeholder="Example, Lviv" 
                value={searchTo} 
                onChange={(e) => setSearchTo(e.target.value)}
              />
            </form>
          </div>
        </div>
        <h3>Trains available upon request ({filteredTrains.length})</h3>
        {loading ? (
          <p style={{ fontStyle: 'italic' }}>Download the current schedule...</p>
        ) : filteredTrains.length === 0 ? (
          <p style={{ fontStyle: 'italic' }}>No trains were found on this route.</p>
        ) : (
          <div className="trains-block">
            {filteredTrains.map((train) => (
              <div key={train.id} className="train-card">
                <div>
                  <span className="train-number">
                    № {train.trainNumber || train.number}
                  </span>
                  <h4>{train.departureStation || train.fromStation} <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon> {train.arrivalStation || train.toStation}</h4>
                </div>
                <div className="train-info">
                  <p><strong>Outbound:</strong> {new Date(train.departureTime).toLocaleString('uk-UA')}</p>
                  <p><strong>Arrival:</strong> {new Date(train.arrivalTime).toLocaleString('uk-UA')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
