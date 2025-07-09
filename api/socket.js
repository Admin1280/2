import { Server } from 'socket.io';

// 存储成员状态
let members = [
    { name: "何宇豪", role: "电池组", color: "rgba(245, 247, 250, 0.7)", size: 100 },
    { name: "刘清轶", role: "电池组", color: "rgba(161, 196, 253, 0.7)", size: 120 },
    { name: "李奕乐", role: "电控组", color: "rgba(240, 147, 251, 0.7)", size: 90 },
    { name: "陈品运", role: "电控组", color: "rgba(79, 172, 254, 0.7)", size: 110 },
    { name: "叶雨桐", role: "电驱组", color: "rgba(67, 233, 123, 0.7)", size: 95 }
];

export default function handler(req, res) {
    if (!res.socket.server.io) {
        console.log('Starting Socket.io server');
        const io = new Server(res.socket.server, {
            path: '/api/socket.io/',
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        io.on('connection', (socket) => {
            console.log(`Client connected: ${socket.id}`);

            // 发送初始数据
            socket.emit('init-members', members);

            // 处理用户加入
            socket.on('user-joined', (username) => {
                io.emit('user-connected', username || '匿名用户');
            });

            // 处理成员点击
            socket.on('member-clicked', (data) => {
                try {
                    const memberIndex = members.findIndex(m => m.name === data.name);
                    if (memberIndex >= 0) {
                        // 随机更新颜色和大小
                        members[memberIndex].color = `rgba(${
                            Math.floor(Math.random() * 255)
                        }, ${
                            Math.floor(Math.random() * 255)
                        }, ${
                            Math.floor(Math.random() * 255)
                        }, 0.7)`;
                        
                        members[memberIndex].size = Math.max(80, 
                            Math.min(150, members[memberIndex].size + (Math.random() > 0.5 ? 10 : -10))
                        );
                        
                        // 广播更新
                        io.emit('bubble-update', members[memberIndex]);
                        console.log(`${data.name} 状态更新`, members[memberIndex]);
                    }
                } catch (err) {
                    console.error('处理点击事件出错:', err);
                    socket.emit('error', '处理请求时出错');
                }
            });

            // 处理更新请求
            socket.on('request-update', () => {
                socket.emit('init-members', members);
            });

            socket.on('disconnect', () => {
                console.log(`Client disconnected: ${socket.id}`);
            });
        });

        res.socket.server.io = io;
    }
    res.end();
}
