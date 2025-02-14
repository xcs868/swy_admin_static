import { request } from '@/utils/request.js'

export default {
    /**
     * 获取实时出奖列表
     * @returns
     */
    getRealTimeAward(params = {}) {
        return request({
            url: 'game/racing/real-time-award',
            method: 'get',
            params
        })
    },

    /**
     * 获取当前游戏场次信息
     * @returns
     */
    getCurrentInfo() {
        return request({
            url: 'game/racing/current-info',
            method: 'get'
        })
    },

    /**
     * 获取当前发布的套餐详情
     * @returns
     */
    getRacingCfg() {
        return request({
            url: 'game/racing/cfg',
            method: 'get'
        })
    },

    /**
     * 更新
     * @returns
     */
    update(id, data = {}) {
        return request({
            url: '/game/racing/update-lottery-results',
            method: 'put',
            data
        })
    },
}