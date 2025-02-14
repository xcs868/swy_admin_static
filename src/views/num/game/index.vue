<template>
  <div>
    <a-card title="奖池信息" :bordered="false">
      <a-descriptions :column="1" bordered>
        <a-descriptions-item label="当前奖池金额" :span="2">{{ infoData.current_coins }}</a-descriptions-item>
        <a-descriptions-item label="历史总参与用户人数" :span="2">{{ infoData.bet_man_times }}</a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card title="基础设置" :bordered="false" class="mt-2.5">
      <a-form :model="formData" auto-label-width @submit="handleSubmit">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="room_master" label="主播分成比例">
              <a-input-number v-model="formData.room_master" hide-button />&nbsp;%
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="platform" label="平台分成比例">
              <a-input-number v-model="formData.platform" hide-button />&nbsp;%
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="usermaxcoin" label="用户单局可下注金额">
              <a-input-number v-model="formData.usermaxcoin" hide-button />&nbsp;%
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="shield_rate" label="单局可亏损比例">
              <a-input-number v-model="formData.shield_rate" hide-button />&nbsp;%
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="highratefix" label="超出奖金池回调比例">
              <a-input-number v-model="formData.highratefix" hide-button />&nbsp;%
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label-align="left" label-widht="0px">
          <a-button type="primary" html-type="submit">修改</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card title="配置信息" :bordered="false" class="mt-2.5">
      <a-table :columns="columns" :data="tableData" stripe :pagination="false">
        <template #columns>
          <a-table-column title="" data-index="">
            <template #cell="{ record }">
              {{ filtration(record.name) }}
            </template>
          </a-table-column>
          <a-table-column title="奖池区间开始">
            <template #cell="{ record }">
              <a-input v-model="record.range_start"></a-input>
            </template>
          </a-table-column>
          <a-table-column title="奖池区间结束">
            <template #cell="{ record }">
              <a-input v-model="record.range_end"></a-input>
            </template>
          </a-table-column>
          <a-table-column title="中奖金额/总押注金额（倍）">
            <template #cell="{ record }">
              <a-input v-model="record.rate"></a-input>
            </template>
          </a-table-column>
          <a-table-column title="下注金额">
            <template #cell="{ record }">
              <a-input v-model="record.all_bet_coins"></a-input>
            </template>
          </a-table-column>
          <a-table-column title="触发几率">
            <template #cell="{ record }">
              <a-input v-model="record.odds_numerator" style="width: 60px"></a-input> /{{ record.odds_denominator }}
            </template>
          </a-table-column>
        </template>
      </a-table>
      <div class="mt-2.5 text-right">
        <a-button type="primary" @click="releaseConfig">发布配置</a-button>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import game from '@/api/num/game'
import { Message, Modal } from "@arco-design/web-vue"
import Big from 'big.js'

const infoData = ref({})
const formData = ref({
  room_master: 0,
  platform: 0,
  usermaxcoin: 0,
  shield_rate: 0,
  highratefix: 0
})
const tableData = ref([])

const handleSubmit = () => {
  Modal.info({
    simple: false,
    hideCancel: false,
    title: '提示',
    content: `确定修改?`,
    onOk: async () => {
      const res = await game.changeBasicConf(formData.value)
      if (res.success) {
        res.success && Message.success(res.message || `修改成功！`)
        getList()
      }
    }
  })
}

const releaseConfig = () => {
  Modal.info({
    simple: false,
    hideCancel: false,
    title: '提示',
    content: `确定发布?`,
    onOk: async () => {
      const lists = []
      tableData.value.forEach((item, index) => {
        lists[index] = []
        lists[index][0] = item.name
        lists[index][1] = item.range_start
        lists[index][2] = item.range_end
        lists[index][3] = item.rate
        lists[index][4] = item.all_bet_coins
        lists[index][5] = item.odds_numerator
      })
      const res = await game.update({ lists })
      if (res.success) {
        res.success && Message.success(res.message || `发布成功！`)
        getList()
      }

    }
  })
}

const getList = async () => {
  const res = await game.getList()
  if (res.success) {
    infoData.value = res.data
    formData.value.room_master = Number(((new Big(res.data.room_master)).times(100)).toFixed())
    formData.value.platform = Number(((new Big(res.data.platform)).times(100)).toFixed())
    formData.value.shield_rate = Number(((new Big(res.data.shield_rate)).times(100)).toFixed())
    formData.value.highratefix = Number(((new Big(res.data.highratefix)).times(100)).toFixed())
    formData.value.usermaxcoin = res.data.usermaxcoin
    tableData.value = res.data.cheat_cfg
  }
}

const filtration = (name) => {
  if (name === 'spit_range') {
    return '吐水区间'
  }
  if (name === 'normal_range') {
    return '正常区间'
  }
  if (name === 'suck_range') {
    return '吸水区间'
  }
  if (name === 'ultra_range') {
    return '极限区间'
  }
  return ''
}

const columns = [
  {
    title: '',
    dataIndex: 'name',
  },
  {
    title: '奖池区间开始',
    dataIndex: 'range_start',
  },
  {
    title: '奖池区间结束',
    dataIndex: 'range_end',
  },
  {
    title: '中奖金额/总押注金额（倍）',
    dataIndex: 'rate',
  },
  {
    title: '下注金额',
    dataIndex: 'all_bet_coins',
  },
  {
    title: '触发几率',
    dataIndex: 'odds_numerator',
  }
]

getList()
</script>

<script>
// export default { name: 'num:game' }
</script>

<style scoped>

</style>
