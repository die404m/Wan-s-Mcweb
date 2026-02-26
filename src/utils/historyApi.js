// 历程API工具函数

/**
 * 解析文件名获取日期、标题和作者
 * @param {string} fileName - 文件名，格式如 "2025-05-28_编码全物品_Wan_wan,Ex"
 * @returns {object} 解析后的对象
 */
export function parseFileName(fileName) {
  // 移除文件后缀名
  const fileNameWithoutExt = fileName.replace(/\.[^.]+$/, '');
  
  const parts = fileNameWithoutExt.split('_');
  if (parts.length < 3) {
    return {
      date: fileNameWithoutExt,
      title: fileNameWithoutExt,
      authors: ['未知作者']
    };
  }
  
  const date = parts[0];
  const title = parts[1];
  // 第二个下划线后面的所有内容作为作者信息
  const authorsPart = parts.slice(2).join('_');
  
  // 按逗号分割作者，并保留下划线
  const authors = authorsPart.split(',').map(author => author.trim());
  
  return {
    date: date,
    title: title.replace(/[-_]/g, ' '),
    authors: authors
  };
}

/**
 * 生成缩略图URL
 * @param {string} originalUrl - 原始图片URL
 * @param {number} width - 缩略图宽度
 * @param {number} quality - 图片质量 (0-100)
 * @returns {string} 缩略图URL
 */
export function generateThumbnailUrl(originalUrl, width = 400, quality = 80) {
  // 如果是本地图片，直接返回原图
  if (originalUrl.startsWith('/') || originalUrl.startsWith('./')) {
    return originalUrl;
  }
  
  // 检查URL是否有效
  if (!originalUrl || typeof originalUrl !== 'string') {
    console.warn('无效的图片URL:', originalUrl);
    return '/backgrounds/default.webp'; // 返回默认图片
  }
  
  // 对于网络图片，直接返回原图（客户端会进行压缩）
  // 避免在服务端修改URL，因为图片服务可能不支持参数
  return originalUrl;
}



/**
 * 扫描本地文件夹获取图片文件
 * @param {string} folderPath - 文件夹路径
 * @returns {Promise<Array>} 图片文件数组
 */
