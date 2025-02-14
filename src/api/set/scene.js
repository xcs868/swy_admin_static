import { request } from '@/utils/request.js'

export default {
    /**
     * 获取游戏管理场景分页列表
     * @returns
     */
    getPageList(params = {}) {
        return request({
            url: 'game/manage/config/from-game',
            method: 'get',
            params
        })
    },
    /**
     * 更新排序
     * @returns
     */
    update(id, data = {}) {
        return request({
            url: 'game/manage/config/sort-update',
            method: 'put',
            data
        })
    },
}