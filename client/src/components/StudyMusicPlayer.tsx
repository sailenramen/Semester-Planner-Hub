import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { Music } from "lucide-react";
import { getStudyMusic, setStudyMusic, getTheme, SpotifyEmbed } from "@/lib/storage";
import {
  DEFAULT_STUDY_MUSIC,
  SPOTIFY_PLAYER_HEIGHT,
  spotifyEmbedUrl,
} from "@/lib/studyMusic";

/**
 * The one Spotify player in the app.
 *
 * A page card could not keep playing: leaving the page unmounts its iframe and
 * the music stops. This player is mounted once in the app shell, above the
 * routes, so moving between the dashboard, a task and the calendar never
 * touches it. The card on the pages is only a chooser for what this plays.
 *
 * The iframe is deliberately never unmounted, re-keyed or re-parented — moving
 * an iframe in the DOM reloads it — and the source is memoised on the chosen
 * playlist alone, so an unrelated re-render or a theme change cannot restart it.
 */

interface StudyMusicValue {
  embed: SpotifyEmbed;
  chooseEmbed: (embed: SpotifyEmbed) => void;
}

const StudyMusicContext = createContext<StudyMusicValue | null>(null);

/** The chosen playlist and a way to change it, for the card to drive. */
export function useStudyMusic(): StudyMusicValue {
  const value = useContext(StudyMusicContext);
  if (!value) {
    throw new Error("useStudyMusic must be used inside StudyMusicProvider");
  }
  return value;
}

export function StudyMusicProvider({ children }: { children: ReactNode }) {
  // Whatever was chosen last, defaulting to the first preset.
  const [embed, setEmbed] = useState<SpotifyEmbed>(() => getStudyMusic() ?? DEFAULT_STUDY_MUSIC);

  const chooseEmbed = (next: SpotifyEmbed) => {
    setEmbed(next);
    setStudyMusic(next);
  };

  const src = useMemo(() => spotifyEmbedUrl(embed, getTheme() === "dark"), [embed]);

  return (
    <StudyMusicContext.Provider value={{ embed, chooseEmbed }}>
      {children}

      <div
        className="fixed bottom-4 right-4 z-40 w-80 max-w-[calc(100vw-2rem)] rounded-xl border bg-card text-card-foreground shadow-lg"
        data-testid="study-music-player"
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b">
          <Music className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Study music</span>
          <span className="text-xs text-muted-foreground ml-auto">Keeps playing</span>
        </div>
        <iframe
          title="Spotify player"
          src={src}
          width="100%"
          height={SPOTIFY_PLAYER_HEIGHT}
          frameBorder={0}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="rounded-b-xl block"
        />
      </div>
    </StudyMusicContext.Provider>
  );
}
