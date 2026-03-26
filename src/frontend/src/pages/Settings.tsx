import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Clock, Copy, Info, Key, Link2, Moon, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SettingsProps {
  currentPin: string;
  onPinChange: (pin: string) => void;
}

function generatePairingCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const ABOUT_ITEMS = [
  { label: "Version", value: "1.0.0" },
  { label: "Build", value: "2026.03.20" },
  { label: "Platform", value: "Web Dashboard" },
  { label: "Protocol", value: "WebRTC / WSS" },
];

export default function Settings({ currentPin, onPinChange }: SettingsProps) {
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pairingCode, setPairingCode] = useState(() => generatePairingCode());
  const [timeout, setTimeout_] = useState([30]);
  const [darkMode] = useState(true);

  const handlePinChange = () => {
    if (oldPin !== currentPin) {
      toast.error("Current PIN is incorrect");
      return;
    }
    if (newPin.length < 4) {
      toast.error("New PIN must be at least 4 digits");
      return;
    }
    if (newPin !== confirmPin) {
      toast.error("PINs do not match");
      return;
    }
    onPinChange(newPin);
    setOldPin("");
    setNewPin("");
    setConfirmPin("");
    toast.success("PIN updated successfully");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pairingCode).then(() => {
      toast.success("Pairing code copied to clipboard");
    });
  };

  const pinInputClass =
    "w-full h-10 px-3 bg-spy-bg border border-spy-border rounded-lg text-spy-text placeholder:text-spy-muted focus:outline-none focus:border-spy-teal/50 font-mono tracking-widest text-sm";

  return (
    <div className="space-y-6 max-w-2xl" data-ocid="settings.panel">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-spy-muted">
          Settings
        </h2>
        <p className="text-lg font-semibold text-spy-text mt-0.5">
          Configuration &amp; Security
        </p>
      </div>

      {/* PIN Management */}
      <section className="bg-spy-card border border-spy-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-spy-border">
          <Key className="w-4 h-4 text-spy-teal" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-spy-muted">
            PIN Management
          </h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-spy-muted uppercase tracking-wider">
                Current PIN
              </Label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                className={pinInputClass}
                data-ocid="settings.current_pin.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-spy-muted uppercase tracking-wider">
                New PIN
              </Label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                className={pinInputClass}
                data-ocid="settings.new_pin.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-spy-muted uppercase tracking-wider">
                Confirm PIN
              </Label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                value={confirmPin}
                onChange={(e) =>
                  setConfirmPin(e.target.value.replace(/\D/g, ""))
                }
                placeholder="••••••"
                className={pinInputClass}
                data-ocid="settings.confirm_pin.input"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handlePinChange}
            className="px-5 py-2 rounded-lg bg-spy-teal text-spy-bg text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all"
            data-ocid="settings.change_pin.button"
          >
            Update PIN
          </button>
        </div>
      </section>

      {/* Device Pairing Code */}
      <section className="bg-spy-card border border-spy-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-spy-border">
          <Link2 className="w-4 h-4 text-spy-teal" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-spy-muted">
            Device Pairing Code
          </h3>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-xs text-spy-muted">
            Share this 6-character code to pair a new device. Generate a new
            code anytime.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-spy-bg border border-spy-border rounded-xl px-6 py-4 text-center">
              <p className="text-xs uppercase tracking-widest text-spy-muted mb-2">
                Pairing Code
              </p>
              <p className="text-3xl font-mono font-bold tracking-[0.35em] text-spy-teal">
                {pairingCode}
              </p>
              <p className="text-[10px] text-spy-muted mt-2">
                Share with target device to pair
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-spy-bg border border-spy-border text-spy-muted hover:text-spy-text hover:border-spy-teal/40 text-xs font-semibold uppercase transition-all"
                data-ocid="settings.copy_code.button"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button
                type="button"
                onClick={() => setPairingCode(generatePairingCode())}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-spy-bg border border-spy-border text-spy-muted hover:text-spy-text hover:border-spy-teal/40 text-xs font-semibold uppercase transition-all"
                data-ocid="settings.regenerate.button"
              >
                <RefreshCw className="w-4 h-4" />
                New Code
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Connection Settings */}
      <section className="bg-spy-card border border-spy-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-spy-border">
          <Clock className="w-4 h-4 text-spy-teal" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-spy-muted">
            Connection Settings
          </h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <div className="flex justify-between mb-3">
              <Label className="text-xs text-spy-muted uppercase tracking-wider">
                Session Timeout
              </Label>
              <span className="text-xs font-mono font-semibold text-spy-teal">
                {timeout[0]} min
              </span>
            </div>
            <Slider
              min={5}
              max={120}
              step={5}
              value={timeout}
              onValueChange={setTimeout_}
              className="w-full"
              data-ocid="settings.timeout.select"
            />
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="bg-spy-card border border-spy-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-spy-border">
          <Moon className="w-4 h-4 text-spy-teal" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-spy-muted">
            Appearance
          </h3>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-spy-text font-semibold">Dark Mode</p>
              <p className="text-xs text-spy-muted">
                Always enabled for this application
              </p>
            </div>
            <Switch
              checked={darkMode}
              disabled
              className="opacity-60"
              data-ocid="settings.dark_mode.switch"
            />
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-spy-card border border-spy-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-spy-border">
          <Info className="w-4 h-4 text-spy-teal" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-spy-muted">
            About
          </h3>
        </div>
        <div className="p-5 grid grid-cols-2 gap-3">
          {ABOUT_ITEMS.map((item) => (
            <div key={item.label} className="flex justify-between">
              <span className="text-spy-muted text-xs">{item.label}</span>
              <span className="text-spy-text text-xs font-mono font-semibold">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
