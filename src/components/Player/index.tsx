import Image from 'next/image';
import Head from 'next/head';

import { useRef, useEffect, useState } from 'react'

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { usePlayer } from '../../contexts/PlayerContext'
import styles from './styles.module.scss'
import { convertDurationToTimeString } from '../../utils/convertNumber';

export function Player(){
    const audioRef = useRef<HTMLAudioElement>(null);

    const { episodes, 
            currentEpisodeIndex, 
            isPlaying,
            togglePlay,
            setPlayingState,
            isLooping,
            playNext,
            playPrev,
            hasNext,
            hasPrevious,
            toggleLoop,
            toggleShuffle,
            isShuffling,
            clearPlayerState } = usePlayer();
    
    const [progress, setProgress] = useState(0);

    function checkProgress(episode){
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            const seconds = Math.floor(audioRef.current.currentTime);
            setProgress(seconds);
        })
    }

    function handleSlider(amount: number){
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleNextEpisode(){
        if (hasNext){
            playNext()
        } else {
            clearPlayerState();
        }
    }
    
    useEffect(() => {
        if (audioRef.current){
            isPlaying ? audioRef.current.play() : audioRef.current.pause();
        }
    }, [isPlaying])
    
    const episode = episodes[currentEpisodeIndex];

    return (
        <div className={styles.playerContainer}>
            <Head>
                <title>Home | Podcastr - {episode ? episode.title : ''}</title>
            </Head>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora</strong>
            </header>


            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image 
                    width={592} 
                    height={592} 
                    src={episode.thumbnail} 
                    objectFit="cover" 
                    objectPosition="left"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            
            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        { episode ? 
                        ( 
                        <Slider
                        max={episode.duration}
                        value={progress}
                        onChange={handleSlider}
                        trackStyle={{backgroundColor: '#84d361'}} 
                        railStyle={{backgroundColor: '#9F75FF'}}
                        handleStyle={{borderColor: '#84d361', borderWidth: 4}}
                        />
                        ) : <div className={styles.emptySlider} />}
                    </div>
                    <span>{episode ? episode.timeString : '00:00:00'}</span>
                </div>

               { episode && (
                    <audio 
                    src={episode.url} 
                    ref={audioRef} 
                    autoPlay
                    loop={isLooping} 
                    onEnded={handleNextEpisode}
                    onPlay={() => setPlayingState(true)} 
                    onPause={() => setPlayingState(false)}
                    onLoadedMetadata={checkProgress}
                    />
               )}

                <div className={styles.buttons}>
                    <button 
                    type="button" 
                    onClick={toggleShuffle}
                    disabled={!episode || episodes.length === 1}
                    className={isShuffling ? styles.active : ''}>
                        <img src="/shuffle.svg" alt="Aleatório"/>
                    </button>
                    <button type="button" onClick={playPrev} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button 
                    className={styles.playButton} 
                    type="button" 
                    disabled={!episode}
                    onClick={togglePlay}
                    >
                        { isPlaying ? 
                            <img src='/pause.svg' alt="Tocar"/>
                          : <img src='/play.svg' alt="Pausar"/>
                        }
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar próximo"/>
                    </button>
                    <button 
                    type="button" 
                    onClick={toggleLoop} 
                    disabled={!episode}
                    className={isLooping ? styles.active : ''}>
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    )
}