// Phosphor icons (regular and fill weights), inlined at build time. No hand-drawn icon paths.
import phone from '@phosphor-icons/core/assets/regular/phone.svg?raw';
import whatsapp from '@phosphor-icons/core/assets/regular/whatsapp-logo.svg?raw';
import envelope from '@phosphor-icons/core/assets/regular/envelope-simple.svg?raw';
import arrowRight from '@phosphor-icons/core/assets/regular/arrow-right.svg?raw';
import caretDown from '@phosphor-icons/core/assets/regular/caret-down.svg?raw';
import caretLeft from '@phosphor-icons/core/assets/regular/caret-left.svg?raw';
import caretRight from '@phosphor-icons/core/assets/regular/caret-right.svg?raw';
import list from '@phosphor-icons/core/assets/regular/list.svg?raw';
import x from '@phosphor-icons/core/assets/regular/x.svg?raw';
import star from '@phosphor-icons/core/assets/fill/star-fill.svg?raw';
import facebook from '@phosphor-icons/core/assets/regular/facebook-logo.svg?raw';
import instagram from '@phosphor-icons/core/assets/regular/instagram-logo.svg?raw';
import upload from '@phosphor-icons/core/assets/regular/upload-simple.svg?raw';
import checkCircle from '@phosphor-icons/core/assets/regular/check-circle.svg?raw';
import warning from '@phosphor-icons/core/assets/regular/warning-circle.svg?raw';
import arrowsLR from '@phosphor-icons/core/assets/regular/arrows-left-right.svg?raw';
import mapPin from '@phosphor-icons/core/assets/regular/map-pin.svg?raw';
import googleLogo from '@phosphor-icons/core/assets/regular/google-logo.svg?raw';
import arrowsOut from '@phosphor-icons/core/assets/regular/arrows-out.svg?raw';

export const icons = {
  phone, whatsapp, envelope, arrowRight, caretDown, caretLeft, caretRight, list, x, star,
  facebook, instagram, upload, checkCircle, warning, arrowsLR, mapPin, googleLogo, arrowsOut,
} as const;
export type IconName = keyof typeof icons;
