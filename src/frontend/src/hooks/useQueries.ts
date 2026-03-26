import { useActor } from "@/hooks/useActor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Device {
  id: string;
  name: string;
  pairCode: string;
  status: string;
  lastSeen: bigint;
}

export interface LogEntry {
  id: string;
  deviceId: string;
  deviceName: string;
  eventType: string;
  message: string;
  timestamp: bigint;
}

export function useGetDevices() {
  const { actor, isFetching } = useActor();
  return useQuery<Device[]>({
    queryKey: ["devices"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getDevices();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useGetLogs() {
  const { actor, isFetching } = useActor();
  return useQuery<LogEntry[]>({
    queryKey: ["logs"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getLogs();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3000,
  });
}

export function useAddDevice() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      pairCode,
    }: { name: string; pairCode: string }) => {
      if (!actor) throw new Error("Not connected");
      const result: string = await (actor as any).addDevice(name, pairCode);
      return result;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["devices"] });
    },
  });
}

export function useRemoveDevice() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (deviceId: string) => {
      if (!actor) throw new Error("Not connected");
      await (actor as any).removeDevice(deviceId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["devices"] });
      qc.invalidateQueries({ queryKey: ["logs"] });
    },
  });
}

export function useUpdateDeviceStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      deviceId,
      status,
    }: { deviceId: string; status: string }) => {
      if (!actor) throw new Error("Not connected");
      await (actor as any).updateDeviceStatus(deviceId, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["devices"] });
    },
  });
}

export function useAddLog() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      deviceId,
      deviceName,
      eventType,
      message,
    }: {
      deviceId: string;
      deviceName: string;
      eventType: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await (actor as any).addLog(deviceId, deviceName, eventType, message);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["logs"] });
    },
  });
}
