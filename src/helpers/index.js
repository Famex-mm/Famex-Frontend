import avateaToken from './web3/avateaToken';
import marketMaker from './web3/marketMaker';
import vault from './web3/vault';
import marketMaking from "./marketMaking";
import project from "./project";
import token from "./web3/token";
import uniswap from "./web3/uniswap";
import network from "./web3/network";
import formatting from "./formatting";
import user from './user';
import vaultRest from './vault';
import callback from "./callback";
import authentication from "./web3/authentication";
import article from "./article";
import validator from "./validator";
import transactions from "./transactions";
import messages from "./messages";
import liquidityMaker from "./web3/liquidityMaker";
import liquidityMakerRest from "./liquidityMaker";



// @TODO Cleanup all to Web3 object for now keep it as it is without breaking the current code
export default {
    avateaToken,
    marketMaker,
    vault,
    marketMaking,
    web3: {
        avateaToken,
        marketMaker,
        vault,
        authentication,
        token,
        liquidityMaker,
        uniswap,
        network
    },
    liquidityMaker: liquidityMakerRest,
    project,
    article,
    token,
    user,
    vaultRest,
    callback,
    formatting,
    validator,
    transactions,
    messages
}