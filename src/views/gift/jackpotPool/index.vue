<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <ma-crud :options="crud" :columns="columns" ref="crudRef"></ma-crud>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import jackpotPool from '@/api/gift/jackpotPool'

const crud = reactive({
  api: jackpotPool.getList,
  pageLayout: 'fixed',
  operationColumn: true,
  edit: { show: true, text: '编辑', api: jackpotPool.updateBasic, auth: ['gift:jackpotPool:update'] },
  operationColumnWidth: 90,
  labelWidth: '200px',
  afterRequest: (tableData) => {
    tableData.forEach(item => {
      item.ordinary_normal_conf = JSON.parse(item.ordinary_normal_conf)
      item.ordinary_normal_conf_min = item.ordinary_normal_conf.min
      item.ordinary_normal_conf_max = item.ordinary_normal_conf.max

      item.ordinary_limit_thread_conf = JSON.parse(item.ordinary_limit_thread_conf)
      item.ordinary_limit_thread_conf_min = item.ordinary_limit_thread_conf.min
    })
    return tableData
  }
})

const columns = reactive([
  { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
  {
    title: '礼物昵称', dataIndex: 'gift_name', editDisplay: false,
  },
  {
    title: '礼物金额', dataIndex: 'money', editDisplay: false,
  },
  {
    title: '普通奖池极限水平线', dataIndex: 'ordinary_limit_thread_conf_min',
    commonRules: [
      { required: true, message: '普通奖池极限水平线必填' }
    ]
  },
  {
    title: '普通奖池正常水平线', dataIndex: 'ordinary_normal_conf_min',
    commonRules: [
      { required: true, message: '普通奖池正常水平线必填' }
    ],
  },
  {
    title: '普通奖池高水平线', dataIndex: 'ordinary_normal_conf_max',
    commonRules: [
      { required: true, message: '普通奖池高水平线必填' }
    ],
  },
  {
    title: '主播分成比例', dataIndex: 'anchor_scale',
    commonRules: [
      { required: true, message: '主播分成比例必填' }
    ],
  },
  {
    title: '平台分成比例', dataIndex: 'platform_scale',
    commonRules: [
      { required: true, message: '平台分成比例必填' }
    ],
  },
  {
    title: '普通奖池入库比例', dataIndex: 'ordinary_jackpot_scale',
    commonRules: [
      { required: true, message: '普通奖池入库比例必填' }
    ],
  },
  {
    title: '公共大奖池入库比例', dataIndex: 'common_jackpot_scale',
    commonRules: [
      { required: true, message: '公共大奖池入库比例必填' }
    ],
  },
  {
    title: '个人奖池入库比例', dataIndex: 'personal_jackpot_scale',
    commonRules: [
      { required: true, message: '个人奖池入库比例必填' }
    ],
  }
])
</script>

<script>
// export default { name: 'gift:jackpotPool' }
</script>

<style scoped>

</style>
