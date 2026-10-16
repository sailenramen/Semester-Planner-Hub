import { SpotifyEmbed } from "./storage";

/**
 * Shared pieces of the study-music feature.
 *
 * Spotify's Embed is a plain iframe: the link alone decides what plays, so no
 * API key, account or backend is involved. Anything Spotify's own Share menu
 * copies is accepted, as is a bare ID.
 */
const SPOTIFY_LINK_PATTERN =
  /(?:open\.spotify\.com\/(?:intl-[a-z-]+\/)?|spotify:)(playlist|album|track|artist|episode|show)[/:]([A-Za-z0-9]{22})(?![A-Za-z0-9])/;

const SPOTIFY_ID_PATTERN = /^[A-Za-z0-9]{22}$/;

// Two official editorial playlists, both confirmed live, that suit a study
// session; anything else can be pasted into the field on the card.
export const DEFAULT_STUDY_MUSIC: SpotifyEmbed = {
  type: "playlist",
  id: "37i9dQZF1DWZeKCadgRdKQ",
};

export const STUDY_MUSIC_PRESETS: { label: string; embed: SpotifyEmbed }[] = [
  { label: "Deep Focus", embed: DEFAULT_STUDY_MUSIC },
  { label: "lofi beats", embed: { type: "playlist", id: "37i9dQZF1DWWQRwui0ExPn" } },
];

export function parseSpotifyLink(value: string): SpotifyEmbed | null {
  const trimmed = value.trim();

  const match = trimmed.match(SPOTIFY_LINK_PATTERN);
  if (match) {
    return { type: match[1] as SpotifyEmbed["type"], id: match[2] };
  }

  // A bare ID carries no type, so the most common case is assumed.
  if (SPOTIFY_ID_PATTERN.test(trimmed)) {
    return { type: "playlist", id: trimmed };
  }

  return null;
}

export function spotifyEmbedUrl(embed: SpotifyEmbed, isDark: boolean): string {
  return `https://open.spotify.com/embed/${embed.type}/${embed.id}?utm_source=generator&theme=${
    isDark ? 0 : 1
  }`;
}

/**
 * The compact embed height. The player is docked in the corner of every page so
 * it can keep playing while the student works, so it stays small on purpose.
 */
export const SPOTIFY_PLAYER_HEIGHT = 152;
