<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <ma-crud :options="crud" :columns="columns" ref="crudRef"></ma-crud>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import basic from '@/api/racing/basic'
const crudRef = ref()

const crud = reactive({
  api: basic.getList,
  recycleApi: undefined,
  pageLayout: 'fixed',
  operationColumn: true,
  operationColumnWidth: 100,
  edit: { show: true, title: '参数设置', api: basic.update, auth: ['racing:basic:update'] },
})

const columns = reactive([
  { title: 'id', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50 },
  {
    title: '暗税', dataIndex: 'dark_tax_scale', formType: 'input-number', max: 1, precision: 6, step: 0.1
  },
  {
    title: '主播抽成', dataIndex: 'anchor_scale', formType: 'input-number', max: 1, precision: 6, step: 0.1
  },
  {
    title: '默认水库', dataIndex: 'pool', formType: 'input-number'
  },
  {
    title: '周期', dataIndex: 'periodic_pattern', formType: 'radio',
    dict: { data: [{ label: '小时', value: 1 }, { label: '整天', value: 2 }, { label: '每周', value: 3 }, { label: '长期', value: 4 }], translation: true}
  }
])

</script>

<script>
// export default { name: 'racing:basic' }
</script>

<style lang="less" scoped>

</style>