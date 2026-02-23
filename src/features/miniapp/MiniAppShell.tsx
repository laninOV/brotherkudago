"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { MatchesTab } from "./tabs/MatchesTab";
import { HomeTab } from "./tabs/HomeTab";
import { ProfileTab } from "./tabs/ProfileTab";
import { useTelegramSetup } from "./telegram/useTelegramSetup";
import { AppProvider } from "./state/AppState";
import { PlacesProvider } from "./state/PlacesState";
import { TabBar, type TabKey } from "./ui/TabBar";

const MapTab = dynamic(() => import("./tabs/MapTab").then((mod) => mod.MapTab), { ssr: false });

function MiniApp() {
  useTelegramSetup()

  const [tab, setTab] = useState<TabKey>("home");
  const content = useMemo(() => {
    switch (tab) {
      case "home":
        return <HomeTab />;
      case "map":
        return <MapTab />;
      case "matches":
        return <MatchesTab />;
      case "profile":
        return <ProfileTab />;
    }
  }, [tab]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTab("home");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="app miniapp-root ma-root">
      <div className="app__content">{content}</div>
      <TabBar value={tab} onChange={setTab} />
    </div>
  );
}

export default function MiniAppShell() {
  return (
    <AppProvider>
      <PlacesProvider>
        <MiniApp />
      </PlacesProvider>
    </AppProvider>
  );
}
