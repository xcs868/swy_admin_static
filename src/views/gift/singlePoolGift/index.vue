<template>
  <div>
    <a-card :bordered="false">
      <a-button v-auth="['gift:singlePoolGift:save']" type="primary" @click="addGift">添加礼物</a-button>
      <a-table :columns="columns" :data="tableData" stripe :pagination="false" :scroll="{ x: 2000 }" :bordered="{ cell:true }" class="mt-5">
        <template #multiple_odds_0="{ record }">
          <div>倍数:{{ record.multiple_odds_0 }}</div>
          <div>权重:{{ record.weight_0 }}</div>
          <div>概率:{{ record.multiple_expect_0 }}</div>
        </template>
        <template #multiple_odds_1="{ record }">
          <div>倍数:{{ record.multiple_odds_1 }}</div>
          <div>权重:{{ record.weight_1 }}</div>
          <div>概率:{{ record.multiple_expect_1 }}</div>
        </template>
        <template #multiple_odds_2="{ record }">
          <div>倍数:{{ record.multiple_odds_2 }}</div>
          <div>权重:{{ record.weight_2 }}</div>
          <div>概率:{{ record.multiple_expect_2 }}</div>
        </template>
        <template #multiple_odds_3="{ record }">
          <div>倍数:{{ record.multiple_odds_3 }}</div>
          <div>权重:{{ record.weight_3 }}</div>
          <div>概率:{{ record.multiple_expect_3 }}</div>
        </template>
        <template #multiple_odds_4="{ record }">
          <div>倍数:{{ record.multiple_odds_4 }}</div>
          <div>权重:{{ record.weight_4 }}</div>
          <div>概率:{{ record.multiple_expect_4 }}</div>
        </template>
        <template #multiple_odds_5="{ record }">
          <div>倍数:{{ record.multiple_odds_5 }}</div>
          <div>权重:{{ record.weight_5 }}</div>
          <div>概率:{{ record.multiple_expect_5 }}</div>
        </template>
        <template #multiple_odds_6="{ record }">
          <div>倍数:{{ record.multiple_odds_6 }}</div>
          <div>权重:{{ record.weight_6 }}</div>
          <div>概率:{{ record.multiple_expect_6 }}</div>
        </template>
        <template #multiple_odds_7="{ record }">
          <div>倍数:{{ record.multiple_odds_7 }}</div>
          <div>权重:{{ record.weight_7 }}</div>
          <div>概率:{{ record.multiple_expect_7 }}</div>
        </template>
        <template #operation="{ record }">
          <a-link @click="handleForecast(record)">干预预测</a-link>
          <a-popconfirm
              content="是否确认该操作？"
              position="bottom"
              @ok="handleGrounding(record)"
          >
            <a-link v-auth="['gift:singlePoolGift:update']">{{ record.gift_state === '1' ? "下架" : "上架" }}</a-link>
          </a-popconfirm>
          <a-link v-auth="['gift:singlePoolGift:update']" @click="handleEdit(record)">编辑</a-link>
        </template>
      </a-table>
    </a-card>
    <a-modal
        v-model:visible="addGiftVisible"
        :footer="true"
        :on-before-ok="addSubmit"
        @cancel="addClose"
        ok-text="保存"
        cancel-text="关闭"
        draggable
        unmount-on-close
        width="600px"
        title="添加礼物"
    >
      <a-form :model="addForm" ref="addFormRef">
        <a-form-item field="id" label="礼物id" :rules="[{ required: true, message: '礼物id必填' }]">
          <a-input v-model="addForm.id" placeholder="请输入礼物id" clearable />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
        v-model:visible="editGiftVisible"
        :footer="true"
        :on-before-ok="editSubmit"
        @cancel="editClose"
        ok-text="保存"
        cancel-text="关闭"
        draggable
        unmount-on-close
        width="680px"
        :title="editTitle"
    >
      <a-form :model="editForm" ref="editFormRef" auto-label-width>
        <a-row>
          <a-col>
            <a-alert>提示：填写完后请先点击计算按钮，验证值是否正确再保存。</a-alert>
          </a-col>
        </a-row>
        <a-row class="mt-2.5">
          <a-col>
            <a-alert type="warning">注意：倍数配置（"-1"代表倍数未配置）。</a-alert>
          </a-col>
        </a-row>
        <a-row :gutter="16" class="mt-2.5">
          <a-col :span="8">
            <a-form-item field="total_weight" label="总权重" disabled>
              <a-input-number v-model="editForm.total_weight" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="desire_rtp" label="期望RTP" disabled>
              <a-input v-model="editForm.desire_rtp" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="system_benefits" label="系统收益" disabled>
              <a-input v-model="editForm.system_benefits" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="expected_award_distribution" label="预期派奖" disabled>
              <a-input v-model="editForm.expected_award_distribution" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="reality_rtp" label="实际RTP" disabled>
              <a-input v-model="editForm.reality_rtp" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-button type="primary" long @click="calculate">计算</a-button>
          </a-col>
        </a-row>
        <a-divider />
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="multiple_odds_0" label="倍数0" :rules="[{ required: true, message: '倍数0必填' }]">
              <a-input v-model="editForm.multiple_odds_0" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="weight_0" label="倍0权重" disabled :rules="[{ required: true, message: '倍0权重必填' }]">
              <a-input-number v-model="editForm.weight_0" :step="1" :min="0" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="multiple_expect_0" label="倍0概率" disabled :rules="[{ required: true, message: '倍0概率必填' }]">
              <a-input-number v-model="editForm.multiple_expect_0" :step="0.0000001" :precision="7" :min="0.0000000" :max="1" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="multiple_odds_1" label="倍数1" :rules="[{ required: true, message: '倍数1必填' }]">
              <a-input v-model="editForm.multiple_odds_1" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="weight_1" label="倍1权重" :rules="[{ required: true, message: '倍1权重必填' }]">
              <a-input-number v-model="editForm.weight_1" :step="1" :min="0" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="multiple_expect_1" label="倍1概率" disabled :rules="[{ required: true, message: '倍1概率必填' }]">
              <a-input-number v-model="editForm.multiple_expect_1" :step="0.0000001" :precision="7" :min="0.0000000" :max="1" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="multiple_odds_2" label="倍数2" :rules="[{ required: true, message: '倍数2必填' }]">
              <a-input v-model="editForm.multiple_odds_2" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="weight_2" label="倍2权重" :rules="[{ required: true, message: '倍2权重必填' }]">
              <a-input-number v-model="editForm.weight_2" :step="1" :min="0" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="multiple_expect_2" label="倍2概率" disabled :rules="[{ required: true, message: '倍2概率必填' }]">
              <a-input-number v-model="editForm.multiple_expect_2" :step="0.0000001" :precision="7" :min="0.0000000" :max="1" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="multiple_odds_3" label="倍数3" :rules="[{ required: true, message: '倍数3必填' }]">
              <a-input v-model="editForm.multiple_odds_3" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="weight_3" label="倍3权重" :rules="[{ required: true, message: '倍3权重必填' }]">
              <a-input-number v-model="editForm.weight_3" :step="1" :min="0" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="multiple_expect_3" label="倍3概率" disabled :rules="[{ required: true, message: '倍3概率必填' }]">
              <a-input-number v-model="editForm.multiple_expect_3" :step="0.0000001" :precision="7" :min="0.0000000" :max="1" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="multiple_odds_4" label="倍数4" :rules="[{ required: true, message: '倍数4必填' }]">
              <a-input v-model="editForm.multiple_odds_4" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="weight_4" label="倍4权重" :rules="[{ required: true, message: '倍4权重必填' }]">
              <a-input-number v-model="editForm.weight_4" :step="1" :min="0" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="multiple_expect_4" label="倍4概率" disabled :rules="[{ required: true, message: '倍4概率必填' }]">
              <a-input-number v-model="editForm.multiple_expect_4" :step="0.0000001" :precision="7" :min="0.0000000" :max="1" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="multiple_odds_5" label="倍数5" :rules="[{ required: true, message: '倍数5必填' }]">
              <a-input v-model="editForm.multiple_odds_5" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="weight_5" label="倍5权重" :rules="[{ required: true, message: '倍5权重必填' }]">
              <a-input-number v-model="editForm.weight_5" :step="1" :min="0" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="multiple_expect_5" label="倍5概率" disabled :rules="[{ required: true, message: '倍5概率必填' }]">
              <a-input-number v-model="editForm.multiple_expect_5" :step="0.0000001" :precision="7" :min="0.0000000" :max="1" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="multiple_odds_6" label="倍数6" :rules="[{ required: true, message: '倍数6必填' }]">
              <a-input v-model="editForm.multiple_odds_6" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="weight_6" label="倍6权重" :rules="[{ required: true, message: '倍6权重必填' }]">
              <a-input-number v-model="editForm.weight_6" :step="1" :min="0" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="multiple_expect_6" label="倍6概率" disabled :rules="[{ required: true, message: '倍6概率必填' }]">
              <a-input-number v-model="editForm.multiple_expect_6" :step="0.0000001" :precision="7" :min="0.0000000" :max="1" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="multiple_odds_7" label="倍数7" :rules="[{ required: true, message: '倍数7必填' }]">
              <a-input v-model="editForm.multiple_odds_7" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="weight_7" label="倍7权重" :rules="[{ required: true, message: '倍7权重必填' }]">
              <a-input-number v-model="editForm.weight_7" :step="1" :min="0" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="multiple_expect_7" label="倍7概率" disabled :rules="[{ required: true, message: '倍7概率必填' }]">
              <a-input-number v-model="editForm.multiple_expect_7" :step="0.0000001" :precision="7" :min="0.0000000" :max="1" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal
        v-model:visible="forecastVisible"
        :footer="false"
        fullscreen
        unmount-on-close
        hide-cancel
        :title="handleTitle"
    >
      <a-table :data="forecastData" stripe :pagination="false" :scroll="{ x: 1000 }" :bordered="{ cell:true }">
        <template #columns>
          <a-table-column title="干预值" prop="intervention_value" fixed="left" :width="80">
            <template #cell="{ record }">
              {{ record.intervention_value }}
            </template>
          </a-table-column>
          <a-table-column title="倍数">
            <a-table-column v-if="forecastForm.multiple_odds_0 != -1" prop="multiple_odds_0" :title="String(forecastForm.multiple_odds_0)">
              <template #cell="{ record }">
                <div style="color: #ff9500">权重:{{ record.weight_0 }}</div>
                <div>概率:{{ record.multiple_expect_0 }}</div>
              </template>
            </a-table-column>
            <a-table-column v-if="forecastForm.multiple_odds_1 != -1" prop="multiple_odds_1" :title="String(forecastForm.multiple_odds_1)">
              <template #cell="{ record }">
                <div>权重:{{ record.weight_1 }}</div>
                <div>概率:{{ record.multiple_expect_1 }}</div>
              </template>
            </a-table-column>
            <a-table-column v-if="forecastForm.multiple_odds_2 != -1" prop="multiple_odds_2" :title="String(forecastForm.multiple_odds_2)">
              <template #cell="{ record }">
                <div>权重:{{ record.weight_2 }}</div>
                <div>概率:{{ record.multiple_expect_2 }}</div>
              </template>
            </a-table-column>
            <a-table-column v-if="forecastForm.multiple_odds_3 != -1" prop="multiple_odds_3" :title="String(forecastForm.multiple_odds_3)">
              <template #cell="{ record }">
                <div>权重:{{ record.weight_3 }}</div>
                <div>概率:{{ record.multiple_expect_3 }}</div>
              </template>
            </a-table-column>
            <a-table-column v-if="forecastForm.multiple_odds_4 != -1" prop="multiple_odds_4" :title="String(forecastForm.multiple_odds_4)">
              <template #cell="{ record }">
                <div>权重:{{ record.weight_4 }}</div>
                <div>概率:{{ record.multiple_expect_4 }}</div>
              </template>
            </a-table-column>
            <a-table-column v-if="forecastForm.multiple_odds_5 != -1" prop="multiple_odds_5" :title="String(forecastForm.multiple_odds_5)">
              <template #cell="{ record }">
                <div>权重:{{ record.weight_5 }}</div>
                <div>概率:{{ record.multiple_expect_5 }}</div>
              </template>
            </a-table-column>
            <a-table-column v-if="forecastForm.multiple_odds_6 != -1" prop="multiple_odds_6" :title="String(forecastForm.multiple_odds_6)">
              <template #cell="{ record }">
                <div>权重:{{ record.weight_6 }}</div>
                <div>概率:{{ record.multiple_expect_6 }}</div>
              </template>
            </a-table-column>
            <a-table-column v-if="forecastForm.multiple_odds_7 != -1" prop="multiple_odds_7" :title="String(forecastForm.multiple_odds_7)">
              <template #cell="{ record }">
                <div>权重:{{ record.weight_7 }}</div>
                <div>概率:{{ record.multiple_expect_7 }}</div>
              </template>
            </a-table-column>
          </a-table-column>
          <a-table-column title="权重合计">
            <a-table-column title="Sum" prop="total_weight">
              <template #cell="{ record }">
                {{ record.total_weight }}
              </template>
            </a-table-column>
          </a-table-column>
          <a-table-column title="期望RTP" prop="desire_rtp">
            <template #cell="{ record }">
              <div style="color:#4f00ff">{{ record.desire_rtp }}</div>
            </template>
          </a-table-column>
          <a-table-column title="已加入主播分成与暗税">
            <a-table-column title="系统收益" prop="system_benefits">
              <template #cell="{ record }">
                <div style="color:#fab6b6">{{ record.system_benefits }}</div>
              </template>
            </a-table-column>
            <a-table-column title="预期派奖" prop="expected_award_distribution">
              <template #cell="{ record }">
                <div style="color:#e6a23c">{{ record.expected_award_distribution }}</div>
              </template>
            </a-table-column>
            <a-table-column title="实际RTP" prop="reality_rtp">
              <template #cell="{ record }">
                <div style="color:#0ecb5e">{{ record.reality_rtp }}</div>
              </template>
            </a-table-column>
          </a-table-column>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import singlePoolGift from '@/api/gift/singlePoolGift'
