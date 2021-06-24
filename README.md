# wstock_v5
Upgrade based on wstock，支持最新V5版本接口，兼容V4

### install 
```bash
npm install wstock_v5 -g
```

## news
Upgrade based on [wstock](https://github.com/hellopao/wstock)

Use the latest version
```shell script
wstock list5
```

## 我摊牌了，不装了，我英文比较菜
基于 [wstock](https://github.com/hellopao/wstock) 升级到V5版本，支持最新的接口

<hr>
如有版权侵犯，请联系我，立马删，绝不马虎
<hr>

安装
```bash
npm install wstock_v5 -g
```

show没改，因为我不用呀~~~啊哈哈哈哈

最新版本使用，支持原来的参数，其他的我都没改，老功能依旧可以使用
```shell script
wstock list5
```

## wstock
 a cmd tool for watching stock

### usage
- `wstock list`

 display all the stocks in stock.json and check status at intervals
 
 	- `wstock list -n`
	 
	 	do not mark the stock status red or green by its increase
 
 	- `wstock list -i <interval>`
	 
	 	set the stock code check interval

- `wstock show <code>`

 show stock status and and check it at intervals

 	- `wstock show <code> -n`
	 
	 	do not mark the stock status red or green by its increase
 
 	- `wstock show <code> -i <interval>`
	 
	 	set the stock code check interval
		 
 
- `wstock query <code|name>`

 query stock info by code or name

- `wstock add <code>`

 add stock to stock.json then u can use `wstock list` to display it's status
 
- `wstock remove <code>`

 remove stock from stock.json

