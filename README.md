# 🐲EMURPG WEB🐲

> Website is hosted on https://www.emurpg.com

## Backend Integration

The EMURPG Club Website interacts with various backend endpoints to manage game tables, players, and events. Below is a brief overview of how different components interact with the backend and the security measures in place.


### Technologies Used

#### <img src="https://cdn.jsdelivr.net/npm/simple-icons@13.16.0/icons/react.svg" width="16" height="16"> React
The primary library for building the user interface, allowing for the creation of reusable components and efficient state management.

#### <img src="https://cdn.jsdelivr.net/npm/simple-icons@13.16.0/icons/tailwindcss.svg" width="16" height="16"> Tailwind CSS
A utility-first CSS framework used for styling the application, ensuring a consistent and responsive design across different devices.

#### <img src="https://cdn.jsdelivr.net/npm/simple-icons@13.16.0/icons/rsocket.svg" width="16" height="16"> WebSockets
Implemented for real-time updates, enabling live communication between the server and clients.

#### <img src="https://cdn.jsdelivr.net/npm/simple-icons@13.16.0/icons/axios.svg" width="16" height="16"> Axios
A promise-based HTTP client used for API requests, simplifying data fetching and error handling.

#### <img src="https://cdn.jsdelivr.net/npm/simple-icons@13.16.0/icons/reactrouter.svg" width="16" height="16"> React Router
Used for navigation and routing, providing a seamless user experience.

#### <img src="https://cdn.jsdelivr.net/npm/simple-icons@13.16.0/icons/i18next.svg" width="16" height="16"> i18next
A library for internationalization, allowing multi-language support.

#### <img src="https://cdn.jsdelivr.net/npm/simple-icons@13.16.0/icons/letsencrypt.svg" width="16" height="16"> js-sha256
Used for secure password hashing.

#### <img src="https://cdn.jsdelivr.net/npm/simple-icons@13.16.0/icons/react.svg" width="16" height="16"> React Icons
Provides popular icons.

#### <img src="https://cdn.jsdelivr.net/npm/simple-icons@13.16.0/icons/styledcomponents.svg" width="16" height="16"> Styled Components
For component-level CSS styling.

#### <img src="https://cdn.jsdelivr.net/npm/simple-icons@13.16.0/icons/vite.svg" width="16" height="16"> Vite
A fast development build tool.

### Key Features

- **Game Table Management**: Allows admins to create, update, and delete game tables. Each table includes details such as game name, game master, player quota, and joined players.
- **Player Management**: Enables admins to add, update, and remove players from tables. Players can view their assigned tables and seat information.
- **Real-Time Updates**: Utilizes WebSockets to provide real-time updates on game tables and player data, ensuring that users have the most current information.
- **CSV Export**: Provides functionality to export game table and player data as CSV files, facilitating easy data sharing and analysis.
- **Responsive Design**: Ensures that the application is accessible and functional on various devices, including desktops, tablets, and smartphones.
- **Internationalization**: Supports multiple languages, allowing users to switch between English and Turkish.
- **Secure Authentication**: Implements secure login and session management using hashed passwords and API key validation.
- **Notifications**: Real-time notifications for important events and updates, keeping users informed of any changes or actions required.
- **User-Friendly Forms**: Forms for creating and updating game tables and player information, with validation to ensure data integrity.
- **Sortable Tables**: Organized and sortable tables for displaying game table and player data, making it easy to find and manage information.
- **Social Media Integration**: Links to social media platforms like Discord, WhatsApp, Instagram, and LinkedIn for community engagement.
- **EMUCON Event Management**: Full support for EMUCON (EMU Club Convention) event management including:
  - Multiple themed corners (Entertainment, Awareness, Health & Lifestyle, Folk & Social, Art, Technology, Science)
  - Club and activity scheduling with detailed event information
  - Time-slot based scheduling and continuous activities
  - Real-time event registration with shareable tokens
  - Admin dashboard for managing EMUCON events, clubs, and schedules

### User Interface & Experience

The front-end of the EMURPG Club Website is designed to provide an intuitive and engaging user experience. Key aspects include:

- **Consistent Design**: The use of Tailwind CSS ensures a cohesive and visually appealing design across all pages, with a medieval theme that aligns with the RPG club's identity.
- **Responsive Layout**: The application is fully responsive, adapting seamlessly to different screen sizes and devices, from desktops to smartphones.
- **Accessibility**: Efforts have been made to ensure the website is accessible to all users, including those with disabilities. This includes keyboard navigation and screen reader support.
- **Interactive Elements**: Features such as real-time updates, sortable tables, and interactive forms enhance user engagement and make the application more dynamic.
- **Clear Navigation**: The Navbar provides easy access to different sections of the website, ensuring users can quickly find the information they need.
- **Feedback Mechanisms**: Users receive immediate feedback through notifications and visual cues, such as loading indicators and error messages, improving the overall user experience.
- **Localization (WIP)**: The application supports multiple languages, allowing users to switch between English and Turkish, catering to a diverse user base.

