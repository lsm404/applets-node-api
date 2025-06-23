# 超级管理员权限系统使用指南

## 🚀 快速开始

### 1. 初始化数据库表和管理员账号

```bash
# 在Api目录下运行
node init-administrators.js
```

运行后会：
- 创建 `administrators` 表
- 创建超级管理员账号：`superadmin` / `admin123`
- 创建普通管理员账号：`tooladmin` / `admin123`

### 2. 重启后端服务

```bash
node index.js
```

## 🔐 权限级别说明

### superadmin（超级管理员）
- ✅ 拥有所有权限
- ✅ 可以添加/编辑/删除工具
- ✅ 可以管理分类
- ✅ 可以管理用户
- ✅ 可以修改系统设置

### admin（普通管理员）
- ❌ 不能进行任何关键操作
- ❌ 只能查看数据，不能修改

## 🛡️ 受保护的接口

### 工具管理（仅superadmin）
- `POST /api/tools` - 添加工具
- `PUT /api/tools/:id` - 更新工具
- `DELETE /api/tools/:id` - 删除工具
- `POST /api/tools/batch-delete` - 批量删除工具
- `PATCH /api/tools/:id/status` - 更新工具状态

### 分类管理（仅superadmin）
- `POST /api/categories` - 添加分类
- `PUT /api/categories/:id` - 更新分类
- `DELETE /api/categories/:id` - 删除分类
- `PATCH /api/categories/:id/status` - 更新分类状态

### 无需权限的接口
- `GET /api/tools` - 查看工具列表
- `GET /api/tools/search` - 搜索工具
- `GET /api/tools/:id` - 查看工具详情
- `GET /api/categories` - 查看分类列表
- `GET /api/categories/options` - 获取分类选项

## 🎯 前端权限控制

### 获取用户权限信息
```javascript
// 调用接口
GET /api/admin/permissions

// 返回结果（超级管理员）
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "role": "superadmin",
    "permissions": ["all"],
    "isSuperAdmin": true,
    "canDeleteTools": true,
    "canEditTools": true,
    "canAddTools": true,
    "canManageUsers": true,
    "canManageSettings": true
  }
}

// 返回结果（普通管理员）
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "role": "admin",
    "permissions": ["tools", "upload"],
    "isSuperAdmin": false,
    "canDeleteTools": false,
    "canEditTools": false,
    "canAddTools": false,
    "canManageUsers": false,
    "canManageSettings": false
  }
}
```

### 前端按钮控制示例
```vue
<template>
  <div>
    <!-- 只有超级管理员能看到这些按钮 -->
    <el-button 
      v-if="userPermissions.isSuperAdmin" 
      type="primary" 
      @click="addTool"
    >
      添加工具
    </el-button>
    
    <el-button 
      v-if="userPermissions.canDeleteTools" 
      type="danger" 
      @click="deleteTool"
    >
      删除工具
    </el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userPermissions: {}
    }
  },
  async mounted() {
    // 获取用户权限
    const res = await this.$api.get('/api/admin/permissions');
    this.userPermissions = res.data;
  }
}
</script>
```

## 🔧 错误码说明

- `401` - 未登录或token无效
- `403` - 权限不足（非超级管理员尝试操作受保护接口）
- `404` - 管理员账号不存在
- `500` - 数据库错误

## 🎭 测试步骤

### 1. 测试超级管理员登录
```bash
curl -X POST http://localhost:8088/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username": "superadmin", "password": "admin123"}'
```

### 2. 测试权限保护接口
```bash
# 使用返回的token
curl -X POST http://localhost:8088/api/tools \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title": "测试工具", "link": "http://test.com", "desc": "测试描述"}'
```

### 3. 测试普通管理员权限
```bash
# 使用tooladmin登录，然后尝试添加工具，应该返回403错误
curl -X POST http://localhost:8088/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username": "tooladmin", "password": "admin123"}'
```

## 🔄 修改权限

### 添加新的管理员
```sql
INSERT INTO administrators (admin_name, username, password, email, role, permissions, status) VALUES
('新管理员', 'newadmin', MD5('password123'), 'new@admin.com', 'admin', '["tools"]', 1);
```

### 升级为超级管理员
```sql
UPDATE administrators SET role = 'superadmin', permissions = '["all"]' WHERE username = 'username';
```

### 禁用管理员
```sql
UPDATE administrators SET status = 0 WHERE username = 'username';
```

## 🎯 扩展权限系统

如果需要添加新的权限控制，可以：

1. 在中间件中添加新的权限检查函数
2. 在路由中应用权限检查
3. 更新前端权限获取接口

示例：
```javascript
// 在middleware/auth.js中添加
const requireSpecialPermission = requirePermission(['special']);

// 在路由中使用
router.post('/api/special', requireSpecialPermission, (req, res) => {
  // 只有拥有special权限的用户才能访问
});
```

## 🎉 完成！

现在你的系统已经实现了完整的超级管理员权限控制！

- superadmin可以进行所有操作
- 其他管理员无法进行关键操作
- 前端可以根据权限动态显示/隐藏按钮 