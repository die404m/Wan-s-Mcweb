// 成员列表数据获取工具函数
import { websiteConfig } from '../config/website.config.js';

// 缓存数据
let cachedMembers = null;
let lastFetchTime = 0;

/**
 * 获取成员列表数据
 * @returns {Promise<Array>} 成员列表
 */
export async function fetchMembersData() {
  const now = Date.now();
  const membersConfig = websiteConfig.about?.members;
  
  if (!membersConfig || !membersConfig.enabled) {
    return [];
  }
  
  const cacheTimeout = membersConfig.localFile?.cacheTimeout || 300000;
  
  // 检查缓存是否有效
  if (cachedMembers && (now - lastFetchTime) < cacheTimeout) {
    return cachedMembers;
  }
  
  try {
    let members = [];
    
    if (membersConfig.dataSource === 'manual') {
      // 手动模式：直接返回手动配置的成员列表
      members = membersConfig.manualList || [];
    } else if (membersConfig.dataSource === 'localFile') {
      // 本地文件模式：从本地JSON文件获取成员列表
      
      // 使用import.meta.glob在构建时加载JSON文件
      const jsonModules = import.meta.glob('../../public/assets/memberlist/*.json', {
        eager: true,
        import: 'default'
      });
      
      // 查找whitelist.json文件
      const whitelistKey = Object.keys(jsonModules).find(key => key.includes('whitelist.json'));
      
      if (!whitelistKey) {
        throw new Error('未找到whitelist.json文件');
      }
      
      const data = jsonModules[whitelistKey];
      
      // 从JSON数据中提取玩家名
      if (Array.isArray(data)) {
        members = data.map(item => item.name).filter(name => name && name.trim());
      } else {
        throw new Error('JSON文件数据格式不正确');
      }
    }
    
    // 去重并排序
    members = [...new Set(members)].sort();
    
    // 更新缓存
    cachedMembers = members;
    lastFetchTime = now;
    
    console.log('从本地JSON文件加载成员列表数据成功');
    return members;
  } catch (error) {
    console.error('获取成员列表数据失败:', error);
    
    // 如果缓存中有数据，返回缓存数据
    if (cachedMembers) {
      console.warn('使用缓存的成员列表数据');
      return cachedMembers;
    }
    
    // 如果本地文件失败且没有缓存，返回手动配置的成员列表作为备用
    if (membersConfig.manualList && membersConfig.manualList.length > 0) {
      console.warn('本地文件失败，使用手动配置的成员列表');
      return membersConfig.manualList;
    }
    
    return [];
  }
}

/**
 * 获取玩家头像URL
 * @param {string} playerName 玩家名
 * @returns {string} 头像URL
 */
export function getPlayerAvatarUrl(playerName) {
  return `https://crafthead.net/avatar/${encodeURIComponent(playerName)}`;
}

/**
 * 格式化成员列表显示
 * @param {Array} members 成员列表
 * @returns {Array} 格式化后的成员列表
 */
export function formatMembersList(members) {
  return members.map(playerName => ({
    name: playerName,
    avatar: getPlayerAvatarUrl(playerName)
  }));
}