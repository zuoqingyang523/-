let devMidWare = {
    target: "http://47.94.74.150:8001",
    ws: true,
    changeOrigin: true,
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
};