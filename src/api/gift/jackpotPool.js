import { request } from '@/utils/request.js'

export default {
    /**
     * 获取奖池列表
     * @returns
     */
    getList(params = {}) {
        return request({
            url: 'game/luck-gift/pool-cfg/list',
            method: 'get',
            params
        })
    },

    /**
     * 修改奖池
     * @returns
     */
    updateBasic(id, data = {}) {
        return request({
            url: 'game/luck-gift/pool-cfg/update/' + id,
            method: 'put',
            data
        })
    }
}