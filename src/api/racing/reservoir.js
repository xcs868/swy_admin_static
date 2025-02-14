import { request } from '@/utils/request.js'

export default {
    /**
     * 获取参数列表
     * @returns
     */
    getList(params = {}) {
        return request({
            url: 'game/racing/pool-config/list',
            method: 'get',
            params
        })
    },

    /**
     * 更新参数
     * @returns
     */
    update(data) {
        return request({
            url: 'game/racing/pool-config/update',
            method: 'put',
            data
        })
    },
}