import { request } from '@/utils/request.js'

export default {
    /**
     * 获取幸运礼物基础列表
     * @returns
     */
    getBasicList(params = {}) {
        return request({
            url: 'game/luck-gift/basic-cfg/list',
            method: 'get',
            params
        })
    },

    /**
     * 获取幸运礼物奖池列表
     * @returns
     */
    getMergeList(params = {}) {
        return request({
            url: 'game/luck-gift/basic-cfg/merge-configs',
            method: 'get',
            params
        })
    },

    /**
     * 修改幸运礼物基础配置
     * @returns
     */
    updateBasic(id, data = {}) {
        return request({
            url: 'game/luck-gift/basic-cfg/mdf-basic-cfg/' + id,
            method: 'put',
            data
        })
    },

    /**
     * 修改幸运礼物奖池配置
     * @returns
     */
    updateMerge(id, data = {}) {
        return request({
            url: 'game/luck-gift/basic-cfg/mdf-basic-cfg2/' + id,
            method: 'put',
            data
        })
    },
}