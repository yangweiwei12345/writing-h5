const app = getApp();

Component({
  options: { addGlobalClass: true },
  data: {
    selected: 0,
    color: "#999",
    selectedColor: "#ED1843",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/resource/nav/home.png",
      selectedIconPath: "/resource/nav/home_active.png",
      text: "作品广场",
      isSpecial: false
    },
    {
      pagePath: "/pages/course/index",
      iconPath: "/resource/nav/center.png",
      selectedIconPath: "/resource/nav/center_active.png",
      text: "上课学习",
      isSpecial: false
    },
    {
      pagePath: "/pages/shop/index",
      iconPath: "/resource/nav/shop.png",
      selectedIconPath: "/resource/nav/shop_active.png",
      text: "积分商城",
      isSpecial: false

    },
    {
      pagePath: "/pages/my/index",
      iconPath: "/resource/nav/my.png",
      selectedIconPath: "/resource/nav/my_active.png",
      text: "个人中心",
      isSpecial: false
    }],
    //适配IphoneX的屏幕底部横线
    isIphoneX: app.globalData.isIphoneX
  },
  attached() {},
  methods: {
    switchTab(e) {
      console.log(e);
      const dataset = e.currentTarget.dataset
      const path = dataset.path
      const index = dataset.index
      //如果是特殊跳转界面
      if (this.data.list[index].isSpecial) {
        wx.navigateTo({
          url: path
        })
      } else {
        //正常的tabbar切换界面
        wx.switchTab({
          url: path
        });
        console.log(index, path);
        this.setData({
          selected: index
        })
      }
    }
  }
})