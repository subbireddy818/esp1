/**
 * BattleZone — Tactical Operations Palette
 * High-contrast, military-industrial aesthetic.
 * Dark Zinc backgrounds with Amber (Warning) and Cyan (System) accents.
 */

export const Colors = {
  // ── Primary Accents ──
  primary: '#EAB308',        // Tactical Gold / Warning
  gold: '#EAB308',           // Explicit Gold
  primaryDim: '#CA8A04',
  primaryGlow: 'rgba(234, 179, 8, 0.15)',

  accent: '#06B6D4',         // System Cyan / Data link
  accentDim: '#0891B2',
  accentGlow: 'rgba(6, 182, 212, 0.15)',

  // ── Semantic ──
  success: '#10B981',        // Emerald 500
  successDim: '#059669',
  danger: '#EF4444',         // Red 500
  dangerDim: '#DC2626',
  warning: '#F59E0B',        // Amber 500
  info: '#3B82F6',           // Blue 500

  // ── Backgrounds ──
  background: '#09090B',     // Zinc 950 (Deep Void)
  backgroundLight: '#18181B',// Zinc 900
  surface: '#18181B',        // Zinc 900
  surfaceLight: '#27272A',   // Zinc 800
  surfaceLighter: '#3F3F46', // Zinc 700
  card: '#121214',           // Slightly lighter than bg

  // ── Borders ──
  border: '#27272A',         // Zinc 800
  borderLight: '#3F3F46',    // Zinc 700
  borderAccent: 'rgba(234, 179, 8, 0.5)', // Gold border

  // ── Text ──
  textPrimary: '#FAFAFA',    // Zinc 50
  textSecondary: '#A1A1AA',  // Zinc 400
  textMuted: '#52525B',      // Zinc 600
  textAccent: '#EAB308',     // Gold text

  // ── Gradients ──
  gradientPrimary: ['#EAB308', '#CA8A04'] as const, // Gold to Dark Gold
  gradientGold: ['#EAB308', '#CA8A04'] as const,
  gradientCyan: ['#06B6D4', '#0891B2'] as const,
  gradientDark: ['#09090B', '#18181B'] as const,
  gradientCard: ['#18181B', '#121214'] as const,    // Subtle metal sheen
  gradientSurface: ['#27272A', '#18181B'] as const,
  gradientBonfire: ['#F59E0B', '#EF4444'] as const, // Fire
  gradientDanger: ['#EF4444', '#DC2626'] as const,  // Red gradient for full slots

  // ── Tier Colors (Military Ranks) ──
  tierBronze: '#78350F',     // Bronze
  tierSilver: '#94A3B8',     // Slate 400
  tierGold: '#FBBF24',       // Amber 400
  tierPlatinum: '#22D3EE',   // Cyan 400
  tierDiamond: '#818CF8',    // Indigo 400
  tierConqueror: '#DC2626',  // Red 600

  // ── Overlay ──
  overlay: 'rgba(9, 9, 11, 0.85)', // Zinc 950 with opacity

  // ── Tab bar ──
  tabBar: '#09090B',
  tabBarBorder: '#27272A',
  tabInactive: '#52525B',
  tabActive: '#EAB308',

  // ── Theme Schemas (Compatibility) ──
  light: {
    text: '#09090B',
    background: '#FAFAFA',
    tint: '#EAB308',
    icon: '#52525B',
    tabIconDefault: '#52525B',
    tabIconSelected: '#EAB308',
  },
  dark: {
    text: '#FAFAFA',
    background: '#09090B',
    tint: '#EAB308',
    icon: '#A1A1AA',
    tabIconDefault: '#A1A1AA',
    tabIconSelected: '#EAB308',
  },
};
