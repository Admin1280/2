// 导入需要的模块
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// 创建Express应用
const app = express();

// 中间件配置
app.use(cors()); // 允许跨域请求
app.use(express.json()); // 解析JSON请求体

// 从环境变量读取Supabase配置
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// 创建Supabase客户端
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 定义API路由 - 提交项目日志
app.post('/api/submit-project-log', async (req, res) => {
  try {
    // 从请求体获取数据
    const { username, group, date, principle, content, problem, solution, harvest } = req.body;

    // 验证必要字段
    if (!username || !group || !date) {
      return res.status(400).json({ error: '缺少必要字段: username, group, date' });
    }

    // 准备要插入的数据
    const dataToInsert = {
      username,
      group,
      date,
      principle: principle || null, // 可选字段
      content: content || null,
      problem: problem || null,
      solution: solution || null,
      harvest: harvest || null
    };

    // 调用Supabase插入数据
    const { data, error } = await supabase
      .from('project_logs')
      .insert([dataToInsert]);

    if (error) {
      console.error('Supabase插入错误:', error);
      return res.status(500).json({ error: '数据库插入失败' });
    }

    // 成功响应
    res.status(201).json({ message: '数据提交成功', data });
  } catch (err) {
    console.error('服务器错误:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 定义API路由 - 获取项目日志
app.get('/api/get-project-logs', async (req, res) => {
  try {
    // 调用Supabase查询数据
    const { data, error } = await supabase
      .from('project_logs')
      .select('*');

    if (error) {
      console.error('Supabase查询错误:', error);
      return res.status(500).json({ error: '数据库查询失败' });
    }

    // 成功响应
    res.status(200).json({ data });
  } catch (err) {
    console.error('服务器错误:', err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});