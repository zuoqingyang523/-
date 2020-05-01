let devMidWare = {
    target: "http://47.94.74.150:8001",
    ws: true,
    changeOrigin: true,
    // pathRewrite: {
    //     '^/m': ''
    // }
}
module.exports = {

    port: 3200,
    // 帅勋
    dev: {
        '/m/file/': devMidWare,
        '/m/signatory/': devMidWare,
        '/m/contract/': devMidWare,
        '/m/user/': devMidWare,
        '/m/common/': devMidWare,
        '/m/warn/': devMidWare,
        '/m/seal/': devMidWare,
        '/m/agent/': devMidWare,
        '/m/pay/': devMidWare,
        '/m/ws/': devMidWare,
        '/m/Judiciary/': devMidWare,
        '/m/perform/': devMidWare,
        '/m/template/': devMidWare,
        '/m/home/': devMidWare,
        '/m/getToken': devMidWare
    },
    shuaixunTable: {
        '/file/': {
            target: 'http://192.168.1.122:8080',
            ws: true,
            changeOrigin: false
        },
        '/signatory/': {
            target: 'http://192.168.1.122:8080',
            ws: true,
            changeOrigin: false
        },
        '/contract/': {
            target: 'http://192.168.1.122:8080',
            ws: true,
            changeOrigin: false
        },
        '/user/': {
            target: 'http://192.168.1.122:8080',
            ws: true,
            changeOrigin: false
        },
        '/common/': {
            target: 'http://192.168.1.122:8080',
            ws: true,
            changeOrigin: false
        },
        '/warn/': {
            target: 'http://192.168.1.122:8080',
            ws: true,
            changeOrigin: false
        },
        '/seal/': {
            target: 'http://192.168.1.122:8080',
            ws: true,
            changeOrigin: false
        },
        '/agent/': {
            target: 'http://192.168.1.122:8080',
            ws: true,
            changeOrigin: false
        },
        '/seal/': {
            target: 'http://192.168.1.122:8080',
            ws: true,
            changeOrigin: false
        },
        '/ws/': {
            target: 'ws://192.168.1.122:8080',
            ws: true,
            changeOrigin: false
        },
        '/Judiciary/': {
            target: 'ws://192.168.1.122:8080',
            ws: true,
            changeOrigin: false
        }


    },
    // 永光
    yongGuangTable: {
        '/file/': {
            target: 'http://192.168.1.144:8080',
            ws: true,
            changeOrigin: false
        },
        '/signatory/': {
            target: 'http://192.168.1.144:8080',
            ws: true,
            changeOrigin: false
        },
        '/contract/': {
            target: 'http://192.168.1.144:8080',
            ws: true,
            changeOrigin: false
        },
        '/user/': {
            target: 'http://192.168.1.144:8080',
            ws: true,
            changeOrigin: false
        },
        '/common/': {
            target: 'http://192.168.1.144:8080',
            ws: true,
            changeOrigin: false
        },
        '/warn/': {
            target: 'http://192.168.1.144:8080',
            ws: true,
            changeOrigin: false
        },
        '/seal/': {
            target: 'http://192.168.1.144:8080',
            ws: true,
            changeOrigin: false
        },
    },
    yuruiTable: {
        '/user/': {
            target: 'http://192.168.1.123:8080',
            ws: true,
            changeOrigin: false
        },
        '/common/': {
            target: 'http://192.168.1.123:8080',
            ws: true,
            changeOrigin: false
        },
        '/perform/': {
            target: 'http://192.168.1.123:8080',
            ws: true,
            changeOrigin: false
        },
        '/pay/': {
            target: 'http://192.168.1.123:8080',
            ws: true,
            changeOrigin: false
        }
    }
};