import { Message, Modal } from "@arco-design/web-vue";
import Big from 'big.js'

const addGiftVisible = ref(false)
const editGiftVisible = ref(false)
const addFormRef = ref()
const addForm = ref({
  id: ''
})
const editFormRef = ref()
const editForm = ref({})
const editTitle = ref()
const tableData = ref([])

const forecastVisible = ref(false)
const forecastData = ref([])
const handleTitle = ref()
const forecastForm = ref({})
const odds_count = ref(0)
const radio1 = ref('水池系统赢钱')
const radio2 = ref('用户赢钱')
const count = ref(100)

const addGift = () => {
  addGiftVisible.value = true
}

const addSubmit = async () => {
  const validResult = await addFormRef.value.validate()
  if (validResult) {
    for (let i in validResult) {
      Message.error(validResult[i].message)
    }
    return false
  }
  const res = await singlePoolGift.save(addForm.value)
  if (res.success) {
    Message.success(res.message)
    getList()
  }
  addFormRef.value.resetFields()
}

const addClose = () => {
  addGiftVisible.value = false
  addFormRef.value.resetFields()
}

const handleGrounding = async (record) => {
  const data = {
    config_id: record.id,
    gift_id: record.gift_id,
    queue_status: record.gift_state
  }
  const res = await singlePoolGift.putAway(data)
  if (res.success) {
    Message.success(res.message)
    getList()
  }
}

