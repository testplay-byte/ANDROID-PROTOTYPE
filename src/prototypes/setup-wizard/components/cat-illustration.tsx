/* eslint-disable react/no-unknown-property */
/**
 * setup-wizard / components / cat-illustration — side-view cat companion.
 *
 * A detailed side-profile cat standing on all four legs, with a curvy arched
 * body, properly connected ears (no "cut-off" base), an expressive face, and
 * a swishing S-curve tail.
 *
 * Unlike the previous front-view cat (which looked identical on every screen),
 * this component supports 7 VARIANTS — one per wizard step — each with its own
 * accessory, head pose, and animation emphasis:
 *
 *   - "welcome"     → cat looks up with a raised waving paw + sparkles
 *   - "theme"       → cat with 3 orbiting color dots
 *   - "folder"      → cat peering down at a folder icon
 *   - "permissions" → cat with a floating shield + checkmark
 *   - "restore"     → cat watching falling data drops
 *   - "summary"     → cat next to a growing bar chart
 *   - "finish"      → cat mid-leap with confetti
 *
 * COLOR STRATEGY (fixes the previous light-mode wash-out):
 *   - Body fill uses a linear-gradient from `--color-primary-container` (top)
 *     to `--color-primary` (bottom). In DARK mode the container is dark and
 *     primary is light (rich shaded body); in LIGHT mode the container is a
 *     light pastel and primary is saturated (soft highlight on top, solid
 *     color underneath) — so the cat always has presence against the bg.
 *   - Outline is a fixed `rgba(0,0,0,0.32)` — gives definition in BOTH modes
 *     (the old cat used `var(--color-primary)` as its outline which vanished
 *     against the primary-colored body).
 *   - Iris is `--color-warn` (amber) — a classic cat-eye color that contrasts
 *     with both the white sclera and the primary-colored face in every palette.
 *
 * The component is self-contained: gradients, clip-paths, and animation
 * keyframes are all namespaced with a per-instance `useId()` so multiple cats
 * can render on the same page without ID collisions.
 */
import { useId } from "react";

export type CatVariant =
  | "welcome"
  | "theme"
  | "folder"
  | "permissions"
  | "restore"
  | "summary"
  | "finish";

