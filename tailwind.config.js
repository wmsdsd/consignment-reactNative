/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                primary: '#000000',
                secondary: '#3400A2',
                tertiary: '#1E1E1E',
                'card-assign': 'rgba(137,198,151,0.3)',
                'card-receive': 'rgba(99,151,255,0.3)',
                'card-dispute': 'rgba(226,118,118,0.3)',
                'card-primary': 'rgba(112,76,189,0.3)',
            },
        },
    },
    plugins: [],
};
