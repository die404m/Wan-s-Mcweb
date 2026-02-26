// 图片压缩工具函数

/**
 * 压缩图片
 * @param {File|string} image - 图片文件或URL
 * @param {number} maxSizeKB - 最大文件大小（KB）
 * @param {number} maxWidth - 最大宽度
 * @param {number} quality - 图片质量 (0-1)
 * @returns {Promise<Blob>} 压缩后的图片Blob
 */
export async function compressImage(image, maxSizeKB = 500, maxWidth = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
      // 计算新尺寸
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // 绘制图片到canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // 压缩图片
      canvas.toBlob((blob) => {
        if (blob.size <= maxSizeKB * 1024) {
          resolve(blob);
        } else {
          // 如果仍然太大，进一步降低质量
          compressImage(image, maxSizeKB, maxWidth, quality * 0.8)
            .then(resolve)
            .catch(reject);
        }
      }, 'image/jpeg', quality);
    };
    
    img.onerror = reject;
    
    if (typeof image === 'string') {
      img.src = image;
    } else if (image instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(image);
    } else {
      reject(new Error('不支持的图片类型'));
    }
  });
}

/**
 * 创建缩略图
 * @param {string} imageUrl - 图片URL
 * @param {number} width - 缩略图宽度
 * @param {number} height - 缩略图高度
 * @returns {Promise<string>} 缩略图DataURL
 */
export async function createThumbnail(imageUrl, width = 400, height = 225) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = width;
    canvas.height = height;
    
    img.onload = function() {
      // 计算缩放比例
      const scale = Math.min(width / img.width, height / img.height);
      const newWidth = img.width * scale;
      const newHeight = img.height * scale;
      
      // 居中绘制
      const x = (width - newWidth) / 2;
      const y = (height - newHeight) / 2;
      
      ctx.drawImage(img, x, y, newWidth, newHeight);
      
      // 转换为DataURL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      resolve(dataUrl);
    };
    
    img.onerror = reject;
    img.src = imageUrl;
  });
}

/**
 * 检查图片是否需要压缩
 * @param {string} imageUrl - 图片URL
 * @returns {Promise<boolean>} 是否需要压缩
 */
export async function needsCompression(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function() {
      // 如果图片宽度超过1200px或文件大小可能超过500KB，则需要压缩
      const needs = img.width > 1200 || img.height > 1200;
      resolve(needs);
    };
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
}

/**
 * 获取图片信息
 * @param {string} imageUrl - 图片URL
 * @returns {Promise<object>} 图片信息
 */
export async function getImageInfo(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function() {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
        size: null // 无法直接获取网络图片的文件大小
      });
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}

/**
 * 批量压缩图片
 * @param {Array} images - 图片数组
 * @param {object} options - 压缩选项
 * @returns {Promise<Array>} 压缩后的图片数组
 */
export async function compressImages(images, options = {}) {
  const {
    maxSizeKB = 500,
    maxWidth = 1200,
    quality = 0.8
  } = options;
  
  const compressedImages = [];
  
  for (const image of images) {
    try {
      const compressed = await compressImage(image, maxSizeKB, maxWidth, quality);
      compressedImages.push({
        original: image,
        compressed: compressed,
        size: compressed.size
      });
    } catch (error) {
      console.warn('图片压缩失败:', error);
      compressedImages.push({
        original: image,
        compressed: null,
        error: error.message
      });
    }
  }
  
  return compressedImages;
}