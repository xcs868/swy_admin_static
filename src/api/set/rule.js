import { request } from '@/utils/request.js'

export default {
    /**
     * 获取规则列表
     * @returns
     */
    getList(params = {}) {
        return request({
            url: 'game/manage/config/list',
            method: 'get',
            params
        })
    },

    /**
     * 删除规则
     * @returns
     */
    delete(data) {
        return request({
            url: 'game/manage/config/delete-rule',
            method: 'delete',
            data
        })
    },

    /**
     * 获取详情
     * @returns
     */
    getDetail(params) {
        return request({
            url: 'game/manage/config/show',
            method: 'get',
            params
        })
    },

    /**
     * 新增/修改规则 修改传id
     * @returns
     */
    save(data = {}) {
        return request({
            url: 'game/manage/config/add',
            method: 'post',
            data
        })
    },
}