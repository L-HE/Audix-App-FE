/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind 2.0에서는 content 대신 presets 사용
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./shared/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // 주요 색상
        danger: '#FF3116',
        warning: '#FFC525',
        normal: '#1CAA00',
        unknown: '#D7D7D7',

        // CSS 변수를 TailwindCSS 색상으로 등록
        'custom-danger': 'var(--color-danger)',
        'custom-warning': 'var(--color-warning)',
        'custom-normal': 'var(--color-normal)',
        'custom-unknown': 'var(--color-unknown)',
        
        // 배경색
        'bg-primary': '#fff',
        'bg-secondary': '#f2f2f2',
        
        // 텍스트 색상
        'text-primary': '#000',
        'text-secondary': '#666',
        'text-tertiary': '#777',
        
        // 보더 색상
        'border-primary': '#656565',
        'border-light': '#e0e0e0',
      },
      fontFamily: {
        // 폰트 패밀리 추가 (필요시)
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      spacing: {
        // 앱 전용 스페이싱
        'header': '120px',
        'bottom-nav': '60px',
        'safe-top': '44px',
        'safe-bottom': '34px',
      },
      borderRadius: {
        // 커스텀 보더 반지름
        'xl': '12px',
        '2xl': '16px',
      },
      shadows: {
        // 커스텀 그림자
        'card': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'elevated': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      zIndex: {
        // 레이어 관리
        'header': '100',
        'navigation': '200',
        'modal': '1000',
        'overlay': '9999',
      }
    },
  },
  plugins: [],
}

