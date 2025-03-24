
```markdown
# README.md

# 男性服装搭配系统使用指南

## 系统要求
- 现代浏览器（推荐Chrome 90+）
- 屏幕分辨率：≥1280x720
- 网络连接：需要加载图片资源

## 快速入门
### 1. 场景选择
```html
<!-- 示例代码片段 -->
<div class="scene-selector">
  <div class="scene-card" data-scene="casual">
    <h3>日常穿搭</h3>
  </div>
  <div class="scene-card" data-scene="business">
    <h3>商务着装</h3>
  </div>
</div>
2. 搭配操作流程
选择年龄区间 → 2. 选择使用场景 → 3. 设置价格范围 → 4. 查看推荐结果

3. 核心交互说明
收藏功能
javascript
复制
// 示例收藏逻辑
function toggleFavorite(outfitId) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const index = favorites.indexOf(outfitId);
  
  if (index === -1) {
    favorites.push(outfitId);
  } else {
    favorites.splice(index, 1);
  }
  
  localStorage.setItem('favorites', JSON.stringify(favorites));# Men-s-clothing-matching-system
