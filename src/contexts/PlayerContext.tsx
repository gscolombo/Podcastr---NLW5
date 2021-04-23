import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    timeString: string;
    url: string;
}

type PlayerContextData = {
    episodes: Array<Episode>;
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    play: (episode: Episode) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    playNext: () => void;
    playPrev: () => void;
    setPlayingState: (state: boolean) => void;
    playList: (list: Episode[], index: number) => void;
    clearPlayerState: () => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProp = {children: ReactNode} 

export function PlayerContextProvider({ children } : PlayerContextProviderProp){
    const [episodes, setEpisode] = useState([]);
    const [currentEpisodeIndex, setEpisodeIndex] = useState(0);
    const [isPlaying, togglePlayingState] = useState(false); 
    const [isLooping, toggleLoopingState] = useState(false); 
    const [isShuffling, toggleShuffleState] = useState(false); 
    
    function play(episode: Episode) {
      setEpisode([episode]);
      setEpisodeIndex(0);
      togglePlayingState(true);
    }

    function playList(list: Episode[], index: number){
      setEpisode(list);
      setEpisodeIndex(index);
      togglePlayingState(true);
    }

    const hasNext = isShuffling || currentEpisodeIndex + 1 < episodes.length;
    const hasPrevious = currentEpisodeIndex - 1 >= 0;

    function playNext(){
      if (isShuffling) {
        const randomNextIndex = Math.floor(Math.random() * episodes.length);
        setEpisodeIndex(randomNextIndex);
      } else if (hasNext)
        setEpisodeIndex(currentEpisodeIndex + 1);
    }

    function playPrev(){
      if (hasPrevious)
        setEpisodeIndex(currentEpisodeIndex - 1);
    }
    
    // Play - Pause
    function togglePlay(){
      togglePlayingState(!isPlaying);
    }
  
    function setPlayingState(state) {
      togglePlayingState(state);
    }

    // Looping
    function toggleLoop(){
      toggleLoopingState(!isLooping);
    }

    // Shuffling
    function toggleShuffle(){
      toggleShuffleState(!isShuffling);
    }

    function clearPlayerState(){
      setEpisode([]);
      setEpisodeIndex(0);
    }

    
    return (
        <PlayerContext.Provider 
          value={
                  {episodes, 
                  currentEpisodeIndex, 
                  isPlaying, 
                  play, 
                  togglePlay, 
                  setPlayingState,
                  playList,
                  playNext,
                  playPrev,
                  hasNext,
                  hasPrevious,
                  isLooping,
                  toggleLoop,
                  toggleShuffle,
                  isShuffling,
                  clearPlayerState}
                }>
          {children}
        </PlayerContext.Provider>
    )
}

export function usePlayer(){
  return useContext(PlayerContext);
}