<template>
  <div>
    <a-card title="水库信息" :bordered="false">
      <a-descriptions :column="1" bordered>
        <a-descriptions-item label="当前水库值">{{ pool_value }}</a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card title="配置信息" :bordered="false" class="mt-2.5">
      <a-alert>提示：参数单位（分），参数范围（>= 范围最小值，< 范围最大值）。</a-alert>
      <a-table :columns="columns" :data="tableData" stripe :pagination="false" class="mt-2.5">
        <template #id="{ record }">
            {{ record.id }} <a-tag v-if="Number(record.id) === area_id" color="#00b42a">当前</a-tag>
        </template>
        <template #min="{ record }">
          <a-input
              v-model="record.min"
          />
        </template>
        <template #max="{ record }">
          <a-input
              v-model="record.max"
          />
        </template>
        <template #type="{ record }">
          <a-input
              v-model="record.type"
          />
        </template>
        <template #probability="{ record }">
          <a-input
              v-model="record.probability"
          />
        </template>
      </a-table>
      <div class="mt-2.5 text-right">
        <a-button v-auth="['racing:reservoir:save']" type="primary" @click="releaseConfig">发布配置</a-button>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import reservoir from '@/api/racing/reservoir'

const area_id = ref()
const pool_value = ref()
const tableData = ref([])

const releaseConfig = () => {
  Modal.info({
    simple: false,
    hideCancel: false,
    title: '提示',
    content: '您确定要操作吗？',
    onOk: async () => {
      const data = {}
      tableData.value.forEach(item => {
        data[item.id] = {
          min: item.min * 1,
          max: item.max * 1,
          type: item.type * 1,
          probability: item.probability * 1
        }
      })
      const res = await reservoir.update({ data })
      if (res.success) {
        Message.success(res.message)
        getList()
      }
    }
  })
}

const getList = async () => {
  const res = await reservoir.getList()
  if (res.success) {
    area_id.value = res.data.area_id
    pool_value.value = res.data.racing_pool_value
    tableData.value = res.data.items
  }
}

const columns = reactive([
  {
    title: '编号', dataIndex: 'id', slotName: 'id'
  },
  {
    title: '范围最小值', dataIndex: 'min', slotName: 'min'
  },
  {
    title: '范围最大值', dataIndex: 'max', slotName: 'max'
  },
  {
    title: '类型（1：吃大赔小，2：吃小赔大）', dataIndex: 'type', slotName: 'type'
  },
  {
    title: '控制概率%', dataIndex: 'probability', slotName: 'probability'
  },
])

getList()

</script>

<script>
// export default { name: 'racing:reservoir' }
</script>

<style lang="less" scoped>
</style>
