import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddDevice,
  useAddLog,
  useGetDevices,
  useRemoveDevice,
  useUpdateDeviceStatus,
} from "@/hooks/useQueries";
import {
  AlertCircle,
  Loader2,
  Plus,
  RefreshCw,
  Smartphone,
  Trash2,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

function formatLastSeen(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  if (ms === 0) return "Never";
  const diff = Date.now() - ms;
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ms).toLocaleDateString();
}

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function Devices() {
  const { data: devices, isLoading, isError } = useGetDevices();
  const addDevice = useAddDevice();
  const removeDevice = useRemoveDevice();
  const updateStatus = useUpdateDeviceStatus();
  const addLog = useAddLog();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");

  const handleAdd = async () => {
    if (!newName.trim()) {
      toast.error("Device name is required");
      return;
    }
    const code = newCode.trim() || generateCode();
    if (code.length !== 6) {
      toast.error("Pairing code must be exactly 6 characters");
      return;
    }
    try {
      const result = await addDevice.mutateAsync({
        name: newName.trim(),
        pairCode: code,
      });
      if (result === "CODE_EXISTS") {
        toast.error("Pairing code already in use. Try another.");
      } else {
        toast.success(`Device "${newName.trim()}" added successfully`);
        setDialogOpen(false);
        setNewName("");
        setNewCode("");
      }
    } catch {
      toast.error("Failed to add device");
    }
  };

  const handleRemove = async (deviceId: string, name: string) => {
    try {
      await removeDevice.mutateAsync(deviceId);
      toast.success(`Device "${name}" removed`);
    } catch {
      toast.error("Failed to remove device");
    }
  };

  const handleSimulateOnline = async (deviceId: string, deviceName: string) => {
    try {
      await Promise.all([
        updateStatus.mutateAsync({ deviceId, status: "online" }),
        addLog.mutateAsync({
          deviceId,
          deviceName,
          eventType: "connected",
          message: `${deviceName} came online`,
        }),
      ]);
      toast.success(`${deviceName} is now online`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl" data-ocid="devices.panel">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-spy-muted">
            Devices
          </h2>
          <p className="text-lg font-semibold text-spy-text mt-0.5">
            Paired Device Management
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-2 bg-spy-teal text-spy-bg hover:bg-spy-teal/90 text-xs font-bold uppercase tracking-wider"
              data-ocid="devices.open_modal_button"
            >
              <Plus className="w-4 h-4" />
              Add Device
            </Button>
          </DialogTrigger>
          <DialogContent
            className="bg-spy-card border-spy-border text-spy-text"
            data-ocid="devices.dialog"
          >
            <DialogHeader>
              <DialogTitle className="text-spy-text flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-spy-teal" />
                Add New Device
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-spy-muted uppercase tracking-wider">
                  Device Name
                </Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Samsung Galaxy S24"
                  className="bg-spy-bg border-spy-border text-spy-text placeholder:text-spy-muted focus-visible:ring-spy-teal/50"
                  data-ocid="devices.name.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-spy-muted uppercase tracking-wider">
                  Pairing Code (6 chars)
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newCode}
                    onChange={(e) =>
                      setNewCode(e.target.value.toUpperCase().slice(0, 6))
                    }
                    placeholder="Auto-generated if empty"
                    className="bg-spy-bg border-spy-border text-spy-text placeholder:text-spy-muted focus-visible:ring-spy-teal/50 font-mono tracking-widest"
                    data-ocid="devices.code.input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setNewCode(generateCode())}
                    className="border-spy-border text-spy-muted hover:text-spy-text hover:bg-spy-card shrink-0"
                    data-ocid="devices.generate_code.button"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-spy-muted">
                  Leave blank to auto-generate a random code.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="border-spy-border text-spy-muted hover:text-spy-text"
                data-ocid="devices.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                disabled={addDevice.isPending}
                className="bg-spy-teal text-spy-bg hover:bg-spy-teal/90"
                data-ocid="devices.confirm_button"
              >
                {addDevice.isPending && (
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                )}
                Add Device
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <div
          className="grid gap-4 sm:grid-cols-2"
          data-ocid="devices.loading_state"
        >
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl bg-spy-card" />
          ))}
        </div>
      )}

      {isError && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl bg-spy-card border border-spy-red/30 text-spy-red text-sm"
          data-ocid="devices.error_state"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          Failed to load devices. Retrying...
        </div>
      )}

      {!isLoading && !isError && (!devices || devices.length === 0) && (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="devices.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-spy-card border border-spy-border flex items-center justify-center mb-4">
            <Smartphone className="w-7 h-7 text-spy-muted" />
          </div>
          <p className="text-spy-text font-semibold mb-1">
            No devices paired yet
          </p>
          <p className="text-spy-muted text-xs max-w-xs">
            Click "Add Device" to pair your first target device using a unique
            6-character code.
          </p>
        </div>
      )}

      {!isLoading && devices && devices.length > 0 && (
        <AnimatePresence>
          <div className="grid gap-4 sm:grid-cols-2">
            {devices.map((device, idx) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-spy-card border border-spy-border rounded-xl p-5 space-y-4 hover:border-spy-teal/30 transition-colors"
                data-ocid={`devices.item.${idx + 1}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-spy-bg border border-spy-border flex items-center justify-center shrink-0">
                      <Smartphone className="w-5 h-5 text-spy-teal" />
                    </div>
                    <div>
                      <p className="text-spy-text font-semibold text-sm">
                        {device.name}
                      </p>
                      <p className="text-spy-muted text-xs font-mono mt-0.5">
                        Code:{" "}
                        <span className="text-spy-teal tracking-widest">
                          {device.pairCode}
                        </span>
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`text-[10px] uppercase tracking-wider shrink-0 ${
                      device.status === "online"
                        ? "bg-spy-green/15 text-spy-green border-spy-green/30"
                        : "bg-spy-muted/10 text-spy-muted border-spy-border"
                    }`}
                    variant="outline"
                  >
                    {device.status === "online" ? (
                      <Wifi className="w-3 h-3 mr-1" />
                    ) : (
                      <WifiOff className="w-3 h-3 mr-1" />
                    )}
                    {device.status}
                  </Badge>
                </div>

                <div className="text-xs text-spy-muted">
                  Last seen:{" "}
                  <span className="text-spy-text">
                    {formatLastSeen(device.lastSeen)}
                  </span>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSimulateOnline(device.id, device.name)}
                    disabled={updateStatus.isPending || addLog.isPending}
                    className="flex-1 border-spy-border text-spy-muted hover:text-spy-teal hover:border-spy-teal/40 text-xs"
                    data-ocid={`devices.toggle.${idx + 1}`}
                  >
                    <Zap className="w-3 h-3 mr-1.5" />
                    Simulate Online
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemove(device.id, device.name)}
                    disabled={removeDevice.isPending}
                    className="border-spy-border text-spy-muted hover:text-spy-red hover:border-spy-red/40 text-xs"
                    data-ocid={`devices.delete_button.${idx + 1}`}
                  >
                    {removeDevice.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