interface CatIllustrationProps {
  variant?: CatVariant;
  size?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Small shared helpers                                               */
/* ------------------------------------------------------------------ */

/** Four-pointed sparkle, centered at (cx, cy) with radius r. */
function Sparkle({ cx, cy, r, fill, className, style }: {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const pts = `${cx},${cy - r} ${cx + r * 0.28},${cy - r * 0.28} ${cx + r},${cy} ${cx + r * 0.28},${cy + r * 0.28} ${cx},${cy + r} ${cx - r * 0.28},${cy + r * 0.28} ${cx - r},${cy} ${cx - r * 0.28},${cy - r * 0.28}`;
  return <polygon points={pts} fill={fill} className={className} style={style} />;
}

/* ------------------------------------------------------------------ */
/* The cat — base body (reused by every variant)                      */
/* ------------------------------------------------------------------ */

interface CatBodyProps {
  uid: string;
  /** Head tilt in degrees (negative = look up, positive = look down). */
  headTilt?: number;
  /** Vertical offset for the whole body (for "leap" poses). */
  bodyLift?: number;
  /** Whether to raise the front-right paw (waving). */
  raisePaw?: boolean;
  /** Tail swish intensity multiplier. */
  tailSway?: number;
}

/**
 * The base cat: side profile, facing right, standing on 4 legs.
 * Wrapped in its own <g> so variants can position/transform it.
 */
function CatBody({ uid, headTilt = 0, bodyLift = 0, raisePaw = false, tailSway = 1 }: CatBodyProps) {
  // Color tokens (resolved at render via CSS custom properties)
  const primary = "var(--color-primary)";
  const primaryContainer = "var(--color-primary-container)";
  const tertiary = "var(--color-tertiary)";
  const warn = "var(--color-warn)";
  const outline = "rgba(0,0,0,0.32)";
  const outlineSoft = "rgba(0,0,0,0.22)";
  const white = "#ffffff";
  const pupil = "#161620";

  return (
    <g transform={`translate(0 ${-bodyLift})`}>
      {/* ---------- TAIL (behind body, swishing) ---------- */}
      <g className={`cat-tail-${uid}`}>
        <path
          d="M 62 124 C 48 120, 34 112, 28 94 C 24 78, 30 60, 42 54 C 38 66, 42 80, 49 90 C 55 100, 60 112, 64 122 Z"
          fill={`url(#cat-body-grad-${uid})`}
          stroke={outline}
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        {/* Tail rings (tabby detail) */}
        <path d="M 38 78 Q 42 80, 46 78" stroke={outlineSoft} strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M 34 66 Q 38 68, 42 66" stroke={outlineSoft} strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M 44 92 Q 48 94, 52 92" stroke={outlineSoft} strokeWidth="1.1" fill="none" strokeLinecap="round" />
        {/* Tail tip highlight */}
        <path d="M 38 60 Q 42 56, 46 58" stroke="rgba(255,255,255,0.25)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </g>

      {/* ---------- BACK-FAR LEG (behind body) ---------- */}
      <path
        d="M 60 152 C 57 164, 56 176, 58 185 L 68 185 C 70 176, 70 164, 68 152 Z"
        fill={primaryContainer}
        stroke={outline}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* Back-far paw toes */}
      <path d="M 59 183 L 59 187" stroke={outlineSoft} strokeWidth="0.8" strokeLinecap="round" />
      <path d="M 63 183 L 63 187" stroke={outlineSoft} strokeWidth="0.8" strokeLinecap="round" />
      <path d="M 67 183 L 67 187" stroke={outlineSoft} strokeWidth="0.8" strokeLinecap="round" />

      {/* ---------- BODY (curvy, arched back, facing right) ---------- */}
      <g className={`cat-body-${uid}`}>
        <path
          d="M 62 120
             C 59 102, 74 88, 100 86
             C 120 86, 133 93, 139 104
             C 142 114, 139 124, 135 131
             C 132 140, 128 148, 123 154
             C 108 162, 88 164, 74 158
             C 64 152, 59 142, 60 132
             C 60 126, 60 122, 62 120 Z"
          fill={`url(#cat-body-grad-${uid})`}
          stroke={outline}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Belly highlight (lighter underside) */}
        <path
          d="M 78 140 C 92 156, 112 156, 126 144 C 122 152, 108 160, 90 158 C 80 154, 74 148, 78 140 Z"
          fill={primaryContainer}
          opacity="0.55"
        />
        {/* Back fur stripes (tabby detail) */}
        <path d="M 78 94 Q 84 98, 90 94" stroke={outlineSoft} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M 95 90 Q 101 94, 107 90" stroke={outlineSoft} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M 112 92 Q 118 96, 124 94" stroke={outlineSoft} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        {/* Top-of-back highlight stripe */}
        <path d="M 80 90 C 95 86, 115 86, 128 92" stroke="rgba(255,255,255,0.18)" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Chest fluff (zigzag where chest meets body) */}
        <path
          d="M 124 138 L 128 144 L 132 138 L 136 144 L 140 138"
          stroke={outline}
          strokeWidth="0.9"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>