const calculate = () => {
  let all_weight = 0
  for (let i = 0; i <= 7; i++) {
    if (editForm.value["multiple_odds_" + i] != -1) {
      all_weight += editForm.value["weight_" + i];
    }
  }
  // 总权重
  editForm.value.total_weight = all_weight;

  // 概率
  let rtp = 0
  for (let i = 0; i <= 7; i++) {
    editForm.value["rtp_" + i] = 0;
    if (editForm.value["multiple_odds_" + i] != -1) {
      //概率
      editForm.value["multiple_expect_" + i] = editForm.value["weight_" + i] / all_weight;
      editForm.value["rtp_" + i] = editForm.value.gift_coin * editForm.value["multiple_odds_" + i] * editForm.value["multiple_expect_" + i];
    } else {
      editForm.value["multiple_expect_" + i] = 0;
      editForm.value["weight_" + i] = 0;
    }
    rtp += editForm.value["rtp_" + i];
  }
  // 期望RTP=rtp和/金币
  editForm.value.desire_rtp = rtp / editForm.value.gift_coin
  //系统收益=物品金币值*权重合计*（1-主播分成%-系统暗税%）
  let system_benefits = editForm.value.gift_coin * all_weight * (1 - editForm.value.dark_tax_scale - editForm.value.anchor_scale)
  editForm.value.system_benefits = String(system_benefits)
  //预期派奖=物品金币值*权重合计*期望RTP
  let expected_award_distribution = editForm.value.gift_coin * all_weight * editForm.value.desire_rtp
  editForm.value.expected_award_distribution = String(expected_award_distribution)
  //实际RTP=预期派奖/系统收益
  editForm.value.reality_rtp = expected_award_distribution / system_benefits
  editForm.value.reality_rtp = editForm.value.reality_rtp.toFixed(7)
  editForm.value.desire_rtp = editForm.value.desire_rtp.toFixed(7)
}

