import request from "./request"

const http = {
    get(url,params){
        const config = {
            method:"get",
            url:url
        }
        if(params){
            config.params = params
        }
        return request(config)
    },
    post(url,data){
        const config = {
            method:"post",
            url:url
        }
        if(data){
            config.data = data
        }
        return request(config)
    }
}

export default http
