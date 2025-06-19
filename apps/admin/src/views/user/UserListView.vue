<template>
  <div>
    <!-- 页面标题 -->
    <div class="flex-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">用户管理</h1>
        <p class="text-gray-600 mt-1">管理系统用户信息和权限</p>
      </div>
      <a-button type="primary" @click="showCreateModal">
        <template #icon>
          <span class="i-ant-design:plus-outlined"></span>
        </template>
        新增用户
      </a-button>
    </div>

    <!-- 搜索和筛选 -->
    <div class="card card-body mb-6">
      <a-form layout="inline" :model="searchForm" @finish="handleSearch">
        <a-form-item label="关键词">
          <a-input
            v-model:value="searchForm.keyword"
            placeholder="搜索用户名、邮箱或昵称"
            allow-clear
            style="width: 200px"
          />
        </a-form-item>

        <a-form-item label="状态">
          <a-select
            v-model:value="searchForm.status"
            placeholder="选择状态"
            allow-clear
            style="width: 120px"
          >
            <a-select-option value="active">正常</a-select-option>
            <a-select-option value="inactive">禁用</a-select-option>
            <a-select-option value="banned">封禁</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="角色">
          <a-select
            v-model:value="searchForm.roleId"
            placeholder="选择角色"
            allow-clear
            style="width: 120px"
          >
            <a-select-option v-for="role in roleOptions" :key="role.id" :value="role.id">
              {{ role.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading"> 搜索 </a-button>
          <a-button @click="handleReset" class="ml-2"> 重置 </a-button>
        </a-form-item>
      </a-form>
    </div>

    <!-- 用户表格 -->
    <div class="card">
      <div class="card-body">
        <!-- 批量操作 -->
        <div class="flex-between mb-4" v-if="selectedRowKeys.length > 0">
          <div>
            <span class="text-gray-600">已选择 {{ selectedRowKeys.length }} 项</span>
            <a-button type="primary" danger size="small" @click="handleBatchDelete" class="ml-4">
              批量删除
            </a-button>
          </div>
          <a-button size="small" @click="selectedRowKeys = []"> 取消选择 </a-button>
        </div>

        <a-table
          :columns="columns"
          :data-source="userList"
          :loading="loading"
          :pagination="pagination"
          :row-selection="rowSelection"
          @change="handleTableChange"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'avatar'">
              <a-avatar :src="record.avatar" size="small">
                {{ record.username.charAt(0).toUpperCase() }}
              </a-avatar>
            </template>

            <template v-else-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">
                {{ getStatusText(record.status) }}
              </a-tag>
            </template>

            <template v-else-if="column.key === 'roles'">
              <a-tag v-for="role in record.roles" :key="role" color="blue" class="mb-1">
                {{ getRoleName(role) }}
              </a-tag>
            </template>

            <template v-else-if="column.key === 'createdAt'">
              {{ formatDate(record.createdAt) }}
            </template>

            <template v-else-if="column.key === 'action'">
              <a-space>
                <a-button type="link" size="small" @click="handleEdit(record)"> 编辑 </a-button>
                <a-button
                  type="link"
                  size="small"
                  @click="handleToggleStatus(record)"
                  :disabled="record.username === 'admin'"
                >
                  {{ record.status === 'active' ? '禁用' : '启用' }}
                </a-button>
                <a-button
                  type="link"
                  size="small"
                  danger
                  @click="handleDelete(record)"
                  :disabled="record.username === 'admin'"
                >
                  删除
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 创建/编辑用户弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑用户' : '新增用户'"
      width="600px"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :confirm-loading="submitLoading"
    >
      <a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="用户名" name="username">
              <a-input v-model:value="formData.username" placeholder="请输入用户名" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="邮箱" name="email">
              <a-input v-model:value="formData.email" placeholder="请输入邮箱" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="昵称" name="nickname">
              <a-input v-model:value="formData.nickname" placeholder="请输入昵称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="手机号" name="phone">
              <a-input v-model:value="formData.phone" placeholder="请输入手机号" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16" v-if="!isEdit">
          <a-col :span="12">
            <a-form-item label="密码" name="password">
              <a-input-password v-model:value="formData.password" placeholder="请输入密码" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="确认密码" name="confirmPassword">
              <a-input-password v-model:value="formData.confirmPassword" placeholder="请确认密码" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="状态" name="status">
              <a-select v-model:value="formData.status" placeholder="选择状态">
                <a-select-option value="active">正常</a-select-option>
                <a-select-option value="inactive">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="角色" name="roleIds">
              <a-select v-model:value="formData.roleIds" mode="multiple" placeholder="选择角色">
                <a-select-option
                  v-for="role in roleOptions"
                  :key="role.id"
                  :value="role.id"
                  :disabled="role.disabled"
                >
                  {{ role.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import type { TableColumnsType, FormInstance } from 'ant-design-vue'
import type {
  User,
  UserStatus,
  RoleOption,
  CreateUserDto,
  UpdateUserDto,
} from '@admin-system/shared'
import { formatDate } from '@admin-system/shared'
import * as userApi from '@/api/user'
import * as roleApi from '@/api/role'

// 响应式数据
const loading = ref(false)
const submitLoading = ref(false)
const userList = ref<User[]>([])
const roleOptions = ref<RoleOption[]>([])
const selectedRowKeys = ref<string[]>([])
const modalVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: undefined as UserStatus | undefined,
  roleId: '',
  page: 1,
  limit: 10,
})

// 分页信息
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
})

