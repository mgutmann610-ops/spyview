import { Activity, Headphones, Mic, MicOff } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const BARS = 32;

const STATS = [
  { label: "Bitrate", key: "bitrate" },
  { label: "Sample Rate", key: "sampleRate" },
  { label: "Channel", key: "channel" },
];

export default function AudioMonitor() {
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [levels, setLevels] = useState<number[]>(Array(BARS).fill(0.1));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (active) {
      intervalRef.current = setInterval(() => {
        setLevels(
          Array.from({ length: BARS }, () => 0.1 + Math.random() * 0.9),
        );
      }, 80);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      setLevels(Array(BARS).fill(0.05));
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active]);

  const handleToggle = () => {
    if (active) {
      setActive(false);
    } else {
      setSeconds(0);
      setActive(true);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const barColor = (level: number) => {
    if (level > 0.75) return "oklch(0.62 0.22 25)";
    if (level > 0.45) return "oklch(0.78 0.18 60)";
    return "oklch(0.75 0.14 145)";
  };

  const now = new Date();
  const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

  const statValues: Record<string, string> = {
    bitrate: active ? "128 kbps" : "— kbps",
    sampleRate: active ? "44.1 kHz" : "— kHz",
    channel: "Mono",
  };

  const statIcons: Record<string, React.ReactNode> = {
    bitrate: <Activity className="w-4 h-4" />,
    sampleRate: <Mic className="w-4 h-4" />,
    channel: <Headphones className="w-4 h-4" />,
  };

  return (
    <div className="space-y-4" data-ocid="audio.panel">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-spy-muted">
          Audio Monitor
        </h2>
        <p className="text-lg font-semibold text-spy-text mt-0.5">
          One-Way Microphone Surveillance
        </p>
      </div>

      <div className="bg-spy-card border border-spy-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                active
                  ? "bg-spy-teal/20 text-spy-teal"
                  : "bg-spy-border/50 text-spy-muted"
              }`}
            >
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-spy-muted">
                Live Audio
              </p>
              <p className="text-sm text-spy-text font-semibold">
                {active ? "RECORDING ACTIVE" : "MONITORING PAUSED"}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active ? "active" : "inactive"}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                active
                  ? "bg-spy-red/10 border-spy-red/40 text-spy-red"
                  : "bg-spy-border/30 border-spy-border text-spy-muted"
              }`}
            >
              {active ? (
                <span className="flex items-center gap-1">
                  <span className="pulse-red w-1.5 h-1.5 rounded-full bg-spy-red inline-block" />
                  REC
                </span>
              ) : (
                "IDLE"
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="bg-spy-bg rounded-xl p-4 mb-6 border border-spy-border/50">
          <div className="flex items-end justify-center gap-1 h-24">
            {levels.map((level, i) => (
              <motion.div
                // biome-ignore lint/suspicious/noArrayIndexKey: waveform bars are purely positional
                key={i}
                className="w-2 rounded-sm flex-shrink-0"
                style={{
                  height: `${level * 100}%`,
                  backgroundColor: active
                    ? barColor(level)
                    : "oklch(0.24 0.010 240)",
                  minHeight: "4px",
                }}
                animate={{ height: `${level * 100}%` }}
                transition={{ duration: 0.08, ease: "linear" }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="space-y-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-spy-muted">
              Target Phone Mic Level
            </p>
            <p className="text-xs text-spy-muted font-mono">{timestamp}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-spy-muted">
              Duration
            </p>
            <p className="text-2xl font-mono font-bold text-spy-teal">
              {formatTime(seconds)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className={`w-full h-14 rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 ${
            active
              ? "bg-spy-red/10 border border-spy-red/50 text-spy-red hover:bg-spy-red/20"
              : "bg-spy-teal text-spy-bg hover:brightness-110"
          }`}
          data-ocid="audio.toggle"
        >
          {active ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
          {active ? "STOP MONITORING" : "START MONITORING"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {STATS.map((stat) => (
          <div
            key={stat.key}
            className="bg-spy-card border border-spy-border rounded-xl p-4"
          >
            <div
              className={`mb-2 ${active ? "text-spy-teal" : "text-spy-muted"}`}
            >
              {statIcons[stat.key]}
            </div>
            <p className="text-xs uppercase tracking-widest text-spy-muted">
              {stat.label}
            </p>
            <p className="text-base font-semibold font-mono text-spy-text mt-0.5">
              {statValues[stat.key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
