import { request } from '@/utils/request.js'

export default {
    /**
     * 获取基本信息列表
     * @returns
     */
    getList(params = {}) {
        return request({
            url: 'game/luck-gift/jackpot-config/list',
            method: 'get',
            params
        })
    },

    /**
     * 新增礼物
     * @returns
     */
    save(data = {}) {
        return request({
            url: 'game/luck-gift/jackpot-config/save',
            method: 'post',
            data
        })
    },

    /**
     * 编辑
     * @returns
     */
    update(data) {
        return request({
            url: 'game/luck-gift/jackpot-config/update',
            method: 'put',
            data
        })
    },

    /**
     * 上下架
     * @returns
     */
    putAway(data) {
        return request({
            url: 'game/luck-gift/jackpot-config/put-away',
            method: 'put',
            data
        })
    },

    /**
     * 获取干预预测
     * @returns
     */
    read(id, params = {}) {
        return request({
            url: 'game/luck-gift/jackpot-config/read/' + id,
            method: 'get',
            params
        })
    },
}