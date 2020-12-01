//app.js
App({
	onLaunch: function () {
		// 展示本地存储能力
		var logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		wx.setStorageSync('logs', logs)

		wx.cloud.init()

		let app = this;

		// 登录
		wx.login({
			success: res => {
				if (res.code) {
					//获取openId
					wx.request({
						url: 'https://api.weixin.qq.com/sns/jscode2session',
						data: {
							//小程序唯一标识
							appid: 'wx07cb15f4e9757dc6',
							//小程序的 app secret
							secret: '5fd3874b2dcb0c125c6ccc69ffb04887',
							grant_type: 'authorization_code',
							js_code: res.code
						},
						method: 'GET',
						header: {
							'content-type': 'application/json'
						},
						success: function (openIdRes) {
							console.info("登录成功返回的openId：" + openIdRes.data.openid);
							app.globalData.openId = openIdRes.data.openid;
							// 判断openId是否获取成功
							if (openIdRes.data.openid != null & openIdRes.data.openid != undefined) {
								// 有一点需要注意 询问用户 是否授权 那提示 是这API发出的
								wx.getUserInfo({
									success: function (data) {
										// 自定义操作
										// 绑定数据，渲染页面
									},
									fail: function (failData) {
										console.info("用户拒绝授权");
									}
								});
							} else {
								console.info("获取用户openId失败");
							}
						},
						fail: function (error) {
							console.info("获取用户openId失败");
							console.info(error);
						}
					})
				}
			}
		})
		// 获取用户信息
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							// 可以将 res 发送给后台解码出 unionId
							this.globalData.userInfo = res.userInfo

							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							// 所以此处加入 callback 以防止这种情况
							if (this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res)
							}
						}
					})
				}
			}
		})
	},
	globalData: {
		openId: null
	}
})