const handleEdit = (record) => {
  editTitle.value = record.gift_name + ': 倍数配置， 金额：' + record.gift_coin
  // 字符串转换成数字类型
  const obj = Object.assign({}, record)
  for (let i = 0; i < 8; i++) {
    obj['weight_' + i] = Number(obj['weight_' + i])
    obj['multiple_expect_' + i] = Number(obj['multiple_expect_' + i])
    obj.multiple_odds_0 = filtrationVal(record.multiple_odds_0)
    obj.multiple_odds_1 = filtrationVal(record.multiple_odds_1)
    obj.multiple_odds_2 = filtrationVal(record.multiple_odds_2)
    obj.multiple_odds_3 = filtrationVal(record.multiple_odds_3)
    obj.multiple_odds_4 = filtrationVal(record.multiple_odds_4)
    obj.multiple_odds_5 = filtrationVal(record.multiple_odds_5)
    obj.multiple_odds_6 = filtrationVal(record.multiple_odds_6)
    obj.multiple_odds_7 = filtrationVal(record.multiple_odds_7)
  }
  editForm.value = obj
  editGiftVisible.value = true
}

const editSubmit = async () => {
  calculate()
  if (editForm.value.reality_rtp > 1) {
    Message.error('实际RTP不能超过1!')
    return false
  }
  const validResult = await editFormRef.value.validate()
  if (validResult) {
    for (let i in validResult) {
      Message.error(validResult[i].message)
    }
    return false
  }
  const data = {
    id: editForm.value.id,
    gift_id: editForm.value.gift_id,
    form: {}
  }
  for (let i = 0; i <= 7; i++) {
    data['form']['multiple_odds_' + i] = editForm.value['multiple_odds_' + i]
    data['form']['multiple_expect_' + i] = editForm.value['multiple_expect_' + i]
    data['form']['weight_' + i] = editForm.value['weight_' + i]
  }
  const res = await singlePoolGift.update(data)
  if (res.success) {
    Message.success(res.message)
    getList()
  }
  editFormRef.value.resetFields()
}

