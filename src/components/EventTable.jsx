import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import config from '../config';

const EventTable = () => {
  const [events, setEvents] = useState([]);
  const backendUrl = config.backendUrl;

  useEffect(() => {
    fetch(`${backendUrl}/api/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const columns = [
    {
      title: 'Game Name',
      dataIndex: 'game_name',
      key: 'game_name',
    },
    {
      title: 'Game Master',
      dataIndex: 'game_master',
      key: 'game_master',
    },
    {
      title: 'Player Quota',
      dataIndex: 'player_quota',
      key: 'player_quota',
    },
    {
      title: 'Total Joined Players',
      dataIndex: 'total_joined_players',
      key: 'total_joined_players',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Link to={`${backendUrl}/event/${record.slug}`} className="text-yellow-500 hover:text-yellow-400">
          View Event
        </Link>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center py-8">
      <div className="container mx-auto px-4">
        <div className="bg-gray-800 rounded-lg border-4 border-yellow-600 shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-center text-yellow-500 mb-6">Events Table</h1>
          <Table
            dataSource={events}
            columns={columns}
            rowClassName="bg-gray-700 border-b border-gray-600 hover:bg-gray-600 transition-colors duration-200"
            pagination={{ pageSize: 5 }}
            className="rounded-lg overflow-hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default EventTable;
