<template>
  <div>
    <a-card title="基础配置" :bordered="false">
      <ma-crud :options="crud1" :columns="columns1" ref="crudRef1">
<!--        <template #operationCell="{ record }">-->
<!--          <a-link v-auth="['gift:jackpotSetting:update']" @click="release(record)">发布</a-link>-->
<!--        </template>-->
      </ma-crud>
    </a-card>
    <a-card title="奖池配置" :bordered="false" class="mt-2.5">
      <ma-crud :options="crud2" :columns="columns2" ref="crudRef2"></ma-crud>
    </a-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
// import { Message, Modal } from '@arco-design/web-vue'
import jackpotSetting from '@/api/gift/jackpotSetting'

const crudRef1 = ref()

// const release = (record) => {
//   Modal.info({
//     simple: false,
//     hideCancel: false,
//     title: '提示',
//     content: '确定发布？',
//     onOk: async () => {
//       console.log(30, record)
//       const data = {
//         common_burst_point: record.common_burst_point,
//         common_denominator: record.common_denominator,
//         personal_burst_point: record.personal_burst_point,
//         init_ordinary_jackpot: record.init_ordinary_jackpot,
//         id: record.id
//       }
//       const res = await jackpotSetting.updateBasic(record.id, data)
//       if (res.success) {
//         Message.success(res.message)
//         crudRef1.value.refresh()
//       }
//     }
//   })
// }

const crud1 = reactive({
  api: jackpotSetting.getBasicList,
  // pageLayout: 'fixed',
  operationColumn: true,
  labelWidth: '150px',
  edit: { show: true, text: '编辑', api: jackpotSetting.updateBasic, auth: ['gift:jackpotSetting:update'] }
})

const columns1 = reactive([
  { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
  {
    title: '礼物昵称', dataIndex: 'gift_name', editDisplay: false
  },
  {
    title: '礼物金额', dataIndex: 'money', editDisplay: false
  },
  {
    title: '普通奖池当前金币', dataIndex: 'ordinary_value', editDisplay: false
  },
  {
    title: '普通奖池初始化值', dataIndex: 'init_ordinary_jackpot', editReadonly: true
  },
])

const crud2 = reactive({
  api: jackpotSetting.getMergeList,
  // pageLayout: 'fixed',
  operationColumn: true,
  edit: { show: true, text: '编辑', api: jackpotSetting.updateMerge, auth: ['gift:jackpotSetting:update'] },
  beforeEdit: (formData) => {
    formData.config_amount = formData.amount
    formData.config_count = formData.count
    return true
  }
})

const columns2 = reactive([
  { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
  {
    title: '礼物昵称', dataIndex: 'gift_names', editDisplay: false,
  },
  {
    title: '公共大奖池当前金币', dataIndex: 'common_value.value', editDisplay: false,
  },
  {
    title: '大奖金额', dataIndex: 'amount', formType: 'input-number',
    commonRules: [
      { required: true, message: '大奖金额必填' }
    ],
  },
  {
    title: '爆奖值', dataIndex: 'count', formType: 'input-number',
    commonRules: [
      { required: true, message: '爆奖值必填' }
    ]
  }
])
</script>

<script>
// export default { name: 'gift:jackpotSetting' }
</script>

<style scoped>

</style>
