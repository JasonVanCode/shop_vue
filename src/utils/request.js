import axios from 'axios';
import router from '../router';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: 'http://localhost:8080/admin',
    timeout: 5000
});

service.interceptors.request.use(
    config => {
        if(config.data){
            config.data = JSON.stringify(config.data)
            config.headers = {
                'Content-Type':'application/json' //配置请求头
            }
        }
        const token = localStorage.getItem("token");
        if(token){
            const token_type = "Bearer";
            config.headers.Authorization =token_type+ ' ' + token
        }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            //判断token是否过期
            let data = response.data
            //判断token 是否过期
            if (data.errno == 401){
                //清空用户缓存信息
                localStorage.setItem('ms_username',"");
                return;
            }
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;
