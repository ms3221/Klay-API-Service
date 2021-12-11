const Caver = require("caver-js");
const caver = new Caver("https://api.baobab.klaytn.net:8651/");





module.exports = {
    version: async (req, res) => {
        const version = await caver.rpc.klay.getClientVersion();
        res.send(version);
    }
}