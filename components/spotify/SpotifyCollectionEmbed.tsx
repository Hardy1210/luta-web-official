type SpotifyArtistEmbedProps = {
  artistId: string;
  height?: number;
};

export function SpotifyCollectionEmbed({
  artistId,
  height = 352,
}: SpotifyArtistEmbedProps) {
  return (
    <iframe
      src={`https://open.spotify.com/embed/artist/${artistId}`}
      width="100%"
      height={height}
      style={{
        borderRadius: '12px',
        border: '0',
      }}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className="max-w-[40rem]"
    />
  );
}
