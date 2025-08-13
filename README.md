# WTFish Identifier

A simple web app to help anglers in Ontario identify a fish from a photo and provides a quick link to log the catch on the official Fish ON-Line website.

## Features

* **Mobile-First Design:** Use your phone's camera directly to capture a photo of your catch.
* **AI-Powered Identification:** Leverages the Google Gemini API to identify the fish species from the image.
* **Image Resizing:** Automatically downsizes large photos taken on mobile devices to ensure fast and reliable analysis.
* **Secure API Handling:** Uses a Vercel Serverless Function to keep the Google API key secure and private.
* **Simple Workflow:** Provides clear, step-by-step instructions for the user to complete their catch log on the official government website.

## How It Works

The application streamlines the process of logging a fish catch into two main steps:

1. **Identify:** The user uploads or takes a picture of their fish. The app sends this image to a secure backend function, which gets an identification from the Google Gemini API and returns the species name to the user.
2. **Log:** After a successful identification, the user is presented with a button that opens the Fish ON-Line website, along with clear instructions on how to navigate their site to record the catch details.

## Tech Stack

* **Frontend:** HTML, Tailwind CSS, Vanilla JavaScript
* **Backend:** Node.js running on a Vercel Serverless Function
* **Platform:** Deployed on [Vercel](https://vercel.com)
* **Core AI Service:** [Google Gemini API](https://ai.google.dev/)

## Setup and Deployment

To deploy your own version of this application, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git)
   cd YOUR_REPOSITORY
