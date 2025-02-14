import { request } from '@/utils/request.js'

export default {
    /**
     * 获取页面全部数据
     * @returns
     */
    getList(params = {}) {
        return request({
            url: 'game/num/list',
            method: 'get',
            params
        })
    },

    /**
     * 修改基础设置
     * @returns
     */
    changeBasicConf(data = {}) {
        return request({
            url: 'game/num/change-basic-conf',
            method: 'put',
            data
        })
    },

    /**
     * 发布配置
     * @returns
     */
    update(data = {}) {
        return request({
            url: 'game/num/update',
            method: 'put',
            data
        })
    }
}