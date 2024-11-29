import { React, useEffect } from "react";import EventList from "../components/EventList";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const HomePage = () => (
  <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col bg-medieval-pattern select-none">
    <Navbar />
    <main className="flex-grow flex items-center justify-center p-4">
      <div className="container">
        <div className="bg-gray-800 rounded-lg border-4 border-yellow-600 shadow-2xl p-4 md:p-8">
          <EventList />
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default HomePage;