// 表单数据
const formData = reactive<CreateUserDto & { id?: string; confirmPassword?: string }>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  nickname: '',
  status: 'active' as UserStatus,
  roleIds: [],
})

// 表格列定义
const columns: TableColumnsType = [
  {
    title: '头像',
    key: 'avatar',
    width: 80,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '角色',
    key: 'roles',
    width: 150,
  },
  {
    title: '创建时间',
    key: 'createdAt',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
  },
]

// 表单验证规则
const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为 3-20 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, message: '密码长度至少 8 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_: any, value: string) => {
        if (value !== formData.password) {
          return Promise.reject('两次输入的密码不一致')
        }
        return Promise.resolve()
      },
      trigger: 'blur',
    },
  ],
}

// 行选择配置
const rowSelection = {
  selectedRowKeys: selectedRowKeys,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys
  },
  getCheckboxProps: (record: User) => ({
    disabled: record.username === 'admin',
  }),
}

// 工具函数
const getStatusColor = (status: UserStatus) => {
  const colors = {
    active: 'green',
    inactive: 'orange',
    banned: 'red',
    pending: 'blue',
  }
  return colors[status] || 'default'
}

const getStatusText = (status: UserStatus) => {
  const texts = {
    active: '正常',
    inactive: '禁用',
    banned: '封禁',
    pending: '待激活',
  }
  return texts[status] || status
}

const getRoleName = (roleCode: string) => {
  const role = roleOptions.value.find((r) => r.code === roleCode)
  return role?.name || roleCode
}

// API 调用函数
const fetchUserList = async () => {
  try {
    loading.value = true
    const params = {
      ...searchForm,
      page: pagination.current,
      limit: pagination.pageSize,
    }

    const response = await userApi.getUserList(params)
    if (response.success && response.data) {
      userList.value = response.data.users
      pagination.total = response.data.total
    }
  } catch (error) {
    message.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const fetchRoleOptions = async () => {
  try {
    const response = await roleApi.getRoleOptions()
    if (response.success && response.data) {
      roleOptions.value = response.data
    }
  } catch (error) {
    console.error('获取角色选项失败:', error)
  }
}

// 事件处理函数
const handleSearch = () => {
  pagination.current = 1
  fetchUserList()
}

const handleReset = () => {
  Object.assign(searchForm, {
    keyword: '',
    status: undefined,
    roleId: '',
    page: 1,
    limit: 10,
  })
  pagination.current = 1
  fetchUserList()
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchUserList()
}

const showCreateModal = () => {
  isEdit.value = false
  modalVisible.value = true
  resetForm()
}

const handleEdit = (record: User) => {
  isEdit.value = true
  modalVisible.value = true
  Object.assign(formData, {
    id: record.id,
    username: record.username,
    email: record.email,
    phone: record.phone,
    nickname: record.nickname,
    status: record.status,
    roleIds: record.roles,
  })
}

const resetForm = () => {
  Object.assign(formData, {
    id: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    nickname: '',
    status: 'active' as UserStatus,
    roleIds: [],
  })
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitLoading.value = true

    if (isEdit.value) {
      const { id, confirmPassword, ...updateData } = formData
      await userApi.updateUser(id!, updateData as UpdateUserDto)
      message.success('用户更新成功')
    } else {
      const { id, ...createData } = formData
      await userApi.createUser(createData as CreateUserDto)
      message.success('用户创建成功')
    }

    modalVisible.value = false
    fetchUserList()
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    submitLoading.value = false
  }
}

const handleCancel = () => {
  modalVisible.value = false
  resetForm()
}

const handleToggleStatus = async (record: User) => {
  try {
    const newStatus = record.status === 'active' ? 'inactive' : 'active'
    await userApi.updateUserStatus(record.id, newStatus as UserStatus)
    message.success('状态更新成功')
    fetchUserList()
  } catch (error) {
    message.error('状态更新失败')
  }
}

const handleDelete = (record: User) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除用户 "${record.username}" 吗？此操作不可恢复。`,
    onOk: async () => {
      try {
        await userApi.deleteUser(record.id)
        message.success('用户删除成功')
        fetchUserList()
      } catch (error) {
        message.error('用户删除失败')
      }
    },
  })
}

const handleBatchDelete = () => {
  Modal.confirm({
    title: '确认批量删除',
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 个用户吗？此操作不可恢复。`,
    onOk: async () => {
      try {
        await userApi.batchDeleteUsers(selectedRowKeys.value)
        message.success('批量删除成功')
        selectedRowKeys.value = []
        fetchUserList()
      } catch (error) {
        message.error('批量删除失败')
      }
    },
  })
}

// 初始化
onMounted(() => {
  fetchUserList()
  fetchRoleOptions()
})
</script>
