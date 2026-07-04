"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type TrackId = "rain" | "forest" | "ocean" | "campfire" | "lofi";

const TRACKS: { id: TrackId; src: string; icon: string }[] = [
  { id: "rain", src: "/sounds/rain.mp3", icon: "🌧️" },
  { id: "forest", src: "/sounds/forest.mp3", icon: "🌲" },
  { id: "ocean", src: "/sounds/ocean.mp3", icon: "🌊" },
  { id: "campfire", src: "/sounds/campfire.mp3", icon: "🔥" },
  { id: "lofi", src: "/sounds/lofi.mp3", icon: "🎵" },
];

export function AmbientPlayer() {
  const t = useTranslations("breathingTool.ambient");
  const [trackId, setTrackId] = useState<TrackId | null>(null);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  function handleSelect(id: TrackId) {
    setTrackId((current) => (current === id ? null : id));
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !trackId) return;
    audio.play().catch(() => {});
  }, [trackId]);

  const currentTrack = TRACKS.find((track) => track.id === trackId);

  return (
    <div className="w-full max-w-xs rounded-xl border border-brand-gray px-4 py-3">
      <p className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-foreground/50">
        {t("title")}
      </p>
      <ul className="flex flex-col gap-1">
        {TRACKS.map((track) => (
          <li key={track.id}>
            <button
              onClick={() => handleSelect(track.id)}
              aria-pressed={trackId === track.id}
              className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                trackId === track.id
                  ? "border-brand-yellow bg-brand-yellow/10 text-foreground"
                  : "border-transparent text-foreground/70 hover:bg-brand-gray/20"
              }`}
            >
              <span aria-hidden="true">{track.icon}</span>
              <span>{t(`tracks.${track.id}`)}</span>
              {trackId === track.id && <span className="ml-auto text-xs text-brand-yellow">{t("playing")}</span>}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-2">
        <label htmlFor="ambient-volume" className="text-xs text-foreground/50">
          {t("volumeLabel")}
        </label>
        <input
          id="ambient-volume"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1"
        />
      </div>
      {currentTrack && <audio ref={audioRef} src={currentTrack.src} loop autoPlay={false} />}
    </div>
  );
}
