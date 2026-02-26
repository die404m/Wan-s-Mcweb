// 排行榜数据获取工具函数
import { websiteConfig } from '../config/website.config.js';

// 缓存数据
let cachedData = null;
let lastFetchTime = 0;

/**
 * 获取排行榜数据
 * @returns {Promise<Object>} 排行榜数据
 */
export async function fetchLeaderboardData() {
  const now = Date.now();
  const cacheTimeout = websiteConfig.leaderboard?.localFile?.cacheTimeout || 300000;
  
  // 检查缓存是否有效
  if (cachedData && (now - lastFetchTime) < cacheTimeout) {
    return cachedData;
  }
  
  try {
    const filePath = websiteConfig.leaderboard?.localFile?.path;
    if (!filePath) {
      throw new Error('排行榜本地文件路径未配置');
    }
    
    // 使用import.meta.glob在构建时加载JSON文件
    const jsonModules = import.meta.glob('../../public/assets/leaderboard/*.json', {
      eager: true,
      import: 'default'
    });
    
    // 查找count_export.json文件
    const countExportKey = Object.keys(jsonModules).find(key => key.includes('count_export.json'));
    
    if (!countExportKey) {
      throw new Error('未找到count_export.json文件');
    }
    
    const data = jsonModules[countExportKey];
    
    // 验证数据结构
    if (!data.objectives || typeof data.objectives !== 'object') {
      throw new Error('JSON文件数据格式不正确');
    }
    
    // 更新缓存
    cachedData = data;
    lastFetchTime = now;
    
    console.log('从本地JSON文件加载排行榜数据成功');
    return data;
  } catch (error) {
    console.error('获取排行榜数据失败:', error);
    
    // 如果缓存中有数据，返回缓存数据
    if (cachedData) {
      console.warn('使用缓存的排行榜数据');
      return cachedData;
    }
    
    // 返回空数据
    return {
      export_time: new Date().toISOString(),
      objectives: {}
    };
  }
}

/**
 * 获取可用的计分板列表
 * @param {Object} data API返回的数据
 * @returns {Array} 可用的计分板列表
 */
export function getAvailableObjectives(data) {
  if (!data || !data.objectives) return [];
  
  const objectivesConfig = websiteConfig.leaderboard?.objectives || {};
  
  return Object.entries(data.objectives)
    .filter(([key, objective]) => {
      // 检查是否在配置中启用
      const config = objectivesConfig[key];
      return config && config.enabled !== false;
    })
    .map(([key, objective]) => {
      const config = objectivesConfig[key];
      return {
        key,
        config,
        data: objective,
        displayName: config?.displayName || key,
        icon: config?.icon || 'mdi-trophy',
        unit: config?.unit || ''
      };
    });
}

/**
 * 获取特定计分板的玩家数据
 * @param {Object} objectiveData 计分板数据
 * @param {Object} config 计分板配置
 * @returns {Array} 玩家数据列表
 */
export function getPlayerScores(objectiveData, config) {
  if (!objectiveData || !objectiveData.player_scores) return [];
  
  const playerScores = [...objectiveData.player_scores];
  
  // 过滤掉总计数据（如果配置不显示总计）
  if (config && config.showTotal === false) {
    return playerScores.filter(score => !score.player.includes('总'));
  }
  
  return playerScores;
}

/**
 * 格式化分数显示
 * @param {number} score 分数
 * @param {string} unit 单位
 * @returns {string} 格式化后的分数
 */
export function formatScore(score, unit) {
  if (typeof score !== 'number') return '0' + unit;
  
  // 根据数值大小选择合适的格式化方式
  if (score >= 1000000) {
    return (score / 1000000).toFixed(1) + 'M' + unit;
  } else if (score >= 1000) {
    return (score / 1000).toFixed(1) + 'K' + unit;
  } else {
    return score.toLocaleString() + unit;
  }
}

/**
 * 格式化时间显示
 * @param {string} timeString 时间字符串
 * @returns {string} 格式化后的时间
 */
export function formatUpdateTime(timeString) {
  if (!timeString) return '未知时间';
  
  try {
    // 直接返回原始时间字符串，不进行相对时间格式化
    return `数据更新时间: ${timeString}`;
  } catch (error) {
    return timeString;
  }
}