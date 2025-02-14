import { request } from '@/utils/request.js'

export default {
    /**
     * 获取列表
     * @returns
     */
    getList(params = {}) {
        return request({
            url: 'game/manage/config/list-default',
            method: 'get',
            params
        })
    },

    /**
     * 修改上下架、预上下架、白名单
     * @returns
     */
    updateStatus(data) {
        return request({
            url: 'game/manage/config/game-status-update',
            method: 'put',
            data
        })
    },

    /**
     * 获取详情
     * @returns
     */
    getDetail(id) {
        return request({
            url: 'game/manage/config/show-default?id=' + id,
            method: 'get'
        })
    },

    /**
     * 修改规则
     * @returns
     */
    updateRule(data) {
        return request({
            url: '/game/manage/config/add-default',
            method: 'put',
            data
        })
    },
}