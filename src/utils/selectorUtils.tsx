export const preventKeyDownScroll = (e: KeyboardEvent) => {
  switch (e.keyCode) {
    case 38:
    case 40:
    case 32: // Arrow keys
      e.preventDefault();
      break; // Space
    default:
      break; // do not block other keys
  }
};
