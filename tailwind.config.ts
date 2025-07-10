import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

import { light } from 'daisyui/src/theming/themes'

const config: Config = {
    darkMode: 'class',
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                transparent: 'transparent',
                current: 'currentColor',
                light: '#F2F5F9',
                primary: '#015FC9',
            },
            fontFamily: {
                'roboto-condensed': ['"Roboto Condensed"', 'sans-serif'],
                'dm-sans': ['"DM Sans"', 'sans-serif'],
            },
        },
        container: {
            padding: {
                DEFAULT: '1rem',
                sm: '2rem',
                lg: '3rem',
                xl: '4rem',
                '2xl': '5rem',
            },
        },
        screens: {
            sm: '640px',

            md: '768px',

            lg: '1024px',

            xl: '1280px',

            '2xl': '1536px',
        },
    },
    daisyui: {
        themes: [
            {
                light: {
                    ...light,
                    primary: '#1547ce',
                    secondary: '#F2F5F9',
                },
            },
            'dark',
        ],
    },

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    plugins: [daisyui, require('tailwind-scrollbar')],
}

export default config
