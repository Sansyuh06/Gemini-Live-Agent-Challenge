import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	extend: {
    		fontFamily: {
    			kiddo: [
    				'Fredoka One',
    				'cursive'
    			],
    			story: [
    				'Baloo 2',
    				'cursive'
    			],
    			sans: [
    				'Baloo 2',
    				'Inter',
    				'ui-sans-serif',
    				'system-ui',
    				'sans-serif',
    				'Apple Color Emoji',
    				'Segoe UI Emoji',
    				'Segoe UI Symbol',
    				'Noto Color Emoji'
    			],
    			serif: [
    				'ui-serif',
    				'Georgia',
    				'Cambria',
    				'Times New Roman',
    				'Times',
    				'serif'
    			],
    			mono: [
    				'ui-monospace',
    				'SFMono-Regular',
    				'Menlo',
    				'Monaco',
    				'Consolas',
    				'Liberation Mono',
    				'Courier New',
    				'monospace'
    			]
    		},
    		colors: {
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			kiddo: {
    				coral: 'hsl(var(--kiddo-coral))',
    				'coral-glow': 'hsl(var(--kiddo-coral-glow))',
    				sky: 'hsl(var(--kiddo-sky))',
    				sunshine: 'hsl(var(--kiddo-sunshine))',
    				mint: 'hsl(var(--kiddo-mint))',
    				lavender: 'hsl(var(--kiddo-lavender))',
    				peach: 'hsl(var(--kiddo-peach))'
    			},
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: { height: '0' },
    				to: { height: 'var(--radix-accordion-content-height)' }
    			},
    			'accordion-up': {
    				from: { height: 'var(--radix-accordion-content-height)' },
    				to: { height: '0' }
    			},
    			'fade-in': {
    				'0%': { opacity: '0', transform: 'translateY(10px)' },
    				'100%': { opacity: '1', transform: 'translateY(0)' }
    			},
    			'fade-out': {
    				'0%': { opacity: '1', transform: 'translateY(0)' },
    				'100%': { opacity: '0', transform: 'translateY(10px)' }
    			},
    			'scale-in': {
    				'0%': { transform: 'scale(0.95)', opacity: '0' },
    				'100%': { transform: 'scale(1)', opacity: '1' }
    			},
    			'slide-in-right': {
    				'0%': { transform: 'translateX(100%)' },
    				'100%': { transform: 'translateX(0)' }
    			},
    			'bounce-in': {
    				'0%': { transform: 'scale(0.3)', opacity: '0' },
    				'50%': { transform: 'scale(1.08)' },
    				'70%': { transform: 'scale(0.95)' },
    				'100%': { transform: 'scale(1)', opacity: '1' }
    			},
    			'star-pop': {
    				'0%': { transform: 'scale(0) translateY(0)', opacity: '0' },
    				'50%': { transform: 'scale(1.3) translateY(-8px)', opacity: '1' },
    				'100%': { transform: 'scale(1) translateY(-16px)', opacity: '0' }
    			},
    			'level-up': {
    				'0%': { transform: 'scale(1) rotate(0deg)' },
    				'25%': { transform: 'scale(1.2) rotate(-5deg)' },
    				'50%': { transform: 'scale(1.3) rotate(5deg)' },
    				'75%': { transform: 'scale(1.1) rotate(-3deg)' },
    				'100%': { transform: 'scale(1) rotate(0deg)' }
    			},
    			'wiggle': {
    				'0%, 100%': { transform: 'rotate(0deg)' },
    				'15%': { transform: 'rotate(-8deg)' },
    				'30%': { transform: 'rotate(6deg)' },
    				'45%': { transform: 'rotate(-4deg)' },
    				'60%': { transform: 'rotate(2deg)' },
    				'75%': { transform: 'rotate(-1deg)' }
    			},
    			'float': {
    				'0%, 100%': { transform: 'translateY(0)' },
    				'50%': { transform: 'translateY(-8px)' }
    			},
    			'sparkle': {
    				'0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
    				'50%': { opacity: '1', transform: 'scale(1.2)' }
    			},
    			'slide-up': {
    				'0%': { transform: 'translateY(100%)', opacity: '0' },
    				'100%': { transform: 'translateY(0)', opacity: '1' }
    			},
    			'pulse-badge': {
    				'0%, 100%': { transform: 'scale(1)' },
    				'50%': { transform: 'scale(1.1)' }
    			},
    			'spin-slow': {
    				'0%': { transform: 'rotate(0deg)' },
    				'100%': { transform: 'rotate(360deg)' }
    			},
    			'card-hover': {
    				'0%': { transform: 'translateY(0)' },
    				'100%': { transform: 'translateY(-4px)' }
    			},
    			'progress-fill': {
    				'0%': { width: '0%' },
    				'100%': { width: 'var(--progress-width, 100%)' }
    			},
    			'bounce-gentle': {
    				'0%, 100%': { transform: 'translateY(0)' },
    				'50%': { transform: 'translateY(-4px)' }
    			},
    			'shake': {
    				'0%, 100%': { transform: 'translateX(0)' },
    				'10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
    				'20%, 40%, 60%, 80%': { transform: 'translateX(4px)' }
    			},
    			'streak-fire': {
    				'0%, 100%': { transform: 'scale(1) rotate(0deg)' },
    				'25%': { transform: 'scale(1.15) rotate(-3deg)' },
    				'75%': { transform: 'scale(1.15) rotate(3deg)' }
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'fade-in': 'fade-in 0.3s ease-out forwards',
    			'fade-out': 'fade-out 0.3s ease-out forwards',
    			'scale-in': 'scale-in 0.2s ease-out forwards',
    			'slide-in-right': 'slide-in-right 0.3s ease-out',
    			'bounce-in': 'bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards',
    			'star-pop': 'star-pop 0.8s ease-out forwards',
    			'level-up': 'level-up 0.6s ease-in-out',
    			'wiggle': 'wiggle 0.5s ease-in-out',
    			'float': 'float 3s ease-in-out infinite',
    			'sparkle': 'sparkle 2s ease-in-out infinite',
    			'shake': 'shake 0.5s ease-in-out',
    			'slide-up': 'slide-up 0.4s ease-out forwards',
    			'pulse-badge': 'pulse-badge 2s ease-in-out infinite',
    			'spin-slow': 'spin-slow 3s linear infinite',
    			'card-hover': 'card-hover 0.2s ease-out forwards',
    			'progress-fill': 'progress-fill 1s ease-out forwards',
    			'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
    			'streak-fire': 'streak-fire 1.5s ease-in-out infinite'
    		}
    	}
    },
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
