// 全局状态管理
const state = {
    selectedAge: null,
    selectedScene: null,
    priceRange: 1000,
    favorites: JSON.parse(localStorage.getItem('favorites')) || []
};

// 模拟搭配数据
const outfitData = {
    'daily': {
        '15-22': [
            { id: 1, title: '校园休闲风', items: ['基础款T恤', '直筒牛仔裤', '小白鞋'], price: 500, image: 'images/daily-casual-1.png' },
            { id: 2, title: '运动学院风', items: ['连帽卫衣', '工装裤', '运动鞋'], price: 800, image: 'images/daily-sport-1.png' },
            // 新增服装推荐
            { id: 7, title: '潮流街头风', items: ['印花T恤', '破洞牛仔裤', '板鞋'], price: 600, image: 'images/daily-street-1.png' },
            { id: 8, title: '夏日清新风', items: ['短袖衬衫', '休闲短裤', '凉鞋'], price: 700, image: 'images/daily-summer-1.png' }
        ],
        '22-28': [
            { id: 3, title: '简约通勤', items: ['纯色衬衫', '休闲西裤', '皮鞋'], price: 1200, image: 'images/daily-work-1.png' },
            { id: 4, title: '休闲商务', items: ['针织衫', '九分裤', '乐福鞋'], price: 1500, image: 'images/daily-business-1.png' },
            // 新增服装推荐
            { id: 9, title: '都市潮流', items: ['印花衬衫', '牛仔裤', '运动鞋'], price: 1300, image: 'images/daily-urban-1.png' },
            { id: 10, title: '夏季休闲', items: ['短袖T恤', '短裤', '凉鞋'], price: 1100, image: 'images/daily-casual-2.png' }
        ],
        '28-40': [
            { id: 5, title: '成熟商务', items: ['西装外套', '修身西裤', '商务皮鞋'], price: 2500, image: 'images/daily-formal-1.png' },
            { id: 6, title: '精英休闲', items: ['polo衫', '休闲裤', '豆豆鞋'], price: 2000, image: 'daily-elite-1.png' },
            // 新增服装推荐
            { id: 11, title: '经典商务', items: ['条纹衬衫', '西裤', '皮鞋'], price: 2400, image: 'daily-classic-1.png' },
            { id: 12, title: '休闲周末', items: ['休闲衬衫', '牛仔裤', '运动鞋'], price: 1800, image: 'daily-weekend-1.png' }
        ]
    },
    'sports': {
        '15-22': [
            { id: 13, title: '学生运动风', items: ['运动T恤', '短裤', '跑鞋'], price: 400, image: 'images/sports-student-1.png' }
        ],
        '22-28': [
            { id: 14, title: '新人运动风', items: ['运动夹克', '运动裤', '运动鞋'], price: 700, image: 'sports-newbie-1.png' }
        ],
        '28-40': [
            { id: 15, title: '成熟运动风', items: ['运动衫', '短裤', '运动鞋'], price: 900, image: 'sports-mature-1.png' }
        ]
    },
    'business': {
        '15-22': [
            { id: 16, title: '学生商务风', items: ['衬衫', '西裤', '皮鞋'], price: 1000, image: 'images/business-student-1.png' }
        ],
        '22-28': [
            { id: 17, title: '新人商务风', items: ['西装', '领带', '皮鞋'], price: 1500, image: 'business-newbie-1.png' }
        ],
        '28-40': [
            { id: 18, title: '成熟商务风', items: ['西装三件套', '领带', '皮鞋'], price: 2000, image: 'business-mature-1.png' }
        ]
    },
    'date': {
        '15-22': [
            { id: 19, title: '学生约会风', items: ['休闲衬衫', '牛仔裤', '休闲鞋'], price: 600, image: 'images/date-student-1.png' }
        ],
        '22-28': [
            { id: 20, title: '新人约会风', items: ['休闲西装', '休闲裤', '皮鞋'], price: 1200, image: 'date-newbie-1.png' }
        ],
        '28-40': [
            { id: 21, title: '成熟约会风', items: ['休闲夹克', '牛仔裤', '休闲鞋'], price: 1400, image: 'date-mature-1.png' }
        ]
    },
    // 其他场景的搭配数据...
};

