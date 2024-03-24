import pandas as pd
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
import spotipy
import requests
from spotipy.oauth2 import SpotifyClientCredentials
from spotipy.oauth2 import SpotifyOAuth
from spotipy.client import SpotifyException
import warnings

warnings.filterwarnings("ignore")

class SpotifyClient:
    def __init__(self, sp):
        # self.client_id = client_id
        # self.client_secret = client_secret
        # self.redirect_uri = redirect_uri
        # self.user_id = user_id
        # self.scope = scope
        
        # auth_manager = SpotifyOAuth(client_id=self.client_id,
        #                             client_secret=self.client_secret,
        #                             redirect_uri=self.redirect_uri,
        #                             scope=self.scope,
        #                             username=self.user_id)
        # Initialize the Spotipy client with the auth manager
        self.sp = sp

    # def __init__(self, client_id, client_secret, redirect_uri, user_id, scope):
    #     self.client_id = client_id
    #     self.client_secret = client_secret
    #     self.redirect_uri = redirect_uri
    #     self.user_id = user_id
    #     self.scope = scope

    #     #Initialize the Spotipy client with the client credentials manager
    #     self.sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=self.client_id,
    #                                                         client_secret=self.client_secret,
    #                                                         redirect_uri=self.redirect_uri,
    #                                                         scope=self.scope,
    #                                                         username=self.user_id))

    def get_id_name(self):
        """
        Retrieves a dictionary mapping playlist names to their corresponding IDs.

        Returns:
            dict: A dictionary where the keys are playlist names and the values are playlist IDs.
        """
        id_name = {}
        for i in self.sp.current_user_playlists()['items']:
            id_name[i['name']] = i['uri'].split(':')[2]
        return id_name
    
    def analyze_my_playlist(self, playlist_name, id_dic, sp):
        playlist_id = id_dic[playlist_name]
        self.analyze_playlist(playlist_id)

    def analyze_playlist(self, playlist_id):
        """
        Analyzes a Spotify playlist by retrieving the tracks, their audio features, and merging them into a DataFrame.

        Parameters:
        - playlist_id (str): The ID of the Spotify playlist to analyze.

        Returns:
        - playlist_with_features (pd.DataFrame): A DataFrame containing the playlist tracks and their audio features.
        """
        # Retrieve the tracks from the playlist
        playlist_data = []
        for track_item in self.sp.playlist(playlist_id)['tracks']['items']:
            track = track_item['track']
            if track and track['id']: 
                playlist_data.append({
                    'artist': track['artists'][0]['name'],
                    'name': track['name'],
                    'id': track['id'],
                    'date_added': track_item['added_at'],
                    'popularity': track['popularity'],
                    'explicit': track['explicit']
                })

        # Create a DataFrame from the playlist data
        playlist = pd.DataFrame(playlist_data)
        playlist['date_added'] = pd.to_datetime(playlist['date_added'])
        playlist = playlist.sort_values('date_added', ascending=False)
        
        # Retrieve the audio features for the tracks
        track_ids = playlist['id'].tolist()
        audio_features_list = self.sp.audio_features(track_ids)
        audio_features_df = pd.DataFrame(audio_features_list)

        # Select specific columns for the audio features DataFrame
        selected_columns = ['id', 'danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo', 'duration_ms', 'time_signature']
        audio_features_df = audio_features_df[selected_columns]

        # Merge the playlist DataFrame with the audio features DataFrame
        playlist_with_features = pd.merge(playlist, audio_features_df, on='id', how='inner')
        playlist_with_features = self.rearrange_columns(playlist_with_features)
        
        # Return the resulting DataFrame
        return playlist_with_features

    def get_playlist_track_name(self, id, input='playlist'):
        """
        Retrieves the name of a Spotify playlist given its ID.

        Parameters:
        - playlist_id (str): The ID of the Spotify playlist.

        Returns:
        - str: The name of the playlist.
        """
        if input == 'playlist':
            playlist = self.sp.playlist(id)
            playlist_name = playlist['name']
            return playlist_name

        elif input == 'track':
            track = self.sp.track(id)
            track_name = track['name']
            artist_name = track['artists'][0]['name']
            album_release = track['album']['release_date'].split('-')[0]
            return track_name, artist_name, album_release
        
    # def get_track_links(self, df):
    #     track_links = []
    #     # Iterate over the rows of the DataFrame
    #     for index, row in df.iterrows():
    #         track_name = row['track_name']
    #         artist_name = row['artists']
            
    #         #track_name = re.sub('[^A-Za-z0-9 ]+', '', track_name)[:50]
    #         results = self.sp.search(q='track:{}'.format(track_name), type='track')
    #         #Flag to check if the track is found
    #         found = False
    #         # Iterate over the search results
    #         # Iterate over the search results
    #         for track in results['tracks']['items']:
    #             # Check if the artist's name matches
    #             for artist in track['artists']:
    #                 if artist['name'].lower() == artist_name.lower():
    #                     # Check if the duration matches
    #                     track_links.append(track['external_urls']['spotify'])
    #                     found = True
    #                     break
    #             if found:
    #                 break
    #         if not found:
    #             track_links.append('https://open.spotify.com/track/' + track['id'])
    #     return track_links
    
    def get_song_features(self, track_id):
        """
        Retrieves the audio features of a list of track IDs from Spotify API.

        Args:
            track_ids (list): A list of track IDs.

        Returns:
            pandas.DataFrame: A DataFrame containing the audio features of the tracks, along with additional information such as artist, name, popularity, and explicitness.
        """
        if not track_id:
            print("No track provided.")
            return
        
        # Retrieve audio features for the track IDs
        audio_features_list = self.sp.audio_features(track_id)

        # Convert the list of audio features into a DataFrame
        audio_features_df = pd.DataFrame(audio_features_list)

        # Select specific columns to print
        selected_columns = ['id', 'danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo', 'duration_ms', 'time_signature']

        # Retrieve additional information for each track
        tracks_info_list = {
            'id' : track_id,
            'artist' : self.sp.track(track_id)['artists'][0]['name'],
            'name': self.sp.track(track_id)['name'],
            'popularity' : self.sp.track(track_id)['popularity'],
            'explicit' : self.sp.track(track_id)['explicit'],

            }

        # Create a DataFrame for the additional track information
        tracks_info_df = pd.DataFrame(tracks_info_list, index=[0])


        # Merge the track information DataFrame with the audio features DataFrame
        song_features_df = pd.merge(tracks_info_df, audio_features_df, on='id', how='inner')

        # Rearrange the columns of the DataFrame
        song_features_df = self.rearrange_columns(song_features_df)
        song_features_df['release_date'] = self.get_release_date(track_id)
        
        # Add release date if available
        return song_features_df

    def get_release_date(self, track_id):
        return self.sp.track(track_id)['album']['release_date']
    

    def get_id_type(self, id):
        try:
            track = self.sp.track(id)
            if track:
                return 'track'
        except:
            pass  # Track not found or an error occurred
        
        try:
            playlist = self.sp.playlist(id)
            if playlist:
                return 'playlist'
        except:
            pass  # Playlist not found or an error occurred

        return 'unknown'

    def rearrange_columns(self, df):
        """
        Rearrange the columns of a DataFrame according to a desired order.

        Parameters:
            df (pandas.DataFrame): The DataFrame to rearrange.

        Returns:
            pandas.DataFrame: The rearranged DataFrame.
        """
        # Define the desired order of columns
        columns_order = ['artist', 'name', 'id', 'date_added', 'popularity', 'duration_ms', 'danceability', 'energy', 'key', 
                         'loudness', 'mode', 'speechiness', 'acousticness', 'instrumentalness', 
                         'liveness', 'valence', 'tempo', 'time_signature']

        # Add missing columns with default value 0
        for column in columns_order:
            if column not in df.columns:
                df[column] = 0

        # Reorder the columns
        df = df[columns_order]

        return df

    def predict(self, data_entry, choice, model, scaler, label_encoder, X_train):
        # Check if model and label encoder are loaded
        #Get song features or analyze playlist based on int_choice
        if (choice == 'track'):
            data = self.get_song_features(data_entry)
            release_date = data['release_date']
            data.drop('release_date', axis=1, inplace=True)
        elif (choice == 'playlist'):
            data = self.analyze_playlist(data_entry)
            
        
        # Create a DataFrame from the data
        data_df = pd.DataFrame(data)
        
        # One-hot encode categorical features
        categorical_features = ['key', 'mode', 'time_signature']
        data_df = pd.get_dummies(data, columns=categorical_features)
        
        # Add missing columns to the data DataFrame
        for col in X_train.columns:
            if col not in data.columns:
                data_df[col] = 0
        
        # Reorder the columns to match the training data
        data_df = data_df[X_train.columns]
        
        # Scale the data using the scaler
        data_scaled = scaler.transform(data_df)
        
        # Predict the genre labels using the model
        predictions_encoded = model.predict(data_scaled)
        
        # Decode the predicted labels using the label encoder
        predictions_decoded = label_encoder.inverse_transform(predictions_encoded)
        
        if (choice == 'track'):
            data['release_date'] = release_date
            data.drop('date_added', axis=1, inplace=True)
            
        # Add the predicted genre labels to the data DataFrame
        data['track_genre'] = predictions_decoded
        
        # Return the data DataFrame with predicted genre labels
        return data
     