      {/* ---------- BACK-NEAR LEG (in front of back-far) ---------- */}
      <path
        d="M 72 154 C 70 166, 69 177, 71 185 L 82 185 C 84 177, 84 166, 82 154 Z"
        fill={`url(#cat-body-grad-${uid})`}
        stroke={outline}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* Back-near paw toes */}
      <path d="M 72 183 L 72 187" stroke={outlineSoft} strokeWidth="0.9" strokeLinecap="round" />
      <path d="M 76 183 L 76 187" stroke={outlineSoft} strokeWidth="0.9" strokeLinecap="round" />
      <path d="M 80 183 L 80 187" stroke={outlineSoft} strokeWidth="0.9" strokeLinecap="round" />

      {/* ---------- FRONT-FAR LEG (behind front-near) ---------- */}
      <path
        d="M 112 154 C 110 166, 109 177, 111 185 L 122 185 C 124 177, 124 166, 122 154 Z"
        fill={primaryContainer}
        stroke={outline}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* Front-far paw toes */}
      <path d="M 112 183 L 112 187" stroke={outlineSoft} strokeWidth="0.8" strokeLinecap="round" />
      <path d="M 116 183 L 116 187" stroke={outlineSoft} strokeWidth="0.8" strokeLinecap="round" />
      <path d="M 120 183 L 120 187" stroke={outlineSoft} strokeWidth="0.8" strokeLinecap="round" />

      {/* ---------- FRONT-NEAR LEG (or raised paw for "wave") ---------- */}
      {raisePaw ? (
        <g className={`cat-wave-${uid}`}>
          {/* Bent leg with raised paw */}
          <path
            d="M 124 154 C 124 162, 128 168, 134 168 C 138 166, 140 160, 138 154 Z"
            fill={`url(#cat-body-grad-${uid})`}
            stroke={outline}
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* Raised paw */}
          <ellipse cx="138" cy="156" rx="6" ry="5" fill={`url(#cat-body-grad-${uid})`} stroke={outline} strokeWidth="1" />
          {/* Toe beans on raised paw */}
          <circle cx="136" cy="155" r="1" fill={outlineSoft} />
          <circle cx="139" cy="154" r="1" fill={outlineSoft} />
          <circle cx="141" cy="156" r="1" fill={outlineSoft} />
        </g>
      ) : (
        <>
          <path
            d="M 124 154 C 122 166, 121 177, 123 185 L 134 185 C 136 177, 136 166, 134 154 Z"
            fill={`url(#cat-body-grad-${uid})`}
            stroke={outline}
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* Front-near paw toes */}
          <path d="M 124 183 L 124 187" stroke={outlineSoft} strokeWidth="0.9" strokeLinecap="round" />
          <path d="M 128 183 L 128 187" stroke={outlineSoft} strokeWidth="0.9" strokeLinecap="round" />
          <path d="M 132 183 L 132 187" stroke={outlineSoft} strokeWidth="0.9" strokeLinecap="round" />
        </>
      )}

      {/* ---------- HEAD (profile, facing right) + EARS ---------- */}
      <g className={`cat-head-${uid}`} transform={`rotate(${headTilt} 142 100)`}>
        {/* Back ear (far, behind head) — shorter, tip lower than front ear */}
        <path
          d="M 132 80 L 141 56 L 150 78 Z"
          fill={primaryContainer}
          stroke={outline}
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* Back ear inner (pink) */}
        <path d="M 136 74 L 141 62 L 146 74 Z" fill={tertiary} opacity="0.6" />

        {/* Head + FRONT ear as ONE continuous outline (no cut-off at base) */}
        <path
          d="M 134 92
             C 131 84, 132 78, 137 76
             L 149 72
             L 157 44
             L 165 74
             C 169 77, 172 83, 173 89
             C 175 93, 177 97, 178 101
             L 182 104
             L 179 108
             C 177 114, 171 118, 162 118
             C 150 119, 140 116, 135 110
             C 132 104, 131 98, 134 92 Z"
          fill={`url(#cat-head-grad-${uid})`}
          stroke={outline}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Front ear inner (pink) — prominent */}
        <path d="M 152 68 L 157 50 L 162 70 Z" fill={tertiary} opacity="0.75" />

        {/* Forehead stripe (tabby M mark between ears) */}
        <path d="M 148 80 Q 150 86, 148 90" stroke={outlineSoft} strokeWidth="1.1" fill="none" strokeLinecap="round" />
        <path d="M 154 80 Q 156 86, 155 90" stroke={outlineSoft} strokeWidth="1.1" fill="none" strokeLinecap="round" />

        {/* Cheek fluff (small zigzag on the jaw) */}
        <path
          d="M 138 110 L 140 114 L 142 110 L 144 114 L 146 110"
          stroke={outline}
          strokeWidth="0.8"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* ---------- EYE (profile, one visible) — larger, more prominent ---------- */}
        <g className={`cat-blink-${uid}`} style={{ transformOrigin: "160px 96px" }}>
          {/* Eye white (sclera) — almond shape, larger */}
          <path
            d="M 151 96 Q 158 90, 166 95 Q 161 100, 153 100 Q 151 98, 151 96 Z"
            fill={white}
          />
          {/* Iris (amber) — larger */}
          <circle cx="160" cy="96" r="4" fill={warn} />
          {/* Iris inner ring (darker amber) */}
          <circle cx="160" cy="96" r="4" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="0.6" />
          {/* Pupil (vertical slit — cat-like) */}
          <ellipse cx="160" cy="96" rx="1.1" ry="3.5" fill={pupil} />
          {/* Highlight (top-left) */}
          <circle cx="158.5" cy="94" r="1.1" fill={white} />
          {/* Small secondary highlight */}
          <circle cx="161.5" cy="97.5" r="0.5" fill={white} opacity="0.7" />
          {/* Upper lash line — thicker */}
          <path d="M 151 96 Q 158 90, 166 95" stroke={outline} strokeWidth="1.3" fill="none" strokeLinecap="round" />
          {/* Outer lash flick */}
          <path d="M 165 93 Q 168 91, 169 89" stroke={outline} strokeWidth="1" fill="none" strokeLinecap="round" />
        </g>

        {/* Eyebrow (subtle) */}
        <path d="M 154 86 Q 158 84, 163 86" stroke={outlineSoft} strokeWidth="0.9" fill="none" strokeLinecap="round" />

        {/* ---------- NOSE — slightly bigger, more visible ---------- */}
        <path d="M 176 101 L 182 104 L 176 107 Z" fill={tertiary} stroke={outline} strokeWidth="0.6" strokeLinejoin="round" />

        {/* ---------- MOUTH — more visible ---------- */}
        <path d="M 176 108 Q 174 112, 170 112" stroke={outline} strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M 174 111 Q 171 114, 167 113" stroke={outline} strokeWidth="0.9" fill="none" strokeLinecap="round" />

        {/* ---------- WHISKERS (3 from muzzle, going right) — slightly thicker ---------- */}
        <path d="M 168 106 Q 176 105, 186 103" stroke={outlineSoft} strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M 168 109 Q 176 109, 187 109" stroke={outlineSoft} strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M 168 112 Q 176 113, 186 115" stroke={outlineSoft} strokeWidth="0.8" fill="none" strokeLinecap="round" />
        {/* Whisker dots (where whiskers attach) */}
        <circle cx="168" cy="106" r="0.6" fill={outlineSoft} />
        <circle cx="168" cy="109" r="0.6" fill={outlineSoft} />
        <circle cx="168" cy="112" r="0.6" fill={outlineSoft} />

        {/* Blush (subtle warm patch on cheek) */}
        <ellipse cx="150" cy="108" rx="6" ry="3.5" fill={tertiary} opacity="0.28" />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Variant-specific accessory layers (drawn around the base cat)      */
