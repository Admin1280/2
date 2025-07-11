// 使用Supabase的Realtime功能
const supabase = createClient('https://sqtvydboqvsxhurfxllg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxdHZ5ZGJvcXZzeGh1cmZ4bGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNTE5MjgsImV4cCI6MjA2NzcyNzkyOH0.zz-icV0ww852hyHo2WGNciBALdSrdxhAksOISPdc_lg');

// 订阅表的变化(插入/更新/删除)
supabase
  .channel('data_updates')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'project_logs' },
    (payload) => {
      console.log('数据变化:', payload);
      // 这里更新前端页面显示
      loadData(); // 数据变化时重新加载数据
    }
  )
  .subscribe();

// 初始加载数据
async function loadData() {
  const { data, error } = await supabase.from('project_logs').select('*');
  if (!error) {
    displayData(data); // 将数据渲染到页面
  } else {
    console.error('加载数据失败:', error);
    // 可以添加错误处理UI
  }
}

// 渲染数据到HTML
function displayData(data) {
  const container = document.getElementById('data-container');
  if (!container) {
    console.error('找不到data-container元素');
    return;
  }
  
  if (!data || data.length === 0) {
    container.innerHTML = '<p>暂无数据</p>';
    return;
  }

  container.innerHTML = data.map(item => `
    <div class="data-card">
      <h3>${item.username} (${item.group})</h3>
      <p>日期: ${item.date}</p>
      <p>工作原理: ${item.principle || '无'}</p>
      <p>实习内容: ${item.content || '无'}</p>
      <p>遇到的问题: ${item.problem || '无'}</p>
      <p>解决方法: ${item.solution || '无'}</p>
      <p>收获与体会: ${item.harvest || '无'}</p>
    </div>
  `).join('');
}

// 页面加载时获取数据
loadData();