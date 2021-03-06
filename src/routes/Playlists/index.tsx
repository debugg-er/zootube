import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import IPlaylist from '@interfaces/IPlaylist';
import playlistApi from '@api/playlistApi';
import { useSetLoading } from '@contexts/LoadingContext';

import Sequence from '@utils/Sequence';
import HorizontalPlaylist from '@components/HorizontalPlaylist';
import NotFound from '@components/NotFound';
import HorizontalPlaylistSkeleton from '@components/HorizontalPlaylist/HorizontalPlaylistSkeleton';

import './Playlists.css';

const step = 10;

function Playlists() {
  const [playlists, setPlaylists] = useState<Array<IPlaylist>>([]);
  const hasMore = useRef(true);

  const setLoading = useSetLoading();

  useEffect(() => {
    hasMore.current = true;
    setLoading(true);
    playlistApi
      .getPlaylists({ offset: 0, limit: step })
      .then((_playlists) => {
        if (_playlists.length !== step) hasMore.current = false;
        setPlaylists(_playlists);
      })
      .finally(() => setLoading(false));
  }, [setLoading]);

  async function loadPlaylists() {
    const _playlists = await playlistApi.getPlaylists({
      offset: playlists.length,
      limit: step,
    });
    if (_playlists.length !== step) hasMore.current = false;
    setPlaylists([...playlists, ..._playlists]);
  }

  return (
    <InfiniteScroll
      className="Playlists App-HorizontalPlaylistGrid"
      dataLength={playlists.length}
      next={loadPlaylists}
      hasMore={hasMore.current}
      endMessage={<NotFound text="Không còn playlist để hiển thị" horizontal />}
      loader={<Sequence Component={HorizontalPlaylistSkeleton} length={8} />}
      scrollableTarget="Main"
    >
      {playlists.map((playlist) => (
        <HorizontalPlaylist key={playlist.id} playlist={playlist} />
      ))}
    </InfiniteScroll>
  );
}

export default Playlists;