const editClose = () => {
  editGiftVisible.value = false
  editFormRef.value.resetFields()
}

const handleForecast = async (record) => {
  odds_count.value = 0
  forecastData.value = []
  handleTitle.value = record.gift_name + " 金额：" + record.gift_coin+ " 干预预测"
  const res = await singlePoolGift.read(record.gift_id, {})
  if (res.success) {
    forecastForm.value.multiple_odds_0 = res.data.gift.multiple_odds_0 * 1;
    forecastForm.value.multiple_odds_1 = res.data.gift.multiple_odds_1 * 1;
    forecastForm.value.multiple_odds_2 = res.data.gift.multiple_odds_2 * 1;
    forecastForm.value.multiple_odds_3 = res.data.gift.multiple_odds_3 * 1;
    forecastForm.value.multiple_odds_4 = res.data.gift.multiple_odds_4 * 1;
    forecastForm.value.multiple_odds_5 = res.data.gift.multiple_odds_5 * 1;
    forecastForm.value.multiple_odds_6 = res.data.gift.multiple_odds_6 * 1;
    forecastForm.value.multiple_odds_7 = res.data.gift.multiple_odds_7 * 1;

    for (let i = 0; i <= 7; i++) {
      if (forecastForm.value["multiple_odds_" + i] != -1) {
        odds_count.value += 1;
      }
    }

    forecastForm.value.weight_1 = res.data.gift.weight_1;
    forecastForm.value.weight_2 = res.data.gift.weight_2;
    forecastForm.value.weight_3 = res.data.gift.weight_3;
    forecastForm.value.weight_4 = res.data.gift.weight_4;
    forecastForm.value.weight_5 = res.data.gift.weight_5;
    forecastForm.value.weight_6 = res.data.gift.weight_6;
    forecastForm.value.weight_7 = res.data.gift.weight_7;
    forecastForm.value.gift_coin = res.data.coin * 1;
    forecastForm.value.dark_tax_scale = res.data.cycle.dark_tax_scale * 1;
    forecastForm.value.anchor_scale = res.data.cycle.anchor_scale * 1;

    getForecastData()
    forecastVisible.value = true
  }
}

