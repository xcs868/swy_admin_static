<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <template #search-date>
        <a-range-picker
            showTime
            v-model="dateStr"
        />
      </template>
    </ma-crud>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import realtime from '@/api/num/realtime'

const dateStr = ref([])

realtime.getRealtimeList({ page: 1, pageSize: 1 }).then(res => {
  dateStr.value = [res.data.start_date, res.data.end_date]
})

const crud = reactive({
  api: realtime.getRealtimeList,
  pageLayout: 'fixed',
  beforeRequest: (params) => {
    if (dateStr.value && dateStr.value.length > 0) {
      params.start_date = dateStr.value[0]
      params.end_date = dateStr.value[1]
    } else {
      delete params.start_date
      delete params.end_date
    }
  }
})

const columns = reactive([
  {
    title: '场次', dataIndex: 'bout', search: true
  },
  {
    title: '投注人数', dataIndex: 'bet_count'
  },
  {
    title: '投注总金额', dataIndex: 'bet_coins'
  },
  {
    title: '中奖数字', dataIndex: 'lucky_num_str'
  },
  {
    title: '中奖人数', dataIndex: 'win_count'
  },
  {
    title: '中奖总金额', dataIndex: 'win_coins'
  },
  {
    title: '主播分成', dataIndex: 'give_coins'
  },
  {
    title: '平台分成', dataIndex: 'platform_coins'
  },
  {
    title: '亏盈金额', dataIndex: 'loss_amount'
  },
  {
    title: '日期', dataIndex: 'date', search: true, hide: true
  }
])
</script>

<script>
// export default { name: 'num:realtime' }
</script>

<style scoped>

</style>