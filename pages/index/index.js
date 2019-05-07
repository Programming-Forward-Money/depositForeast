//index.js

Page({
  data: {
    pname:'',
    pmny:'',
    curType:0, // 收入/支出
    placeholder:'请输入收入金额',
    btnname:"切为支出",
    projects : [],
    date: "2019-01-01",
    countryCodes: ["1个月", "2个月", "3个月", "4个月", "5个月", "6个月", "7个月", "8个月", "9个月", "10个月", "11个月", "12个月"],
    countryCodeIndex: 0,
    checkboxItems: [
      { name: '支出', value: '0', checked: true }
    ],
  },
  bindCountryCodeChange: function (e) {
    this.setData({
      countryCodeIndex: e.detail.value
    })
  },
  //事件处理函数
  bindViewTap: function() {
   
  },
  onLoad: function () {
    
  },
  getUserInfo: function(e) {
    
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  addProject: function(e){
    let project = {
      "name":e.detail.value.name,
      "cycle": parseInt(e.detail.value.cycle),
      "cycleBase": e.detail.value.cycleBase,
      "mny": parseInt(e.detail.value.mny),
    };

    if (project.name && project.cycle && project.cycleBase && project.mny){
      this.data.projects.push(project)
      this.setData({ "projects":this.data.projects})
      console.log(this.data.projects)
      this.clear()
    }else{
      wx.showModal({
        content: '缺少输入值',
        showCancel: false,
        success: function (res) {
          
        }
      });
    }    
  },
  remove : function(e){
    this.data.projects.splice(e.currentTarget.dataset.index,1);
    this.setData({ "projects": this.data.projects })
  },
  clear : function(){
    this.setData({"pname":"","pmny":""})
  },
  goto:function(){
    // 跳转之前，将项目集合保存下来
    wx.setStorageSync('projects', JSON.stringify(this.data.projects))
    wx.navigateTo({
      url: '../main/main'
    })
  },
  toggle:function(){
    if(this.data.curType == 0){
      this.setData({ "curType": 1,"placeholder":"请输入支出金额","btnname":"切为收入"})
      this.setData({ "pmny": -this.data.pmny })
    }else{
      this.setData({ "curType": 0, "placeholder": "请输入收入金额", "btnname": "切为支出" })
      if (this.data.pmny){
        this.setData({ "pmny": Math.abs(this.data.pmny) })
      }
    }
  },
  changeinput : function(e){
    this.setData({ "pmny": e.detail.value })
    if (this.data.curType == 1) {
      let mny = parseInt(Math.abs(e.detail.value))
      this.setData({"pmny":-mny})
    }
  }
})
