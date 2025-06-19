# 部署指南

## 概述

本文档详细介绍了后台管理系统的部署方法，包括开发环境、测试环境和生产环境的部署步骤。

## 环境要求

### 基础环境
- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0
- **Git**: 最新版本

### 数据库环境
- **PostgreSQL**: >= 13.0
- **Redis**: >= 6.0

### 容器环境（可选）
- **Docker**: >= 20.0
- **Docker Compose**: >= 2.0

## 开发环境部署

### 1. 克隆项目
```bash
git clone https://github.com/your-username/admin-system.git
cd admin-system
```

### 2. 安装依赖
```bash
# 安装 pnpm（如果未安装）
npm install -g pnpm

# 安装项目依赖
pnpm install
```

### 3. 环境配置
```bash
# 复制环境变量文件
cp .env.example .env

# 编辑环境变量
vim .env
```

**关键配置项**
```env
# 应用配置
NODE_ENV=development
PORT=3333

# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=admin_system

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
```

### 4. 数据库准备
```bash
# 创建数据库
createdb admin_system

# 运行数据库迁移（如果有）
cd apps/api
pnpm run migration:run
```

### 5. 启动开发服务器
```bash
# 构建共享包
cd packages/shared && pnpm build && cd ../..

# 启动所有服务
pnpm dev

# 或者使用开发脚本
./scripts/dev.sh
```

### 6. 访问应用
- **前端**: http://localhost:3001
- **后端**: http://localhost:3333
- **API 文档**: http://localhost:3333/api/v1/docs

## 生产环境部署

### 方式一：传统部署

#### 1. 服务器准备
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 pnpm
npm install -g pnpm

# 安装 PM2
npm install -g pm2
```

#### 2. 数据库安装
```bash
# 安装 PostgreSQL
sudo apt install postgresql postgresql-contrib

# 安装 Redis
sudo apt install redis-server

# 配置数据库
sudo -u postgres createuser --interactive
sudo -u postgres createdb admin_system
```

#### 3. 项目部署
```bash
# 克隆项目
git clone https://github.com/your-username/admin-system.git
cd admin-system

# 安装依赖
pnpm install --frozen-lockfile

# 配置环境变量
cp .env.example .env
vim .env

# 构建项目
pnpm build
```

#### 4. 配置 PM2
```bash
# 创建 PM2 配置文件
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'admin-api',
      script: './apps/api/dist/main.js',
      cwd: './apps/api',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3333
      }
    }
  ]
}
EOF

# 启动应用
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 5. 配置 Nginx
```bash
# 安装 Nginx
sudo apt install nginx

# 创建配置文件
sudo vim /etc/nginx/sites-available/admin-system
```

**Nginx 配置**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 前端静态文件
    location / {
        root /path/to/admin-system/apps/admin/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # API 代理
    location /api/ {
        proxy_pass http://localhost:3333/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/admin-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 方式二：Docker 部署

#### 1. 使用 Docker Compose
```bash
# 克隆项目
git clone https://github.com/your-username/admin-system.git
cd admin-system

# 配置环境变量
cp .env.example .env
vim .env

# 构建并启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

#### 2. 单独构建镜像
```bash
# 构建后端镜像
docker build --target api -t admin-api .

# 构建前端镜像
docker build --target admin -t admin-frontend .

# 运行容器
docker run -d --name admin-api -p 3333:3333 admin-api
docker run -d --name admin-frontend -p 80:80 admin-frontend
```

### 方式三：云平台部署

#### Vercel 部署（前端）
```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署前端
cd apps/admin
vercel --prod
```

#### Railway 部署（后端）
```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录并部署
railway login
railway init
railway up
```

## 环境配置详解

### 开发环境配置
```env
NODE_ENV=development
PORT=3333
API_PREFIX=api/v1

# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=admin_system

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT 配置
JWT_SECRET=dev-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=dev-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# CORS 配置
CORS_ORIGIN=http://localhost:3001
```

### 生产环境配置
```env
NODE_ENV=production
PORT=3333
API_PREFIX=api/v1

# 数据库配置
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-strong-password
DB_DATABASE=admin_system

# Redis 配置
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# JWT 配置（使用强密钥）
JWT_SECRET=your-super-strong-production-secret-key-at-least-32-characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-strong-refresh-secret-key-at-least-32-characters
JWT_REFRESH_EXPIRES_IN=7d

# CORS 配置
CORS_ORIGIN=https://your-domain.com

# 邮件配置
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
MAIL_FROM=noreply@your-domain.com
```

## 监控和维护

### 日志管理
```bash
# PM2 日志
pm2 logs admin-api

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 系统日志
journalctl -u nginx -f
```

### 性能监控
```bash
# PM2 监控
pm2 monit

# 系统资源监控
htop
iostat
```

### 备份策略
```bash
# 数据库备份
pg_dump admin_system > backup_$(date +%Y%m%d_%H%M%S).sql

# 自动备份脚本
cat > backup.sh << EOF
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump admin_system > $BACKUP_DIR/db_backup_$DATE.sql
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
EOF

# 添加到 crontab
crontab -e
# 每天凌晨 2 点备份
0 2 * * * /path/to/backup.sh
```

## 故障排除

### 常见问题

1. **端口被占用**
```bash
# 查看端口占用
lsof -i :3333
netstat -tulpn | grep 3333

# 杀死进程
kill -9 <PID>
```

2. **数据库连接失败**
```bash
# 检查数据库状态
sudo systemctl status postgresql

# 重启数据库
sudo systemctl restart postgresql
```

3. **内存不足**
```bash
# 检查内存使用
free -h

# 清理缓存
sudo sync && sudo sysctl vm.drop_caches=3
```

4. **磁盘空间不足**
```bash
# 检查磁盘使用
df -h

# 清理日志文件
sudo journalctl --vacuum-time=7d
```

## 安全建议

### 服务器安全
- 定期更新系统和软件包
- 配置防火墙规则
- 使用 SSH 密钥认证
- 禁用 root 用户直接登录

### 应用安全
- 使用强密码和密钥
- 启用 HTTPS
- 配置 CORS 策略
- 实施 API 限流

### 数据库安全
- 使用强密码
- 限制数据库访问权限
- 定期备份数据
- 启用数据库日志审计
