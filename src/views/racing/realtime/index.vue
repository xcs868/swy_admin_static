<template>
  <div>
    <a-card title="当前轮次信息" :bordered="false">
      <a-descriptions :column="4" :value-style="{background: '#fff'}" bordered>
        <a-descriptions-item v-if="currentInfo.dealer_info.user_info && currentInfo.dealer_info.user_info.nickname" label="当前店长" :span="4"><a-tag color="#00b42a">{{ currentInfo.dealer_info.user_info.nickname}}</a-tag></a-descriptions-item>
        <a-descriptions-item label="当前轮次" :span="2"><a-tag color="#00b42a">{{ currentInfo.bout }}</a-tag></a-descriptions-item>
        <a-descriptions-item :label="currentInfo.timetitle" :span="2"><a-tag color="#f53f3f">{{ currentInfo.time }}s</a-tag></a-descriptions-item>
        <a-descriptions-item label="油箱值" :span="2">{{ currentInfo.dealer_info.coin }}</a-descriptions-item>
        <a-descriptions-item label="局数" :span="2">{{ currentInfo.dealer_info != '' ? currentInfo.dealer_info.number:  '0'}}</a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card title="奖品信息" :bordered="false" class="mt-2.5">
      <a-row>
        <a-col :span="3" v-for="item in prizesList" :key="item.id" class="text-center">
          <a-statistic :title="item.name" :value="Number(item.multiple)" show-group-separator />
        </a-col>
      </a-row>
    </a-card>
    <a-card title="历史轮次信息" :bordered="false" class="mt-2.5">
      <ma-crud :options="crud" :columns="columns" ref="crudRef">
        <template #prize_id="{ record }">
          {{ record.prize_info.name }}
        </template>
        <template #is_update_result="{ record }">
          {{ record.is_update_result == 1 ? "是" : "否" }}
        </template>
        <template #platform_scale_value="{ record }">
          {{ record.platform_scale_value - record.win_coins }}
        </template>
        <template #operationCell="{ record }">
          <div v-if="record.status !== '0'"></div>
        </template>
      </ma-crud>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeUnmount } from 'vue'
import realtime from '@/api/racing/realtime'
const crudRef = ref()
const now = Date.now();
const currentInfo = ref({
  bout: '', // 当前轮次
  timetitle: '', // 当前倒计时状态
  time: '', // 倒计时
  xianz: false, // 限制请求次数
  dealer_info: {}, // 当前店长
})
// 游戏配置
const prizesList = ref([])
// 下拉选择数据
const prizesOptions = ref([])
// 定时器
const timer = ref()
// 状态码
const statusCode = {
    1: '开始倒计时',
    2: '互动时间',
    3: '结果倒计时',
    4: '开奖中',
    5: '本轮结果'
}

const getCurrentInfo = async () => {
  const res = await realtime.getCurrentInfo()
  if (res.success) {
    currentInfo.value.bout = res.data.bout
    currentInfo.value.time = res.data.countdown
    currentInfo.value.dealer_info = res.data.dealer_info
    currentInfo.value.timetitle = statusCode[res.data.status]
  }
}

const setIntervalCurrentRond = () => {
  timer.value = setInterval(() => {
    currentInfo.value.time--
    if (currentInfo.value.time < 0) {
      currentInfo.value.xianz = true;
      if (currentInfo.value.xianz) {
        getCurrentInfo()
        crudRef.value.refresh()
      }
      currentInfo.value.time = 0
    }
  }, 1000)
}

const getRacingCfg = async () => {
  const res = await realtime.getRacingCfg()
  if (res.success) {
    prizesList.value = res.data.prizes
    prizesOptions.value = res.data.prizes
  }
}

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})

getRacingCfg()
getCurrentInfo()
setIntervalCurrentRond()

// setInterval(() => {
//   crudRef.value.refresh()
// }, 5000)

const crud = reactive({
  api: realtime.getRealTimeAward,
  recycleApi: undefined,
  operationColumn: true,
  operationColumnWidth: 100,
  edit: { show: true, title: '', api: realtime.update, auth: ['racing:realtime:update'] },
  beforeOpenEdit(record) {
    crud.edit.title = `修改场次【${record.id}】的结果`
    return true
  }
})

const columns = reactive([
  {
    title: '今日轮次', dataIndex: 'bout', editDisplay: false, fixed: 'left'
  },
  {
    title: '总轮次', dataIndex: 'id', editDisplay: false
  },
  {
    title: '开奖汽车', dataIndex: 'prize_id', formType: 'select',
    dict: { data: prizesOptions, props: { label: 'name', value: 'id' }, translation: true },
    commonRules: [
      { required: true, message: '开奖汽车必选' }
    ],
  },
  {
    title: '原始汽车', dataIndex: 'prize_info.ori_name', editDisplay: false
  },
  {
    title: '赔率', dataIndex: 'odds', editDisabled: true
  },
  {
    title: '套餐名称', dataIndex: 'racing_combo_name', editDisabled: true, width: 150
  },
  {
    title: '用户参与人数', dataIndex: 'bet_count', editDisplay: false
  },
  {
    title: '中奖用户数', dataIndex: 'win_count', editDisplay: false
  },
  {
    title: '用户投注金额', dataIndex: 'bet_coins', editDisplay: false
  },
  {
    title: '用户中出金额', dataIndex: 'win_coins', editDisplay: false
  },
  {
    title: '平台补贴金额', dataIndex: 'platform_profit_and_loss', editDisplay: false
  },
  {
    title: '暗税', dataIndex: 'platform_scale_value', editDisplay: false
  },
  {
    title: '主播抽成', dataIndex: 'anchor_reward_amount', editDisplay: false
  },
  {
    title: '是否干预', dataIndex: 'is_update_result', editDisplay: false, fixed: 'right', width: 100
  },
  {
    title: '是否开奖', dataIndex: 'status_text', editDisplay: false, fixed: 'right', width: 100
  }
])
</script>

<script>
// export default { name: 'racing:realtime' }
</script>
