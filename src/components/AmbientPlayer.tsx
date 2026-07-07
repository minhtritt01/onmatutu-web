"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import YouTube, { type YouTubePlayer } from "react-youtube";
import { getRelaxTracks, type RelaxTrack } from "@/lib/relax-content";
import { parseYoutubeId, searchYoutube, type YoutubeSearchResult } from "@/lib/youtube";

type TrackId = "rain" | "forest" | "ocean" | "campfire" | "lofi";
type SearchStatus = "idle" | "loading" | "error" | "empty" | "unavailable";

const SEARCH_DEBOUNCE_MS = 400;
const SEARCH_MIN_CHARS = 2;

const TRACKS: { id: TrackId; src: string; icon: string }[] = [
  { id: "rain", src: "/sounds/rain.mp3", icon: "🌧️" },
  { id: "forest", src: "/sounds/forest.mp3", icon: "🌲" },
  { id: "ocean", src: "/sounds/ocean.mp3", icon: "🌊" },
  { id: "campfire", src: "/sounds/campfire.mp3", icon: "🔥" },
  { id: "lofi", src: "/sounds/lofi.mp3", icon: "🎵" },
];

export function AmbientPlayer() {
  const t = useTranslations("breathingTool.ambient");
  const locale = useLocale();
  const [trackId, setTrackId] = useState<TrackId | null>(null);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [youtubeTracks, setYoutubeTracks] = useState<RelaxTrack[]>([]);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [pasteValue, setPasteValue] = useState("");
  const [pasteError, setPasteError] = useState(false);
  const [pastedTracks, setPastedTracks] = useState<{ videoId: string; title: string }[]>([]);
  const youtubePlayerRef = useRef<YouTubePlayer | null>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<YoutubeSearchResult[]>([]);
  const [searchStatus, setSearchStatus] = useState<SearchStatus>("idle");
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    getRelaxTracks().then(setYoutubeTracks);
  }, []);

  useEffect(() => {
    youtubePlayerRef.current?.setVolume(volume * 100);
  }, [volume]);

  function handleSelect(id: TrackId) {
    setTrackId((current) => (current === id ? null : id));
    setYoutubeVideoId(null);
  }

  function handleSelectYoutube(videoId: string) {
    setYoutubeVideoId((current) => (current === videoId ? null : videoId));
    setTrackId(null);
    setPasteError(false);
  }

  function handlePasteSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseYoutubeId(pasteValue);
    if (!parsed) {
      setPasteError(true);
      return;
    }
    handleSelectYoutube(parsed);
    setPasteValue("");

    if (pastedTracks.some((track) => track.videoId === parsed)) return;
    setPastedTracks((current) => [...current, { videoId: parsed, title: parsed }]);
    fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${parsed}`)}&format=json`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.title) return;
        setPastedTracks((current) =>
          current.map((track) => (track.videoId === parsed ? { ...track, title: data.title } : track)),
        );
      })
      .catch(() => {});
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !trackId) return;
    audio.play().catch(() => {});
  }, [trackId]);

  function runSearch(query: string) {
    setSearchStatus("loading");
    searchYoutube(query)
      .then((results) => {
        setSearchResults(results);
        setSearchStatus(results.length === 0 ? "empty" : "idle");
      })
      .catch((err) => {
        setSearchStatus(err instanceof Error && err.message === "not_configured" ? "unavailable" : "error");
      });
  }

  function handleSearchQueryChange(value: string) {
    setSearchQuery(value);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    const trimmed = value.trim();
    if (trimmed.length < SEARCH_MIN_CHARS) {
      setSearchStatus("idle");
      setSearchResults([]);
      return;
    }
    searchDebounceRef.current = setTimeout(() => runSearch(trimmed), SEARCH_DEBOUNCE_MS);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    const trimmed = searchQuery.trim();
    if (trimmed.length < SEARCH_MIN_CHARS) return;
    runSearch(trimmed);
  }

  function handleSelectSearchResult(result: YoutubeSearchResult) {
    handleSelectYoutube(result.videoId);
    if (pastedTracks.some((track) => track.videoId === result.videoId)) return;
    setPastedTracks((current) => [...current, { videoId: result.videoId, title: result.title }]);
  }

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

  const currentTrack = TRACKS.find((track) => track.id === trackId);

  return (
    <div className="w-full max-w-xs rounded-xl border border-brand-gray bg-background/80 px-4 py-3 backdrop-blur-sm">
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

      {youtubeTracks.length > 0 && (
        <>
          <p className="mt-4 mb-2 text-center text-xs font-medium uppercase tracking-wide text-foreground/50">
            {t("youtubeTitle")}
          </p>
          <ul className="flex flex-col gap-1">
            {youtubeTracks.map((track) => (
              <li key={track.id}>
                <button
                  onClick={() => handleSelectYoutube(track.youtubeId)}
                  aria-pressed={youtubeVideoId === track.youtubeId}
                  className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                    youtubeVideoId === track.youtubeId
                      ? "border-brand-yellow bg-brand-yellow/10 text-foreground"
                      : "border-transparent text-foreground/70 hover:bg-brand-gray/20"
                  }`}
                >
                  <span aria-hidden="true">{track.icon ?? "🎵"}</span>
                  <span>{locale === "vi" ? track.labelVi : track.labelEn}</span>
                  {youtubeVideoId === track.youtubeId && (
                    <span className="ml-auto text-xs text-brand-yellow">{t("playing")}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-3">
        <button
          type="button"
          onClick={() => setSearchOpen((v) => !v)}
          aria-pressed={searchOpen}
          className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
            searchOpen
              ? "border-brand-yellow bg-brand-yellow/10 text-foreground"
              : "border-brand-gray text-foreground/70 hover:bg-brand-gray/20"
          }`}
        >
          <span aria-hidden="true">🔍</span>
          <span>{t("searchLabel")}</span>
        </button>

        {searchOpen && (
          <div className="mt-2">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchQueryChange(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="flex-1 rounded-lg border border-brand-gray bg-background/60 px-2 py-1 text-sm text-foreground placeholder:text-foreground/40"
              />
              <button
                type="submit"
                className="rounded-lg border border-brand-gray px-3 py-1 text-sm text-foreground/70 hover:bg-brand-gray/20"
              >
                {t("searchSubmit")}
              </button>
            </form>

            {searchStatus === "loading" && (
              <p className="mt-2 text-xs text-foreground/50">{t("searchLoading")}</p>
            )}
            {searchStatus === "error" && <p className="mt-2 text-xs text-red-500">{t("searchError")}</p>}
            {searchStatus === "empty" && <p className="mt-2 text-xs text-foreground/50">{t("searchEmpty")}</p>}
            {searchStatus === "unavailable" && (
              <p className="mt-2 text-xs text-foreground/50">{t("searchUnavailable")}</p>
            )}

            {searchResults.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1">
                {searchResults.map((result) => (
                  <li key={result.videoId}>
                    <button
                      onClick={() => handleSelectSearchResult(result)}
                      aria-pressed={youtubeVideoId === result.videoId}
                      className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                        youtubeVideoId === result.videoId
                          ? "border-brand-yellow bg-brand-yellow/10 text-foreground"
                          : "border-transparent text-foreground/70 hover:bg-brand-gray/20"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={result.thumbnailUrl}
                        alt=""
                        aria-hidden="true"
                        className="h-8 w-8 shrink-0 rounded object-cover"
                      />
                      <span className="truncate">{result.title}</span>
                      {youtubeVideoId === result.videoId && (
                        <span className="ml-auto shrink-0 text-xs text-brand-yellow">{t("playing")}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handlePasteSubmit} className="mt-3 flex flex-col gap-1">
        <label htmlFor="ambient-youtube-url" className="text-xs text-foreground/50">
          {t("pasteLabel")}
        </label>
        <div className="flex gap-2">
          <input
            id="ambient-youtube-url"
            type="text"
            value={pasteValue}
            onChange={(e) => {
              setPasteValue(e.target.value);
              setPasteError(false);
            }}
            placeholder={t("pastePlaceholder")}
            className="flex-1 rounded-lg border border-brand-gray bg-background/60 px-2 py-1 text-sm text-foreground placeholder:text-foreground/40"
          />
          <button
            type="submit"
            className="rounded-lg border border-brand-gray px-3 py-1 text-sm text-foreground/70 hover:bg-brand-gray/20"
          >
            {t("pastePlay")}
          </button>
        </div>
        {pasteError && <p className="text-xs text-red-500">{t("pasteInvalid")}</p>}
      </form>

      {pastedTracks.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1">
          {pastedTracks.map((track) => (
            <li key={track.videoId}>
              <button
                onClick={() => handleSelectYoutube(track.videoId)}
                aria-pressed={youtubeVideoId === track.videoId}
                className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                  youtubeVideoId === track.videoId
                    ? "border-brand-yellow bg-brand-yellow/10 text-foreground"
                    : "border-transparent text-foreground/70 hover:bg-brand-gray/20"
                }`}
              >
                <span aria-hidden="true">🔗</span>
                <span className="truncate">{track.title}</span>
                {youtubeVideoId === track.videoId && (
                  <span className="ml-auto shrink-0 text-xs text-brand-yellow">{t("playing")}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {youtubeVideoId && (
        <div className="sr-only">
          <YouTube
            videoId={youtubeVideoId}
            opts={{ playerVars: { autoplay: 1, controls: 0 } }}
            onReady={(event) => {
              youtubePlayerRef.current = event.target;
              event.target.setVolume(volume * 100);
            }}
          />
        </div>
      )}
    </div>
  );
}
