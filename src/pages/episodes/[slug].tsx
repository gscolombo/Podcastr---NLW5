import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { usePlayer } from '../../contexts/PlayerContext';

import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertNumber';

import styles from './episode.module.scss';

type Episode = {
    id: string;
    title: string;
    description: string;
    members: string;
    duration: number;
    timeString: string;
    publishedAt: string;
    url: string;
    thumbnail: string;
}

export default function Episode(episode: Episode){

    const { play } = usePlayer();

    return (
        <div className={styles.episode}>
            <Head>
                <title>{episode.title} | Podcastr</title>
            </Head>

            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar"/>
                    </button>
                </Link>
                <Image 
                width={700}
                height={160}
                src={episode.thumbnail}
                objectFit="cover"
                />
                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Tocar episódio"/>
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.timeString}</span>
            </header>

            <div className={styles.description} 
            dangerouslySetInnerHTML={{__html: episode.description}} />
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: "blocking",
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { slug } = context.params;
    const { data } = await api.get(`episodes/${slug}`);

    const episode = {
        id: data.id,
        title: data.title,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBR}),
        duration: Number(data.file.duration),
        timeString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
        thumbnail: data.thumbnail,
      }

    return {
        props: episode,
        revalidate: 3600 * 24,
    }
}