"use client";

import { useEffect, useState } from "react";

export function OpeningScreen() {
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [entering, setEntering] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("zero-store-entered") !== "true") {
        setVisible(true);
      } else {
        setHidden(true);
      }
    } catch {
      setVisible(true);
    }
    setReady(true);
  }, []);

  function enterStore() {
    if (entering) return;

    setEntering(true);
    try {
      sessionStorage.setItem("zero-store-entered", "true");
    } catch {}

    window.setTimeout(() => {
      setVisible(false);

      window.setTimeout(() => {
        setHidden(true);
      }, 1100);
    }, 1900);
  }

  if (!ready || hidden) return null;

  return (
    <>
      <style jsx>{`
        .opening-screen {
          opacity: 1;
          transform-origin: center;
        }

        .opening-image {
          animation: imageReveal 2s cubic-bezier(.2,.7,.2,1) both;
        }

        .opening-glow {
          background:
            radial-gradient(ellipse at 50% 72%, rgba(220, 20, 40, .2), transparent 48%),
            linear-gradient(to top, rgba(0,0,0,.82), transparent 55%);
          animation: glowReveal 2s ease-out both;
        }

        .opening-content {
          animation: contentReveal 1.2s .45s cubic-bezier(.16,1,.3,1) both;
        }

        .opening-button {
          box-shadow:
            0 0 20px rgba(220, 20, 40, .28),
            0 8px 30px rgba(0,0,0,.35),
            inset 0 1px 0 rgba(255,255,255,.25);
          transition: transform .25s ease, box-shadow .25s ease;
        }

        .opening-button:active {
          transform: scale(.96);
        }

        .progress-track {
          background: rgba(255,255,255,.2);
          box-shadow: 0 0 12px rgba(255,255,255,.08);
        }

        .progress-fill {
          width: 8%;
          transition: width 1.9s cubic-bezier(.2,.7,.2,1);
        }

        .progress-fill.loading {
          width: 100%;
        }

        .screen-exit {
          opacity: 0;
          transform: scale(1.09);
          filter: blur(12px);
          transition:
            opacity 1.05s ease,
            transform 1.1s cubic-bezier(.7,0,.2,1),
            filter 1s ease;
        }

        .screen-exit .opening-image {
          transform: scale(1.13);
          transition: transform 1.1s ease;
        }

        .screen-exit .opening-content {
          opacity: 0;
          transform: translateY(35px);
          transition: all .45s ease;
        }

        .screen-exit .opening-glow {
          opacity: 1;
          background: radial-gradient(circle at center, rgba(255,20,45,.5), #000 75%);
          transition: all .7s ease;
        }

        @keyframes screenReveal {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes imageReveal {
          from { transform: scale(1.09); filter: brightness(.55); }
          to { transform: scale(1); filter: brightness(1); }
        }

        @keyframes contentReveal {
          from { opacity: 0; transform: translateY(45px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes glowReveal {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .opening-screen, .opening-image, .opening-content {
            animation: none !important;
          }
        }
      `}</style>

      <div
        className={`opening-screen fixed inset-0 z-[9999] flex min-h-[100dvh] items-end justify-center overflow-hidden bg-black ${
          visible ? "opacity-100" : "screen-exit pointer-events-none"
        }`}
      >
        <img
          src="/zero-store-opening.png"
          alt="ZERO STORE"
          className="opening-image absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="opening-glow absolute inset-0" />

        <div className="opening-content relative z-10 w-full max-w-md px-7 pb-[max(3rem,env(safe-area-inset-bottom))] text-center">
          <button
            onClick={enterStore}
            disabled={entering}
            className="opening-button w-full rounded-2xl border border-red-300/60 bg-gradient-to-b from-red-500 via-red-600 to-red-800 px-6 py-4 text-sm font-black tracking-[0.2em] text-white ring-1 ring-white/10 disabled:cursor-wait"
          >
            {entering ? "MEMASUKI ZERO STORE..." : "MASUK ZERO STORE"}
          </button>

          <div className="progress-track mt-6 h-[6px] w-full overflow-hidden rounded-full">
            <div
              className={`progress-fill h-full rounded-full bg-gradient-to-r from-red-700 via-red-400 to-white shadow-[0_0_14px_rgba(255,30,50,.9)] ${
                entering ? "loading" : ""
              }`}
            />
          </div>

          <p className="mt-4 text-[10px] font-bold tracking-[0.35em] text-white/85">
            {entering ? "ENTERING THE WORLD OF ZERO..." : "MEMUAT ZERO STORE..."}
          </p>

          <div className="mt-5 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-red-500/70" />
            <span className="text-[9px] tracking-[0.45em] text-white/45">
              PREMIUM GAME MARKETPLACE
            </span>
            <span className="h-px w-8 bg-red-500/70" />
          </div>
        </div>
      </div>
    </>
  );
}
