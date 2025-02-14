<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <template #operationCell="{ record }">
        <a-link @click="handleDetail(record)">详情</a-link>
      </template>
    </ma-crud>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import commonKill from '@/api/gift/commonKill'

const router = useRouter()

const handleDetail = (record) => {
  router.push({
    path: '/gift/commonLevel',
    query: {
      uid: record.uid
    }
  })
}

const crud = reactive({
  api: commonKill.getList,
  pageLayout: 'fixed',
  operationColumn: true,
})

const columns = reactive([
  {
    title: 'uid', dataIndex: 'uid', search: true
  },
  {
    title: '昵称', dataIndex: 'nickname'
  }
])
</script>

<script>
// export default { name: 'gift:commonKill' }
</script>

<style scoped>

</style>