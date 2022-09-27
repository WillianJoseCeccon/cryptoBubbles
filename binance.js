let moedasComVariacao = 5


const options = {
    label: d => d.id + "\n" + d.value.toFixed(2) + "%",//text
    value: d => Math.abs(d.value),//value
    group: d => d.value > 0 ? "up" : "down",//agrupamento por cor
    title: d => d.id,//hover
    link: d => `https://www.binance.com/en/trade/${d.id.replace('USDT', '')}_USDT`,
    width: 1024,
    height: 768
}


    const objData = {};
    const webSocket = new WebSocket('wss://stream.binance.com:9443/ws/!miniTicker@arr');
    webSocket.onmessage = function (event) {
        const json = JSON.parse(event.data);
        json.filter(o => o.s.endsWith('USDT')
            && !/^.{2,}(DOWNUSDT|UPUSDT)$/.test(o.s))
            .map(o => objData[o.s] = (((parseFloat(o.c) * 100) / parseFloat(o.o)) - 100));
 
        const data = Object.keys(objData).map(symbol => {
            return {
                id: symbol.replace('USDT', ''), value: objData[symbol]
            }
        }).filter(o => Math.abs(o.value) > moedasComVariacao);
 
    document.getElementById('div').innerHTML = JSON.stringify(data);

    const chart = BubbleChart(data, options);
    document.getElementById('div').innerHTML = chart.outerHTML;
}
