<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">权限管理</h1>
      <a-button type="primary" @click="showCreateModal">
        <template #icon><PlusOutlined /></template>
        新增权限
      </a-button>
    </div>

    <!-- 搜索筛选 -->
    <div class="card card-body mb-6">
      <a-form layout="inline" :model="searchForm" @finish="handleSearch">
        <a-form-item label="关键词">
          <a-input
            v-model:value="searchForm.keyword"
            placeholder="请输入权限名称或代码"
            allow-clear
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item label="权限类型">
          <a-select
            v-model:value="searchForm.type"
            placeholder="请选择权限类型"
            allow-clear
            style="width: 150px"
          >
            <a-select-option value="menu">菜单权限</a-select-option>
            <a-select-option value="button">按钮权限</a-select-option>
            <a-select-option value="api">API权限</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            v-model:value="searchForm.status"
            placeholder="请选择状态"
            allow-clear
            style="width: 120px"
          >
            <a-select-option value="active">启用</a-select-option>
            <a-select-option value="inactive">禁用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading">
            <template #icon><SearchOutlined /></template>
            搜索
          </a-button>
          <a-button @click="resetSearch" style="margin-left: 8px"> 重置 </a-button>
        </a-form-item>
      </a-form>
    </div>

    <!-- 权限表格 -->
    <div class="card card-body">
      <a-table
        :columns="columns"
        :data-source="permissions"
        :loading="loading"
        row-key="id"
        :pagination="false"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            <a-tag :color="getTypeColor(record.type)">
              {{ getTypeText(record.type) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === 'active' ? 'green' : 'red'">
              {{ record.status === 'active' ? '启用' : '禁用' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="showEditModal(record)"> 编辑 </a-button>
              <a-popconfirm title="确定要删除这个权限吗？" @confirm="handleDelete(record.id)">
                <a-button type="link" size="small" danger> 删除 </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 创建/编辑权限弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑权限' : '新增权限'"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :confirm-loading="submitLoading"
      width="600px"
    >
      <a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="权限名称" name="name">
              <a-input v-model:value="formData.name" placeholder="请输入权限名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="权限代码" name="code">
              <a-input v-model:value="formData.code" placeholder="请输入权限代码" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="权限类型" name="type">
              <a-select v-model:value="formData.type" placeholder="请选择权限类型">
                <a-select-option value="menu">菜单权限</a-select-option>
                <a-select-option value="button">按钮权限</a-select-option>
                <a-select-option value="api">API权限</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="父级权限" name="parentId">
              <a-tree-select
                v-model:value="formData.parentId"
                :tree-data="permissionTreeData"
                placeholder="请选择父级权限"
                allow-clear
                tree-default-expand-all
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16" v-if="formData.type === 'menu'">
          <a-col :span="12">
            <a-form-item label="路由路径" name="path">
              <a-input v-model:value="formData.path" placeholder="请输入路由路径" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="组件路径" name="component">
              <a-input v-model:value="formData.component" placeholder="请输入组件路径" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="图标" name="icon">
              <a-input v-model:value="formData.icon" placeholder="请输入图标名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排序" name="sort">
              <a-input-number
                v-model:value="formData.sort"
                :min="0"
                placeholder="请输入排序值"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="formData.status">
            <a-radio value="active">启用</a-radio>
            <a-radio value="inactive">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-textarea v-model:value="formData.description" placeholder="请输入权限描述" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons-vue'
import type {
  Permission,
  CreatePermissionDto,
  UpdatePermissionDto,
  PermissionType,
  PermissionStatus,
  PermissionTreeNode,
} from '@admin-system/shared'
import * as permissionApi from '@/api/permission'

// 响应式数据
const loading = ref(false)
const submitLoading = ref(false)
const permissions = ref<Permission[]>([])
const permissionTreeData = ref<any[]>([])
const modalVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()

// 搜索表单
const searchForm = reactive({
  keyword: '',
  type: undefined,
  status: undefined,
})

// 表单数据
const formData = reactive<CreatePermissionDto & { id?: string }>({
  name: '',
  code: '',
  type: 'menu',
  parentId: undefined,
  path: '',
  component: '',
  icon: '',
  sort: 0,
  status: 'active',
  description: '',
})

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入权限代码', trigger: 'blur' }],
  type: [{ required: true, message: '请选择权限类型', trigger: 'change' }],
  sort: [{ required: true, message: '请输入排序值', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

// 表格列配置
const columns = [
  {
    title: '权限名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: '权限代码',
    dataIndex: 'code',
    key: 'code',
    width: 180,
  },
  {
    title: '权限类型',
    dataIndex: 'type',
    key: 'type',
    width: 100,
  },
  {
    title: '路由路径',
    dataIndex: 'path',
    key: 'path',
    width: 150,
  },
  {
    title: '图标',
    dataIndex: 'icon',
    key: 'icon',
    width: 80,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: 80,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    width: 200,
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right',
  },
]

// 获取权限类型颜色
const getTypeColor = (type: string) => {
  const colors = {
    menu: 'blue',
    button: 'green',
    api: 'orange',
  }
  return colors[type as keyof typeof colors] || 'default'
}

// 获取权限类型文本
const getTypeText = (type: string) => {
  const texts = {
    menu: '菜单权限',
    button: '按钮权限',
    api: 'API权限',
  }
  return texts[type as keyof typeof texts] || type
}

// 获取权限列表
const fetchPermissions = async () => {
  try {
    loading.value = true
    const response = await permissionApi.getPermissions(searchForm)
    permissions.value = response.data || []
  } catch (error) {
    message.error('获取权限列表失败')
  } finally {
    loading.value = false
  }
}

// 获取权限树数据
const fetchPermissionTree = async () => {
  try {
    const response = await permissionApi.getPermissionTree()
    permissionTreeData.value = buildTreeSelectData(response.data || [])
  } catch (error) {
    console.error('获取权限树失败:', error)
  }
}

// 构建树选择器数据
const buildTreeSelectData = (permissions: Permission[]): any[] => {
  return permissions.map((permission) => ({
    title: permission.name,
    value: permission.id,
    key: permission.id,
    children: permission.children ? buildTreeSelectData(permission.children) : undefined,
  }))
}

// 搜索
const handleSearch = () => {
  fetchPermissions()
}

// 重置搜索
const resetSearch = () => {
  Object.assign(searchForm, {
    keyword: '',
    type: undefined,
    status: undefined,
  })
  fetchPermissions()
}

// 显示创建弹窗
const showCreateModal = () => {
  isEdit.value = false
  modalVisible.value = true
  resetForm()
}

// 显示编辑弹窗
const showEditModal = (record: Permission) => {
  isEdit.value = true
  modalVisible.value = true
  Object.assign(formData, {
    id: record.id,
    name: record.name,
    code: record.code,
    type: record.type,
    parentId: record.parentId,
    path: record.path,
    component: record.component,
    icon: record.icon,
    sort: record.sort,
    status: record.status,
    description: record.description,
  })
}

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    id: undefined,
    name: '',
    code: '',
    type: 'menu',
    parentId: undefined,
    path: '',
    component: '',
    icon: '',
    sort: 0,
    status: 'active',
    description: '',
  })
  formRef.value?.resetFields()
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitLoading.value = true

    if (isEdit.value) {
      await permissionApi.updatePermission(formData.id!, formData)
      message.success('权限更新成功')
    } else {
      await permissionApi.createPermission(formData)
      message.success('权限创建成功')
    }

    modalVisible.value = false
    fetchPermissions()
    fetchPermissionTree()
  } catch (error) {
    message.error(isEdit.value ? '权限更新失败' : '权限创建失败')
  } finally {
    submitLoading.value = false
  }
}

// 取消
const handleCancel = () => {
  modalVisible.value = false
  resetForm()
}

// 删除权限
const handleDelete = async (id: string) => {
  try {
    await permissionApi.deletePermission(id)
    message.success('权限删除成功')
    fetchPermissions()
    fetchPermissionTree()
  } catch (error) {
    message.error('权限删除失败')
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchPermissions()
  fetchPermissionTree()
})
</script>