export async function scanLocalFolder(folderPath) {
  try {
    // 在Astro中，我们使用import.meta.glob来在构建时扫描静态资源
    // 这种方法在开发和生产环境中都能正常工作
    
    // 获取文件夹路径对应的glob模式
    const actualPath = folderPath.replace(/^\//, ''); // 移除开头的斜杠
    const globPattern = `../public/${actualPath}/*.{jpg,jpeg,png,webp,gif}`;
    
    // 使用import.meta.glob扫描图片文件
    const imageModules = import.meta.glob('../../public/assets/history-images/*.{jpg,jpeg,png,webp,gif}', {
      eager: true,
      import: 'default'
    });
    
    // 提取文件名
    const imageFiles = Object.keys(imageModules).map(filePath => {
      // 从完整路径中提取文件名
      const fileName = filePath.split('/').pop();
      return fileName;
    });
    
    // 按文件名排序（通常是按日期排序）
    imageFiles.sort();
    
    const images = imageFiles.map((fileName, index) => {
      const { date, title, authors } = parseFileName(fileName);
      const imageUrl = `${folderPath}/${fileName}`;
      
      return {
        id: index,
        imageUrl: imageUrl,
        thumbnailUrl: generateThumbnailUrl(imageUrl),
        date: date,
        title: title,
        authors: authors,
        description: `${title} - ${date}`
      };
    });
    
    console.log(`构建时扫描到 ${images.length} 张历程图片`);
    return images;
  } catch (error) {
    console.error('构建时扫描本地文件夹失败:', error);
    
    // 如果动态扫描失败，回退到手动列表（保持向后兼容）
    console.log('尝试使用手动文件列表作为备选方案');
    return getManualHistoryImages(folderPath);
  }
}

/**
 * 手动文件列表备选方案
 * @param {string} folderPath - 文件夹路径
 * @returns {Array} 图片数据数组
 */
function getManualHistoryImages(folderPath) {
  // 手动文件列表（作为备选方案）
  const imageFiles = [
    '2025-09-30_该存档正式创建！_wanwan_jiean.webp',
    '2025-09-30_那么在新的基地开启我们的旅程吧_wanwan_jiean.webp',
    '2025-10-04_牢大复活机_mc_anya101.webp',
    '2025-10-05_潜影贝农场_Bu_XiAo_Le,EpiphanyEX.webp',
    '2025-10-08_24核刷铁机_EpiphanyEX,Bu_XiAo_Le.webp',
    '2025-10-10_200k袭击塔_EpiphanyEX,Bu_XiAo_Le.webp',
    '2025-10-11_全树种树场_EpiphanyEX.webp',
    '2025-10-13_黑曜石机_lanbaicai01,Bu_XiAo_Le,EpiphanyEX.webp',
    '2025-10-15_464k大云杉树场_Bu_XiAo_Le,EpiphanyEX.webp',
    '2025-10-15_640熔炉组_Bu_XiAo_Le,EpiphanyEX.webp',
    '2025-10-21_地毯铁轨工场_Bu_XiAo_Le.webp',
    '2025-10-25_瓜机_Bu_XiAo_Le,EpiphanyEX.webp',
    '2025-10-30_史莱姆农场_Bu_XiAo_Le,EpiphanyEX.webp',
    '2025-11-02_切门换底猪人塔_EpiphanyEX,Bu_XiAo_Le.webp',
    '2025-11-04_村民交易所_EpiphanyEX,Bu_XiAo_Le.webp',
    '2025-11-08_矿车洪流凋零骷髅农场_EpiphanyEX,Bu_XiAo_Le.webp',
    '2025-11-09_深色橡木树场_Bu_XiAo_Le,EpiphanyEX.webp',
    '2025-11-13_270猪灵交易_Bu_XiAo_Le,EpiphanyEX.webp',
    '2025-11-14_紫菘果农场_Bu_XiAo_Le,EpiphanyEX.webp',
    '2025-11-15_红树树场_Bu_XiAo_Le,EpiphanyEX.webp',
    '2025-11-17_72k刷冰机_Bu_XiAo_Le,EpiphanyEX.webp',
    '2025-11-20_天基屠龙炮_Bu_XiAo_Le,EpiphanyEX.webp',
    '2025-11-23_黏土机_Bu_XiAo_Le,EpiphanyEX.webp',
    '2025-11-28_百万玄武岩刷石机_EpiphanyEX,Bu_XiAo_Le.webp',
    '2025-11-29_主世界工业区_全服成员.webp',
    '2025-12-01_全生物收集_Bu_XiAo_Le.webp',
    '2025-12-05_地狱疣农场_Bu_XiAo_Le.webp',
    '2025-12-23_芙洛薇的内心世界_ckdg.webp',
    '2026-01-08_编码全物品_EpiphanyEX,Bu_XiAo_Le,ckdg.webp',
    '2026-01-13_三维矢量珍珠炮_EpiphanyEX.webp',
    '2026-02-11_烈焰人农场_EpiphanyEX.webp'
  ];
  
  const images = imageFiles.map((fileName, index) => {
    const { date, title, authors } = parseFileName(fileName);
    const imageUrl = `${folderPath}/${fileName}`;
    
    return {
      id: index,
      imageUrl: imageUrl,
      thumbnailUrl: generateThumbnailUrl(imageUrl),
      date: date,
      title: title,
      authors: authors,
      description: `${title} - ${date}`
    };
  });
  
  console.log(`手动列表备选方案加载了 ${images.length} 张历程图片`);
  return images;
}

/**
 * 获取历程数据
 * @param {object} historyConfig - 历程配置
 * @returns {Promise<Array>} 历程数据数组
 */
export async function getHistoryData(historyConfig) {
  // 直接使用文件夹路径获取图片数据
  const images = await scanLocalFolder(historyConfig.imagesFolder);
  return images.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * 预加载图片
 * @param {string} url - 图片URL
 * @returns {Promise} 图片加载Promise
 */
export function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * 批量预加载图片
 * @param {Array} urls - 图片URL数组
 * @returns {Promise} 所有图片加载完成的Promise
 */
export function preloadImages(urls) {
  return Promise.all(urls.map(url => preloadImage(url)));
}