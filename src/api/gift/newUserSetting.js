import { request } from '@/utils/request.js'

export default {
    /**
     * 获取列表
     * @returns
     */
    getList(params = {}) {
        return request({
            url: 'game/luck-gift/level3/list',
            method: 'get',
            params
        })
    },

    /**
     * 发布配置
     * @returns
     */
    updateBasic(data) {
        return request({
            url: 'game/luck-gift/level3/update',
            method: 'put',
            data
        })
    }
}