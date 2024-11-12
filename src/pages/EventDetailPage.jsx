import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';
import config from '../config';
import { FaDiceD20 } from 'react-icons/fa';
import { FaCaretLeft,FaCaretRight } from 'react-icons/fa6';

const EventDetailPage = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [seatId, setSeatId] = useState(null);  // Use state for seatId
  const [canJoin, setCanJoin] = useState(false);  // Use state for canJoin
  const backendUrl = config.backendUrl;

  // Fetch the event data initially
  useEffect(() => {
    const fetchEventData = () => {
      fetch(`${backendUrl}/api/event/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          data = data.data;
          setEvent(data);  // Set the event data
          if (data.total_joined_players < data.player_quota) {
            if (data.player_quota < data.total_joined_players) {
              setCanJoin(false);  // Set canJoin to false if there are more players than seats
              setSeatId(null);  // Set seatId to null
            } else{
            setCanJoin(true);  // Set canJoin to true if there are available seats
            setSeatId(data.total_joined_players + 1);  // Calculate and set seatId
          }
          } 
          else {
            setCanJoin(false);  // Set canJoin to false if there are no available seats
            setSeatId(null);  // Set seatId to null
          }
          console.log(`Seat ID: ${data.player_quota - data.total_joined_players}`);
        });
    };

    // Fetch data immediately when the component mounts
    fetchEventData();

    // Set up an interval to fetch the data every 2 seconds (2000ms)
    const intervalId = setInterval(fetchEventData, 2000);

    // Clear the interval when the component unmounts to avoid memory leaks
    return () => clearInterval(intervalId);
  }, [slug, backendUrl]);  // Dependencies: slug, backendUrl

  // Display loading message while data is being fetched
  if (!event) {
    return <div className="text-center text-gray-100">Loading...</div>;
  }

  return (
    <>
    <div className="min-h-screen text-center bg-gray-900 text-gray-100 flex items-center justify-center bg-medieval-pattern relative select-none">
      <button
        className="absolute top-4 left-4 text-yellow-500 hover:text-yellow-300 bg-gray-800 rounded px-3 py-1 transition duration-300"
        onClick={() => window.location.href = "https://events.emurpg.com"}
      >
        Back
      </button>
      <div className="container px-4 py-8">
        <div className="bg-gray-800 rounded-lg border-4 border-yellow-600 shadow-2xl p-8">
        <div className="flex justify-center"><FaCaretLeft className="text-6xl py-2 text-yellow-500" /><FaDiceD20 className="text-6xl py-2 text-yellow-500" /><FaCaretRight className="text-6xl py-2 text-yellow-500" /></div>
          <h1 className="text-4xl font-bold text-yellow-500 mb-2">{event.game_name}</h1>
          <h2 className="text-2xl text-gray-300 mb-4">{event.game_master}</h2>
          
          {canJoin ? (
            <>
              <p className="text-lg mb-2">Game Master: {event.game_master}</p>
              <p className="text-lg mb-2">Player Quota: {event.player_quota}</p>
              <p className="text-lg mb-2">Total Joined Players: {event.total_joined_players}</p>
              <p className="text-lg mb-4">Seat Number: {seatId}</p>
              <RegistrationForm eventSlug={event.slug} seatId={seatId} tableId={event.slug} />
            </>
          ) : (
            <p className="text-lg text-red-500">Table is full.</p>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default EventDetailPage;
