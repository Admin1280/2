// 方法二：卡片点击事件增强
document.addEventListener('DOMContentLoaded', function() {
    // 为所有卡片添加点击事件
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function(e) {
            // 检查点击的是否已经是链接
            if (e.target.tagName === 'A') return;
            
            // 查找卡片内的链接
            const link = this.querySelector('.view-log');
            if (link) {
                // 触发链接点击（或直接跳转）
                link.click();
                // 或者使用：window.location.href = link.href;
            }
        });
    });

    // 保持原有的悬停效果
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});
