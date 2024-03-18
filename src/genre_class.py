import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

from spotify_client import SpotifyClient

class GenreClassifier:
    def __init__(self, data_path, spotify_client):
        self.data = pd.read_csv(data_path)
        self.lr_model = LogisticRegression(max_iter=500, class_weight='balanced', random_state=420, verbose=0) # Make random state 69
        self.rf_model = RandomForestClassifier(n_estimators=150, class_weight='balanced', random_state=69, verbose=0) # Make random state 69
        self.scaler = MinMaxScaler()
        self.label_encoder = LabelEncoder()
        self.sp = spotify_client

    def preprocess_data(self):
        categorical_features = ['key', 'mode', 'time_signature']
        self.data = pd.get_dummies(self.data, columns=categorical_features)  # One-hot encode categorical features

        # Encode the labels
        self.data['track_genre'] = self.label_encoder.fit_transform(self.data['track_genre'])  # Encode track_genre labels

    def train_test_split(self, test_size=0.2):
        # Define features and target
        X = self.data.drop(['track_id', 'artists', 'track_name', 'track_genre'], axis=1)  # Drop unnecessary columns from features
        y = self.data['track_genre']  # Set track_genre as the target variable
        
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(X, y, test_size=test_size, random_state=69, stratify=y)  # Split data into train and test sets with stratified sampling
        self.X_train_df = self.X_train.copy()  # Create a copy of X_train for saving the features
        self.scaler.fit(self.X_train)  # Fit the scaler on X_train
        self.X_train = self.scaler.transform(self.X_train)  # Scale X_train
        self.X_test = self.scaler.transform(self.X_test)  # Scale X_test

       

    def train_save_model(self):
        lr_model_filename = 'GenreClassModel/lr_model.joblib'  # Define the filename for the logistic regression model
        rf_model_filename = 'GenreClassModel/rf_model.joblib'  # Define the filename for the random forest model
        scaler_filename = 'GenreClassModel/scaler.joblib'  # Define the filename for the scaler
        encoder_filename = 'GenreClassModel/encoder.joblib'  # Define the filename for the label encoder
        features_filename = 'GenreClassModel/features.joblib'  # Define the filename for the features

        # Train and save the logistic regression model
        self.lr_model.fit(self.X_train, self.y_train)  # Train the logistic regression model
        joblib.dump(self.lr_model, lr_model_filename)  # Save the logistic regression model to a file
        print(f"Logistic Regression model saved to {lr_model_filename}")

        # Train and save the random forest model
        self.rf_model.fit(self.X_train, self.y_train)  # Train the random forest model
        joblib.dump(self.rf_model, rf_model_filename)  # Save the random forest model to a file
        print(f"Random Forest model saved to {rf_model_filename}")


        # Save scaler
        joblib.dump(self.scaler, scaler_filename)  # Save the scaler to a file
        print(f"Scaler saved to {scaler_filename}")

        # Save encoder 
        joblib.dump(self.label_encoder, encoder_filename)  # Save the label encoder to a file
        print(f"Label Encoder saved to {encoder_filename}")
        
        joblib.dump(self.X_train_df, features_filename)  # Save the features to a file
        print(f"Features saved to {features_filename}")

    def evaluate_all_models(self):
        self.evaluate_model(self.lr_model)
        self.evaluate_model(self.rf_model)

    def evaluate_model(self, model):
        # Predict labels using the model
        y_pred = model.predict(self.X_test)
        
        # Calculate evaluation metrics
        accuracy = accuracy_score(self.y_test, y_pred)  # Calculate accuracy
        precision = precision_score(self.y_test, y_pred, average='macro')  # Calculate precision using macro averaging
        recall = recall_score(self.y_test, y_pred, average='macro')  # Calculate recall using macro averaging
        f1 = f1_score(self.y_test, y_pred, average='macro')  # Calculate F1-score using macro averaging

        # Print evaluation results
        print(f"Model: {model.__class__.__name__}")
        print(f"Accuracy: {accuracy}")
        print(f"Precision: {precision}")
        print(f"Recall (R-score): {recall}")
        print(f"F1-score: {f1}")
            
    def load_model(self, model_choice=1):
        model_filenames = {
            0: 'GenreClassModel/lr_model.joblib',  # Filename for logistic regression model
            1: 'GenreClassModel/rf_model.joblib',  # Filename for random forest model
        }
        scaler_filename = 'GenreClassModel/scaler.joblib'  # Filename for scaler
        encoder_filename = 'GenreClassModel/encoder.joblib'  # Filename for label encoder
        features_filename = 'GenreClassModel/features.joblib'  # Filename for features

        if model_choice not in model_filenames:
            raise Exception(f"Invalid model choice. Available choices are: {list(model_filenames.keys())}")

        model_filename = model_filenames[model_choice]
        self.model = joblib.load(model_filename)  # Load the selected model
        #print(f"Model loaded from {model_filename}.")
        self.model.verbose = 0

        self.scaler = joblib.load(scaler_filename)  # Load the scaler
        #print(f"Scaler loaded from {scaler_filename}.")

        self.label_encoder = joblib.load(encoder_filename)  # Load the label encoder
        #print(f"Encoder loaded from {encoder_filename}.")

        self.X_train = joblib.load(features_filename)  # Load the features
        #print(f"Features loaded from {features_filename}.")

    def predict(self, data_entry):
        # Check if model and label encoder are loaded
        if not hasattr(self, 'model') or not hasattr(self, 'label_encoder'):
            raise Exception("Model and Label Encoder must be loaded before predicting")
        
        #Get song features or analyze playlist based on int_choice
        choice = self.sp.get_id_type(data_entry)
        if (choice == 'track'):
            data = self.sp.get_song_features(data_entry)
            release_date = data['release_date']
            data.drop('release_date', axis=1, inplace=True)
        elif (choice == 'playlist'):
            data = self.sp.analyze_playlist(data_entry)
            
        
        # Create a DataFrame from the data
        data_df = pd.DataFrame(data)
        
        # One-hot encode categorical features
        categorical_features = ['key', 'mode', 'time_signature']
        data_df = pd.get_dummies(data, columns=categorical_features)
        
        # Add missing columns to the data DataFrame
        for col in self.X_train.columns:
            if col not in data.columns:
                data_df[col] = 0
        
        # Reorder the columns to match the training data
        data_df = data_df[self.X_train.columns]
        
        # Scale the data using the scaler
        data_scaled = self.scaler.transform(data_df)
        
        # Predict the genre labels using the model
        predictions_encoded = self.model.predict(data_scaled)
        
        # Decode the predicted labels using the label encoder
        predictions_decoded = self.label_encoder.inverse_transform(predictions_encoded)
        
        if (choice == 'track'):
            data['release_date'] = release_date
            data.drop('date_added', axis=1, inplace=True)
            
        # Add the predicted genre labels to the data DataFrame
        data['track_genre'] = predictions_decoded
        
        # Return the data DataFrame with predicted genre labels
        return data


   