// ========== 烟花系统 ==========
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

// 设置画布实际尺寸与显示一致
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 烟花粒子类
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.size = Math.random() * 3 + 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05; // 轻微重力
        this.alpha -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 存储所有活跃的粒子
let particles = [];

// 创建一场烟花（在指定位置）
function createFirework(x, y) {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#FF8C42', '#A29BFE', '#FD79A8', '#FDCB6E', '#00CEC9'];
    const particleCount = 80;
    const color = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y, color));
    }
}

// 动画循环：每帧更新并重绘画布
function animate() {
    // 使用半透明背景制造拖尾效果
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 更新并绘制所有粒子
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
            particles.splice(i, 1);
        }
    }
    requestAnimationFrame(animate);
}

animate();

// ========== 打卡逻辑（原有部分） ==========
const punchData = {
    total: 0,
    dates: []
};

const badges = [
    { name: '青铜', icon: '🥉', needDays: 1, unlocked: false },
    { name: '白银', icon: '🥈', needDays: 7, unlocked: false },
    { name: '黄金', icon: '🥇', needDays: 30, unlocked: false },
    { name: '钻石', icon: '💎', needDays: 100, unlocked: false }
];

function getTodayStr() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function updateTotalDaysDisplay() {
    document.getElementById('totalDays').textContent = punchData.total;
}

function checkBadges() {
    for (let i = 0; i < badges.length; i++) {
        badges[i].unlocked = punchData.total >= badges[i].needDays;
    }
}

function renderBadges() {
    const badgeListDiv = document.getElementById('badgeList');
    badgeListDiv.innerHTML = '';
    for (let i = 0; i < badges.length; i++) {
        const badge = badges[i];
        const div = document.createElement('div');
        const statusClass = badge.unlocked ? 'badge-unlocked' : 'badge-locked';
        div.className = `badge-item ${statusClass}`;
        div.textContent = `${badge.icon} ${badge.name} (${badge.needDays}天)`;
        badgeListDiv.appendChild(div);
    }
}

function doPunch() {
    const today = getTodayStr();
    if (punchData.dates.indexOf(today) !== -1) {
        alert('今天已经打过卡啦！');
        return;
    }

    // 成功打卡
    punchData.total++;
    punchData.dates.push(today);
    checkBadges();
    updateTotalDaysDisplay();
    renderBadges();

    // 触发烟花！在按钮位置或随机位置绽放
    const btn = document.getElementById('punchBtn');
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    // 同时放3组烟花，增加视觉冲击
    createFirework(x, y);
    createFirework(x - 30, y - 20);
    createFirework(x + 30, y - 20);
}

window.onload = function() {
    const btn = document.getElementById('punchBtn');
    btn.addEventListener('click', doPunch);
    checkBadges();
    updateTotalDaysDisplay();
    renderBadges();
};