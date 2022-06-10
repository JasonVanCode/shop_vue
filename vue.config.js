module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        port:3000
        // proxy: {
        //     '/api':{
        //         target:'http://jsonplaceholder.typicode.com',
        //         changeOrigin:true,
        //         pathRewrite:{
        //             '/api':''
        //         }
        //     }
        // }
    }
}