import {
  ArrowLeft,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Home,
  LayoutGrid,
  Lock,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useState } from "react";

type ButtonId = string;

const APP_ICONS = [
  { color: "bg-blue-500", label: "Phone" },
  { color: "bg-green-500", label: "Msgs" },
  { color: "bg-red-500", label: "YT" },
  { color: "bg-purple-500", label: "Gram" },
  { color: "bg-yellow-500", label: "Maps" },
  { color: "bg-teal-500", label: "Cam" },
  { color: "bg-pink-500", label: "Music" },
  { color: "bg-orange-500", label: "Play" },
  { color: "bg-cyan-600", label: "Twit" },
  { color: "bg-indigo-500", label: "Mail" },
  { color: "bg-emerald-500", label: "Drive" },
  { color: "bg-rose-500", label: "TikTok" },
];

const DOCK_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-red-500",
  "bg-gray-500",
];
const SIGNAL_BARS = [4, 3, 3, 2];

export default function ScreenControl() {
  const [connected, setConnected] = useState(true);
  const [activeBtn, setActiveBtn] = useState<ButtonId | null>(null);
  const [time] = useState(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  });

  const pressBtn = (id: ButtonId) => {
    setActiveBtn(id);
    setTimeout(() => setActiveBtn(null), 200);
  };

  const btnClass = (id: ButtonId) =>
    `flex items-center justify-center rounded-lg border transition-all duration-150 active:scale-95 ${
      activeBtn === id
        ? "bg-spy-teal/30 border-spy-teal text-spy-teal scale-95"
        : "bg-spy-card border-spy-border text-spy-muted hover:text-spy-text hover:border-spy-teal/40"
    }`;

  return (
    <div className="space-y-4" data-ocid="screen.panel">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-spy-muted">
            Screen Control
          </h2>
          <p className="text-lg font-semibold text-spy-text mt-0.5">
            Remote Device View &amp; Input
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 text-xs font-semibold uppercase ${connected ? "text-spy-green" : "text-spy-red"}`}
          >
            {connected ? (
              <Wifi className="w-4 h-4" />
            ) : (
              <WifiOff className="w-4 h-4" />
            )}
            {connected ? "Connected" : "Disconnected"}
          </div>
          <button
            type="button"
            onClick={() => setConnected((v) => !v)}
            className="px-4 py-2 rounded-lg border border-spy-red/50 text-spy-red text-xs font-semibold uppercase tracking-wider hover:bg-spy-red/10 transition-all"
            data-ocid="screen.disconnect.button"
          >
            {connected ? "DISCONNECT" : "CONNECT"}
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-3">
          <div className="bg-spy-card border border-spy-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-spy-border">
              <div className="flex items-center gap-2">
                <span className="pulse-red w-2 h-2 rounded-full bg-spy-red inline-block" />
                <span className="text-xs font-bold text-spy-red uppercase tracking-widest">
                  LIVE
                </span>
              </div>
              <span className="text-xs text-spy-muted">Feed #1 — EI-M09</span>
            </div>

            <div
              className="relative bg-[oklch(0.08_0.003_240)] mx-4 my-3 rounded-2xl overflow-hidden"
              style={{ aspectRatio: "9/16", maxHeight: "480px" }}
            >
              {connected && <div className="scan-line" />}

              <div className="flex items-center justify-between px-4 py-2 text-spy-text/70">
                <span className="text-[10px] font-mono">{time}</span>
                <div className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {SIGNAL_BARS.map((h, i) => (
                      <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: static positional signal bars
                        key={i}
                        className="w-1 bg-spy-text/60 rounded-sm"
                        style={{ height: `${h * 2 + 4}px` }}
                      />
                    ))}
                  </div>
                  <Wifi className="w-3 h-3 text-spy-text/60" />
                  <div className="w-5 h-2.5 rounded-sm border border-spy-text/40 flex items-center px-0.5">
                    <div className="w-3/4 h-full bg-spy-green/80 rounded-sm" />
                  </div>
                </div>
              </div>

              {connected ? (
                <>
                  <div className="px-4 pt-2">
                    <p className="text-spy-text/40 text-[9px] uppercase tracking-widest text-center mb-4">
                      Home Screen
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      {APP_ICONS.map((app) => (
                        <div
                          key={app.label}
                          className="flex flex-col items-center gap-1"
                        >
                          <div
                            className={`w-9 h-9 rounded-xl ${app.color} opacity-80`}
                          />
                          <span className="text-spy-text/50 text-[8px]">
                            {app.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-spy-text/5 rounded-2xl px-3 py-2 flex justify-around">
                    {DOCK_COLORS.map((c) => (
                      <div
                        key={c}
                        className={`w-10 h-10 rounded-xl ${c} opacity-70`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <WifiOff className="w-12 h-12 text-spy-border mx-auto mb-2" />
                    <p className="text-spy-muted text-xs">No Signal</p>
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-spy-border bg-spy-bg/50 flex flex-wrap items-center gap-4 text-[11px] font-mono">
              <span className="text-spy-muted">
                Target: <span className="text-spy-text">Android</span>
              </span>
              <span className="text-spy-muted">
                Device ID: <span className="text-spy-teal">EI-M09</span>
              </span>
              <span className="text-spy-muted">
                Resolution: <span className="text-spy-text">1080×2340</span>
              </span>
              <span className="text-spy-muted">
                OS: <span className="text-spy-text">Android 14</span>
              </span>
              <span className="text-spy-muted">
                Battery: <span className="text-spy-green">87%</span>
              </span>
            </div>
          </div>
        </div>

        <div className="w-56 flex flex-col gap-3">
          <div className="bg-spy-card border border-spy-border rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-spy-muted mb-4">
              Remote Input
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div />
              <button
                type="button"
                onClick={() => pressBtn("up")}
                className={`${btnClass("up")} h-10`}
                data-ocid="screen.up.button"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <div />
              <button
                type="button"
                onClick={() => pressBtn("left")}
                className={`${btnClass("left")} h-10`}
                data-ocid="screen.left.button"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="h-10 rounded-lg bg-spy-bg border border-spy-border/50 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-spy-border" />
              </div>
              <button
                type="button"
                onClick={() => pressBtn("right")}
                className={`${btnClass("right")} h-10`}
                data-ocid="screen.right.button"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div />
              <button
                type="button"
                onClick={() => pressBtn("down")}
                className={`${btnClass("down")} h-10`}
                data-ocid="screen.down.button"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <div />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                type="button"
                onClick={() => pressBtn("back")}
                className={`${btnClass("back")} h-10`}
                data-ocid="screen.back.button"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => pressBtn("home")}
                className={`${btnClass("home")} h-10`}
                data-ocid="screen.home.button"
              >
                <Home className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => pressBtn("recent")}
                className={`${btnClass("recent")} h-10`}
                data-ocid="screen.recent.button"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => pressBtn("vol_up")}
                className={`${btnClass("vol_up")} h-10 gap-1 text-xs`}
                data-ocid="screen.volume_up.button"
              >
                <Volume2 className="w-4 h-4" />
                <span>+</span>
              </button>
              <button
                type="button"
                onClick={() => pressBtn("vol_dn")}
                className={`${btnClass("vol_dn")} h-10 gap-1 text-xs`}
                data-ocid="screen.volume_down.button"
              >
                <VolumeX className="w-4 h-4" />
                <span>−</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => pressBtn("lock")}
                className={`${btnClass("lock")} h-10 gap-1 text-[10px]`}
                data-ocid="screen.lock.button"
              >
                <Lock className="w-4 h-4" />
                <span>Lock</span>
              </button>
              <button
                type="button"
                onClick={() => pressBtn("shot")}
                className={`${btnClass("shot")} h-10 gap-1 text-[10px]`}
                data-ocid="screen.screenshot.button"
              >
                <Camera className="w-4 h-4" />
                <span>Shot</span>
              </button>
            </div>
          </div>

          <div className="bg-spy-card border border-spy-border rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-spy-muted">
              Status
            </p>
            <div className="space-y-1.5">
              {[
                { label: "Signal", value: "98%", color: "text-spy-green" },
                { label: "Latency", value: "42ms", color: "text-spy-green" },
                { label: "FPS", value: "24fps", color: "text-spy-teal" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-xs">
                  <span className="text-spy-muted">{row.label}</span>
                  <span className={`font-mono font-semibold ${row.color}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
