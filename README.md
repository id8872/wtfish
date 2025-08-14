# WTFish Identifier

A smart web app to help anglers in Ontario identify a fish from a photo, automatically find their fishing zone via GPS, and check the relevant fishing regulations instantly.

## Features

* **Mobile-First Design:** Use your phone's camera directly to capture a photo of your catch.
* **AI-Powered Identification:** Leverages the Google Gemini API to identify the fish species from an image.
* **GPS Zone Finder:** Automatically detects the user's Fisheries Management Zone (FMZ) using their device's location.
* **Instant Regulation Lookups:** Cross-references the identified fish and FMZ with a built-in database of the 2025 Ontario fishing regulations.
* **Smart Warnings:**
  * Displays a **red** warning if the catch is out of season.
  * Displays an **amber** warning for species with size restrictions or catch-and-release rules.
* **Secure API Handling:** Uses Vercel Serverless Functions to keep the Google API key secure and private.
* **Mobile Conveniences:** Includes an option to download the captured photo directly to your mobile device.

## How It Works

The application provides a seamless workflow for anglers:

1. **Find Zone (Optional):** The user can tap "Find" to use their GPS to automatically select the correct Fisheries Management Zone (FMZ). They can also select it manually.
2. **Identify:** The user takes a picture of their fish. The app sends this image and the selected FMZ to a secure backend.
3. **Get Results:** The backend identifies the fish species using the Google Gemini API and then performs an instant lookup in its internal regulations database.
4. **Display Info:** The app displays the fish's name along with its specific season and limits for that zone, complete with color-coded warnings for any potential breaches.
5. **Log:** The user is provided with a direct link to the official Fish ON-Line website to log their catch, armed with all the necessary information.

## Tech Stack

* **Frontend:** HTML, Tailwind CSS, Vanilla JavaScript
* **Backend:** Node.js on Vercel Serverless Functions
* **Geolocation:** Browser Geolocation API
* **Mapping Data:** GeoJSON for FMZ boundaries
* **Core AI Service:** [Google Gemini API](https://ai.google.dev/)
* **Platform:** Deployed on [Vercel](https://vercel.com)

## Setup and Deployment

To deploy your own version of this application, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git)
   cd YOUR_REPOSITORY
   ```

2. **Get a Google Gemini API Key:**
   * Visit [Google AI Studio](https://aistudio.google.com) to create an API key.

3. **Deploy to Vercel:**
   * Import the project into Vercel from your GitHub repository.
   * In the project settings, go to **Settings -> Environment Variables**.
   * Add your Google API key with the following name:
     * `GOOGLE_API_KEY`
   * Deploy the project. Vercel will automatically handle the rest.

## Project Structure

The project is structured for Vercel's serverless environment:

```
/
├── api/
│   ├── identify.js          # Main function: identifies fish & checks regulations
│   ├── get-zone.js          # Function: determines FMZ from GPS coordinates
│   ├── regulations.js       # Data: The fishing regulations database
│   └── fmz-boundaries.js    # Data: The GeoJSON map boundaries for each zone
│
├── assets/
│   ├── Waterbody.png        # The icon used in the instructions
│   └── favicon.png          # The website's browser icon
│
└── index.html               # The main frontend page for the user
