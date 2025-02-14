<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <template #game_url="{ record }">
        <img :src="record.game_url" alt="">
      </template>
      <template #game_status="{ record }">
        <a-tag v-if="record.game_status === '2'" color="#f53f3f">已下架</a-tag>
        <a-tag v-else color="#00b42a">已上架</a-tag>
      </template>
      <template #operationCell="{ record }">
        <div v-auth="['set:config:update']">
          <a-link @click="handleEdit(record)">编辑</a-link>
          <a-popconfirm
              content="是否确认该操作？"
              position="bottom"
              @ok="handleStatus(record)"
          >
            <a-link :status="record.game_status === '2' ? 'success' : 'danger'">{{ record.game_status === '2' ? '上架' : '下架' }}</a-link>
          </a-popconfirm>
          <a-popconfirm
              content="是否确认该操作？"
              position="bottom"
              @ok="handlePreStatus(record)"
          >
            <a-link :status="record.pre_remove === '0' ? 'danger' : 'success'">{{ record.pre_remove === '0' ? '预下架' : '取消预下架' }}</a-link>
          </a-popconfirm>
          <a-link @click="handleWhitelist(record)">白名单</a-link>
        </div>
      </template>
    </ma-crud>
    <a-modal
        v-model:visible="whitelistVisible"
        :footer="true"
        :on-before-ok="whitelistSubmit"
        @cancel="whitelistClose"
        ok-text="保存"
        cancel-text="关闭"
        draggable
        unmount-on-close
        width="600px"
        :title="whitelistTitle"
    >
      <a-alert>白名单可针对此款游戏进行规则绕过,但游戏必须是上架状态</a-alert>
      <a-form class="mt-2.5" :model="whitelistForm" ref="whitelistFormRef">
        <a-form-item field="white_list" label="白名单">
          <a-textarea v-model="whitelistForm.white_list" auto-size />
          <template #extra>多个uid用逗号分割，请勿换行</template>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
        v-model:visible="editVisible"
        :footer="true"
        :on-before-ok="editSubmit"
        @cancel="editClose"
        ok-text="保存"
        cancel-text="关闭"
        draggable
        unmount-on-close
        width="600px"
        title="修改规则"
    >
      <a-form :model="editForm" ref="editFormRef" auto-label-width>
        <a-form-item field="rules_name" label="规则名称" :rules="[{ required: true, message: '规则名称必填' }]">
          <a-input v-model="editForm.rules_name" placeholder="请输入" clearable />
        </a-form-item>
        <a-form-item field="area_group_id" label="地区" :rules="[{ required:true,message:'地区必选' }]">
          <a-tree-select
              v-model="editForm.area_group_id"
              :default-expand-all="false"
              :allow-clear="true"
              :tree-checkable="true"
              :tree-check-strictly="false"
              :fieldNames="{ title: 'area_name', key: 'area_id' }"
              :treeProps="{
                defaultExpandAll: false
              }"
              :max-tag-count="10"
              :data="areaList"
              placeholder="请选择"
          ></a-tree-select>
        </a-form-item>
        <a-form-item field="lang_cfg" label="默认语言" :rules="[{ required:true,message:'默认语言必选' }]">
          <a-tree-select
              v-model="editForm.lang_cfg"
              :default-expand-all="false"
              :allow-clear="true"
              :tree-checkable="true"
              :tree-check-strictly="false"
              :treeProps="{
                defaultExpandAll: false
              }"
              :max-tag-count="10"
              :data="langList"
              placeholder="请选择"
          ></a-tree-select>
        </a-form-item>
        <a-form-item field="sex_cfg" label="性别" :rules="[{ required:true,message:'性别必选' }]">
          <a-checkbox-group v-model="editForm.sex_cfg">
            <a-checkbox value="1">男</a-checkbox>
            <a-checkbox value="2">女</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item field="wealth_cfg" label="财富等级" :rules="[{ required:true,message:'财富等级必填' }]">
          <a-input v-model="editForm.wealth_cfg" placeholder="请输入" />
        </a-form-item>
        <a-form-item field="charm_cfg" label="魅力等级" :rules="[{ required:true,message:'魅力等级必填' }]">
          <a-input v-model="editForm.charm_cfg" placeholder="请输入" />
        </a-form-item>
        <a-form-item field="account_limit" label="账户余额>=" :rules="[{ required:true,message:'账户余额必填' }]">
          <a-input v-model="editForm.account_limit" placeholder="请输入" />
        </a-form-item>
        <a-form-item field="from_cfg" label="展示场景" :rules="[{ required:true,message:'展示场景必选' }]">
          <a-tree-select
              v-model="editForm.from_cfg"
              :default-expand-all="false"
              :allow-clear="true"
              :tree-checkable="true"
              :tree-check-strictly="false"
              :treeProps="{
                defaultExpandAll: false
              }"
              :max-tag-count="10"
              :data="scenarioList"
              placeholder="请选择"
          ></a-tree-select>
        </a-form-item>
        <a-form-item field="label_id" label="标签" :rules="[{ required:true,message:'标签必选' }]">
          <a-radio-group v-model="editForm.label_id">
            <a-radio v-for="item in labelList" :key="item.key" :value="item.key">{{ item.title }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item field="is_club" label="是否家族专属" :rules="[{ required:true,message:'家族专属必选' }]">
          <a-radio-group v-model="editForm.is_club">
            <a-radio value="0">不是</a-radio>
            <a-radio value="1">是</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import config from '@/api/set/config'

const crudRef = ref()

const whitelistVisible = ref(false)
const whitelistTitle = ref('')
const whitelistForm = ref({
  game_id: '',
  white_list: ''
})
const whitelistFormRef = ref()

const editVisible = ref(false)
const editForm = ref({})
const editFormRef = ref()
const areaList = ref([])

const langList = [
  {
    title: '全部语言',
    key: '-1',
    children: [
      {
        title: '中文（简体）',
        key: 'zh-CN'
      },
      {
        title: '中文（繁体）',
        key: 'zh-TW'
      },
      {
        title: '英文',
        key: 'en'
      },
      {
        title: '阿拉伯语',
        key: 'ar'
      },
      {
        title: '马来语',
        key: 'ms'
      },
      {
        title: '印地语',
        key: 'hi'
      },
      {
        title: '越南语',
        key: 'vi'
      },
      {
        title: '葡萄牙',
        key: 'pt'
      },
      {
        title: '西班牙',
        key: 'es'
      }
    ]
  }
]
const scenarioList = [
  {
    title: '全部场景',
    key: '-1',
    children: [
      {
        title: '视频派对',
        key: '1'
      },
      {
        title: '单人直播间',
        key: '2'
      },
      {
        title: '家族厅',
        key: '3'
      },
      {
        title: '家族群',
        key: '4'
      },
      {
        title: '私聊',
        key: '5'
      },
      {
        title: '家族主页',
        key: '6'
      },
      {
        title: '游戏中心',
        key: '7'
      }
    ]
  }
]
const labelList = [
  {
    title: '无标签',
    key: '0',
  },
  {
    title: 'Club',
    key: '1',
  },
  {
    title: 'Hot',
    key: '2',
  },
  {
    title: 'New',
    key: '3',
  }
]

const handleStatus = async (record) => {
  const data = {
    game_id: record.game_id,
    game_status: record.game_status
  }
  const res = await config.updateStatus(data)
  if (res.success) {
    Message.success(res.message)
    crudRef.value.refresh()
  }
}

const handlePreStatus = async (record) => {
  const data = {
    game_id: record.game_id,
    pre_remove: record.pre_remove
  }
  const res = await config.updateStatus(data)
  if (res.success) {
    Message.success(res.message)
    crudRef.value.refresh()
  }
}

const handleWhitelist = (record) => {
  whitelistTitle.value = '当前正在编辑的游戏ID：' + record.game_id
  whitelistForm.value.game_id = record.game_id
  whitelistForm.value.white_list = record.white_list
  whitelistVisible.value = true
}

const whitelistSubmit = async () => {
  const res = await config.updateStatus(whitelistForm.value)
  if (res.success) {
    Message.success(res.message)
    crudRef.value.refresh()
  }
}

const whitelistClose = () => {
  whitelistVisible.value = false
  whitelistFormRef.value.resetFields()
}

const handleEdit = async (record) => {
  const res = await config.getDetail(record.id)
  if (res.success) {
    editForm.value.rules_name = record.rules_name
    res.data.list.areaList.continent.forEach(item => {
      item.children = res.data.list.areaList.country[item.area_id]
    })
    areaList.value = res.data.list.areaList.continent
    editForm.value.area_group_id = res.data.list.info.area_group_id
    editForm.value.lang_cfg = res.data.list.info.lang_cfg
    editForm.value.sex_cfg = res.data.list.info.sex_cfg === '1' ? ['1'] : res.data.list.info.sex_cfg === '2' ? ['2'] : ['1', '2']
    editForm.value.wealth_cfg = res.data.list.info.wealth_cfg
    editForm.value.charm_cfg = res.data.list.info.charm_cfg
    editForm.value.account_limit = res.data.list.info.account_limit
    editForm.value.from_cfg = res.data.list.info.from_cfg
    editForm.value.label_id = res.data.list.info.label_id
    editForm.value.is_club = res.data.list.info.is_club
    editForm.value.id = res.data.list.info.id
    editForm.value.rules_type = res.data.list.info.rules_type
    editForm.value.priority = res.data.list.info.priority
    editForm.value.is_rules = res.data.list.info.is_rules
    editForm.value.game_cfg = record.game_id
    editVisible.value = true
  }
}

// const filterTreeNode = (searchValue, nodeData) => {
//   return nodeData.area_name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
// }

const editSubmit = async () => {
  const validResult = await editFormRef.value.validate()
  if (validResult) {
    for (let i in validResult) {
      Message.error(validResult[i].message)
    }
    return false
  }
  const res = await config.updateRule(editForm.value)
  if (res.success) {
    Message.success(res.message)
    crudRef.value.refresh()
  }
  editFormRef.value.resetFields()
}

const editClose = () => {
  editVisible.value = false
  editFormRef.value.resetFields()
}

const crud = reactive({
  api: config.getList,
  pageLayout: 'fixed',
  operationColumn: true,
  operationColumnWidth: 240,
})

const columns = reactive([
  {
    title: '游戏id', dataIndex: 'game_id'
  },
  {
    title: '游戏名称', dataIndex: 'game_name'
  },
  {
    title: '游戏图标', dataIndex: 'game_url'
  },
  {
    title: '规则名称', dataIndex: 'rules_name'
  },
  {
    title: '性别', dataIndex: 'sex_cfg'
  },
  {
    title: '财富等级', dataIndex: 'wealth_cfg'
  },
  {
    title: '魅力等级', dataIndex: 'charm_cfg'
  },
  {
    title: '账户余额', dataIndex: 'account_limit'
  },
  {
    title: '标签', dataIndex: 'label_id'
  },
  {
    title: '是否家族专属', dataIndex: 'is_club'
  },
  {
    title: '上架状态', dataIndex: 'game_status'
  }
])
</script>

<script>
// export default { name: 'set:config' }
</script>

<style scoped>

</style>