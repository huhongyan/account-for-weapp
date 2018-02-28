const { mysql } = require('../qcloud')
const debug = require('debug')('koa-weapp-demo')

async function add(ctx, next) {

  const userinfo = ctx.state.$wxInfo.userinfo,
    openId = userinfo && userinfo['openId'];

  if (openId) {

    const params = ctx.request.body;
    params['open_id'] = openId;

    await mysql('cWish').insert(params).then(function (resp) {
      ctx.state.data = {
        id: resp[0]
      }
      ctx.state.code = 1
    }).catch(function (err) {
      ctx.state.code = -1
      debug('Catch Error: %o', err)
    });

  } else {
    ctx.state.code = -1
  }
}

async function getList(ctx, next) {
  const userinfo = ctx.state.$wxInfo.userinfo,
    openId = userinfo && userinfo['openId'];

  if (openId) {
    
    let list = await mysql('cWish').select().where({ 'open_id': openId }).orderBy('create_time', 'desc');

    ctx.state.code = 1;
    ctx.state.data = list;

  } else {
    ctx.state.code = -1;
    ctx.state.message = "账号未登录";
  }
}

module.exports = {
  add,
  getList
}