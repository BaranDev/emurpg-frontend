import React, { useState } from 'react';
import config from '../config';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 border-2 border-yellow-600 rounded-lg p-6 max-w-md w-full">
        {children}
      </div>
    </div>
  );
};

const RegistrationForm = ({ tableSlug, seatId, tableId }) => {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ruleLanguage, setRuleLanguage] = useState('EN');
  const backendUrl = config.backendUrl;

  const rules = {
    EN: [
      "1. Participants must be currently enrolled students.",
      "2. Respect all other participants and staff members.",
      "3. Follow the event schedule and guidelines.",
      "4. No cheating or unfair play is allowed.",
      "5. Have fun and embrace the spirit of role-playing!"
    ],
    TR: [
      "1. Katılımcılar kayıtlı öğrenci olmalıdır.",
      "2. Tüm diğer katılımcılara ve personele saygılı olun.",
      "3. Etkinlik programını ve yönergelerini takip edin.",
      "4. Hile yapmak veya haksız oyun oynamak yasaktır.",
      "5. Eğlenin ve rol yapma ruhunu benimseyin!"
    ]
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert('You must accept the EMURPG Event Join Rules.');
      return;
    }
  
    const response = await fetch(`${backendUrl}/api/register/${tableSlug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        student_id: studentId, 
        name: name, 
        table_id: tableId, 
        seat_id: parseInt(seatId, 10),
        contact: contact
      }),
    });
  
    const result = await response.json();
    if (!response.ok) {
      alert(result.detail || 'An error occurred during registration.');
    } else {
      alert(result.message);
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleRuleLanguage = () => setRuleLanguage(ruleLanguage === 'EN' ? 'TR' : 'EN');

  return (
    <>
      <form onSubmit={handleRegister} className="max-w-md mx-auto bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 border-2 border-yellow-600">
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:shadow-outline focus:border-yellow-500"
            type="text"
            placeholder="Student ID*"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:shadow-outline focus:border-yellow-500"
            type="text"
            placeholder="Name/Surname*"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:shadow-outline focus:border-yellow-500"
            type="text"
            placeholder="Contact Number (OPTIONAL)"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center justify-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-yellow-500"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
            />
            <span className="ml-2 text-sm text-gray-300 items-center justify-center text-center py-1">
              I accept the{' '}
              <span
                onClick={toggleModal}
                className="text-yellow-500 text-sm items-center justify-center hover:text-yellow-400 underline cursor-pointer"
              >
                Event Rules
              </span>
            </span>
          </label>
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
            type="submit"
          >
            Join the Quest
          </button>
        </div>
      </form>

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-yellow-500 text-xl font-bold">EMURPG Event Join Rules</h2>
          <button
            onClick={toggleRuleLanguage}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
          >
            {ruleLanguage === 'EN' ? 'TR' : 'EN'}
          </button>
        </div>
        <div className="text-gray-300">
          {rules[ruleLanguage].map((rule, index) => (
            <p key={index} className="mb-2">{rule}</p>
          ))}
        </div>
        <button
          onClick={toggleModal}
          className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
        >
          Close
        </button>
      </Modal>
    </>
  );
};

export default RegistrationForm;