By focusing on these elements, the front-end aims to deliver a user-friendly and immersive experience for managing RPG events and activities.

#### Navbar
- **Description**: Provides navigation links to different sections of the website.

#### HomePage
- **Endpoint**: `/api/tables`
    - **Description**: Fetches a list of available events and tables without sensitive information.
    - **Method**: `GET`
    - **Security**: Uses CORS policies to restrict access.

#### TableList
- **Endpoint**: `/api/tables`
    - **Description**: Lists all game tables with non-sensitive details such as game name, game master, and player quota.
    - **Method**: `GET`
    - **Security**: Uses CORS policies to restrict access.

#### AdminDashboard
- **Endpoints**:
    - `/api/admin/add_player`
        - **Description**: Adds a new player to a game table.
        - **Method**: `POST`
        - **Security**: Requires API key validation and CORS policies.
    - `/api/admin/delete_player`
        - **Description**: Deletes a player from a game table.
        - **Method**: `DELETE`
        - **Security**: Requires API key validation and CORS policies.
    - `/api/admin/create_table`
        - **Description**: Creates a new game table.
        - **Method**: `POST`
        - **Security**: Requires API key validation and CORS policies.
    - `/api/admin/update_table`
        - **Description**: Updates an existing game table.
        - **Method**: `PUT`
        - **Security**: Requires API key validation and CORS policies.

#### EMUCON Pages & Components
- **EmuconPage** (`/emucon`)
    - **Description**: Main EMUCON event page displaying corners, clubs, and schedule information.
    - **Endpoint**: `/api/emucon/corners` (GET)
    - **Security**: Public access, no authentication required.

- **EmuconSchedulePage** (`/emucon/schedule`)
    - **Description**: Displays the EMUCON event schedule with time slots and activities.
    - **Endpoint**: `/api/emucon/schedule` (GET)
    - **Security**: Public access, no authentication required.

- **EmuconRegisterPage** (`/emucon/register/:code`)
    - **Description**: Event registration page with shareable token links for player registration.
    - **Endpoint**: `/api/emucon/events/{code}` (GET), `/api/emucon/register` (POST)
    - **Security**: Token-based validation, public access with invitation code.

- **EmuconAdminPanel** (`/emucon/admin`)
    - **Description**: Admin dashboard for managing EMUCON events, clubs, and schedules.
    - **Endpoints**:
        - `/api/admin/emucon/corners` (GET, POST, PUT, DELETE)
        - `/api/admin/emucon/clubs` (GET, POST, PUT, DELETE)
        - `/api/admin/emucon/events` (GET, POST, PUT, DELETE)
        - `/api/admin/emucon/schedule` (GET, PUT)
    - **Security**: Requires API key validation and admin authentication.

#### Footer
- **Description**: Contains links to social media and other relevant information.

### Real-Time Functionality
- **WebSocket Endpoint**: `/ws/updates`
    - **Description**: Provides real-time updates on game tables and player data.
    - **Security**: Uses WebSocket connection management to ensure secure communication.

### Security Considerations
- **API Key Validation**: Ensures secure communication with the backend by validating API keys.
- **CORS Policies**: Restricts access to the API to prevent unauthorized requests.
- **HTTPS**: Ensures secure data transmission between the frontend and backend.

### State Management
- **React Hooks**: Utilizes `useState` and `useEffect` hooks for managing component state and side effects, ensuring efficient data fetching and updates.

### Deployment
- **Cloud Platform**: Deployed on Heroku with continuous integration and deployment pipelines, ensuring smooth updates and maintenance.

### EMUCON Features

The frontend now includes comprehensive EMUCON (EMU Club Convention) event management:

#### Pages & Routes
- `/emucon` - Main EMUCON info page with corners and clubs directory
- `/emucon/schedule` - Full event schedule with time slots and activities
- `/emucon/register/:code` - Event registration with token-based access (medieval green theme)
- `/emucon/admin` - Admin panel for managing events, clubs, and schedules

#### Components
- **EmuconPage**: Displays all corners (7 themed areas) with clubs and their activities
- **EmuconSchedulePage**: Interactive schedule with time-slot based layout
- **EmuconRegisterPage**: Beautiful registration form with shareable token links
- **EmuconAdminPanel**: Full admin dashboard for EMUCON management
- **EmuconAdminClubs**: Manage clubs and their event schedules
- **EmuconSchedulePanel**: Edit time periods and create activity slots
- **EmuconStaff**: View and assign staff to activities

#### Data Management
- Bilingual (English/Turkish) support for all EMUCON content
- Real-time updates for event availability and participant counts
- Shareable registration links via unique tokens
- Admin controls for creating, updating, and managing events

### Charroller - AI-Powered Character Sheet Companion

The Charroller system is a comprehensive tool for tabletop roleplaying game players. It allows users to create characters using AI, upload existing character sheet PDFs, and manage their character collection with system-specific gameplay trackers.

#### Pages & Routes
- `/charroller` - Landing page with blue magical forest theme, feature showcase, and autoplay ambient music
- `/charroller/manager` - Character manager with warm tavern theme, character cards, and create actions

