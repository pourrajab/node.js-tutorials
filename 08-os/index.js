const os = require("os");
///این ماژول اطلاعات سیستم کاربر را دریافت می کند
const currentOs = {
  name: os.type(),
  arch: os.arch(),
  platform: os.platform(),
  release: os.release(),
  version: os.version(),
};
console.log(currentOs);
console.log(os.uptime());
console.log(os.userInfo());
console.log(os.totalmem());
console.log(os.freemem());
