"use strict";

const path = require('path');

exports.stockAPI = {
    query: "http://xueqiu.com/stock/search.json?code={key}",
    info: "http://xueqiu.com/v4/stock/quote.json?code={code}",
    info_v5: "http://stock.xueqiu.com/v5/stock/batch/quote.json?symbol={code}&extend=detail", // &is_delay_hk=true
    site: "http://xueqiu.com"
};

exports.stockDataFile = path.join(__dirname, "./stock.json");

exports.stockTermMapV4 = {
    "name": "股票名称",
    "code": "股票代码",
    "open": "今日开盘",
    "last_close": "昨日收盘",
    "current": "当前价格",
    "high": "今日最高",
    "low": "今日最低",
    "change": "今日涨跌",
    "percentage": "今日涨幅"
};

exports.stockTermMapV5 = {
    "name": "股票名称",
    "code": "股票代码",
    "open": "今日开盘",
    "last_close": "昨日收盘",
    "current": "当前价格",
    "high": "今日最高",
    "low": "今日最低",
    "chg": "今日涨跌",
    "percent": "今日涨幅"
};

exports.stockCheckInterval = 5000;
