<template>
  <div>
    <a-card title="用户信息" :bordered="false">
      <a-alert>uid：【为空】设置【全平台用户】等级配置，【不为空】设置【单个用户】等级配置。</a-alert>
      <a-input-search v-model="uid" class="mt-2.5" :style="{width:'400px'}" placeholder="请输入uid" allow-clear button-text="查询" search-button @search="handleSearch">
        <template #prepend>
          uid
        </template>
      </a-input-search>
    </a-card>
    <a-card class="mt-2.5" title="税收信息" :bordered="false">
      <a-form :model="formData" auto-label-width>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item field="tax" label="用户税收比例">
              <a-input v-model="formData.tax" allow-clear />&nbsp;%
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item field="user_tax" label="用户总税收">
              <a-input v-model="formData.user_tax" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item field="profit_loss" label="用户盈亏" disabled>
              <a-input v-model="formData.profit_loss" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item>
              <a-button type="primary" html-type="submit" @click="handleUserTax">设置</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card class="mt-2.5" title="等级信息" :bordered="false">
      <a-alert>干扰系数：用于增减用户不中奖概率，当系数为【+】代表不中奖概率提升(系统吸水)，系数为【-】代表不中奖概率降低(系统吐水)。</a-alert>
      <a-alert class="mt-2.5">类型：【1】为系统输钱用户赢钱，需要提高(+)用户不中奖概率，【2】为系统赢钱用户输钱，需要降低(-)用户不中奖概率。</a-alert>
      <a-table :columns="columns" :data="tableData" stripe :pagination="false" class="mt-2.5">
        <template #user_level="{ record }">
          LV{{ record.user_level }}
          <a-tag v-if="rank == record.user_level && rank_type == record.type && uid" color="#00b42a">当前</a-tag>
        </template>
        <template #use_interference_coefficient="{ record }">
          <a-input
              v-model="record.use_interference_coefficient"
          />
        </template>
        <template #money="{ record }">
          <a-input
              v-model="record.money"
          />
        </template>
        <template #type="{ record }">
          <a-input v-model="record.type">
            <template #append>
              <a-tag v-if="record.type === '1'" color="#ff5722">系统输钱&nbsp;<icon-minus /></a-tag>
              <a-tag v-else-if="record.type === '2'" color="#7bc616">系统赢钱&nbsp;<icon-plus /></a-tag>
              <a-tag v-else color="#86909c">无效类型&nbsp;<icon-close /></a-tag>
            </template>
          </a-input>
        </template>
      </a-table>
      <div class="mt-2.5 text-right">
        <a-space>
          <a-button v-auth="['gift:commonLevel:update']" type="primary" @click="releaseConfig">发布配置</a-button>
          <a-button v-auth="['gift:commonLevel:update']" @click="clearConfig">清除配置</a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'
import commonLevel from '@/api/gift/commonLevel'

const uid = ref()
const route  = useRoute()
if (route.query.uid) {
  uid.value = route.query.uid
}
const formData = ref({
  tax: '',
  user_tax: '',
  profit_loss: ''
})
const tableData = ref([])
const rank_type = ref()
const rank = ref()

const handleSearch = () => {
  getList()
}

const handleUserTax = () => {
  if ((!formData.value.user_tax || formData.value.user_tax < 0) && uid.value) {
    Message.error('税收格式错误')
    return
  }
  if (formData.value.user_tax && !uid.value) {
    Message.error('用户ID不能为空')
    return
  }
  Modal.info({
    simple: false,
    hideCancel: false,
    title: '提示',
    content: '您确定税收配置吗?',
    onOk: async () => {
      const data = {
        tax: {
          value: formData.value.tax,
          user_tax: formData.value.user_tax
        },
        uid: uid.value ? uid.value : 0
      }
      const res = await commonLevel.updateTax(data)
      if (res.success) {
        Message.success(res.message)
        getList()
      }
    }
  })
}

const releaseConfig = () => {
  if (formData.value.user_tax < 0) {
    Message.error('用户总税收 不能为负数')
    return
  }
  const data = {}
  tableData.value.forEach(item => {
    data[item.id] = {
      user_level: item.user_level,
      use_interference_coefficient: item.use_interference_coefficient,
      money: item.money,
      type: item.type,
      uid: uid.value ? uid.value : 0
    }
  })
  let str = ''
  let params = {}
  console.log(uid.value)
  if (!uid.value) {
    str = '您确定要发布全平台等级配置吗？'
    params = {
      form: data,
      tax: {
        value: formData.value.tax
      },
      uid: 0
    }
  } else {
    str = `您确定要设置用户【${uid.value}】的等级配置吗？`
    params = {
      form: data,
      tax: {
        value: formData.value.tax,
        user_tax: formData.value.user_tax
      },
      uid: uid.value
    }
  }
  Modal.info({
    simple: false,
    hideCancel: false,
    title: '提示',
    content: str,
    onOk: async () => {
      const res = await commonLevel.updateConfig(uid.value, params)
      if (res.success) {
        Message.success(res.message)
        getList()
      }
    }
  })
}

const clearConfig = () => {
  if (!uid.value) {
    Message.error('只能清空指定用户的等级配置')
    return
  }
  Modal.info({
    simple: false,
    hideCancel: false,
    title: '提示',
    content: `您确定要清空用户【${uid.value}】的等级配置吗？`,
    onOk: async () => {
      const res = await commonLevel.delete({ uid: uid.value })
      if (res.success) {
        Message.success(res.message)
        getList()
      }
    }
  })
}

const getList = async () => {
  tableData.value = []
  let id = uid.value ? uid.value : 0
  const res = await commonLevel.getList(id)
  if (res.success) {
    res.data.list.forEach(item => {
      tableData.value.push({
        id: item.id,
        user_level: item.user_level,
        use_interference_coefficient: item.use_interference_coefficient,
        money: item.money,
        type: item.type,
      })
    })
    formData.value.tax = res.data.tax.value
    formData.value.user_tax = res.data.tax.user_tax == 0 ? '' : String(res.data.tax.user_tax)
    formData.value.profit_loss = String(res.data.tax.profit_loss)
    rank.value = res.data.tax.rank
    rank_type.value = res.data.tax.rank_type
  }
}

const columns = reactive([
  {
    title: '用户等级', dataIndex: 'user_level', slotName: 'user_level'
  },
  {
    title: '干扰系数', dataIndex: 'use_interference_coefficient', slotName: 'use_interference_coefficient'
  },
  {
    title: '金额', dataIndex: 'money', slotName: 'money'
  },
  {
    title: '类型（1：系统输钱用户赢钱，2：系统赢钱用户输钱）', dataIndex: 'type', slotName: 'type'
  }
])

getList()
</script>

<script>
// export default { name: 'gift:commonLevel' }
</script>

<style scoped>

</style>
