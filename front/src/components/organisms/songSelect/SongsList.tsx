import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../services/axiosInstance';
import { PiMicrophoneStageFill } from 'react-icons/pi';

interface Song {
  id: number;
  coverImage: string;
  title: string;
  singer: string;
}

interface ApiResponse {
  code: string;
  message: string;
  data: Song[];
}

interface SongListProps {
  onSongSelect: (song: Song) => void;
  selectedSongs: Song[];
}

const SongList: React.FC<SongListProps> = ({ onSongSelect, selectedSongs }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<ApiResponse>('/api/base-data/initial');
        if (response.data.code === 'BD100') {
          setSongs(response.data.data);
        } else {
          setError('Failed to fetch songs: Unexpected response code');
        }
      } catch (error) {
        console.error('Failed to fetch songs:', error);
        setError('Failed to fetch songs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-2 p-2">
      {songs.map(song => {
        const isSelected = selectedSongs.some(s => s.id === song.id);
        return (
          <div
            key={song.id}
            className="cursor-pointer relative aspect-square"
            onClick={() => onSongSelect(song)}
          >
            <div
              className={`w-full h-full rounded-lg overflow-hidden ${
                isSelected ? 'ring-2 ring-neutral brightness-100' : 'brightness-75'
              }`}
            >
              <img src={song.coverImage} alt={song.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1">
                <h3 className="font-bold text-xs text-white truncate">{song.title}</h3>
                <p className="text-xxs text-gray-300 truncate">{song.singer}</p>
              </div>
            </div>
            {isSelected && (
              <div className="absolute -top-2 -right-2 bg-neutral rounded-full p-1.5 shadow-lg">
                <PiMicrophoneStageFill className="text-white text-lg" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SongList;
