/**
 * Builds the iframe `src` for Vimeo embeds used across SphereAI.
 * Use this for every new Vimeo embed so player chrome stays consistent.
 *
 * Hides: title overlay, uploader byline/portrait, badge, Vimeo logo, Chromecast,
 * PiP, AirPlay, transcript UI. Attempts to disable in-player sharing (`sharing=0`);
 * like / watch-later may still require the video owner’s embed settings on vimeo.com.
 *
 * Keeps: playback controls (play/pause, scrub, volume, fullscreen where supported).
 */
export function buildVimeoEmbedSrc(videoId: string): string {
  const params = new URLSearchParams({
    badge: "0",
    autopause: "0",
    byline: "0",
    portrait: "0",
    title: "0",
    vimeo_logo: "0",
    chromecast: "0",
    pip: "0",
    airplay: "0",
    transcript: "0",
    chapters: "0",
    controls: "1",
    fullscreen: "1",
    progress_bar: "1",
    volume: "1",
    keyboard: "1",
    playsinline: "1",
    /** Request no share affordances in the player (honored when Vimeo / plan allows). */
    sharing: "0",
    player_id: "0",
    app_id: "58479",
  });

  return `https://player.vimeo.com/video/${encodeURIComponent(videoId)}?${params.toString()}`;
}
