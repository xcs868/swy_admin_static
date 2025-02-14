<template>
<div>
  <a-card title="奖池信息" :bordered="false">
    <a-descriptions :column="1" bordered>
      <a-descriptions-item label="奖池金额">{{ poolsize }}</a-descriptions-item>
    </a-descriptions>
  </a-card>
  <a-card title="配置信息" :bordered="false" class="mt-2.5">
    <a-table :data="tableData" stripe :pagination="false">
      <template #columns>
        <a-table-column title="礼物名称" :width="90">
          <template #cell="{ record }">
            {{ record.gift_name }}
          </template>
        </a-table-column>
        <a-table-column title="单价（金币）" :width="120">
          <template #cell="{ record }">
            {{ record.coin }}
          </template>
        </a-table-column>
        <a-table-column title="赔率（倍数）">
          <template #cell="{ record }">
            <a-input v-model="record.normal_bei"></a-input>
          </template>
        </a-table-column>
        <a-table-column title="期望">
          <template #cell="{ record }">
            <a-input v-model="record.normal_expect"></a-input>
          </template>
        </a-table-column>
        <a-table-column title="低赔率（倍数）">
          <template #cell="{ record }">
            <a-input v-model="record.low_bei"></a-input>
          </template>
        </a-table-column>
        <a-table-column title="低赔率（期望）">
          <template #cell="{ record }">
            <a-input v-model="record.low_expect"></a-input>
          </template>
        </a-table-column>
        <a-table-column title="高赔率（倍数）">
          <template #cell="{ record }">
            <a-input v-model="record.high_bei"></a-input>
          </template>
        </a-table-column>
        <a-table-column title="高赔率（期望）">
          <template #cell="{ record }">
            <a-input v-model="record.high_expect"></a-input>
          </template>
        </a-table-column>
      </template>
    </a-table>
    <div class="mt-2.5 text-right">
      <a-button v-auth="['gift:newUserSetting:update']" type="primary" @click="releaseConfig">发布配置</a-button>
    </div>
  </a-card>
</div>
</template>

<script setup>
import { ref } from 'vue'
import { Message, Modal } from "@arco-design/web-vue"
import newUserSetting from '@/api/gift/newUserSetting'

const poolsize = ref()
const tableData = ref([])

const releaseConfig = () => {
  Modal.info({
    simple: false,
    hideCancel: false,
    title: '提示',
    content: `确定发布?`,
    onOk: async () => {
      const datas = {}
      tableData.value.forEach(item => {
        datas[item.id] = {
          normal_bei: item.normal_bei,
          normal_expect: item.normal_expect,
          high_bei: item.high_bei,
          high_expect: item.high_expect,
          low_bei: item.low_bei,
          low_expect: item.low_expect,
        }
      })
      const res = await newUserSetting.updateBasic({ datas })
      if (res.success) {
        Message.success(res.message)
        getList()
      }
    }
  })
}

const getList = async () => {
  const res = await newUserSetting.getList()
  if (res.success) {
    poolsize.value = res.data.poolsize
    tableData.value = res.data.items
  }
}

getList()

// const columns = reactive([
//   {
//     title: '礼物名称', dataIndex: 'gift_name'
//   },
//   {
//     title: '单价（金币）', dataIndex: 'coin'
//   },
//   {
//     title: '赔率（倍数）', dataIndex: 'normal_bei'
//   },
//   {
//     title: '期望', dataIndex: 'normal_expect'
//   },
//   {
//     title: '低赔率（倍数）', dataIndex: 'low_bei'
//   },
//   {
//     title: '低赔率（期望）', dataIndex: 'low_expect'
//   },
//   {
//     title: '高赔率（倍数）', dataIndex: 'high_bei'
//   },
//   {
//     title: '高赔率（期望）', dataIndex: 'high_expect'
//   }
// ])
</script>

<script>
// export default { name: 'gift:newUserSetting' }
</script>

<style scoped>

</style>
