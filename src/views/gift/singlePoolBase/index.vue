<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <ma-crud :options="crud" :columns="columns" ref="crudRef"></ma-crud>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import singlePoolBase from '@/api/gift/singlePoolBase.js'

const crud = reactive({
  api: singlePoolBase.getList,
  pageLayout: 'fixed',
  operationColumn: true,
  operationColumnWidth: 90,
  labelWidth: '170px',
  edit: { show: true, text: '编辑', api: singlePoolBase.update, auth: ['gift:singlePoolBase:update'] }
})

const columns = reactive([
  {
    title: '初始不中奖权重', dataIndex: 'initial_no_win_weight', disabled: true,
    commonRules: [
      { required: true, message: '初始不中奖权重必填' }
    ]
  },
  {
    title: '基础控制系数', dataIndex: 'basic_control_coefficicent', disabled: true,
    commonRules: [
      { required: true, message: '基础控制系数必填' }
    ]
  },
  {
    title: '主播分成', dataIndex: 'anchor_scale', formType: 'input-number', precision: 5, step: 0.00001, min: 0.0001, max: 1,
    commonRules: [
      { required: true, message: '主播分成必填' }
    ]
  },
  {
    title: '个人等级', dataIndex: 'personal_level', disabled: true, formType: 'input-number', precision: 5, step: 0.00001, max: 20,
    commonRules: [
      { required: true, message: '个人等级必填' }
    ]
  },
  {
    title: '系统暗税', dataIndex: 'dark_tax_scale', formType: 'input-number', precision: 5, step: 0.00001, min: 0.0001, max: 1,
    commonRules: [
      { required: true, message: '系统暗税必填' }
    ]
  },
  {
    title: '水库档位控制系数', dataIndex: 'reser_gear_control_coefficient', disabled: true,
    commonRules: [
      { required: true, message: '水库档位控制系数必填' }
    ]
  },
  {
    title: '默认水库', dataIndex: 'pool',
    commonRules: [
      { required: true, message: '默认水库必填' }
    ]
  },
  {
    title: '用户税收比例', dataIndex: 'tax', editDisplay: false,
    commonRules: [
      { required: true, message: '用户税收比例必填' }
    ]
  },
  {
    title: '周期', dataIndex: 'periodic_pattern', formType: 'radio',
    dict: { data: [{ label: '小时', value: 1 }, { label: '整天', value: 2 }, { label: '每周', value: 3 }, { label: '长期', value: 4 }], translation: true},
    commonRules: [
      { required: true, message: '周期必选' }
    ]
  }
])
</script>

<script>
// export default { name: 'gift:singlePoolBase' }
</script>

<style scoped>

</style>