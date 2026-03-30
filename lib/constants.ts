/** JPEG sequence in /public/sequence1/ */
export const SEQUENCE_BASE = "/sequence1";
export const FRAME_COUNT = 120;
export const FRAME_PREFIX = "ezgif-frame-";
export const FRAME_PAD = 3;
export const FRAME_EXT = ".jpg";

export function frameUrl(index: number): string {
  const n = Math.min(Math.max(0, index), FRAME_COUNT - 1);
  const padded = String(n + 1).padStart(FRAME_PAD, "0");
  return `${SEQUENCE_BASE}/${FRAME_PREFIX}${padded}${FRAME_EXT}`;
}

export const HERO_SCROLL_VH = 4;
