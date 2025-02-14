<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <template #operationBeforeExtend="{ record }">
        <a-popconfirm
            content="是否确认该操作？"
            position="bottom"
            @ok="release(record)"
        >
          <a-link v-auth="['racing:game:update']">发布</a-link>
        </a-popconfirm>
        <a-link v-auth="['racing:game:index']" @click="openPrizeModal(record)">奖品列表</a-link>
      </template>
      <template #status="{ record }">
        <div v-if="record.status == 1">
          <a-tag color="#00b42a">已发布</a-tag>
        </div>
        <div v-else>
          <a-tag color="#86909c">未发布</a-tag>
        </div>
      </template>
    </ma-crud>
    <prize-list ref="prizeRef" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import game from '@/api/racing/game'
import prizeList from './prize.vue'

const crudRef = ref()
const prizeRef = ref()

const defaultFormData = {
  user_win_scale: 0,
  user_lose_scale: 0,
  min_dealer_value: 10000,
  name_lang: '3000',
  feed_gifts_max: 1000,
  gold_coins_feed_max: 1000,
  max_platform_loss: 100000,
  dynamic_odds_max: 0.95,
  dynamic_odds_min: 0.70,
  banker_closing_amount: 20000,
}

// 发布
const release = async (record) => {
  const response = await game.release({ id: record.id })
  if (response.success) {
    Message.success(response.message)
    crudRef.value.refresh()
  }
}

// 打开奖品列表
const openPrizeModal = (record) => {
  console.log(176, record)
  prizeRef.value.open(record)
}

const crud = reactive({
  api: game.getList,
  recycleApi: undefined,
  pageLayout: 'fixed',
  operationColumn: true,
  // operationColumnWidth: 280,
  add: { show: true, text: '新增套餐', api: game.save, auth: ['racing:game:save'] },
  edit: { show: true, text: '编辑套餐', api: game.update, auth: ['racing:game:update'] },
  delete: {
    show: true,
    api: game.delete, auth: ['racing:game:delete'],
    realApi: undefined, realAuth: ['racing:game:realDelete']
  },
  recovery: { show: true, api: undefined, auth: ['racing:game:recovery']},
  beforeAdd: (formData) => {
    formData = Object.assign(formData, defaultFormData)
    return true
  }
})

const columns = reactive([
  { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50 },
  {
    title: '套餐名称', dataIndex: 'name', width: 150, formType: 'input', maxLength: 11, showWordLimit: true, labelWidth: '290px',
    commonRules: [
      { required: true, message: '套餐名称必填' }
    ],
  },
  {
    title: '状态', dataIndex: 'status', width: 150, labelWidth: '290px', addDisplay: false, editDisplay: false
  },
  {
    title: '平台兜底金额', dataIndex: 'controllable_amount', width: 150, formType: 'input-number', labelWidth: '290px', hide: true,
    commonRules: [
      { required: true, message: '平台兜底金额必填' }
    ],
  },
  {
    title: '平台守信额度', dataIndex: 'platform_dealer', width: 150, formType: 'input-number', labelWidth: '290px', hide: true,
    commonRules: [
      { required: true, message: '平台守信额度必填' }
    ],
  },
  {
    title: '平台庄家挑战值', dataIndex: 'no_dealer_controllable_amount', width: 150, formType: 'input-number', labelWidth: '290px', hide: true,
    commonRules: [
      { required: true, message: '平台庄家挑战值必填' }
    ],
  },
  {
    title: '平台庄家下庄值', dataIndex: 'platform_banker_closing_amount', width: 150, formType: 'input-number', labelWidth: '290px', hide: true,
    commonRules: [
      { required: true, message: '平台庄家下庄值必填' }
    ],
  },
  {
    title: '庄家赢取倍数', dataIndex: 'banker_win_multiplier', width: 150, formType: 'input-number', extra: '最大10，最小2', labelWidth: '290px', hide: true,
    commonRules: [
      { required: true, message: '庄家赢取倍数必填' },
      { type: 'number', min: 2, max: 10, message: '庄家赢取倍数最大10，最小2' }
    ],
  },
  {
    title: '高倍区间下注限制', dataIndex: 'high_bet_limit', width: 150, formType: 'input-number', labelWidth: '290px', hide: true,
    commonRules: [
      { required: true, message: '高倍区间下注限制必填' }
    ],
  },
  {
    title: '高倍区间下注限制的百分比', dataIndex: 'high_bet_limit_percentage', width: 150, formType: 'input-number', extra: '最大100，最小1', labelWidth: '290px', hide: true,
    commonRules: [
      { required: true, message: '高倍区间下注限制的百分比必填' },
      { type: 'number', min: 1, max: 100, message: '高倍区间下注限制的百分比最大100，最小1' }
    ],
  },
  {
    title: '单局下注最大值', dataIndex: 'max_bet_value', width: 150, formType: 'input-number', labelWidth: '290px', hide: true,
    commonRules: [
      { required: true, message: '单局下注最大值必填' }
    ],
  },
  {
    title: '单日下注为最大值', dataIndex: 'day_max_bet_value', width: 150, formType: 'input-number', labelWidth: '290px', hide: true,
    commonRules: [
      { required: true, message: '单日下注为最大值必填' }
    ],
  },
  {
    title: '当店长最大局数', dataIndex: 'max_dealer_count', width: 150, formType: 'input-number', labelWidth: '290px', hide: true,
    commonRules: [
      { required: true, message: '当店长最大局数必填' }
    ],
  },
  {
    title: '全站飘屏阈值', dataIndex: 'screen_value', width: 150, formType: 'input-number', labelWidth: '290px', hide: true,
    commonRules: [
      { required: true, message: '全站飘屏阈值必填' }
    ],
  },
  {
    title: '飘屏文案', dataIndex: 'reward_tips', width: 150, addDefaultValue: '恭喜%name%在狂野飚车获得%num%个油箱', disabled: true, labelWidth: '290px', hide: true,
    commonRules: [
      { required: true, message: '飘屏文案必填' }
    ],
  },
  {
    title: '全站飘屏文案多语言key', dataIndex: 'reward_lang', width: 150, formType: 'input-number', addDefaultValue: 70000550, disabled: true, labelWidth: '290px', hide: true,
    commonRules: [
      { required: true, message: '全站飘屏文案多语言key必填' }
    ],
  },
  {
    title: '房间飘屏阈值', dataIndex: 'room_screen_value', width: 150, formType: 'input-number', labelWidth: '290px', hide: true,
    commonRules: [
      { required: true, message: '房间飘屏阈值必填' }
    ],
  },
  {
    title: '房间飘屏文案', dataIndex: 'room_reward_tips', width: 150, addDefaultValue: '恭喜%name%在狂野飚车获得%num%个油箱', disabled: true, labelWidth: '290px', hide: true,
    commonRules: [
      { required: true, message: '房间飘屏文案必填' }
    ],
  },
  {
    title: '房间飘屏文案多语言key', dataIndex: 'room_reward_lang', width: 150, formType: 'input-number', addDefaultValue: 70000555, disabled: true, labelWidth: '290px', hide: true,
    commonRules: [
      { required: true, message: '房间飘屏文案多语言key必填' }
    ],
  },
])


</script>

<script>
// export default { name: 'racing:game' }
</script>

<style lang="less" scoped>
.inquireForm{
  background-color: #fff;
  padding: 1rem 1rem 0;
}
</style>
