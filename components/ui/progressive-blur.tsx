"use client"

import React from "react"

import { cn } from "@/lib/utils"

export type BlurPreset = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"

/**
 * Pre-defined blur level arrays, each with 8 stops (required by the layer logic).
 *
 * | Preset   | Max blur | Character                                      |
 * |----------|----------|------------------------------------------------|
 * | xs |   2 px   | Almost imperceptible — frosted-glass whisper   |
 * | sm    |   4 px   | Gentle fade, content still legible beneath     |
 * | md     |   8 px   | Default feel, smooth editorial blur            |
 * | lg   |  16 px   | Noticeable depth, good for hero overlays       |
 * | xl   |  32 px   | Bold separation between layers                 |
 * | 2xl    |  64 px   | Dense frosted glass, content fully obscured    |
 * | 3xl  | 128 px   | Opaque-feeling wall of blur                    |
 */
export const BLUR_PRESETS: Record<BlurPreset, number[]> = {
  xs: [0.1, 0.25, 0.5, 0.75, 0.9, 1.2, 1.5, 2],
  sm: [0.25, 0.5, 1, 1.5, 1, 2, 3, 4],
  md: [0.5, 1, 2, 3, 4, 5, 6.5, 8],
  lg: [0.5, 1, 2, 4, 6, 8, 12, 16],
  xl: [0.5, 1, 2, 4, 8, 16, 24, 32],
  '2xl': [1, 2, 4, 8, 16, 24, 32, 64],
  '3xl': [1, 2, 4, 8, 16, 32, 64, 128],
}

/**
 * The direction the blur gradient flows toward (i.e. where the opaque/blurred
 * end of the gradient is). Think of it like a CSS `background: linear-gradient`
 * direction — "left" means the blur fades from right (transparent) to left (blurry).
 *
 * - "top"    – blurry at the top, fades downward to transparent
 * - "bottom" – blurry at the bottom, fades upward to transparent  (default)
 * - "left"   – blurry at the left, fades rightward to transparent
 * - "right"  – blurry at the right, fades leftward to transparent
 */
export type BlurDirection = "top" | "bottom" | "left" | "right"

/**
 * Which edge of the parent the blur band is anchored to.
 * Entirely independent from `direction` — you can anchor to the right edge
 * while the blur gradient flows leftward, or any other combination.
 *
 * - "top"    – pinned to the top edge
 * - "bottom" – pinned to the bottom edge  (default)
 * - "left"   – pinned to the left edge
 * - "right"  – pinned to the right edge
 */
export type BlurPosition = "top" | "bottom" | "left" | "right"

export interface ProgressiveBlurProps {
  className?: string
  /**
   * Size of the blur band along its main axis.
   * For top/bottom positions this is the height; for left/right it is the width.
   * Accepts any valid CSS length value. Default: "30%".
   */
  height?: string
  /**
   * The direction the blur gradient flows toward (where the opaque/blurry end is).
   *
   * - "top"    – blurry at top, transparent toward bottom
   * - "bottom" – blurry at bottom, transparent toward top  (default)
   * - "left"   – blurry at left, transparent toward right
   * - "right"  – blurry at right, transparent toward left
   */
  direction?: BlurDirection
  /**
   * Which edge of the parent the blur band is anchored/pinned to.
   * Defaults to match `direction` when omitted (original behaviour).
   *
   * - "top"    – pinned to the top edge
   * - "bottom" – pinned to the bottom edge
   * - "left"   – pinned to the left edge
   * - "right"  – pinned to the right edge
   */
  position?: BlurPosition
  /**
   * Overrides `preset` when provided. Useful for fully custom blur curves.
   * Must contain exactly 8 values (ascending recommended).
   */
  blurLevels?: number[]
  children?: React.ReactNode
  /**
   * Selects a pre-defined set of blur stops.
   * Ignored when `blurLevels` is explicitly provided.
   *
   * - "xs"  – almost imperceptible whisper of blur
   * - "sm"   – gentle fade, content still legible
   * - "md"    – smooth editorial blur (default)
   * - "lg"  – noticeable depth, good for hero overlays
   * - "xl"  – bold layer separation
   * - "2xl"   – dense frosted glass
   * - "3xl" – opaque-feeling wall of blur
   */
  preset?: BlurPreset

