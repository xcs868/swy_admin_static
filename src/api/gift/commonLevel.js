import { request } from '@/utils/request.js'

export default {
    /**
     * 获取 全平台/用户 等级列表
     * @returns
     */
    getList(id) {
        return request({
            url: 'game/luck-gift/jackpot-rank/list?uid=' + id,
            method: 'get'
        })
    },

    /**
     * 设置税收配置
     * @returns
     */
    updateTax(data) {
        return request({
            url: 'game/luck-gift/jackpot-rank/update/tax',
            method: 'put',
            data
        })
    },

    /**
     * 设置 全平台/用户 用等级配置
     * @returns
     */
    updateConfig(id, data = {}) {
        return request({
            url: 'game/luck-gift/jackpot-rank/update' + (id ? ('/' + id) : ''),
            method: 'put',
            data
        })
    },

    /**
     * 清除登记设置
     * @returns
     */
    delete(data) {
        return request({
            url: 'game/luck-gift/jackpot-rank/delete',
            method: 'delete',
            data
        })
    },
}