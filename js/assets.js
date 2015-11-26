import MsgPackAsset from './utils/asset-loader.js';

console.log(MsgPackAsset);
module.exports = {
    testMesh : new MsgPackAsset("monster.js").load().register()
};

