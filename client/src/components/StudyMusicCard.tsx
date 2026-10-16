import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useStudyMusic } from "@/components/StudyMusicPlayer";
import { parseSpotifyLink, STUDY_MUSIC_PRESETS } from "@/lib/studyMusic";

interface StudyMusicCardProps {
  // The Study page's sidebar cards title themselves at text-lg, while the
  // Dashboard's cards use text-base.
  titleClassName?: string;
}

/**
 * Chooses what the docked player plays. The player itself is mounted once in
 * the app shell, so the music keeps going when this card is left behind.
 */
export function StudyMusicCard({ titleClassName = "text-base" }: StudyMusicCardProps) {
  const { embed, chooseEmbed } = useStudyMusic();
  const [musicInput, setMusicInput] = useState("");
  const [musicError, setMusicError] = useState(false);

  const applyMusicLink = () => {
    const parsed = parseSpotifyLink(musicInput);

    // An empty field losing focus is not an error, only an unusable link is.
    if (!parsed) {
      if (musicInput.trim()) setMusicError(true);
      return;
    }

    chooseEmbed(parsed);
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
                embed.type === preset.embed.type && embed.id === preset.embed.id
                  ? "default"
                  : "outline"
              }
              size="sm"
              className="flex-1"
              onClick={() => {
                chooseEmbed(preset.embed);
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
        <p className="text-xs text-muted-foreground">
          Plays in the corner, and keeps playing while you work.
        </p>
      </CardContent>
    </Card>
  );
}