  // ── Legacy prop (kept for backwards compatibility) ───────────────────────
  /** @deprecated Use `direction` + `position` separately instead. */
  orientation?: "vertical" | "horizontal"
}

// ─── gradient helpers ────────────────────────────────────────────────────────

/**
 * CSS `linear-gradient` direction token for each BlurDirection.
 * The gradient flows FROM transparent TO opaque in this direction.
 */
const GRADIENT_DIRECTION: Record<BlurDirection, string> = {
  top: "to top",
  bottom: "to bottom",
  left: "to left",
  right: "to right",
}

function buildFirstLayerMask(gradientDir: string): string {
  return `linear-gradient(${gradientDir}, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 37.5%)`
}

function buildMiddleLayerMask(gradientDir: string, blurIndex: number): string {
  const s = blurIndex * 12.5
  const m = (blurIndex + 1) * 12.5
  const e = (blurIndex + 2) * 12.5
  const f = e + 12.5
  return `linear-gradient(${gradientDir}, rgba(0,0,0,0) ${s}%, rgba(0,0,0,1) ${m}%, rgba(0,0,0,1) ${e}%, rgba(0,0,0,0) ${f}%)`
}

function buildLastLayerMask(gradientDir: string): string {
  return `linear-gradient(${gradientDir}, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%)`
}

// ─── anchor classes ──────────────────────────────────────────────────────────

/**
 * Tailwind classes that pin the wrapper to a specific edge.
 * Only the relevant axis edges are set — the opposite edge is left free so
 * consumers can override it via `className` without needing `!`.
 */
const ANCHOR_CLASS: Record<BlurPosition, string> = {
  top: "top-0    left-0 right-0  w-full  [height:var(--pb-size)]",
  bottom: "bottom-0 left-0 right-0  w-full  [height:var(--pb-size)]",
  left: "left-0   top-0  bottom-0 h-full  [width:var(--pb-size)]",
  right: "right-0  top-0  bottom-0 h-full  [width:var(--pb-size)]",
}

// ─── component ───────────────────────────────────────────────────────────────

export function ProgressiveBlur({
  className,
  height = "30%",
  direction = "bottom",
  position,
  blurLevels,
  preset = "md",
}: ProgressiveBlurProps) {
  // When `position` is omitted it defaults to match `direction` (original behaviour).
  const resolvedPosition: BlurPosition = position ?? direction
  const gradientDir = GRADIENT_DIRECTION[direction]

  // Resolve blur levels: explicit array wins over preset.
  const resolvedBlurLevels = blurLevels ?? BLUR_PRESETS[preset]

  // Middle layers = total - 2 (first & last handled separately)
  const middleLayers = Array(resolvedBlurLevels.length - 2).fill(null)

  // ─── render ──────────────────────────────────────────────────────────────

  return (
    <div
      className={cn(
        "gradient-blur pointer-events-none absolute z-10",
        ANCHOR_CLASS[resolvedPosition],
        className,
      )}
      style={{ "--pb-size": height } as React.CSSProperties}
    >
      {/* First blur layer */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          backdropFilter: `blur(${resolvedBlurLevels[0]}px)`,
          WebkitBackdropFilter: `blur(${resolvedBlurLevels[0]}px)`,
          maskImage: buildFirstLayerMask(gradientDir),
          WebkitMaskImage: buildFirstLayerMask(gradientDir),
        }}
      />

      {/* Middle blur layers */}
      {middleLayers.map((_, index) => {
        const blurIndex = index + 1
        const mask = buildMiddleLayerMask(gradientDir, blurIndex)

        return (
          <div
            key={`blur-${index}`}
            className="absolute inset-0"
            style={{
              zIndex: index + 2,
              backdropFilter: `blur(${resolvedBlurLevels[blurIndex]}px)`,
              WebkitBackdropFilter: `blur(${resolvedBlurLevels[blurIndex]}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        )
      })}

      {/* Last blur layer */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: resolvedBlurLevels.length,
          backdropFilter: `blur(${resolvedBlurLevels[resolvedBlurLevels.length - 1]}px)`,
          WebkitBackdropFilter: `blur(${resolvedBlurLevels[resolvedBlurLevels.length - 1]}px)`,
          maskImage: buildLastLayerMask(gradientDir),
          WebkitMaskImage: buildLastLayerMask(gradientDir),
        }}
      />
    </div>
  )
}