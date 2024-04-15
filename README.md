# trading fours (Spotify Recommendation Engine)

## Description

This project is a robust Spotify Recommendation Engine that takes a playlist or a track as input. It uses a random forest classification model to predict overarching track or playlist genre. This model was trained on over 200,000 songs and 20 genres. The recommendation engine then utilizes the spotipy library and the Spotify Web API to retrieve individual track attributes, and creates a vector representative of the playlist/track within a ~45 dimensional space. This vector is compared against an immense & continually updated dataset of diverse songs in both genre and audio features and is then assigned a cosine similarity, which is finally used to determine the best recommendations for the given playlist/track.

## Example Usage & Analysis

Current State (Youtube Demo):
[![YouTube Video Demo](https://github.com/Stanley-Wang910/spotify-rec-engine/assets/117041405/78ccde6e-b337-481d-92a2-ca0e2c796504)](https://www.youtube.com/watch?v=tzjeOJVYI7o)

## Features Coming Soon

2. MySQL Database interactions for tailored user recommendations and profile customizations 

## Contact

    Email: wangstanley910@gmail.com
    School Email: stanley.wang@mail.mcgill.ca
    LinkedIn: https://www.linkedin.com/in/stanley910/

## Installation

To install and run this project, follow these steps:

1. Clone the repository to your local machine:
    ```
    git clone https://github.com/Stanley-Wang910/spotify-rec-engine.git
    ```

2. Navigate to the project directory:
    ```
    cd <path to your project directory>
    ```

3. Install the required dependencies:
    ```
    pip install -r requirements.txt
    ```

## Usage

To use this Spotify Recommendation Engine, follow these steps:

1. Create a Spotify Developer Account:
    - Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) and log in or create a new account.
    - Create a new app and note down the Client ID and Client Secret.

2. Set up the Redirect URI:
    - In the Spotify Developer Dashboard, go to your app settings.
    - Add a Redirect URI for your application. This should be the URL where the user will be redirected after authentication. For example, `http://localhost:8000/callback`.

3. Create a `.env` file in the root directory of your project:
    - Open a text editor and create a new file named `.env`.
    - Add the following lines to the `.env` file, replacing `<YOUR_CLIENT_ID>`, `<YOUR_CLIENT_SECRET>`, and `YOUR_USER_ID` with your actual Client ID, Client Secret, and User ID:
      ```
      CLIENT_ID=<YOUR_CLIENT_ID>
      CLIENT_SECRET=<YOUR_CLIENT_SECRET>
      SPOTIFY_USER_ID=<YOUR_USER_ID>
      REDIRECT_URI=http://localhost:8000/callback
      ```

4. Run the program!
    - in terminal:
      ```
      <User Directory>\RecEngine> python .\src\main.py
      ```
    - Have fun!

## Data Sources

The initial dataframe of ~200,000 songs was collected and altered from the following:

- [Spotify Tracks Dataset](https://www.kaggle.com/datasets/maharshipandya/-spotify-tracks-dataset)
- [Ultimate Spotify Tracks DB](https://www.kaggle.com/datasets/zaheenhamidani/ultimate-spotify-tracks-db)

However, the dataframe is continually updated by playlists and tracks that users enter!



