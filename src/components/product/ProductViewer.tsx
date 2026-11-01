"use client";

import { Component, Suspense, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, Environment, Html, OrbitControls, useGLTF, useProgress } from "@react-three/drei";

const DEFAULT_MODEL_URL = "/models/mac_mini.glb";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

// Self-hosted Draco decoder (from public/draco) — no runtime dependency on gstatic.com
useGLTF.setDecoderPath("/draco/");
// Preload hero models so per-slide swaps are instant (kept in-memory by drei)
useGLTF.preload(DEFAULT_MODEL_URL);
useGLTF.preload("/models/ipad_a16.glb");

function CanvasMessage({ children }: { children: ReactNode }) {
  return (
    <Html center>
      <div className="px-4 py-2 rounded-xl bg-cyber-glass border border-cyber-border/60 text-xs font-bold text-cyber-cyan whitespace-nowrap">
        {children}
      </div>
    </Html>
  );
}

function LoadingProgress() {
  const { progress } = useProgress();
  return <CanvasMessage>Loading 3D product... {Math.round(progress)}%</CanvasMessage>;
}

class ModelErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <CanvasMessage>3D scene failed to load. Add public/models/mac_mini.glb</CanvasMessage>;
    }
    return this.props.children;
  }
}

export default function ProductViewer({
  modelUrl = DEFAULT_MODEL_URL,
}: {
  modelUrl?: string;
}) {
  // Canvas mounts immediately — gating it behind loading state causes Chrome
  // to never present the WebGL surface (blank until tab-switch/resize).
  return (
    <div className="h-full w-full min-h-[120px]">
      <Canvas
        camera={{ position: [3, 2, 3], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={<LoadingProgress />}>
          <ModelErrorBoundary>
            <Environment files="/hdr/studio_small_08_1k.hdr" />
            <ambientLight intensity={0.5} />
            {/* key refits the camera bounds when the model changes; canvas/env stay alive */}
            <Bounds key={modelUrl} fit clip observe margin={1.6}>
              <Center>
                <Model url={modelUrl} />
              </Center>
            </Bounds>
          </ModelErrorBoundary>
        </Suspense>
        <OrbitControls makeDefault enableZoom={true} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
}