// 初始化事件监听
document.addEventListener('DOMContentLoaded', () => {
    initializeAgeSelector();
    initializeSceneSelector();
    initializePriceRange();
    updateRecommendations();
    renderFavorites();
});

// 年龄选择器初始化
function initializeAgeSelector() {
    const ageButtons = document.querySelectorAll('.age-options button');
    ageButtons.forEach(button => {
        button.addEventListener('click', () => {
            ageButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            state.selectedAge = button.dataset.age;
            updateRecommendations();
        });
    });
}

// 场景选择器初始化
function initializeSceneSelector() {
    const sceneCards = document.querySelectorAll('.scene-card');
    sceneCards.forEach(card => {
        card.addEventListener('click', () => {
            sceneCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            state.selectedScene = card.dataset.scene;
            updateRecommendations();
        });
    });
    
    // 如果已有选中场景，恢复选中状态
    if (state.selectedScene) {
        const selectedCard = document.querySelector(`.scene-card[data-scene="${state.selectedScene}"]`);
        if (selectedCard) {
            selectedCard.classList.add('active');
        }
    }
}

// 价格范围初始化
function initializePriceRange() {
    const priceInput = document.getElementById('price-input');
    const priceValue = document.getElementById('price-value');

    priceInput.addEventListener('input', () => {
        state.priceRange = parseInt(priceInput.value);
        priceValue.textContent = `￥${state.priceRange}`;
        updateRecommendations();
    });
}

// 更新搭配推荐
function updateRecommendations() {
    if (!state.selectedAge || !state.selectedScene) return;

    const outfitGrid = document.querySelector('.outfit-grid');
    const recommendations = outfitData[state.selectedScene]?.[state.selectedAge] || [];
    const filteredRecommendations = recommendations.filter(outfit => outfit.price <= state.priceRange);

    outfitGrid.innerHTML = filteredRecommendations.map(outfit => `
        <div class="outfit-card glass-effect" data-id="${outfit.id}">
            <div class="outfit-image">
                <img src="${outfit.image}" alt="${outfit.title}">
            </div>
            <h3>${outfit.title}</h3>
            <p class="outfit-items">${outfit.items.join(' + ')}</p>
            <p class="outfit-price">￥${outfit.price}</p>
            <button class="favorite-btn ${state.favorites.includes(outfit.id) ? 'active' : ''}">
                ❤ ${state.favorites.includes(outfit.id) ? '已收藏' : '收藏'}
            </button>
        </div>
    `).join('');

    // 添加收藏按钮事件监听
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const outfitId = parseInt(e.target.closest('.outfit-card').dataset.id);
            toggleFavorite(outfitId);
        });
    });
}

// 切换收藏状态
function toggleFavorite(outfitId) {
    const index = state.favorites.indexOf(outfitId);
    if (index === -1) {
        state.favorites.push(outfitId);
    } else {
        state.favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
    updateRecommendations();
    renderFavorites();
}

// 渲染收藏夹
function renderFavorites() {
    const favoritesGrid = document.querySelector('.favorites-grid');
    const favoriteOutfits = [];
    
    // 收集所有场景中的收藏搭配
    Object.values(outfitData).forEach(scenes => {
        Object.values(scenes).forEach(outfits => {
            outfits.forEach(outfit => {
                if (state.favorites.includes(outfit.id)) {
                    favoriteOutfits.push(outfit);
                }
            });
        });
    });

    favoritesGrid.innerHTML = favoriteOutfits.map(outfit => `
        <div class="outfit-card glass-effect" data-id="${outfit.id}">
            <div class="outfit-image">
                <img src="${outfit.image}" alt="${outfit.title}">
            </div>
            <h3>${outfit.title}</h3>
            <p class="outfit-items">${outfit.items.join(' + ')}</p>
            <p class="outfit-price">￥${outfit.price}</p>
            <button class="favorite-btn active" onclick="toggleFavorite(${outfit.id})">
                ❤ 取消收藏
            </button>
        </div>
    `).join('');
}