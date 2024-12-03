![alt text](/react_app/public/logot4.png)

Trading Fours is your own personalized Spotify recommendation engine. 

**Important Update**: (I sadly took Trading Fours down on 12/03/2024, as it was rendered no longer functional when Spotify [deprecated](https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api) some core API endpoints I was using to get track features: (Audio Features & Related Artists)

- Search for a playlist or song, or browse your own library of saved playlists directly on the site, and Trading Fours will recommend alike tracks based on genre & track attributes
- Its thinking is influenced by what you have been listening to as of late, and will use that data to tailor the songs it recommends to you
- Behind the scenes, user and song info is being safely handled and stored using MySQL, and the bulk of the recommendations is being done via Python, where playlist / track data is being processed and computed in a ~45 dimensional space against a dataset of over 200,000+ songs (and growing!) to provide the best recommendations

## Showcase 
Video:

[![YouTube Video Demo](https://github.com/user-attachments/assets/b10b195e-9931-4f60-8f27-472a6f421d10)](https://www.youtube.com/watch?v=sx5btkY24hQ)
![t4-2](https://github.com/user-attachments/assets/4c156f4c-ce57-4df9-a797-24af25525b14)




## Contact

    Email: wangstanley910@gmail.com
    University Email: stanley.wang@mail.mcgill.ca
    LinkedIn: https://www.linkedin.com/in/stanley-utf8/

## Data Sources

The initial dataframe of ~200,000 songs was collected and altered from the following:

- [Spotify Tracks Dataset](https://www.kaggle.com/datasets/maharshipandya/-spotify-tracks-dataset)
- [Ultimate Spotify Tracks DB](https://www.kaggle.com/datasets/zaheenhamidani/ultimate-spotify-tracks-db)

However, the dataframe is continually updated by playlists and tracks that users enter!

Logo Notes by: <a href="https://www.freepik.com/free-vector/illustration-set-music-note-icons_2582736.htm#query=music%20note%20svg&position=12&from_view=keyword&track=ais_user&uuid=d09becc7-341a-4a7c-9fac-31370426cbc0">rawpixel.com</a>

___

Thank you, to anyone who checked out this project! It took me the better half of a year from start to finish, and I am incredibly proud of it. 
