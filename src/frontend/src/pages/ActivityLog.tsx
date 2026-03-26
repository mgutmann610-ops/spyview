import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLogs } from "@/hooks/useQueries";
import { Activity, AlertCircle, Inbox } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const EVENT_STYLES: Record<string, { bg: string; text: string; dot: string }> =
  {
    paired: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
    connected: {
      bg: "bg-spy-green/10",
      text: "text-spy-green",
      dot: "bg-spy-green",
    },
    disconnected: {
      bg: "bg-spy-red/10",
      text: "text-spy-red",
      dot: "bg-spy-red",
    },
    activity: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-400",
      dot: "bg-yellow-400",
    },
  };

function getEventStyle(type: string) {
  return (
    EVENT_STYLES[type] ?? {
      bg: "bg-spy-muted/10",
      text: "text-spy-muted",
      dot: "bg-spy-muted",
    }
  );
}

function formatTimestamp(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  if (ms === 0) return "—";
  return new Date(ms).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function ActivityLog() {
  const { data: logs, isLoading, isError } = useGetLogs();

  const sorted = logs
    ? [...logs].sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1))
    : [];

  return (
    <div className="space-y-6 max-w-3xl" data-ocid="logs.panel">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-spy-muted">
            Activity
          </h2>
          <p className="text-lg font-semibold text-spy-text mt-0.5">
            Live Activity Feed
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-spy-card border border-spy-border">
          <span className="w-2 h-2 rounded-full bg-spy-green animate-pulse" />
          <span className="text-[10px] text-spy-muted uppercase tracking-wider">
            Live · 3s
          </span>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3" data-ocid="logs.loading_state">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl bg-spy-card" />
          ))}
        </div>
      )}

      {isError && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl bg-spy-card border border-spy-red/30 text-spy-red text-sm"
          data-ocid="logs.error_state"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          Failed to load logs. Retrying...
        </div>
      )}

      {!isLoading && !isError && sorted.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="logs.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-spy-card border border-spy-border flex items-center justify-center mb-4">
            <Inbox className="w-7 h-7 text-spy-muted" />
          </div>
          <p className="text-spy-text font-semibold mb-1">No activity yet</p>
          <p className="text-spy-muted text-xs max-w-xs">
            Events will appear here as devices connect, disconnect, and perform
            actions.
          </p>
        </div>
      )}

      {!isLoading && sorted.length > 0 && (
        <ScrollArea className="h-[calc(100vh-14rem)]">
          <div className="space-y-2 pr-3">
            <AnimatePresence initial={false}>
              {sorted.map((log, idx) => {
                const style = getEventStyle(log.eventType);
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: idx < 10 ? idx * 0.03 : 0,
                    }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-spy-card border border-spy-border hover:border-spy-teal/20 transition-colors"
                    data-ocid={`logs.item.${idx + 1}`}
                  >
                    <div
                      className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${style.dot}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-spy-text text-sm font-semibold truncate">
                          {log.deviceName}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase tracking-wider border-current/20 ${style.bg} ${style.text}`}
                        >
                          {log.eventType}
                        </Badge>
                      </div>
                      <p className="text-spy-muted text-xs">{log.message}</p>
                    </div>
                    <span className="text-[10px] text-spy-muted font-mono shrink-0 mt-0.5">
                      {formatTimestamp(log.timestamp)}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </ScrollArea>
      )}

      {!isLoading && sorted.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-spy-muted">
          <Activity className="w-3.5 h-3.5" />
          {sorted.length} event{sorted.length !== 1 ? "s" : ""} total
        </div>
      )}
    </div>
  );
}