const getForecastData = () => {
  let intervention_value = new Big(-0.51);
  let pool_intervention_value = new Big(-0.01);
  let user_pool_intervention_value = new Big(-0.01);
  let pool_intervention_value_opt = "+"
  let user_pool_intervention_value_opt = "+"
  if (radio1.value === "水池系统赢钱") {
    pool_intervention_value_opt = "+";
  }
  if (radio1.value === "水池系统输钱") {
    pool_intervention_value_opt = "-";
  }
  if (radio2.value === "用户赢钱") {
    user_pool_intervention_value_opt = "+";
  }
  if (radio2.value === "用户输钱") {
    user_pool_intervention_value_opt = "-";
  }
  for (let i = 0; i <= count.value; i++) {
    if (pool_intervention_value_opt === "+") {
      pool_intervention_value = pool_intervention_value.plus(0.01);
    }
    if (user_pool_intervention_value_opt === "+") {
      user_pool_intervention_value = user_pool_intervention_value.plus(0.01);
    }
    if (pool_intervention_value_opt === "-") {
      pool_intervention_value = pool_intervention_value.minus(0.01);
    }
    if (user_pool_intervention_value_opt === "-") {
      user_pool_intervention_value = user_pool_intervention_value.minus(0.01);
    }
    intervention_value= intervention_value.plus(0.01);

    let all_weight = new Big(0)
    for (let i2 = 1; i2 <= odds_count.value; i2++) {
      if (forecastForm.value["weight_" + i2]) {
        all_weight = all_weight.plus(forecastForm.value["weight_" + i2] * 1);
      }
    }
    // var weight_0 = new Big((2000 * (1 + (user_pool_intervention_value.toFixed(3) * 1) + (pool_intervention_value.toFixed(3) * 1))))
    let weight_0 = new Big((2000 * (1 + (intervention_value.toFixed(3) * 1))))
    weight_0 = weight_0.toFixed(0)
    forecastForm.value["weight_0"] = weight_0;
    all_weight = all_weight.plus(weight_0);
    all_weight = all_weight.toFixed(0) * 1
    let rtp = new Big(0)
    for (let i3 = 0; i3 <= odds_count.value; i3++) {
      // 概率
      if (forecastForm.value["weight_" + i3]) {
        let item_multiple_expect = new Big(forecastForm.value["weight_" + i3] * 1)
        forecastForm.value["multiple_expect_" + i3] = item_multiple_expect.div(all_weight).toFixed(7) * 1;
        forecastForm.value["rtp_" + i3] = (new Big((forecastForm.value.gift_coin * forecastForm.value["multiple_odds_" + i3] * forecastForm.value["multiple_expect_" + i3]))).toFixed(7) * 1
        rtp = rtp.plus(forecastForm.value["rtp_" + i3])
      }
    }
    rtp = rtp.toFixed(7) * 1;
    // 期望RTP=rtp和/金币
    let desire_rtp = new Big(rtp / forecastForm.value.gift_coin).toFixed(7) * 1;
    let system_benefits = new Big((forecastForm.value.gift_coin * all_weight * (1 - forecastForm.value.dark_tax_scale - forecastForm.value.anchor_scale)));
    //预期派奖=物品金币值*权重合计*期望RTP
    let expected_award_distribution = new Big(forecastForm.value.gift_coin * all_weight * desire_rtp);
    let reality_rtp =  new Big(expected_award_distribution / system_benefits);
    forecastData.value.push({
      "pool_intervention_value": pool_intervention_value.toFixed(3) * 1,
      "user_pool_intervention_value": user_pool_intervention_value.toFixed(3) * 1,
      "intervention_value": intervention_value.toFixed(3) * 1,
      total_weight: all_weight,
      desire_rtp: desire_rtp,
      expected_award_distribution: expected_award_distribution.toFixed(0) * 1,
      system_benefits: system_benefits.toFixed(0) * 1,
      reality_rtp: reality_rtp.toFixed(6) * 1,
      weight_0: weight_0,
      weight_1: forecastForm.value.weight_1,
      weight_2: forecastForm.value.weight_2,
      weight_3: forecastForm.value.weight_3,
      weight_4: forecastForm.value.weight_4,
      weight_5: forecastForm.value.weight_5,
      weight_6: forecastForm.value.weight_6,
      weight_7: forecastForm.value.weight_7,
      multiple_expect_0: forecastForm.value.multiple_expect_0,
      multiple_expect_1: forecastForm.value.multiple_expect_1,
      multiple_expect_2: forecastForm.value.multiple_expect_2,
      multiple_expect_3: forecastForm.value.multiple_expect_3,
      multiple_expect_4: forecastForm.value.multiple_expect_4,
      multiple_expect_5: forecastForm.value.multiple_expect_5,
      multiple_expect_6: forecastForm.value.multiple_expect_6,
      multiple_expect_7: forecastForm.value.multiple_expect_7,
    })
  }
}

