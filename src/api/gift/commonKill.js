import { request } from '@/utils/request.js'

export default {
    /**
     * 获取奖池列表
     * @returns
     */
    getList(params = {}) {
        return request({
            url: 'game/luck-gift/jackpot-user-rank/list',
            method: 'get',
            params
        })
    },
}