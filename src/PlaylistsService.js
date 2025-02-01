const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongs(playlistId) {
    const query = {
      text: `SELECT p.id AS playlist_id, p.name AS playlist_name,
            s.id AS song_id, s.title AS song_title, s.performer AS song_performer
            FROM playlists p
            LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
            LEFT JOIN songs s ON ps.song_id = s.id
            WHERE p.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    const playlist = {
      id: result.rows[0].playlist_id,
      name: result.rows[0].playlist_name,
      songs: result.rows
        .filter((row) => row.song_id !== null)
        .map((row) => ({
          id: row.song_id,
          title: row.song_title,
          performer: row.song_performer,
        })),
    };

    return { playlist };
  }
}

module.exports = PlaylistsService;
