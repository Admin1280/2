document.addEventListener('DOMContentLoaded', function() {
    // 从URL获取成员信息
    const urlParams = new URLSearchParams(window.location.search);
    const memberName = urlParams.get('name');
    const memberRole = urlParams.get('role');
    
    // 设置页面标题和成员信息
    document.title = `${memberName}的日志 - 造卡丁车项目`;
    document.getElementById('member-name').textContent = memberName;
    document.getElementById('member-role').textContent = memberRole;
    
    // 尝试从本地存储加载日志
    let logs = JSON.parse(localStorage.getItem(`kartLogs_${memberName}`)) || [];
    
    // 渲染日志
    function renderLogs() {
        const logContainer = document.getElementById('log-container');
        logContainer.innerHTML = '';
        
        // 按日期排序（最新的在前面）
        logs.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        logs.forEach((log, index) => {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            
            logEntry.innerHTML = `
                <div class="log-date">${log.date}</div>
                <div class="log-content">${log.content}</div>
                <button class="delete-log" data-index="${index}">删除</button>
            `;
            
            logContainer.appendChild(logEntry);
        });
        
        // 添加删除日志的事件监听
        document.querySelectorAll('.delete-log').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                logs.splice(index, 1);
                localStorage.setItem(`kartLogs_${memberName}`, JSON.stringify(logs));
                renderLogs();
            });
        });
    }
    
    // 初始化渲染
    renderLogs();
    
    // 添加日志按钮事件
    document.getElementById('add-log').addEventListener('click', function() {
        const dateInput = document.getElementById('log-date');
        const date = dateInput.value || new Date().toISOString().split('T')[0];
        
        const content = prompt('请输入日志内容:');
        if (content) {
            logs.push({
                date: date,
                content: content
            });
            
            localStorage.setItem(`kartLogs_${memberName}`, JSON.stringify(logs));
            renderLogs();
            
            // 重置日期输入
            dateInput.value = '';
        }
    });
    
    // 导出JSON
    document.getElementById('export-json').addEventListener('click', function() {
        const dataStr = JSON.stringify(logs, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `${memberName}_卡丁车项目日志.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    });
    
    // 导入JSON
    document.getElementById('import-json').addEventListener('click', function() {
        document.getElementById('file-input').click();
    });
    
    document.getElementById('file-input').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedLogs = JSON.parse(e.target.result);
                if (Array.isArray(importedLogs)) {
                    if (confirm(`确定要导入 ${importedLogs.length} 条日志吗？这将覆盖现有日志。`)) {
                        logs = importedLogs;
                        localStorage.setItem(`kartLogs_${memberName}`, JSON.stringify(logs));
                        renderLogs();
                    }
                } else {
                    alert('导入的文件格式不正确，必须是日志数组。');
                }
            } catch (error) {
                alert('导入失败: ' + error.message);
            }
        };
        reader.readAsText(file);
    });
    
    // 设置默认日期为今天
    document.getElementById('log-date').valueAsDate = new Date();
});