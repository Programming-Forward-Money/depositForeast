//index.js

Page({
  data: {
    projects : [],
    date: "2019-01-01"
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
    }else{
      wx.showToast({
        title: '请填写值',
        icon: 'loading',
        duration: 1000
      })
    }    
  },
  remove : function(e){
    this.data.projects.splice(e.currentTarget.dataset.index,1);
    this.setData({ "projects": this.data.projects })
  },
  goto:function(){
    // 跳转之前，将项目集合保存下来
    wx.setStorageSync('projects', JSON.stringify(this.data.projects))
    wx.navigateTo({
      url: '../main/main'
    })
  }
})
