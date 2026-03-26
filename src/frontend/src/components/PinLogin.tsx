import { Delete, Shield } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface PinLoginProps {
  correctPin: string;
  onSuccess: () => void;
}

const KEY_LABELS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "",
  "0",
  "del",
];

export default function PinLogin({ correctPin, onSuccess }: PinLoginProps) {
  const [entered, setEntered] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleKey = (k: string) => {
    if (entered.length >= correctPin.length) return;
    const next = entered + k;
    setEntered(next);
    setError(false);
    if (next.length === correctPin.length) {
      setTimeout(() => verify(next), 100);
    }
  };

  const handleDelete = () => {
    setEntered((p) => p.slice(0, -1));
    setError(false);
  };

  const verify = (pin: string) => {
    if (pin === correctPin) {
      onSuccess();
    } else {
      setShaking(true);
      setError(true);
      setEntered("");
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-spy-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-10 w-full max-w-sm px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-16 h-16 rounded-2xl bg-spy-teal/10 border border-spy-teal/30 flex items-center justify-center">
            <Shield className="w-8 h-8 text-spy-teal" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-widest text-spy-text uppercase">
              SpyView
            </h1>
            <p className="text-xs text-spy-muted tracking-widest uppercase mt-1">
              Secure Access Required
            </p>
          </div>
        </motion.div>

        <motion.div
          animate={shaking ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex gap-4"
          data-ocid="pin.panel"
        >
          {Array.from({ length: correctPin.length }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: PIN dots are purely positional
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                i < entered.length
                  ? error
                    ? "bg-spy-red border-spy-red"
                    : "bg-spy-teal border-spy-teal"
                  : "border-spy-border bg-transparent"
              }`}
            />
          ))}
        </motion.div>

        {error && (
          <AnimatePresence>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-spy-red text-sm -mt-6"
            >
              Incorrect PIN. Try again.
            </motion.p>
          </AnimatePresence>
        )}

        <div className="grid grid-cols-3 gap-3 w-full">
          {KEY_LABELS.map((k, i) => {
            if (k === "") return <div key="empty" />;
            if (k === "del") {
              return (
                <button
                  type="button"
                  key="del"
                  onClick={handleDelete}
                  className="h-14 rounded-xl bg-spy-card border border-spy-border text-spy-muted hover:text-spy-text hover:bg-spy-border/50 flex items-center justify-center transition-all active:scale-95"
                  data-ocid="pin.delete_button"
                >
                  <Delete className="w-5 h-5" />
                </button>
              );
            }
            return (
              <button
                type="button"
                // biome-ignore lint/suspicious/noArrayIndexKey: keypad buttons are stable positional
                key={i}
                onClick={() => handleKey(k)}
                className="h-14 rounded-xl bg-spy-card border border-spy-border text-spy-text text-xl font-semibold hover:bg-spy-border/50 hover:border-spy-teal/40 transition-all active:scale-95"
                data-ocid="pin.button"
              >
                {k}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => verify(entered)}
          disabled={entered.length < correctPin.length}
          className="w-full h-12 rounded-xl bg-spy-teal text-spy-bg font-bold tracking-widest uppercase text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 transition-all"
          data-ocid="pin.submit_button"
        >
          VERIFY
        </button>

        <p className="text-xs text-spy-muted">Demo PIN: 123456</p>
      </div>
    </div>
  );
}
