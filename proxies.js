const axios = require("axios");

async function pickProxiesIp() {
  const proxylist = require("proxylist");
  return proxylist.main().then(async list => {
    console.log(list.length);
    let arrTimes = [];
    for (let i = 0; i < list.length / 10; i++) {
      console.log("IP", list[i]);
      let proxy = {
        ip: list[i].split(":")[0],
        port: list[i].split(":")[1]
      };

      var start = new Date();
      try {
        await axios
          .get(
            "http://www.bing.com/search?q=site%3alinkedin.com+intitle%3aDevelopment+AND+owner+AND+Chicago&qs=n&first=0",
            {
              timeout: 1800,
              proxy: { host: proxy.ip, port: proxy.port }
            }
          )
          .then(resp => {
            var responseTime = new Date() - start;
            resp.data.length > 90000
              ? arrTimes.push({
                  responseTime,
                  ip: list[i]
                })
              : false;
            console.log("RESPONSE TIME", responseTime);
            console.log("RESPONSE LENGTH", resp.data.length);
          })
          .catch(err => console.log(err.message));
      } catch (err) {
        continue;
      }
    }
    console.log(
      "PICKED IP ",
      arrTimes.sort((a, b) => (a.responseTime > b.responseTime ? 1 : -1))[5].ip
    );
    return arrTimes.sort(
      (a, b) => (a.responseTime > b.responseTime ? 1 : -1)
    )[5].ip;
  }); //=> ["50.93.200.237:2018", ...]
}

module.exports.pickProxiesIp = pickProxiesIp;
