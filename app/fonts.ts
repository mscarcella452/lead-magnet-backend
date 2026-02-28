import { Plus_Jakarta_Sans, Roboto } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'optional', // ✅ best balance for performance
  variable: '--font-plus-jakarta-sans',
  preload: true, // ✅ since it's your main UI font
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], // choose the weights you need
  variable: '--font-roboto', // optional if you want to use it as a CSS variable
});

export { plusJakartaSans, roboto };
