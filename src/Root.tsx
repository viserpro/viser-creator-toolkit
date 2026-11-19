import React from "react";
import { Composition } from "remotion";
import { OverlayDemo } from "./components/OverlayDemo";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="VISER-Overlay-Demo"
    component={OverlayDemo}
    durationInFrames={90}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      kicker: "VISER / CREATOR TOOLKIT",
      title: "CERITA KUAT.\nVISUAL TAJAM.",
      subtitle: "A reusable motion overlay",
      accentColor: "#B7FF32"
    }}
  />
);
