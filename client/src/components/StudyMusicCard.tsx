import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getStudyMusic, setStudyMusic, getTheme, SpotifyEmbed } from "@/lib/storage";

// Spotify's Embed is a plain iframe: the link alone decides what plays, so no
// API key, account or backend is involved. Anything Spotify's own Share menu
// copies is accepted, as is a bare ID.
const SPOTIFY_LINK_PATTERN =
  /(?:open\.spotify\.com\/(?:intl-[a-z-]+\/)?|spotify:)(playlist|album|track|artist|episode|show)[/:]([A-Za-z0-9]{22})(?![A-Za-z0-9])/;

const SPOTIFY_ID_PATTERN = /^[A-Za-z0-9]{22}$/;

// Two official editorial playlists, both confirmed live, that suit a study
// session; anything else can be pasted into the field below.
const DEFAULT_STUDY_MUSIC: SpotifyEmbed = {
  type: "playlist",
  id: "37i9dQZF1DWZeKCadgRdKQ",
};

const STUDY_MUSIC_PRESETS: { label: string; embed: SpotifyEmbed }[] = [
  { label: "Deep Focus", embed: DEFAULT_STUDY_MUSIC },
  { label: "lofi beats", embed: { type: "playlist", id: "37i9dQZF1DWWQRwui0ExPn" } },
];

function parseSpotifyLink(value: string): SpotifyEmbed | null {
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

function spotifyEmbedUrl(embed: SpotifyEmbed, isDark: boolean): string {
  return `https://open.spotify.com/embed/${embed.type}/${embed.id}?utm_source=generator&theme=${
    isDark ? 0 : 1
  }`;
}

// The embed's own layout: compact for a single track, shorter for an episode,
// full height for the collections.
function spotifyEmbedHeight(type: SpotifyEmbed["type"]): number {
  if (type === "track") return 152;
  if (type === "episode") return 232;
  return 352;
}

interface StudyMusicCardProps {
  // The Study page's sidebar cards title themselves at text-lg, while the
  // Dashboard's cards use text-base.
  titleClassName?: string;
}

export function StudyMusicCard({ titleClassName = "text-base" }: StudyMusicCardProps) {
  // Whatever was chosen last, defaulting to the first preset.
  const [music, setMusic] = useState<SpotifyEmbed>(() => getStudyMusic() ?? DEFAULT_STUDY_MUSIC);
  const [musicInput, setMusicInput] = useState("");
  const [musicError, setMusicError] = useState(false);

  const applyMusicLink = () => {
    const parsed = parseSpotifyLink(musicInput);

    // An empty field losing focus is not an error, only an unusable link is.
    if (!parsed) {
      if (musicInput.trim()) setMusicError(true);
      return;
    }

    setMusic(parsed);
    setStudyMusic(parsed);
    setMusicInput("");
    setMusicError(false);
  };

  return (
    <Card data-testid="card-study-music">
      <CardHeader>
        <CardTitle className={titleClassName}>Study Music</CardTitle>
        <CardDescription>Pick a playlist or paste your own link.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          {STUDY_MUSIC_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              variant={
                music.type === preset.embed.type && music.id === preset.embed.id
                  ? "default"
                  : "outline"
              }
              size="sm"
              className="flex-1"
              onClick={() => {
                setMusic(preset.embed);
                setStudyMusic(preset.embed);
                setMusicError(false);
              }}
              data-testid={`button-study-music-${preset.embed.id}`}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <Input
          value={musicInput}
          onChange={(e) => {
            setMusicInput(e.target.value);
            if (musicError) setMusicError(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") applyMusicLink();
          }}
          onBlur={applyMusicLink}
          placeholder="Paste a Spotify link"
          aria-label="Spotify link"
          className="h-8 text-xs"
          data-testid="input-study-music"
        />
        {musicError && (
          <p className="text-sm text-destructive" role="alert">
            That doesn't look like a Spotify link.
          </p>
        )}
        <iframe
          title="Spotify player"
          src={spotifyEmbedUrl(music, getTheme() === "dark")}
          width="100%"
          height={spotifyEmbedHeight(music.type)}
          frameBorder={0}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-xl"
        />
      </CardContent>
    </Card>
  );
}
