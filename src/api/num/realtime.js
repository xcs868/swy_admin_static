import { request } from '@/utils/request.js'

export default {
    /**
     * 获取实时数据列表
     * @returns
     */
    getRealtimeList(params = {}) {
        return request({
            url: 'game/num/index',
            method: 'get',
            params
        })
    },
}