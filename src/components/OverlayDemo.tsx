import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig
} from "remotion";

type OverlayDemoProps = {
  kicker: string;
  title: string;
  subtitle: string;
  accentColor: string;
};

export const OverlayDemo: React.FC<OverlayDemoProps> = ({
  kicker,
  title,
  subtitle,
  accentColor
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 130, mass: 0.7 }
  });
  const opacity = interpolate(frame, [0, 8, 78, 90], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const y = interpolate(enter, [0, 1], [80, 0]);
  const scale = interpolate(enter, [0, 1], [0.88, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${y}px) scale(${scale})`,
          borderLeft: `10px solid ${accentColor}`,
          padding: "28px 42px",
          maxWidth: 900
        }}
      >
        <div
          style={{
            color: accentColor,
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: 8,
            marginBottom: 18
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            color: "white",
            fontSize: 84,
            lineHeight: 0.98,
            fontWeight: 900,
            whiteSpace: "pre-line",
            textShadow: "0 8px 28px rgba(0,0,0,0.45)"
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: "white",
            opacity: 0.78,
            fontSize: 28,
            letterSpacing: 3,
            marginTop: 24
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
