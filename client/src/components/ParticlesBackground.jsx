import React from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticlesBackground = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: "#000"
          }
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: { enable: true, mode: "push" },
            onHover: { enable: true, mode: "repulse" },
            resize: true
          },
          modes: {
            push: { quantity: 4 },
            repulse: { distance: 100, duration: 0.4 }
          }
        },
        particles: {
          color: { value: ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa", "#f472b6", "#38bdf8", "#facc15"] },
          links: {
            color: "#fff",
            distance: 120,
            enable: true,
            opacity: 0.3,
            width: 1
          },
          collisions: { enable: false },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "bounce" },
            random: false,
            speed: 1.2,
            straight: false
          },
          number: {
            density: { enable: true, area: 800 },
            value: 50
          },
          opacity: {
            value: 0.7
          },
          shape: {
            type: "circle"
          },
          size: {
            value: { min: 6, max: 18 }
          }
        },
        detectRetina: true
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0
      }}
    />
  );
};

export default ParticlesBackground; 