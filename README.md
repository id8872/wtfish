AI Fish Logger
A simple web app to help anglers in Ontario identify a fish from a photo and provides a quick link to log the catch on the official Fish ON-Line website.

Features
Mobile-First Design: Use your phone's camera directly to capture a photo of your catch.

AI-Powered Identification: Leverages the Google Gemini API to identify the fish species from the image.

Image Resizing: Automatically downsizes large photos taken on mobile devices to ensure fast and reliable analysis.

Secure API Handling: Uses a Vercel Serverless Function to keep the Google API key secure and private.

Simple Workflow: Provides clear, step-by-step instructions for the user to complete their catch log on the official government website.

How It Works
The application streamlines the process of logging a fish catch into two main steps:

Identify: The user uploads or takes a picture of their fish. The app sends this image to a secure backend function, which gets an identification from the Google Gemini API and returns the species name to the user.

Log: After a successful identification, the user is presented with a button that opens the Fish ON-Line website, along with clear instructions on how to navigate their site to record the catch details.

Tech Stack
Frontend: HTML, Tailwind CSS, Vanilla JavaScript

Backend: Node.js running on a Vercel Serverless Function

Platform: Deployed on Vercel

Core AI Service: Google Gemini API

Setup and Deployment
To deploy your own version of this application, follow these steps:

Clone the Repository:

git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY

Get a Google Gemini API Key:

Visit Google AI Studio to create an API key.

Deploy to Vercel:

Import the project into Vercel from your GitHub repository.

In the project settings, go to Settings -> Environment Variables.

Add your Google API key with the following name:

GOOGLE_API_KEY

Deploy the project. Vercel will automatically handle the rest.

Project Structure
The project uses a simple structure optimized for Vercel's serverless environment:

/
├── api/
│   └── identify.js   # The secure serverless function that calls the Google API
│
├── assets/
│   └── Waterbody.png # The icon used in the instructions
│
└── index.html        # The main frontend page for the user
# wtfish
