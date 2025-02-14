import { request } from '@/utils/request.js'

export default {
    /**
     * 获取设定列表
     * @returns
     */
    getList(params = {}) {
        return request({
            url: 'game/luck-gift/single-pool/list',
            method: 'get',
            params
        })
    },

    /**
     * 修改设定
     * @returns
     */
    update(id, data = {}) {
        return request({
            url: 'game/luck-gift/single-pool/update',
            method: 'put',
            data
        })
    }
}