#### Key Features
- **AI Character Generation**: Describe your character in plain text and get a complete roll list with all skills, attacks, and saves
- **PDF Upload**: Upload existing character sheet PDFs (D&D 5e, Pathfinder 2e, Call of Cthulhu, Fate) and extract all rolls automatically
- **Multi-System Support**: Full support for D&D 5e, Pathfinder 2e, Call of Cthulhu, and Fate Core
- **Instant Dice Rolling**: Click any skill or attack to roll with proper modifiers and critical detection
- **Character Collection**: Save unlimited characters to browser localStorage with portraits and metadata
- **Export/Import**: Export characters as JSON for backup or sharing
- **Rate Limiting**: 4 free character creations per day (admin bypass available)
- **BETA Status**: Clearly marked as beta throughout the UI

#### Themed User Experience
- **Landing Page**: Blue magical forest theme with parallax background (moon, stars, fireflies, trees, dice, scrolls)
- **Character Manager**: Warm tavern theme with candlelight effects and cozy atmosphere
- **Ambient Music**: Autoplay on landing, persistent across navigation with play/pause/mute controls

#### System-Specific Gameplay Trackers
When playing a character, users have access to system-appropriate trackers:

| System | Trackers Available |
|--------|-------------------|
| **D&D 5e** | HP + Temp HP, Death Saves (3 success/3 fail), Conditions |
| **Pathfinder 2e** | HP, Focus Points, Hero Points (max 3), Conditions |
| **Call of Cthulhu** | Sanity, Luck, Magic Points, HP, Wounds |
| **Fate** | Fate Points (refresh), Physical/Mental Stress boxes, Consequences (mild/moderate/severe) |

All trackers persist to localStorage and update in real-time.

#### Components
- **CharrollerLandingPage**: Hero section with CTAs, feature cards, how-it-works, and testimonial
- **CharrollerPage**: Main container handling manager/create views with theme switching
- **CharrollerManager**: Character grid with usage tracking, settings panel, and create buttons
- **CharrollerResults**: Gameplay view with roll categories, history, and system-specific trackers
- **CharrollerSystemSelector**: TTRPG system selection with icons and descriptions
- **CharrollerUpload**: Drag-and-drop PDF upload with validation
- **CharrollerDescribe**: AI character description input with example prompts
- **CharrollerBackground**: Blue magical forest parallax with SVG elements
- **TavernBackground**: Warm candlelight tavern with floating dust particles
- **MusicPlayer**: Ambient music with autoplay, theme support, and FontAwesome icons
- **CharacterCard**: Character display with portrait, system badge, and play/delete actions
- **SettingsPanel**: Admin code entry, sound controls, portrait toggle, data export/import
- **DiceRoller**: 3D CSS animated dice with critical success/fail effects

#### Internationalization
Full i18n support with translations in:
- English (`en.json` - `charroller.*` keys)
- Turkish (`tr.json` - `charroller.*` keys)

### Future Enhancements
- **Enhanced Admin Dashboard**: Adding more analytics and reporting features to the admin dashboard for better event management and decision-making.
- **Event Notifications**: Implementing a notification system to alert users about upcoming events and important updates.
- **User Profiles**: Allowing users to create and manage their profiles, including their game history and achievements.
- **Integration with University Systems**: Integrating with university systems for user authentication and event management.
- **Advanced EMUCON Analytics**: Participant tracking, attendance analytics, and event success metrics.
- **Mobile App**: Native mobile applications for easier event access and registration.
- `You can commit your suggestions here!`
### Installation & Setup
1. Clone the repository.
2. Install dependencies using `npm install`.
3. Create a `.env` file and add necessary environment variables.
4. Configure the backend URL and other settings in `config.jsx`:
    ```jsx
    // config.jsx
    const DEV = false; // Set to true for development environment

    // Backend URL based on environment
    const backendUrl = DEV ? "http://localhost:8000" : "https://your-api-production-url.com"; // Make sure to set your development api's port correctly

    // Configuration object
    const config = {
      backendUrl: backendUrl,
      DISCORD_LINK: 'https://your-discord-link.com', // Discord community link
      WHATSAPP_LINK: 'https://your-whatsapp-link.com', // WhatsApp group link
      INSTAGRAM_LINK: 'https://your-instagram-link.com', // Instagram profile link
      LINKEDIN_LINK: 'https://your-linkedin-link.com', // LinkedIn profile link
      FOOTER_TEXT: '© 2024 Your Organization. All rights reserved.', // Copyright text on the footer
      FOOTER_ICON_SIZE: 18, // Size of footer icons
    };

    export default config; // Export configuration
    ```
5. From the terminal, go into the project's `package.json` directory and start the development server using `npm start`.

![GitHub release (latest by date)](https://img.shields.io/github/v/release/barandev/emurpg-frontend?style=for-the-badge)
![GitHub License](https://img.shields.io/github/license/barandev/emurpg-frontend?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/barandev/emurpg-frontend?style=for-the-badge)
