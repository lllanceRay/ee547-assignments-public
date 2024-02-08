const axios = require("axios");
const { EntityNotFoundError } = require("./error");
// Reference: https://developer.spotify.com/documentation/web-api

const ClientId = "9b83cc943342402cb7c0f74c3455a1f6"; // Replace with your client id
const ClientSecret = "ff219ffb8ef248909652cfa706031ca3";

class SpotifyApi {
  constructor(accessToken) {
    // complete me
    this.accessToken = accessToken;
  }
  // static async getAccessToken(clientId, clientSecret) {
//     const bearer = Buffer.from(`${clientId}:${clientSecret}`).toString(
//       "base64"
//     );
// 
//     const { data: { access_token: accessToken } = {} } = await axios.post(
//       "https://accounts.spotify.com/api/token",
//       "grant_type=client_credentials",
//       {
//         headers: {
//           Authorization: `Basic ${bearer}`,
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );
//     return accessToken;
//   }

  static getAccessToken(clientId, clientSecret, callback) {
  const bearer = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const postData = querystring.stringify({ grant_type: 'client_credentials' });
  const options = {
      hostname: 'accounts.spotify.com',
      path: '/api/token',
      method: 'POST',
      headers: {
          Authorization: `Basic ${bearer}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
      }
  };

  const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
          try {
              const parsed = JSON.parse(data);
              callback(null, parsed.access_token);
          } catch (e) {
              callback(e, null);
          }
      });
  });

  req.on('error', (e) => {
      callback(e, null);
  });

  req.write(postData);
  req.end();
}


  async makeRequest(url, callback) {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      callback(null, response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        callback(new EntityNotFoundError("Entity not found"), null);
      } else {
        callback(error, null);
      }
    }
  }

  getAlbum(albumId, callback) {
    // web-api/reference/get-an-album
    const url = `https://api.spotify.com/v1/albums/${albumId}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      })
      .then((response) => {
        const albumData = response.data;
        const album = {
          albumId: albumData.id,
          artists: albumData.artists,
          genres: albumData.genres,
          name: albumData.name,
          imageUrl: albumData.images,
          releaseDate: albumData.release_date,
          tracks: albumData.tracks,
        };
        callback(null, album);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          callback(new EntityNotFoundError("Entity not found"), null);
        } else {
          callback(error, null);
        }
      });
  }
  searchAlbum(query, callback) {
    // web-api/reference/search
    const url = `https://api.spotify.com/v1/search?q=${query}&type=album`;
    this.makeRequest(url, (error, searchResults) => {
      if (error) {
        callback(error, null);
      } else {
        const albums =
          searchResults.albums?.items.map((album) => ({
            albumId: album.id,
            artists: album.artists,
            genres: album.genres,
            name: album.name,
            imageUrl: album.images[0]?.url || "",
            releaseDate: album.release_date,
            tracks: [], // You can populate this if needed
          })) || [];
        callback(null, albums);
      }
    });
  }
  getTrack(trackId, callback) {
    // web-api/reference/get-track
    const url = `https://api.spotify.com/v1/tracks/${trackId}`;
    this.makeRequest(url, (error, trackData) => {
      if (error) {
        callback(error, null);
      } else {
        const track = {
          albumId: trackData.album.id,
          artists: trackData.artists,
          durationMs: trackData.duration_ms,
          trackId: trackData.id,
          name: trackData.name,
          popularity: trackData.popularity,
          previewUrl: trackData.preview_url || "",
        };
        callback(null, track);
      }
    });
  }
  searchTrack(query, callback) {
    // web-api/reference/search
    const url = `https://api.spotify.com/v1/search?q=${query}&type=track`;
    this.makeRequest(url, (error, searchResults) => {
      if (error) {
        callback(error, null);
      } else {
        const tracks =
          searchResults.tracks?.items.map((track) => ({
            albumId: track.album.id,
            artists: track.artists,
            durationMs: track.duration_ms,
            trackId: track.id,
            name: track.name,
            popularity: track.popularity,
            previewUrl: track.preview_url || "",
          })) || [];
        callback(null, tracks);
      }
    });
  }
  getArtist(artistId, callback) {
    // web-api/reference/get-an-artist
    const url = `https://api.spotify.com/v1/artists/${artistId}`;
    this.makeRequest(url, (error, artistData) => {
      if (error) {
        callback(error, null);
      } else {
        const artist = artistData;
        callback(null, artist);
      }
    });
  }
  getArtistTopTracks(artistId, callback) {
    // web-api/reference/get-an-artists-top-tracks
    const url = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`;
    this.makeRequest(url, (error, topTracks) => {
      if (error) {
        callback(error, null);
      } else {
        const tracks =
          topTracks.tracks?.map((track) => ({
            albumId: track.album.id,
            artists: track.artists,
            durationMs: track.duration_ms,
            trackId: track.id,
            name: track.name,
            popularity: track.popularity,
            previewUrl: track.preview_url || "",
          })) || [];
        callback(null, tracks);
      }
    });
  }
  getPlaylist(playlistId, callback) {
    // web-api/reference/get-playlist
    const url = `https://api.spotify.com/v1/playlists/${playlistId}`;
    this.makeRequest(url, (error, playlistData) => {
      if (error) {
        callback(error, null);
      } else {
        const playlist = {
          description: playlistData.description,
          followers: playlistData.followers.total,
          playlistId: playlistData.id,
          imageUrl: playlistData.images[0]?.url || "",
          name: playlistData.name,
          owner: { userId: playlistData.owner.id }, // Assuming user info is not available here
          public: playlistData.public,
          tracks: playlistData.tracks.items.map((item) =>
            this.formatTrack(item.track)
          ),
        };
        callback(null, playlist);
      }
    });
  }
}
exports.SpotifyApi = SpotifyApi;
// const spotifyApi = new SpotifyApi({ ClientId: ClientSecret });
// console.log(ClientId);
// const albumId = "4aawyAB9vmqN3uQ7FjRGTy"; // Replace with a valid album ID
// spotifyApi.getAlbum(albumId, (error, album) => {
//   if (error) {
//     console.error("Error:", error);
//   } else {
//     console.log("Album:", album);
//   }
// });
