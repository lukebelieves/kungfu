const path = require('path');
const { addFileSync } = require('__gUtils/fileUtils');

const KF_HOME_BASE_DIR_RESOLVE = (() => {
    if ( process.env.APP_TYPE === 'cli' ) {
        return require('__gConfig/cliKfHomePathConfig').KF_HOME_BASE_DIR_RESOLVE
     } else {
        return require('__gConfig/appKfHomePathConfig').KF_HOME_BASE_DIR_RESOLVE
     }
})()

addFileSync('', KF_HOME_BASE_DIR_RESOLVE, 'folder');
export const KF_HOME_BASE_DIR = KF_HOME_BASE_DIR_RESOLVE;

//BASE
export const KF_HOME = path.join(KF_HOME_BASE_DIR, 'app')
addFileSync('', KF_HOME, 'folder')

//system
export const SYSTEM_DIR = path.join(KF_HOME, 'system');
addFileSync('', SYSTEM_DIR, 'folder')

//runtime
export const RUNTIME_DIR = path.join(KF_HOME, 'runtime');
addFileSync('', RUNTIME_DIR, 'folder')

//strategy
export const STRATEGY_DIR = path.join(KF_HOME, 'strategy');
addFileSync('', STRATEGY_DIR, 'folder')

//td
export const TD_DIR = path.join(KF_HOME, 'td');
addFileSync('', TD_DIR, 'folder')

//md
export const MD_DIR = path.join(KF_HOME, 'md');
addFileSync('', MD_DIR, 'folder')

//ledger 
export const LEDGER_DIR = path.join(SYSTEM_DIR, 'service', 'ledger')
addFileSync('', LEDGER_DIR, 'folder')

//log
export const LOG_DIR = path.join(KF_HOME, 'log');
addFileSync('', LOG_DIR, 'folder')


//================= global db start ==============================

//BASE_DB_DIR strategys, accounts, tasks
export const BASE_DB_DIR = path.join(SYSTEM_DIR, 'etc', 'kungfu', 'db', 'live');

//strategy
export const STRATEGYS_DB = path.join(BASE_DB_DIR, 'strategys.db')

//accounts(td)
export const ACCOUNTS_DB = path.join(BASE_DB_DIR, 'accounts.db')

//================= global db end =================================

//================= account related start ==========================

//gateway
export const buildGatewayPath = (gatewayName: string) => path.join(KF_HOME, ...gatewayName.split('_'))

//gateway data
export const buildGatewayLiveDBPath = (gatewayName: string) => path.join(buildGatewayPath(gatewayName), 'db', 'live')

//account commission 手续费
export const buildAccountCommissionDBPath = (accountId: string) => path.join(buildGatewayLiveDBPath(`td_${accountId}`), 'commission.db')    

//================= account related end ==========================

//================= live trading start ===========================

//trading data
export const LIVE_TRADING_DB_DIR = path.join(LEDGER_DIR, 'db', 'live');

export const LIVE_TRADING_DATA_DB = path.join(LIVE_TRADING_DB_DIR, 'ledger.db')

//================= live trading end =============================

//================== others start =================================

//global commission 手续费
export const GLOBAL_COMMISSION_DB = path.join(BASE_DB_DIR, 'commission.db');

//获取进程日志地址
export const buildProcessLogPath = (processId: string) => path.join(LOG_DIR, `${processId}.log`)

//获取 ledger nano pub 地址
export const NMSG_PUB_FILE = path.join(SYSTEM_DIR, 'service', 'ledger', 'nn', 'live', 'pub.nn')

//获取 ledger nano rep 地址
export const NMSG_REP_FILE = path.join(SYSTEM_DIR, 'service', 'ledger', 'nn', 'live', 'rep.nn')

//================== others end ===================================


//================== config start =================================

export const KUNGFU_RESOURCES_DIR = process.env.NODE_ENV === 'production'
    ? path.join(process.resourcesPath, 'kungfu-resources')
    : path.join(__resources)


console.log(KUNGFU_RESOURCES_DIR, '---')

export const KF_CONFIG_DEFAULT_PATH = path.join(KUNGFU_RESOURCES_DIR, 'config', 'kfConfig.json')

export const KF_TARADING_CONFIG_DEFAULT_PATH = path.join(KUNGFU_RESOURCES_DIR, 'config', 'kfTradingConfig.json')

export const KF_CONFIG_PATH = path.join(KF_HOME, 'config', 'kfConfig.json')

export const KF_TARADING_CONFIG_PATH = path.join(KF_HOME, 'config', 'kfTradingConfig.json')

export const KF_FUTURE_TICKERS_CONFIG_PATH = path.join(KUNGFU_RESOURCES_DIR, 'config', 'futureTickers.json')

export const KF_STOCK_TICKERS_CONFIG_PATH = path.join(KUNGFU_RESOURCES_DIR, 'config', 'stockTickers.json')


//================== config start =================================


export const getKfEnginePath = () => {
    if(process.env.NODE_ENV === 'production') {
        if(process.env.APP_TYPE === 'test'){
            return process.env.KUNGFU_ENGINE_PATH || ''
        }
    }
}

export const KUNGFU_ENGINE_PATH = process.env.NODE_ENV === 'production' 
    ? process.resourcesPath
    : path.join(__dirname, '..', '..', '..', 'core', 'build')


export const EXTENSION_DIR = path.join(KUNGFU_ENGINE_PATH, 'kfc', 'kungfu_extensions');
