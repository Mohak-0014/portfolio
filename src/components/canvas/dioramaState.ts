/**
 * Lightweight shared signal for the diorama, written each frame by the
 * camera rig and read by every focusable prop — without React re-renders.
 *
 * `focus` is a floating section index (0 = hero/wide, 1 = about, …). A prop
 * whose own index is closest to `focus` lifts, scales up and lights its glow.
 */
export const dioramaState = {
  focus: 0,
};
