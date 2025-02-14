<template>
  <a-modal v-model:visible="visible" fullscreen :footer="false">
    <template #title>奖品列表</template>
    <ma-crud :options="crud" :columns="columns" ref="crudRef"></ma-crud>
  </a-modal>
</template>

<script setup>
import { ref, reactive } from 'vue'
import game from '@/api/racing/game'

const visible = ref(false)
const crudRef = ref()
const taoCanId = ref()

const open = (row) => {
  taoCanId.value = row.id
  visible.value = true
  crudRef.value.requestData()
}

const crud = reactive({
  autoRequest: false,
  api: game.getPrizeList,
  pageLayout: 'fixed',
  operationColumn: true,
  operationColumnWidth: 100,
  edit: { show: true, title: '编辑奖品', api: game.updatePrize, auth: ['racing:game:update'] },
  beforeRequest: (params) => {
    params.prize = taoCanId.value
  },
  beforeEdit: (formData) => {
    formData.prize_id = formData.id
    return true
  }
})

const columns = reactive([
  {
    title: '奖品id', dataIndex: 'id', width: 150
  },
  {
    title: '汽车名称', dataIndex: 'prize_info.name', width: 150, editReadonly: true
  },
  {
    title: '参考赔率', dataIndex: 'multiple', width: 150, formType: 'input-number', extra: '给前端展示使用',
    commonRules: [
      { required: true, message: '参考赔率必填' }
    ],
  },
  {
    title: '真实赔率', dataIndex: 'real_multiple', width: 150, formType: 'input-number', precision: 4,
    commonRules: [
      { required: true, message: '真实赔率必填' }
    ],
  },
  {
    title: '真实概率', dataIndex: 'probability', width: 150, formType: 'input-number', precision: 4,
    commonRules: [
      { required: true, message: '真实概率必填' }
    ],
  },
  {
    title: '参考概率', dataIndex: 'reference_probability', width: 150, extra: '给前端展示使用', formType: 'input-number', precision: 4,
    commonRules: [
      { required: true, message: '参考概率必填' }
    ],
  },
  {
    title: '浮动最大值', dataIndex: 'min_multiple', width: 150, formType: 'input-number', precision: 4,
    commonRules: [
      { required: true, message: '浮动最大值必填' }
    ],
  }
])

defineExpose({ open })
</script>

<style scoped>

</style>