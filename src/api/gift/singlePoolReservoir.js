import { request } from '@/utils/request.js'

export default {
    /**
     * 获取列表信息
     * @returns
     */
    getList(params = {}) {
        return request({
            url: 'game/luck-gift/single-pool-config/list',
            method: 'get',
            params
        })
    },

    /**
     * 发布配置
     * @returns
     */
    update(data) {
        return request({
            url: 'game/luck-gift/single-pool-config/update',
            method: 'put',
            data
        })
    }
}