"use strict";

const fs = require('fs');

const request = require('request');

const config = require('./config/config');

const http = request.defaults({
  //proxy: "http://127.0.0.1:8888",	//for fiddler
  jar: true,
  headers: {
    Accept: '*/*',
    "User-Agent": 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36'
  }
});

/**
 * 读取股票代码配置
 */
function readStockCodeFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(config.stockDataFile, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString());
      }
    })
  })
}

/**
 * 更新股票代码配置
 */
function writeStockCodeFile(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(config.stockDataFile, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  })
}

/**
 * 访问雪球财经站点
 */
function visitStockSite() {
  return new Promise((resolve, reject) => {
    if (http.authed) {
      return resolve();
    }
    http.get(config.stockAPI.site, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        http.authed = true;
        resolve();
      }
    })
  })
}

/**
 * 根据股票名称/代码获取股票详情
 */
function fetchStockInfo(key) {
  return visitStockSite()
    .then(() => {
      key = encodeURIComponent(key);
      return new Promise((resolve, reject) => {
        http.get(config.stockAPI.query.replace(/\{key\}/, key), (err, res, body) => {
          if (err) {
            reject(err);
          } else {
            resolve(body);
          }
        })
      })
    })
}

/**
 * 根据股票代码获取股票状态信息,支持多个
 */
function fetchStockStatus(code, version) {
  let isMulti = Array.isArray(code);
  if (isMulti) {
    code = code.join(',');
  }
  return visitStockSite()
    .then(() => {
      code = encodeURIComponent(code);
      return new Promise((resolve, reject) => {
        let url = version == 5 ? config.stockAPI.info_v5 : config.stockAPI.info;
        http.get(url.replace(/\{code\}/, code), (err, res, body) => {
          if (res.statusCode == 400) {
            http.authed = false;
          }
          if (err) {
            reject(err);
          } else {
            resolve(body);
          }
        })
      })
    })
}

exports.queryStockInfo = key => {
  return fetchStockInfo(key)
    .then(data => {
      data = JSON.parse(data);
      if (!data.stocks.length) {
        return `无相关股票记录: ${key}`;
      }

      return data.stocks;
    })
};

exports.queryStockStatus = code => {
  code = code.toUpperCase();
  return fetchStockStatus(code)
    .then(data => {
      data = JSON.parse(data);
      if (data.error_code) {
        return `无此股票代码: ${code}`
      }

      return Object.assign({}, data[code], {code: code});
    })
};

exports.queryStockListStatus = () => {
  return readStockCodeFile()
    .then(data => {
      let stockData = JSON.parse(data);
      let codes = stockData.map(stock => stock.code);

      return fetchStockStatus(codes)
        .then(data => {
          data = JSON.parse(data);
          if (data.error_code) {
            return [];
          }

          return Object.keys(data).map(code => Object.assign({}, data[code], {code: code}));
        })
    })
};

exports.queryStockListStatusV5 = () => {
  return readStockCodeFile()
    .then(data => {
      let stockData = JSON.parse(data);

      let codes = stockData.map(stock => stock.code);

      return fetchStockStatus(codes, 5)
        .then(data => {
          data = JSON.parse(data);
          if (data.error_code || !data.data || !data.data.items) {
            return [];
          }

          return data.data.items.map(stock => Object.assign({}, stock.quote));
        })
    })
};

exports.addStock = code => {

  return Promise.all([readStockCodeFile(), exports.queryStockInfo(code)])
    .then(results => {
      let stockData = JSON.parse(results[0]);
      if (typeof results[1] === "string") {
        return `无此股票代码: ${code}`
      }

      let stock = results[1].find(item => item.code.toLowerCase() === code.toLowerCase());
      stockData = stockData.filter(item => item.code.toLowerCase() !== code.toLowerCase()).concat({
        code: stock.code,
        name: stock.name
      });

      return writeStockCodeFile(JSON.stringify(stockData))
        .then(() => `添加股票代码 ${code} 成功`)
    })
};

exports.removeStock = code => {
  return readStockCodeFile()
    .then(data => {
      let stockData = JSON.parse(data);
      let index = stockData.findIndex(item => code.toLowerCase() === item.code.toLowerCase());
      if (index !== -1) {
        stockData.splice(index, 1);
        return writeStockCodeFile(JSON.stringify(stockData))
          .then(() => `删除股票代码 ${code} 成功`)
      } else {
        return `列表中无此股票代码: ${code}`;
      }
    })
}

