<template>
    <div class="ma-content-block lg:flex justify-between p-4">
      <!-- CRUD 组件 -->
      <ma-crud :options="crud" :columns="columns" ref="crudRef">
        <!-- 游戏图片 -->
        <template #game_url="{ record }">
          <img :src="record.game_url"/>
        </template>
        <!-- tab -->
        <template #tableBeforeButtons>
          <a-tabs type="rounded" @change="change" size="medium" :default-active-key="default_val">
            <a-tab-pane v-for="item in sceneList" :key="item.value" :title="item.label">
            </a-tab-pane>
          </a-tabs>
        </template>
      </ma-crud>
    </div>
  </template>
  
  <script setup>
    import { ref, reactive } from 'vue'
    import scene from '@/api/set/scene'
  
    const crudRef = ref()

    const crud = reactive({
      api: scene.getPageList,
      recycleApi: scene.getRecyclePageList,
      showIndex: false,
      pageLayout: 'fixed',
      operationColumn: true,
      operationColumnWidth: 200,
      edit: { show: true, api: scene.update, auth: ['set:scene:update'] },
      beforeRequest: (params) => {
        params.from_type = default_val.value
      }
    })

    // 游戏场景列表
    const sceneList = [{
      label: '视频派对',
      value: '1'
    }, {
      label: '单人直播间',
      value: '2'
    }, {
      label: '家族厅',
      value: '3'
    }, {
      label: '家族群',
      value: '4'
    }, {
      label: '私聊',
      value: '5'
    }, {
      label: '家族主页',
      value: '6'
    }, {
      label: '游戏中心',
      value: '7'
    }]

    const default_val = ref(sceneList[0].value);

    const change = (e) => {
      default_val.value = e
      // 重置页码
      crudRef.value.requestParams.page = 1
      // 刷新当前表格
      crudRef.value.refresh()
    }

    const columns = reactive([
      { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
      {
        title: '游戏ID', dataIndex: 'game_id', editDisplay: false, width: 180
      },
      {
        title: '游戏名称', dataIndex: 'game_name', editDisplay: false, width: 180
      },
      {
        title: '游戏图片', dataIndex: 'game_url', width: 180, editDisplay: false
      },
      {
        title: '规则名', dataIndex: 'rules_name', editDisplay: false, width: 180
      },
      {
        title: '规则ID', dataIndex: 'rules_id', editDisplay: false, width: 180
      },
      {
        title: '排序值', dataIndex: 'sort', formType: 'input-number', width: 180, min: 0, max: 1000,
        commonRules: [{ required: true, message: '排序值必填' }]
      }
    ])
  </script>
  
  <script>
//   export default { name: 'set:scene' }
  </script>
  
  <style scoped>
  
  </style>