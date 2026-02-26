// API端点：提供字体配置
import { websiteConfig } from '../../config/website.config.js';

export async function GET({ params, request }) {
  try {
    // 从配置中提取字体设置
    const fontConfig = websiteConfig.fonts || {
      main: {
        family: '像素体',
        file: '/fonts/像素体.ttf',
        fallback: "'Quicksand', 'Noto Sans SC', sans-serif",
        weight: 'normal'
      },
      title: {
        family: '像素体',
        file: '/fonts/像素体.ttf',
        fallback: "'Quicksand', 'Noto Sans SC', sans-serif",
        weight: 'bold'
      }
    };

    return new Response(JSON.stringify(fontConfig), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('字体配置API错误:', error);
    
    // 返回默认配置
    const defaultConfig = {
      main: {
        family: '像素体',
        file: '/fonts/像素体.ttf',
        fallback: "'Quicksand', 'Noto Sans SC', sans-serif",
        weight: 'normal'
      },
      title: {
        family: '像素体',
        file: '/fonts/像素体.ttf',
        fallback: "'Quicksand', 'Noto Sans SC', sans-serif",
        weight: 'bold'
      }
    };

    return new Response(JSON.stringify(defaultConfig), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}