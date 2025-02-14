<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <template #tableBeforeButtons>
        <a-button v-auth="['set:rule:save']" type="primary" @click="addRule">新增规则</a-button>
      </template>
      <template #operationCell="{ record }">
        <a-link v-auth="['set:rule:update']" @click="handleEdit(record)"><icon-edit />编辑</a-link>
        <a-popconfirm
            content="确定要删除该数据吗?"
            position="bottom"
            @ok="handleDelete(record)"
        >
          <a-link v-auth="['set:rule:delete']" status="danger"><icon-delete />删除</a-link>
        </a-popconfirm>
      </template>
    </ma-crud>
    <a-modal
        v-model:visible="addVisible"
        :footer="true"
        :on-before-ok="submit"
        @cancel="close"
        ok-text="保存"
        cancel-text="关闭"
        draggable
        unmount-on-close
        width="600px"
        :title="modalTitle"
    >
      <a-form :model="form" ref="formRef" auto-label-width>
        <a-form-item field="rules_type" label="规则类型" :rules="[{ required: true, message: '规则类型必选' }]">
          <a-select v-model="form.rules_type" placeholder="请选择">
            <a-option value="1">基于地区规则</a-option>
            <a-option value="2">基于性别规则</a-option>
            <a-option value="3">基于地区&性别规则</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="rules_name" label="规则名称" :rules="[{ required: true, message: '规则名称必填' }]">
          <a-input v-model="form.rules_name" placeholder="请输入" clearable />
        </a-form-item>
        <a-form-item field="priority" label="优先级" :rules="[{ required: true, message: '优先级必填' }, { validator: (value, cb) => { value < 1 ? cb('优先级需要大于1') : cb() } }]">
          <a-input v-model="form.priority" placeholder="数字越大越靠前" />
        </a-form-item>
        <a-form-item field="is_rules" label="是否可触发其他定向规则" :rules="[{ required:true,message:'是否可触发其他定向规则必选' }]">
          <a-radio-group v-model="form.is_rules">
            <a-radio value="1">否</a-radio>
            <a-radio value="2">是</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item field="area_group_id" label="地区" :rules="[{ required:true,message:'地区必选' }]">
          <a-tree-select
              v-model="form.area_group_id"
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
              v-model="form.lang_cfg"
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
          <a-checkbox-group v-model="form.sex_cfg">
            <a-checkbox value="1">男</a-checkbox>
            <a-checkbox value="2">女</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item field="wealth_cfg" label="财富等级" :rules="[{ required:true,message:'财富等级必填' }]">
          <a-input v-model="form.wealth_cfg" placeholder="请输入" />
        </a-form-item>
        <a-form-item field="charm_cfg" label="魅力等级" :rules="[{ required:true,message:'魅力等级必填' }]">
          <a-input v-model="form.charm_cfg" placeholder="请输入" />
        </a-form-item>
        <a-form-item field="account_limit" label="账户余额>=" :rules="[{ required:true,message:'账户余额必填' }]">
          <a-input v-model="form.account_limit" placeholder="请输入" />
        </a-form-item>
        <a-form-item field="from_cfg" label="展示场景" :rules="[{ required:true,message:'展示场景必选' }]">
          <a-tree-select
              v-model="form.from_cfg"
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
          <a-radio-group v-model="form.label_id">
            <a-radio v-for="item in labelList" :key="item.key" :value="item.key">{{ item.title }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item field="is_club" label="是否家族专属" :rules="[{ required:true,message:'家族专属必选' }]">
          <a-radio-group v-model="form.is_club">
            <a-radio value="0">不是</a-radio>
            <a-radio value="1">是</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item field="game_cfg" label="生效游戏" :rules="[{ required:true,message:'生效游戏必选' }]">
          <a-checkbox-group v-model="form.game_cfg">
            <a-checkbox v-for="item in gameCfgList" :key="item.key" :value="item.key">{{ item.title }}</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import rule from '@/api/set/rule'

const crudRef = ref()
const addVisible = ref(false)
const modalTitle = ref('')
const formRef = ref()
const form = ref({
  id: '',
  rules_type: '',
  rules_name: '',
  priority: '',
  is_rules: '',
  area_group_id: [],
  lang_cfg: [],
  sex_cfg: [],
  wealth_cfg: '',
  charm_cfg: '',
  account_limit: '',
  from_cfg: [],
  label_id: '',
  is_club: '',
  game_cfg: []
})
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
const gameCfgList = [
  {
    title: 'Lucky Hunter',
    key: '206'
  },
  {
    title: 'UNO',
    key: '216'
  },
  {
    title: 'LUDO',
    key: '217'
  },
  {
    title: 'Lava Link',
    key: '203'
  },
  {
    title: 'TeenPatti',
    key: '209'
  },
  {
    title: 'SPHINX',
    key: '210'
  },
  {
    title: 'CarRacing',
    key: '214'
  },
  {
    title: 'CrazyZoo',
    key: '215'
  },
  {
    title: 'Archery',
    key: '211'
  },
  {
    title: 'Racing',
    key: '212'
  },
  {
    title: 'Lucky77 pro',
    key: '213'
  },
  {
    title: 'Fishing Star',
    key: '205'
  },
  {
    title: 'Fish Joy',
    key: '202'
  },
  {
    title: 'The Bounty',
    key: '208'
  },
  {
    title: 'Jurassic',
    key: '207'
  },
  {
    title: 'Lucky Number',
    key: '4'
  },
  {
    title: 'Asphalt',
    key: '5'
  },
  {
    title: 'zoo loco',
    key: '201'
  },
  {
    title: 'gift wheel',
    key: '3'
  },
  {
    title: 'PusoyDos',
    key: '218'
  }
]

const addRule = () => {
  form.value = {
    id: '',
    rules_type: '',
    rules_name: '',
    priority: '',
    is_rules: '',
    area_group_id: [],
    lang_cfg: [],
    sex_cfg: [],
    wealth_cfg: '',
    charm_cfg: '',
    account_limit: '',
    from_cfg: [],
    label_id: '',
    is_club: '',
    game_cfg: []
  }
  modalTitle.value = '新增规则'
  addVisible.value = true
}

const handleEdit = async (record) => {
  form.value.id = record.id
  modalTitle.value = '编辑规则'
  const res = await rule.getDetail({ id: record.id })
  if (res.success) {
    form.value.rules_type = res.data.ret.info.rules_type
    form.value.rules_name = res.data.ret.info.rules_name
    form.value.priority = res.data.ret.info.priority
    form.value.is_rules = res.data.ret.info.is_rules
    form.value.area_group_id = res.data.ret.info.area_group_id
    form.value.lang_cfg = res.data.ret.info.lang_cfg
    form.value.sex_cfg = res.data.ret.info.sex_cfg === '1' ? ['1'] : res.data.ret.info.sex_cfg === '2' ? ['2'] : ['1', '2']
    form.value.wealth_cfg = res.data.ret.info.wealth_cfg
    form.value.charm_cfg = res.data.ret.info.charm_cfg
    form.value.account_limit = res.data.ret.info.account_limit
    form.value.from_cfg = res.data.ret.info.from_cfg
    form.value.label_id = res.data.ret.info.label_id
    form.value.is_club = res.data.ret.info.is_club
    form.value.game_cfg = res.data.ret.info.games_ids
    addVisible.value = true
  }
}

const handleDelete = async (record) => {
  const res = await rule.delete({ rule_id: record.id })
  if (res.success) {
    Message.success(res.message)
    crudRef.value.refresh()
  }
}

const submit = async () => {
  const validResult = await formRef.value.validate()
  if (validResult) {
    for (let i in validResult) {
      Message.error(validResult[i].message)
    }
    return false
  }
  const res = await rule.save(form.value)
  if (res.success) {
    Message.success(res.message)
    crudRef.value.refresh()
  }
  formRef.value.resetFields()
}

const close = () => {
  addVisible.value = false
  formRef.value.resetFields()
}
const getAreaList = async () => {
  const res = await rule.getDetail({ id: '0' })
  if (res.success) {
    res.data.ret.areaList.continent.forEach(item => {
      item.children = res.data.ret.areaList.country[item.area_id]
    })
    areaList.value = res.data.ret.areaList.continent
  }
}

getAreaList()

const crud = reactive({
  api: rule.getList,
  pageLayout: 'fixed',
  operationColumn: true
})

const columns = reactive([
  {
    title: '规则id', dataIndex: 'id'
  },
  {
    title: '规则类型', dataIndex: 'rules_type'
  },
  {
    title: '规则名称', dataIndex: 'rules_name'
  },
  {
    title: '是否可触发其他定向规则', dataIndex: 'is_rules'
  },
  {
    title: '优先级', dataIndex: 'priority'
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
  }
])
</script>

<script>
// export default { name: 'set:rule' }
</script>

<style scoped>

</style>