/* ------------------------------------------------------------------ */

/** Welcome variant: sparkles + a "waving" paw (raised). */
function WelcomeAccessories({ uid }: { uid: string }) {
  return (
    <>
      <Sparkle className={`cat-sparkle-${uid}`} cx={34} cy={50} r={8} fill="var(--color-primary)" />
      <Sparkle className={`cat-sparkle-${uid}`} cx={172} cy={42} r={6} fill="var(--color-tertiary)" style={{ animationDelay: "0.5s" }} />
      <Sparkle className={`cat-sparkle-${uid}`} cx={30} cy={150} r={5} fill="var(--color-warn)" style={{ animationDelay: "1s" }} />
      <Sparkle className={`cat-sparkle-${uid}`} cx={180} cy={130} r={7} fill="var(--color-primary)" style={{ animationDelay: "0.7s" }} />
      <circle className={`cat-sparkle-${uid}`} cx={150} cy={30} r={2.5} fill="var(--color-secondary)" style={{ animationDelay: "0.3s" }} />
      <circle className={`cat-sparkle-${uid}`} cx={50} cy={90} r={2} fill="var(--color-primary)" style={{ animationDelay: "1.2s" }} />
    </>
  );
}

/** Theme variant: 3 color dots orbiting the cat. */
function ThemeAccessories({ uid }: { uid: string }) {
  return (
    <g className={`cat-orbit-${uid}`}>
      <circle cx={100} cy={20} r={6} fill="var(--color-primary)" />
      <circle cx={180} cy={100} r={5} fill="var(--color-tertiary)" />
      <circle cx={100} cy={180} r={5.5} fill="var(--color-warn)" />
      <circle cx={20} cy={100} r={5} fill="var(--color-secondary)" />
    </g>
  );
}

