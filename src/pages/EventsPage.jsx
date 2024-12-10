import { React, useEffect } from "react";import { Footer, Navbar, EventList, ErrorBoundary } from "../components";

const EventsPage = () => (
  <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col bg-medieval-pattern select-none">
    <Navbar
      buttons={[
        {
          label: "Homepage",
          onClick: () => (window.location.href = "/"),
        },
        {
          label: "Character Roller",
          badge: "Coming Soon",
          disabled: true,
        },
      ]}
      scrollEffectEnabled={false}
    />
    <main className="flex-grow flex items-center justify-center p-4">
      <div className="container">
        <div className="bg-gray-800 rounded-lg border-4 border-yellow-600 shadow-2xl p-4 md:p-8">
          <ErrorBoundary>
            <EventList />
          </ErrorBoundary>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default EventsPage;
