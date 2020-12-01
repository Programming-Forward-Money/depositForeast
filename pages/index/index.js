//index.js
function getToday(){
	let today = new Date()
	return today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
}

Page({
	data: {
		pname: '', //用户输入的
		pmny: '', //用户输入的收支金额
		curType: 0, // 收入指出输入框目前的状态 （0=收入，1=支出）
		placeholder: '请输入收入金额', //收支输入框的palcehodler
		btnname: "切为支出", //收支输入框前面的按钮名称（切为支出/切为收入）
		projects: [], //用户添加完成的的项目数组
		date: getToday(), //用户选择的项目开始日期
		countryCodes: ["1个月", "2个月", "3个月", "4个月", "5个月", "6个月", "7个月", "8个月", "9个月", "10个月", "11个月", "12个月"], //周期枚举
		countryCodeIndex: 0, //用户选择的周期索引
	},
	bindCountryCodeChange: function (e) {
		this.setData({
			countryCodeIndex: e.detail.value
		})
	},
	//"添加项目"按钮触发的方法
	addProject: function (e) {
		let project = {
			"name": e.detail.value.name,
			"cycle": parseInt(e.detail.value.cycle)+1,
			"cycleBase": e.detail.value.cycleBase,
			"mny": parseInt(e.detail.value.mny),
		};

		if (project.name && project.cycle && project.cycleBase && project.mny) {
			this.data.projects.push(project)
			this.setData({
				"projects": this.data.projects
			})
			console.log(this.data.projects)
			this.clear()
			this.saveList();
		} else {
			wx.showModal({
				content: '缺少输入值',
				showCancel: false,
				success: function (res) {

				}
			});
		}
	},
	// 删除按钮触发
	remove: function (e) {
		this.data.projects.splice(e.currentTarget.dataset.index, 1);
		this.setData({
			"projects": this.data.projects
		})
		this.saveList();
	},
	clear: function () {
		this.setData({
			"pname": "",
			"pmny": ""
		})
	},
	// 点击查看结果按钮触发
	goto: function () {
		// 跳转之前，将项目集合保存下来
		wx.setStorageSync('projects', JSON.stringify(this.data.projects))
		wx.navigateTo({
			url: '../main/main'
		})
	},
	//点击切换收入/支出按钮触发
	toggle: function () {
		if (this.data.curType == 0) {
			this.setData({
				"curType": 1,
				"placeholder": "请输入支出金额",
				"btnname": "切为收入"
			})
			if (this.data.pmny) {
				this.setData({
					"pmny": -this.data.pmny
				})
			}
		} else {
			this.setData({
				"curType": 0,
				"placeholder": "请输入收入金额",
				"btnname": "切为支出"
			})
			if (this.data.pmny) {
				this.setData({
					"pmny": Math.abs(this.data.pmny)
				})
			}
		}
	},
	changeinput: function (e) {
		this.setData({
			"pmny": e.detail.value
		})
		if (this.data.curType == 1) {
			let mny = parseInt(Math.abs(e.detail.value))
			this.setData({
				"pmny": -mny
			})
		}
	},
	saveList: function (e) {
		let pj = this.data.projects

		let db = wx.cloud.database()
		let col = db.collection('test')
		col.where({_openid:getApp().globalData.openId}).get().then(res => {
			if(res.data && res.data.length > 0){
				console.log('1')
				col.doc(res.data[0]['_id']).update({
					data: {
						projects : pj
					},
					success: function (res) {
						// wx.showToast({
						//   title: '保存成功！',
						// })
					}
				})
			}else{
				console.log('2')
				col.add({
					data: {
						projects : pj
					},
					success: function (res) {
						// wx.showToast({
						// 	title: '保存成功！',
						//   })
					}
				})
			}
		});
	},
	//事件处理函数
	bindViewTap: function () {

	},
	onLoad: function () {
		console.log('123')
		let db = wx.cloud.database()
		let indexThis = this;
		db.collection('test').where({_openid:getApp().globalData.openId}).get().then(res => {
			console.log(res)
			indexThis.setData({
				"projects": res.data[0].projects
			})
		})
	},
	getUserInfo: function (e) {

	},
	onPullDownRefresh: function(){
		this.onLoad();
		wx.stopPullDownRefresh()
	},
	bindDateChange: function (e) {
		this.setData({
			date: e.detail.value
		})
	}
})