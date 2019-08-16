//***************定义一些全局的变量*********************//
//该配置是后台授权中心的代码
//const ssoserverpath='https://localhost:9999/api/client/'    //用https方式访问
const ssoserverpath='http://localhost:10000/api/client/'      //用http方式访问
//该配置是后台业务服务的访问地址
//const serverpath='https://localhost:9999/api/server/'       //用https方式访问
const serverpath='http://localhost:10000/api/server/'         //用http方式访问

const userInfo = {}
export default{
  serverpath,
  ssoserverpath,
  userInfo,

}
