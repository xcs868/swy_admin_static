import { request } from '@/utils/request.js'

export default {
    /**
     * 获取列表
     * @returns
     */
    getList(params = {}) {
        return request({
            url: 'game/racing/cycle/list',
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
            url: 'game/racing/cycle/update/' + id,
            method: 'put',
            data
        })
    },
}