/** Folder variant: a folder icon below-left of the cat. */
function FolderAccessory({ uid }: { uid: string }) {
  return (
    <g className={`cat-folder-${uid}`}>
      <path
        d="M 18 158 L 18 178 Q 18 182, 22 182 L 58 182 Q 62 182, 62 178 L 62 162 L 38 162 L 34 158 Z"
        fill="var(--color-primary-container)"
        stroke="var(--color-primary)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Folder tab highlight */}
      <path d="M 22 160 L 34 160 L 34 158 L 22 158 Z" fill="var(--color-primary)" opacity="0.4" />
      {/* Poster peeking out */}
      <rect x="24" y="164" width="6" height="8" rx="1" fill="var(--color-tertiary)" opacity="0.7" />
      <rect x="32" y="164" width="6" height="8" rx="1" fill="var(--color-warn)" opacity="0.7" />
    </g>
  );
}

/** Permissions variant: a shield with checkmark floating to the right. */
function ShieldAccessory({ uid }: { uid: string }) {
  return (
    <g className={`cat-shield-${uid}`}>
      {/* Ripple behind shield */}
      <circle cx="168" cy="80" r="22" fill="none" stroke="var(--color-primary)" strokeWidth="1" opacity="0.25" />
      <circle cx="168" cy="80" r="16" fill="none" stroke="var(--color-primary)" strokeWidth="1" opacity="0.4" />
      {/* Shield */}
      <path
        d="M 156 62 L 180 62 L 180 80 Q 180 92, 168 98 Q 156 92, 156 80 Z"
        fill="var(--color-primary-container)"
        stroke="var(--color-primary)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* Checkmark */}
      <path d="M 162 78 L 167 83 L 175 73" stroke="var(--color-primary)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** Restore variant: falling data drops above the cat. */
function CloudAccessory({ uid }: { uid: string }) {
  return (
    <>
      {/* Small cloud up-left */}
      <g className={`cat-cloud-${uid}`}>
        <ellipse cx={45} cy={40} rx={14} ry={12} fill="var(--color-surface-3)" />
        <ellipse cx={62} cy={36} rx={18} ry={15} fill="var(--color-surface-3)" />
        <ellipse cx={78} cy={42} rx={13} ry={11} fill="var(--color-surface-3)" />
        <rect x={42} y={42} width={40} height={10} rx={5} fill="var(--color-surface-3)" />
      </g>
      {/* Falling data particles */}
      <g className={`cat-drop-1-${uid}`}>
        <rect x="50" y="58" width="5" height="5" rx="1.2" fill="var(--color-primary)" transform="rotate(20 52 60)" />
      </g>
      <g className={`cat-drop-2-${uid}`}>
        <circle cx="68" cy="60" r="3" fill="var(--color-tertiary)" />
      </g>
      <g className={`cat-drop-3-${uid}`}>
        <rect x="82" y="58" width="5" height="5" rx="1.2" fill="var(--color-warn)" transform="rotate(-15 84 60)" />
      </g>
      <g className={`cat-drop-4-${uid}`}>
        <circle cx="96" cy="62" r="2.6" fill="var(--color-primary)" opacity="0.85" />
      </g>
    </>
  );
}

/** Summary variant: a small growing bar chart to the right. */
function StatsAccessory({ uid }: { uid: string }) {
  return (
    <g transform="translate(0 0)">
      <rect className={`cat-bar-${uid} cat-bar-1-${uid}`} x="158" y="130" width="9" height="40" rx="2" fill="var(--color-primary)" />
      <rect className={`cat-bar-${uid} cat-bar-2-${uid}`} x="170" y="115" width="9" height="55" rx="2" fill="var(--color-tertiary)" />
      <rect className={`cat-bar-${uid} cat-bar-3-${uid}`} x="182" y="100" width="9" height="70" rx="2" fill="var(--color-warn)" />
      {/* Trend arrow */}
      <g className={`cat-trend-${uid}`}>
        <path d="M 158 122 L 170 108 L 182 96" stroke="var(--color-primary)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 178 96 L 184 96 L 184 102" stroke="var(--color-primary)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
}

/** Finish variant: confetti pieces around the cat. */
function FinishAccessories({ uid }: { uid: string }) {
  const pieces = [
    { x: 30, y: 40, c: "var(--color-primary)", r: -15, d: 0 },
    { x: 170, y: 35, c: "var(--color-tertiary)", r: 30, d: 0.3 },
    { x: 25, y: 100, c: "var(--color-warn)", r: 45, d: 0.6 },
    { x: 180, y: 90, c: "var(--color-secondary)", r: -30, d: 0.2 },
    { x: 45, y: 160, c: "var(--color-primary)", r: 60, d: 0.5 },
    { x: 165, y: 155, c: "var(--color-tertiary)", r: -45, d: 0.8 },
    { x: 95, y: 25, c: "var(--color-warn)", r: 15, d: 0.4 },
  ];
  return (
    <>
      {pieces.map((p, i) => (
        <rect
          key={i}
          className={`cat-confetti-${uid}`}
          x={p.x}
          y={p.y}
          width="6"
          height="6"
          rx="1.2"
          fill={p.c}
          transform={`rotate(${p.r} ${p.x + 3} ${p.y + 3})`}
          style={{ animationDelay: `${p.d}s` }}
        />
      ))}
      {/* Star burst above cat */}
      <Sparkle cx={100} cy={36} r={10} fill="var(--color-primary)" className={`cat-sparkle-${uid}`} />
      <Sparkle cx={80} cy={28} r={6} fill="var(--color-tertiary)" className={`cat-sparkle-${uid}`} style={{ animationDelay: "0.4s" }} />
      <Sparkle cx={120} cy={28} r={6} fill="var(--color-warn)" className={`cat-sparkle-${uid}`} style={{ animationDelay: "0.7s" }} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Animation styles per variant                                       */
/* ------------------------------------------------------------------ */

function buildAnimations(uid: string, variant: CatVariant): string {
  // Base animations shared by all variants
  const base = `
    .cat-body-${uid} {
      transform-origin: 100px 130px;
      animation: cat-breathe-${uid} 3.2s ease-in-out infinite;
    }
    @keyframes cat-breathe-${uid} {
      0%, 100% { transform: scale(1, 1); }
      50% { transform: scale(1.015, 1.025); }
    }
    .cat-tail-${uid} {
      transform-origin: 62px 124px;
      animation: cat-tail-${uid} 3.6s ease-in-out infinite;
    }
    @keyframes cat-tail-${uid} {
      0%, 100% { transform: rotate(${variant === "finish" ? -8 : -4}deg); }
      50% { transform: rotate(${variant === "finish" ? 18 : 12}deg); }
    }
    .cat-head-${uid} {
      transform-origin: 142px 100px;
    }
    .cat-blink-${uid} {
      transform-origin: 158px 96px;
      animation: cat-blink-${uid} 5s ease-in-out infinite;
    }
    @keyframes cat-blink-${uid} {
      0%, 90%, 100% { transform: scaleY(1); }
      93%, 96% { transform: scaleY(0.12); }
    }
    .cat-sparkle-${uid} {
      transform-box: fill-box;
      transform-origin: center;
      animation: cat-twinkle-${uid} 1.8s ease-in-out infinite;
    }
    @keyframes cat-twinkle-${uid} {
      0%, 100% { opacity: 0.3; transform: scale(0.6); }
      50% { opacity: 1; transform: scale(1.15); }
    }
    @media (prefers-reduced-motion: reduce) {
      .cat-body-${uid}, .cat-tail-${uid}, .cat-head-${uid},
      .cat-blink-${uid}, .cat-sparkle-${uid}, .cat-orbit-${uid},
      .cat-cloud-${uid}, .cat-drop-1-${uid}, .cat-drop-2-${uid},
      .cat-drop-3-${uid}, .cat-drop-4-${uid}, .cat-bar-${uid},
      .cat-trend-${uid}, .cat-confetti-${uid}, .cat-wave-${uid},
      .cat-folder-${uid}, .cat-shield-${uid} {
        animation: none !important;
      }
    }
  `;

  // Variant-specific animations
  let variantCss = "";
  switch (variant) {
    case "welcome":
      variantCss = `
        .cat-wave-${uid} {
          transform-origin: 124px 154px;
          animation: cat-wave-${uid} 1.6s ease-in-out infinite;
        }
        @keyframes cat-wave-${uid} {
          0%, 100% { transform: rotate(-12deg); }
          50% { transform: rotate(20deg); }
        }
        .cat-head-${uid} {
          animation: cat-head-tilt-${uid} 5s ease-in-out infinite;
        }
        @keyframes cat-head-tilt-${uid} {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(-4deg); }
          70% { transform: rotate(2deg); }
        }
      `;
      break;
    case "theme":
      variantCss = `
        .cat-orbit-${uid} {
          transform-box: fill-box;
          transform-origin: 100px 100px;
          animation: cat-orbit-${uid} 9s linear infinite;
        }
        @keyframes cat-orbit-${uid} {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .cat-head-${uid} {
          animation: cat-head-tilt-${uid} 6s ease-in-out infinite;
        }
        @keyframes cat-head-tilt-${uid} {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-3deg); }
        }
      `;
      break;
    case "folder":
      variantCss = `
        .cat-folder-${uid} {
          transform-box: fill-box;
          transform-origin: center;
          animation: cat-folder-bob-${uid} 3s ease-in-out infinite;
        }
        @keyframes cat-folder-bob-${uid} {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `;
      break;
    case "permissions":
      variantCss = `
        .cat-shield-${uid} {
          transform-box: fill-box;
          transform-origin: center;
          animation: cat-shield-float-${uid} 3.4s ease-in-out infinite;
        }
        @keyframes cat-shield-float-${uid} {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.04); }
        }
        .cat-head-${uid} {
          animation: cat-head-tilt-${uid} 5s ease-in-out infinite;
        }
        @keyframes cat-head-tilt-${uid} {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2deg); }
        }
      `;
      break;
    case "restore":
      variantCss = `
        .cat-cloud-${uid} {
          transform-box: fill-box;
          transform-origin: center;
          animation: cat-float-${uid} 3.5s ease-in-out infinite;
        }
        @keyframes cat-float-${uid} {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .cat-drop-1-${uid} { transform-box: fill-box; transform-origin: center; animation: cat-drop-${uid} 2.2s ease-in infinite 0s; }
        .cat-drop-2-${uid} { transform-box: fill-box; transform-origin: center; animation: cat-drop-${uid} 2.2s ease-in infinite 0.55s; }
        .cat-drop-3-${uid} { transform-box: fill-box; transform-origin: center; animation: cat-drop-${uid} 2.2s ease-in infinite 1.1s; }
        .cat-drop-4-${uid} { transform-box: fill-box; transform-origin: center; animation: cat-drop-${uid} 2.2s ease-in infinite 1.65s; }
        @keyframes cat-drop-${uid} {
          0% { transform: translateY(-6px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(32px); opacity: 0; }
        }
        .cat-head-${uid} {
          animation: cat-head-tilt-${uid} 4s ease-in-out infinite;
        }
        @keyframes cat-head-tilt-${uid} {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-5deg); }
        }
      `;
      break;
    case "summary":
      variantCss = `
        .cat-bar-${uid} { transform-box: fill-box; transform-origin: bottom; }
        .cat-bar-1-${uid} { animation: cat-grow-${uid} 1.4s var(--ease-emphasized-decel) 0.1s both; }
        .cat-bar-2-${uid} { animation: cat-grow-${uid} 1.4s var(--ease-emphasized-decel) 0.25s both; }
        .cat-bar-3-${uid} { animation: cat-grow-${uid} 1.4s var(--ease-emphasized-decel) 0.4s both; }
        @keyframes cat-grow-${uid} {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        .cat-trend-${uid} {
          transform-box: fill-box;
          transform-origin: bottom;
          animation: cat-bob-${uid} 2.4s ease-in-out infinite;
        }
        @keyframes cat-bob-${uid} {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `;
      break;
    case "finish":
      variantCss = `
        .cat-confetti-${uid} {
          transform-box: fill-box;
          transform-origin: center;
          animation: cat-confetti-fall-${uid} 2.4s ease-in infinite;
        }
        @keyframes cat-confetti-fall-${uid} {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(40px) rotate(180deg); opacity: 0; }
        }
        .cat-body-${uid} {
          animation: cat-breathe-${uid} 3.2s ease-in-out infinite,
                     cat-leap-${uid} 1.8s ease-in-out infinite;
        }
        @keyframes cat-leap-${uid} {
          0%, 100% { transform: scale(1, 1) translateY(0); }
          50% { transform: scale(1.02, 0.96) translateY(-6px); }
        }
      `;
      break;
  }

  return base + variantCss;
}

/* ------------------------------------------------------------------ */
/* Main CatIllustration component                                     */
/* ------------------------------------------------------------------ */

export function CatIllustration({ variant = "welcome", size = 200, className }: CatIllustrationProps) {
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, "");

  // Per-variant body configuration
  const config: Record<CatVariant, { headTilt: number; bodyLift: number; raisePaw: boolean }> = {
    welcome:    { headTilt: -5, bodyLift: 0,  raisePaw: true  },
    theme:      { headTilt: 0,  bodyLift: 0,  raisePaw: false },
    folder:     { headTilt: 8,  bodyLift: 0,  raisePaw: false },
    permissions:{ headTilt: 0,  bodyLift: 0,  raisePaw: false },
    restore:    { headTilt: -8, bodyLift: 0,  raisePaw: false },
    summary:    { headTilt: 0,  bodyLift: 0,  raisePaw: false },
    finish:     { headTilt: -8, bodyLift: 18, raisePaw: false },
  };

  const cfg = config[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={`Cat companion — ${variant}`}
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Body gradient: primary-container (top) → primary (bottom) */}
        <linearGradient id={`cat-body-grad-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="var(--color-primary-container)" />
          <stop offset="100%" stopColor="var(--color-primary)" />
        </linearGradient>
        {/* Head gradient: same as body */}
        <linearGradient id={`cat-head-grad-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="var(--color-primary-container)" />
          <stop offset="100%" stopColor="var(--color-primary)" />
        </linearGradient>
      </defs>

      <style>{buildAnimations(uid, variant)}</style>

      {/* Ground shadow (gives the cat weight; stays on ground even when leaping) */}
      <ellipse
        cx="100"
        cy={188}
        rx={cfg.bodyLift > 0 ? 50 : 58}
        ry={cfg.bodyLift > 0 ? 4.5 : 5}
        fill="rgba(0,0,0,0.22)"
        opacity={cfg.bodyLift > 0 ? 0.6 : 1}
      />

      {/* Variant accessories BEHIND the cat */}
      {variant === "welcome" && <WelcomeAccessories uid={uid} />}
      {variant === "theme" && <ThemeAccessories uid={uid} />}
      {variant === "folder" && <FolderAccessory uid={uid} />}
      {variant === "permissions" && <ShieldAccessory uid={uid} />}
      {variant === "restore" && <CloudAccessory uid={uid} />}
      {variant === "summary" && <StatsAccessory uid={uid} />}
      {variant === "finish" && <FinishAccessories uid={uid} />}

      {/* The cat body itself — finish variant tilts nose-up for leap pose */}
      {variant === "finish" ? (
        <g transform="rotate(-8 100 140)">
          <CatBody
            uid={uid}
            headTilt={cfg.headTilt}
            bodyLift={cfg.bodyLift}
            raisePaw={cfg.raisePaw}
            tailSway={1.5}
          />
        </g>
      ) : (
        <CatBody
          uid={uid}
          headTilt={cfg.headTilt}
          bodyLift={cfg.bodyLift}
          raisePaw={cfg.raisePaw}
          tailSway={1}
        />
      )}
    </svg>
  );
}

export default CatIllustration;
