// ========== 数据：使用对象和数组 ==========
// 打卡数据对象
const punchData = {
    total: 0,           // 累计打卡天数
    dates: []           // 打卡日期数组
};

// 徽章数组，每个元素是一个对象
const badges = [
    { name: '青铜', icon: '🥉', needDays: 1, unlocked: false },
    { name: '白银', icon: '🥈', needDays: 7, unlocked: false },
    { name: '黄金', icon: '🥇', needDays: 30, unlocked: false },
    { name: '钻石', icon: '💎', needDays: 100, unlocked: false }
];

// ========== 函数：封装逻辑 ==========

// 获取今天的日期字符串 (YYYY-MM-DD)
function getTodayStr() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 更新页面上的天数显示（DOM操作）
function updateTotalDaysDisplay() {
    const span = document.getElementById('totalDays');
    span.textContent = punchData.total;
}

// 根据天数更新徽章的解锁状态（条件判断、循环）
function checkBadges() {
    for (let i = 0; i < badges.length; i++) {
        // 条件：累计天数 >= 徽章要求天数
        badges[i].unlocked = punchData.total >= badges[i].needDays;
    }
}

// 渲染徽章列表到页面（循环生成HTML，DOM操作）
function renderBadges() {
    const badgeListDiv = document.getElementById('badgeList');
    // 先清空容器
    badgeListDiv.innerHTML = '';

    // 遍历徽章数组
    for (let i = 0; i < badges.length; i++) {
        const badge = badges[i];
        
        // 创建一个div元素
        const div = document.createElement('div');
        
        // 根据解锁状态添加不同的CSS类（三元运算符）
        const statusClass = badge.unlocked ? 'badge-unlocked' : 'badge-locked';
        div.className = `badge-item ${statusClass}`;
        
        // 设置div内部的文字（模板字符串）
        div.textContent = `${badge.icon} ${badge.name} (${badge.needDays}天)`;
        
        // 将div添加到徽章列表容器中
        badgeListDiv.appendChild(div);
    }
}

// 打卡核心函数（点击事件处理）
function doPunch() {
    const today = getTodayStr();
    
    // 检查今天是否已经打过卡（indexOf 查找）
    if (punchData.dates.indexOf(today) !== -1) {
        alert('今天已经打过卡啦！');
        return; // 提前结束函数
    }
    
    // 更新数据
    punchData.total++;
    punchData.dates.push(today); // push添加
    
    // 重新检查徽章状态
    checkBadges();
    
    // 更新UI
    updateTotalDaysDisplay();
    renderBadges();
}

// ========== 初始化：关联HTML元素与事件 ==========
// 等网页加载完成后执行
window.onload = function() {
    // 获取打卡按钮，绑定点击事件（事件监听，类似bindtap）
    const btn = document.getElementById('punchBtn');
    btn.addEventListener('click', doPunch);
    
    // 初始渲染
    checkBadges();
    updateTotalDaysDisplay();
    renderBadges();
};