// 在表单的提交按钮点击事件中添加：
async function handleSubmit(e) {
  e.preventDefault();
  const formData = {
    username: document.getElementById('username').value,
    group: document.getElementById('group').value,
    date: document.getElementById('date').value,
    principle: document.getElementById('principle').value,
    content: document.getElementById('content').value
  };

  // 调用Supabase API提交数据
  const response = await fetch('https://sqtvydboqvsxhurfxllg.supabase.co/rest/v1/project_logs', {
    method: 'POST',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxdHZ5ZGJvcXZzeGh1cmZ4bGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNTE5MjgsImV4cCI6MjA2NzcyNzkyOH0.zz-icV0ww852hyHo2WGNciBALdSrdxhAksOISPdc_lg', // 注意：生产环境应使用环境变量隐藏密钥
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });

  if (response.ok) {
    alert('数据提交成功！');
    // 可选：刷新页面或重新加载数据列表
  } else {
    alert('提交失败，请重试。');
  }
}