const getList = async () => {
  const res = await singlePoolGift.getList()
  if (res.success) {
    tableData.value = res.data
  }
}

const filtrationVal = (val) => {
  if (val === "无") {
    return '-1'
  }
  return val;
}

getList()

const columns = reactive([
  {
    title: '礼物', dataIndex: 'gift_name', fixed: 'left', width: 80
  },
  {
    title: 'coin', dataIndex: 'gift_coin', fixed: 'left', width: 80
  },
  {
    title: '倍数',
    children: [
      {
        title: '倍数0', dataIndex: 'multiple_odds_0', width: 140, slotName: 'multiple_odds_0'
      },
      {
        title: '倍数1', dataIndex: 'multiple_odds_1', width: 140, slotName: 'multiple_odds_1'
      },
      {
        title: '倍数2', dataIndex: 'multiple_odds_2', width: 140, slotName: 'multiple_odds_2'
      },
      {
        title: '倍数3', dataIndex: 'multiple_odds_3', width: 140, slotName: 'multiple_odds_3'
      },
      {
        title: '倍数4', dataIndex: 'multiple_odds_4', width: 140, slotName: 'multiple_odds_4'
      },
      {
        title: '倍数5', dataIndex: 'multiple_odds_5', width: 140, slotName: 'multiple_odds_5'
      },
      {
        title: '倍数6', dataIndex: 'multiple_odds_6', width: 140, slotName: 'multiple_odds_6'
      },
      {
        title: '倍数7', dataIndex: 'multiple_odds_7', width: 140, slotName: 'multiple_odds_7'
      }
    ]
  },
  {
    title: '权重合计',
    children: [
      {
        title: 'Sum', dataIndex: 'total_weight', width: 100
      }
    ]
  },
  {
    title: '期望RTP', dataIndex: 'desire_rtp', width: 110
  },
  {
    title: '已加入主播分成与暗税',
    children: [
      {
        title: '系统收益', dataIndex: 'system_benefits', width: 110
      },
      {
        title: '预期派奖', dataIndex: 'expected_award_distribution', width: 110
      },
      {
        title: '实际RTP', dataIndex: 'reality_rtp', width: 110
      }
    ]
  },
  {
    title: '状态',
    fixed: 'right',
    children: [
      {
        title: '上下架状态', dataIndex: 'gift_state_val', width: 110,
      }
    ]
  },
  {
    title: '操作', fixed: 'right', width: 180, slotName: 'operation'
  }
])

</script>

<script>
// export default { name: 'gift:singlePoolGift' }
</script>

<style scoped>

</style>