type SpotifyTrackEmbedProps = {
  trackId: string;
  height?: number;
};

export function SpotifyTrackEmbed({
  trackId,
  height = 152,
}: SpotifyTrackEmbedProps) {
  return (
    <iframe
      src={`https://open.spotify.com/embed/track/${trackId}`}
      width="100%"
      height={height}
      style={{
        borderRadius: '12px',
        border: '0',
      }}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className="max-w-[20rem]"
    />
  );
}
