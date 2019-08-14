import Vue from 'vue'
import CryptoJS from 'crypto-js'
// 默认的 KEY 与 iv 如果没有给
const KEY = CryptoJS.enc.Utf8.parse("8a7cd3044f354684");
const IV = CryptoJS.enc.Utf8.parse('8a7cd3044f354684');

export default {

  encrypt (word, keyStr, ivStr) { // 加密

    let key = KEY
    let iv = IV

    if (keyStr) {
      key = CryptoJS.enc.Utf8.parse(keyStr);
      iv = CryptoJS.enc.Utf8.parse(ivStr);
    }

    let srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    });
    // console.log("-=-=-=-", encrypted.ciphertext)
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);

  },

  decrypt (word, keyStr, ivStr) { // 解密

    let key  = KEY
    let iv = IV

    if (keyStr) {
      key = CryptoJS.enc.Utf8.parse(keyStr);
      iv = CryptoJS.enc.Utf8.parse(ivStr);
    }

    let base64 = CryptoJS.enc.Base64.parse(word);
    let src = CryptoJS.enc.Base64.stringify(base64);

    var decrypt = CryptoJS.AES.decrypt(src, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    });

    var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();

  },
  set(key,value){
    let curTime = new Date().getTime()
    console.log("存储的时候的时间是:"+curTime+",KEY值是:"+key)
    let dataObj = {data:value,time:curTime}
    window.localStorage.setItem(JSON.stringify(key),JSON.stringify(dataObj));
  },
  get(key){
    let data = window.localStorage.getItem(JSON.stringify(key));
    let dataObj = JSON.parse(data);
    console.log(dataObj)
    console.log(dataObj);
    if ((new Date().getTime() - dataObj.time)>(1000*60*60*24*7)) {
      //localStorage.removeItem(JSON.stringify(key))
      console.log('信息已过期');
    }else{
      let value = dataObj.data
      console.log("取出的value值是:"+value)
      return value;
    }
  },
  clearKey(key){
    localStorage.removeItem(JSON.stringify(key))  //单独清除key
  },
  clearKeys(){
    window.localStorage.clear();    //localStorage全清
  }


}
