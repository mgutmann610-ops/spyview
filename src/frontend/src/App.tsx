import Layout from "@/components/Layout";
import PinLogin from "@/components/PinLogin";
import { Toaster } from "@/components/ui/sonner";
import ActivityLog from "@/pages/ActivityLog";
import AudioMonitor from "@/pages/AudioMonitor";
import Devices from "@/pages/Devices";
import ScreenControl from "@/pages/ScreenControl";
import Settings from "@/pages/Settings";
import { useState } from "react";

export type Page = "devices" | "logs" | "screen" | "audio" | "settings";

const DEFAULT_PIN = "123456";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("devices");
  const [pin, setPin] = useState(DEFAULT_PIN);

  if (!authenticated) {
    return (
      <>
        <PinLogin correctPin={pin} onSuccess={() => setAuthenticated(true)} />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {currentPage === "devices" && <Devices />}
        {currentPage === "logs" && <ActivityLog />}
        {currentPage === "screen" && <ScreenControl />}
        {currentPage === "audio" && <AudioMonitor />}
        {currentPage === "settings" && (
          <Settings currentPin={pin} onPinChange={setPin} />
        )}
      </Layout>
      <Toaster />
    </>
  );
}
