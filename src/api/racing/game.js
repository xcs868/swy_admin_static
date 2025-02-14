import { request } from '@/utils/request.js'

export default {
    /**
     * 获取套餐列表
     * @returns
     */
    getList(params = {}) {
        return request({
            url: 'game/racing/list',
            method: 'get',
            params
        })
    },

    /**
     * 新增套餐
     * @returns
     */
    save(data = {}) {
        return request({
            url: 'game/racing/save',
            method: 'post',
            data
        })
    },

    /**
     * 修改套餐
     * @returns
     */
    update(id, data = {}) {
        return request({
            url: 'game/racing/update/' + id,
            method: 'put',
            data
        })
    },

    /**
     * 删除套餐
     * @returns
     */
    delete(data) {
        return request({
            url: 'game/racing/delete',
            method: 'delete',
            data
        })
    },

    /**
     * 发布套餐
     * @returns
     */
    release(data) {
        return request({
            url: 'game/racing/release',
            method: 'put',
            data
        })
    },

    /**
     * 获取套餐奖品列表
     * @returns
     */
    getPrizeList(params = {}) {
        return request({
            url: 'game/racing/prize/list',
            method: 'get',
            params
        })
    },

    /**
     * 修改套餐奖品列表
     * @returns
     */
    updatePrize(id, data = {}) {
        return request({
            url: 'game/racing/prize/update',
            method: 'put',
            data
        })
    },
}