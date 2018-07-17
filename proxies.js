const axios = require("axios");

async function pickProxiesIp() {
  const proxylist = require("proxylist");
  return proxylist.main().then(async list => {
    console.log(list.length);
    let arrTimes = [];
    for (let i = 0; i < proxies.length / 10; i++) {
      console.log("IP", proxies[i]);
      let proxy = {
        ip: proxies[i].split(":")[0],
        port: proxies[i].split(":")[1]
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
                  ip: proxies[i]
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
      arrTimes.sort((a, b) => (a.responseTime > b.responseTime ? 1 : -1))[0].ip
    );
    return arrTimes.sort(
      (a, b) => (a.responseTime > b.responseTime ? 1 : -1)
    )[0].ip;
  }); //=> ["50.93.200.237:2018", ...]
}

module.exports.pickProxiesIp = pickProxiesIp;



let proxies = 
['120.138.102.45:8080', 
'185.203.252.121:41258' ,
'120.28.150.52:8090' ,
'187.110.93.120:20183 ' ,
'217.61.108.24:80 ' ,
'185.134.151.17:8080 ' ,
'191.240.28.10:20183 ' ,
'195.230.16.88:9090 ' ,
'94.102.127.8:8080 ' ,
'188.239.95.225:41258 ' ,
'177.128.224.9:8080' ,
'188.35.167.7:45619 ' ,
'1.179.198.37:8080 ' ,
'59.106.210.192:60088' ,
'184.82.128.211:8080 ' ,
'95.80.121.79:41258 ' ,
'186.225.123.229:20183' ,
'168.232.8.5:8080 ' ,
'81.163.52.80:41258 ' ,
'206.189.26.105:80 ' ,
'94.156.57.19:8080 ' ,
'89.234.199.60:41258' ,
'187.141.74.69:8080 ' ,
'80.211.154.220:8888 ' ,
'138.201.46.123:3128 ' ,
'183.88.49.75:8080 ' ,
'67.205.148.246:8080 ' ,
'41.76.242.26:8080 ' ,
'191.102.101.174:3128 ' ,
'77.106.249.11:8080 ' ,
'149.202.106.159:3128 ' ,
'149.28.152.117:8080 ' ,
'34.225.249.169:80 ' ,
'190.128.162.70:80 ' ,
'79.106.22.225:8080 ' ,
'212.47.235.197:3128 ' ,
'199.188.138.217:41258' ,
'202.94.164.94:8080 ' ,
'80.241.253.202:8080 ' ,
'103.224.103.129:8080 ' ,
'195.208.172.70:8080 ' ,
'183.89.27.25:8080 ' ,
'43.241.28.201:8080 ' ,
'45.55.115.0:3128 ' ,
'120.89.54.245:8080 ' ,
'82.244.233.132:80 ' ,
'187.44.255.234:20183 ' ,
'42.115.91.82:52225 ' ,
'31.28.6.185:8080 ' ,
'113.53.61.118:8080 ' ,
'54.36.46.110:8080 ' ,
'178.33.178.217:80 ' ,
'165.227.188.89:80 ' ,
'45.124.145.34:8080 ' ,
'5.128.60.74:3128 ' ,
'82.208.107.218:8080 ' ,
'216.198.170.70:8080 ' ,
'176.62.178.62:8080 ' ,
'111.230.32.95:3128 ' ,
'154.48.196.1:8080 ' ,
'200.167.191.117:20183' ,
'81.18.214.62:8080 ' ,
'139.162.72.63:80 ' ,
'5.59.54.14:8080 ' ,
'85.204.137.218:8181 ' ,
'14.139.189.211:3128 ' ,
'192.99.160.45:8080 ' ,
'201.17.130.107:8080 ' ,
'94.177.254.54:80 ' ,
'95.67.164.35:8080 ' ,
'103.234.94.249:8080 ' ,
'120.55.53.109:3128 ' ,
'109.224.1.210:80 ' ,
'189.1.7.25:20183 ' ,
'77.82.242.38:8080 ' ,
'154.113.86.75:3128 ' ,
'187.32.243.30:8080 ' ,
'81.5.93.14:8080 ' ,
'176.31.125.111:80 ' ,
'5.40.80.44:8080 ' ,
'84.54.222.243:8080 ' ,
'13.125.196.161:80 ' ,
'50.195.207.133:8080 ' ,
'91.106.71.131:8080 ' ,
'66.70.147.196:3128 ' ,
'80.211.28.56:8080 ' ,
'103.73.224.194:8080 ' ,
'149.28.140.138:3128 ' ,
'187.85.83.2:8080 ' ,
'43.224.119.218:8080 ' ,
'103.85.150.154:8080 ' ,
'39.104.77.15:8080 ' ,
'37.144.154.98:8080 ' ,
'51.38.131.129:3128 ' ,
'182.253.191.114:8080 ' ,
'149.28.111.13:3128 ' ,
'37.235.67.3:8080 ' ,
'173.199.90.133:8080 ' ,
'31.44.94.21:8080 ' ,
'82.213.59.90:8080 ' ,
'89.169.88.169:8080 ' ,
'209.190.4.117:80 ' ,
'217.182.92.162:3128 ' ,
'212.49.84.113:65103 ' ,
'187.12.59.74:8080 ' ,
'92.154.124.125:8080 ' ,
'198.50.168.210:80 ' ,
'95.107.94.182:8080' ,
'95.78.121.173:8080' ,
'46.44.33.192:8081 ' ,
'27.98.206.185:3128' ,
'197.255.255.91:8080 ' ,
'94.177.228.130:80 ' ,
'50.93.200.237:2018' ,
'213.108.170.175:8081' ,
'31.46.236.6:8080 ' ,
'195.34.241.85:8080 ' ,
'180.246.77.31:3128 ' ,
'41.215.26.182:8080 ' ,
'5.189.162.175:3128 ' ,
'194.28.61.82:41258 ' ,
'81.217.94.83:8080 ' ,
'159.65.45.64:3128 ' ,
'80.211.37.110:3128 ' ,
'37.200.224.179:8080 ' ,
'85.199.71.121:8080 ' ,
'103.234.255.102:8080' ,
'187.32.157.209:8080 ' ,
'90.182.152.44:80 ' ,
'80.82.55.71:8080 ' ,
'200.233.136.177:2018' ,
'185.20.45.48:41258 ' ,
'47.17.62.181:808 ' ,
'36.67.226.47:31773 ' ,
'203.201.172.92:3128 ' ,
'115.124.75.228:3128 ' ,
'139.0.28.210:8080 ' ,
'91.185.47.156:8080 ' ,
'121.184.72.203:8080 ' ,
'109.233.23.178:8080 ' ,
'201.49.66.97:92 ' ,
'67.43.113.218:8080 ' ,
'110.232.87.137:89 ' ,
'178.128.214.14:3128 ' ,
'38.103.238.1:40348 ' ,
'66.181.166.140:8080 ' ,
'85.109.124.130:8080 ' ,
'8.9.5.163:8080 ' ,
'177.4.173.242:80 ' ,
'103.254.127.133:88 ' ,
'167.99.93.3:8080 ' ,
'177.72.5.121:8080 ' ,
'170.83.3.27:8080 ' ,
'85.109.95.190:9090' ,
'80.211.26.180:8080' ,
'200.178.16.139:20183' ,
'125.165.23.121:8080 ' ,
'103.105.84.2:8080 ' ,
'36.73.85.122:8080 ' ,
'200.11.228.86:3128' ,
'180.250.149.73:8080 ' ,
'45.118.34.93:8080 ' ,
'45.63.76.167:8080 ' ,
'187.87.39.34:8080 ' ,
'89.203.133.84:9999' ,
'115.87.251.5:8080 ' ,
'190.52.130.32:8080 ' ,
'178.128.108.182:8080' ,
'109.110.42.210:41258' ,
'92.241.15.86:8080 ' ,
'62.213.87.170:8080 ' ,
'188.126.35.204:41258' ,
'217.107.71.14:8080 ' ,
'54.39.46.86:3128 ' ,
'187.95.236.212:8080 ' ,
'180.250.252.3:8080 ' ,
'98.190.250.150:48678' ,
'5.128.26.77:8080 ' ,
'89.36.221.125:3128 ' ,
'200.8.98.4:9000 ' ,
'195.69.217.15:8080 ' ,
'91.239.55.167:8090 ' ,
'59.103.254.36:8080 ' ,
'164.138.193.123:3128' ,
'177.21.109.66:20183 ' ,
'173.249.41.161:3128 ' ,
'62.140.224.18:41258 ' ,
'45.35.55.81:8118 ' ,
'180.246.205.26:8080 ' ,
'132.255.155.154:8080' ,
'91.194.42.51:80 ' ,
'5.45.127.12:3128 ' ,
'47.97.166.158:3128 ' ,
'83.219.159.165:41258' ,
'217.194.255.217:3128' ,
'158.69.118.104:3128 ' ,
'97.72.128.134:87 ' ,
'36.89.192.243:8080' ,
'36.67.239.23:8080 ' ,
'158.69.206.181:8888 ' ,
'204.133.187.66:3128 ' ,
'188.166.175.238:80 ' ,
'83.69.245.243:8080 ' ,
'181.129.41.60:8080 ' ,
'177.66.119.21:3128 ' ,
'81.30.211.51:41258 ' ,
'77.247.161.182:8081 ' ,
'118.24.121.231:3128 ' ,
'140.227.53.72:3129 ' ,
'45.76.230.5:8080 ' ,
'195.122.236.246:8080' ,
'101.51.138.3:8080 ' ,
'41.215.127.90:8080 ' ,
'80.71.163.100:3128 ' ,
'158.58.132.33:41258 ' ,
'203.161.10.206:8080 ' ,
'212.56.139.253:80 ' ,
'81.17.131.61:8080 ' ,
'37.18.35.18:3128 ' ,
'85.15.179.5:8080 ' ,
'187.123.94.92:3128 ' ,
'103.215.201.121:8080' ,
'178.32.181.66:3128 ' ,
'39.104.79.89:8080 ' ,
'95.78.229.90:8080 ' ,
'93.126.15.8:8080 ' ,
'91.203.240.210:80 ' ,
'189.109.140.245:8080' ,
'80.211.169.186:80 ' ,
'98.142.237.108:80 ' ,
'177.184.139.213:8080' ,
'67.229.141.186:3128 ' ,
'87.175.45.101:80 ' ,
'93.126.28.117:8080 ' ,
'195.178.207.241:80 ' ,
'178.209.25.139:8080 ' ,
'79.120.177.106:8080 ' ,
'131.72.126.182:3128 ' ,
'82.149.221.190:8080 ' ,
'217.174.187.74:41258' ,
'178.128.222.54:3128 ' ,
'170.231.52.130:6666 ' ,
'181.64.25.201:3128 ' ,
'18.208.212.240:80 ' ,
'52.169.139.131:80 ' ,
'92.242.214.136:8080 ' ,
'177.71.77.202:20183 ' ,
'185.53.152.189:41258' ,
'167.99.193.171:3128 ' ,
'188.120.228.19:80 ' ,
'186.148.191.99:31773' ,
'138.197.170.108:80 ' ,
'52.23.193.25:3128 ' ,
'54.196.211.212:9050 ' ,
'82.112.188.14:8080 ' ,
'81.30.220.232:41258 ' ,
'31.179.179.50:8080 ' ,
'186.195.228.18:20183' ,
'84.208.164.141:8080 ' ,
'186.151.74.26:8080 ' ,
'78.81.24.112:80 ' ,
'171.244.32.140:8080 ' ,
'194.187.148.141:4125' ,
'70.169.150.235:48678' ,
'178.57.50.95:44331 ' ,
'83.238.4.86:8080 ' ,
'177.75.161.206:3128 ' ,
'103.250.157.43:6666 ' ,
'64.58.194.130:41258 ' ,
'46.183.119.212:8080 ' ,
'94.253.14.22:8080 ' ,
'203.77.224.186:63909' ,
'159.65.117.97:3128 ' ,
'124.120.185.162:80 ' ,
'197.243.34.228:3128 ' ,
'186.208.111.145:2018' ,
'150.129.54.102:6666 ' ,
'188.126.55.83:41258 ' ,
'41.90.104.38:8080 ' ,
'94.156.59.49:8181 ' ,
'94.231.174.140:22341' ,
'204.8.219.165:41258 ' ,
'87.98.156.220:8080 ' ,
'81.163.60.88:41258 ' ,
'43.228.245.164:80 ' ,
'91.185.237.71:8080 ' ,
'179.109.158.98:3128 ' ,
'196.22.249.124:80 ' ,
'35.184.109.90:9000 ' ,
'80.94.162.58:8888 ' ,
'125.62.26.197:3128 ' ,
'192.41.140.67:80 ' ,
'182.72.68.39:80 ' ,
'70.65.233.174:8080 ' ,
'200.252.165.226:20183 ' ,
'175.184.231.126:808' ,
'190.5.99.94:3128' ,
'54.39.16.236:31289 ' ,
'84.21.227.187:8080 ' ,
'189.8.89.250:20183'];
	
