import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  shortcuts: [
    // 布局相关
    ['flex-center', 'flex items-center justify-center'],
    ['flex-between', 'flex items-center justify-between'],
    ['flex-col-center', 'flex flex-col items-center justify-center'],
    
    // 按钮样式
    ['btn', 'px-4 py-2 rounded cursor-pointer border-none outline-none'],
    ['btn-primary', 'btn bg-blue-500 text-white hover:bg-blue-600'],
    ['btn-secondary', 'btn bg-gray-500 text-white hover:bg-gray-600'],
    
    // 卡片样式
    ['card', 'bg-white rounded-lg shadow-sm border border-gray-200'],
    ['card-header', 'px-6 py-4 border-b border-gray-200'],
    ['card-body', 'px-6 py-4'],
    
    // 表单样式
    ['form-item', 'mb-4'],
    ['form-label', 'block text-sm font-medium text-gray-700 mb-2'],
    ['form-input', 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'],
  ],
  theme: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
    },
  },
})
