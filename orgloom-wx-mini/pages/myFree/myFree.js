const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
import api from '../../api/api';
import biz from '../../utils/biz';

const _ = db.command;
Page({
      data: {
            college: JSON.parse(config.data).college,
            collegeCur: -2,
            showList: false,
            scrollTop: 0,
            id: 0,
            nomore: false,
            list: [],
            navList:[{"name":"附近","id":0},{"name":"关注","id":1},{"name":"最热","id":2},{"name":"IT","id":3},{"name":"制造","id":4},{"name":"医疗","id":5},{"name":"设计","id":6},{"name":"地产","id":7},{"name":"金融","id":8}],
            scrollLeft: 0,
            scrollTop: 0,
            scrollHeight: 0,
            pagination:{},
            size:15,
            show:false,
            clickId:'',
            actions: [
                  {
                    name: '查看',
                  },
                  {
                    name: '编辑',
                  }
            ]
      },

      onShowActionSheet(e){
            console.log("----action -img----",e.currentTarget.dataset.id)
            this.setData({
                  show:true,
                  clickId:e.currentTarget.dataset.id
            })
      },

      onClose() {
            this.setData({ show: false });
          },
        
      onSelect(event) {
      console.log(event.detail);
            if(event.detail.name=='查看'){
                  console.log("----into---查看",this.data.clickId);
                  wx.navigateTo({
                        url: '/pages/free/freeView?id='+this.data.clickId             
                   })

            } else if(event.detail.name=='编辑'){
                  console.log("----into---编辑",this.data.clickId);

                  wx.navigateTo({
                        url: '/pages/editInfo/editInfo?id='+this.data.clickId                 
                   })
                  
            }

      },


      tapItem(e) {
            var item = e.currentTarget.dataset.id
            console.log("---click person---",item.id);
            let that = this;
            wx.navigateTo({
                  url: '/pages/search/search',
            })

            // wx.navigateTo({
            //       url: '/pages/stock/stock?id=' +item.id+'&&name='+item.name
            // })
      
          //  this.triggerEvent('tapitem', { itemid: id }, { bubbles: true, composed: true });
      
      
          },

      clickTag(){
            wx.switchTab({
                  url: '/pages/start/start',
                });
      },
        //获取公司列表
  async listMyFree(cateId,page) {

if(biz.checkLogin()){
      let that=this;

      const json = await api.listMyFree({
        method:"post",
        query: {
              userId:wx.getStorageSync("userInfo").id
        }
      });
  
      console.log("listMyfree:"+JSON.stringify(json));
  
      if (json.code == 1000) {
            // this.pagination=json.data.pagination;

            // let totalPage=this.pageTotal ( this.pagination.total ,  this.pagination.size);
            // this.pages=totalPage;
            for(var i = 0; i < json.data.length; i++){
  
                  json.data[i].firstName=  json.data[i].freeName.substring(0,1);
            
             }

        
          this.setData({
          list: that.data.list.concat( json.data),
        
        });

       
   
  
      } else {}
} else{

                        var comp = this.selectComponent(".login")
                        if (comp) {
                              comp.show()
                              } else {
                              console.log("fatal:can't find login dialog")
                        }
                        return  
                  }
    },

    pageTotal(rowCount, pageSize) {  
      if (rowCount == null || rowCount == "") {
      return 0;
      } else {
              if (pageSize != 0 && rowCount % pageSize == 0) {
              return parseInt(rowCount / pageSize);          
              }  

              if (pageSize != 0 && rowCount % pageSize != 0) {
              return parseInt(rowCount / pageSize) + 1;
              }
      }
},


    
      onLoad(option) {
      //     this.listkind();
      //      this.getbanner();
      //      this.getList();
       //     console.log("option  id--"+option.code);
       /*
       console.log("app.global.code"+app.globalData.code);
       if (app.globalData.code=='2001') {
            wx.showModal({
                  title: '温馨提示',
                  content: '请首先完善个人基本信息',
                  success(res) {
                        if (res.confirm) {
                              wx.navigateTo({
                                    url: '/pages/editInfo/add',
                              })
                        }
                  }
            })
            app.globalData.code = '2002';

      }
      */
            
            this.listMyFree();
      },
      //监测屏幕滚动
      onPageScroll: function(e) {
            this.setData({
                  scrollTop: parseInt((e.scrollTop) * wx.getSystemInfoSync().pixelRatio)
            })
      },
      //获取上次布局记忆
      listkind() {
            let that = this;
            wx.getStorage({
                  key: 'iscard',
                  success: function(res) {
                        that.setData({
                              iscard: res.data
                        })
                  },
                  fail() {
                        that.setData({
                              iscard: true,
                        })
                  }
            })
      },
      //布局方式选择
      changeCard() {
            let that = this;
            if (that.data.iscard) {
                  that.setData({
                        iscard: false
                  })
                  that.setData({
                        college: JSON.parse(config.data).college,

                  })
                  this.listUser("0");

                  wx.setStorage({
                        key: 'iscard',
                        data: false,
                  })
            } else {
                  that.setData({
                        iscard: true
                  })

                  that.setData({
                        college: JSON.parse(config.data).collegeMan,

                  })

                  this.listUser ("1");
                  wx.setStorage({
                        key: 'iscard',
                        data: true,
                  })
            }
      },
      //跳转搜索
      search() {
            wx.navigateTo({
                  url: '/pages/search/search',
            })
      },
      //学院选择
      collegeSelect(e) {
            this.setData({
                  collegeCur: e.currentTarget.dataset.id - 1,
                  scrollLeft: (e.currentTarget.dataset.id - 3) * 100,
                  showList: false,
            })
            this.getList();
      },
      //选择全部
      selectAll() {
            this.setData({
                  collegeCur: -2,
                  scrollLeft: -200,
                  showList: false,
            })
            this.getList();
      },
      //展示列表小面板
      showlist() {
            let that = this;
            if (that.data.showList) {
                  that.setData({
                        showList: false,
                  })
            } else {
                  that.setData({
                        showList: true,
                  })
            }
      },
      getList() {
            let that = this;
            if (that.data.collegeCur == -2) {
                  var collegeid = _.neq(-2); //除-2之外所有
            } else {
                  var collegeid = that.data.collegeCur + '' //小程序搜索必须对应格式
            }
            db.collection('publish').where({
                  status: 0,
                  dura: _.gt(new Date().getTime()),
                  collegeid: collegeid
            }).orderBy('creat', 'desc').limit(20).get({
                  success: function(res) {
                        wx.stopPullDownRefresh(); //暂停刷新动作
                        if (res.data.length == 0) {
                              that.setData({
                                    nomore: true,
                                    list: [],
                              })
                              return false;
                        }
                        if (res.data.length < 20) {
                              that.setData({
                                    nomore: true,
                                    page: 0,
                                    list: res.data,
                              })
                        } else {
                              that.setData({
                                    page: 0,
                                    list: res.data,
                                    nomore: false,
                              })
                        }
                  }
            })
      },
      more() {

            let that = this;
            console.log("---more---",this.pagination);
            let totalPage=this.pageTotal ( this.pagination.total ,  this.pagination.size);

            if (this.pagination.page >= totalPage) {
                  return false
            }else{
            console.log("---more--1-");
            let page = this.pagination.page+ 1;

            that.listUser(that.data.id,page);

            }
            /*
            let that = this;
            if (that.data.nomore || that.data.list.length < 20) {
                  return false
            }
            let page = that.data.page + 1;
            if (that.data.collegeCur == -2) {
                  var collegeid = _.neq(-2); //除-2之外所有
            } else {
                  var collegeid = that.data.collegeCur + '' //小程序搜索必须对应格式
            }
            db.collection('publish').where({
                  status: 0,
                  dura: _.gt(new Date().getTime()),
                  collegeid: collegeid
            }).orderBy('creat', 'desc').skip(page * 20).limit(20).get({
                  success: function(res) {
                        if (res.data.length == 0) {
                              that.setData({
                                    nomore: true
                              })
                              return false;
                        }
                        if (res.data.length < 20) {
                              that.setData({
                                    nomore: true
                              })
                        }
                        that.setData({
                              page: page,
                              list: that.data.list.concat(res.data)
                        })
                  },
                  fail() {
                        wx.showToast({
                              title: '获取失败',
                              icon: 'none'
                        })
                  }
            })
            */
      },
      onReachBottom() {
            this.more();
      },
      //下拉刷新
      onPullDownRefresh() {
            this.setData({
                  list:[]
            })
            this.listUser("0",1);
            wx.stopPullDownRefresh();

      },
      gotop() {
            wx.pageScrollTo({
                  scrollTop: 0
            })
      },
      //跳转详情
      detail(e) {
            let that = this;
            wx.navigateTo({
                  url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
            })
      },
      //获取轮播
      getbanner() {
            let that = this;
            db.collection('banner').where({}).get({
                  success: function(res) {
                        that.setData({
                              banner: res.data[0].list
                        })
                  }
            })
      },
      //跳转轮播链接
      goweb(e) {
            if (e.currentTarget.dataset.web){
                  wx.navigateTo({
                        url: '/pages/web/web?url='+e.currentTarget.dataset.web.url,
                  })
            }
      },
      onShareAppMessage() {
            return {
                  title: JSON.parse(config.data).share_title,
                  imageUrl: JSON.parse(config.data).share_img,
                  path: '/pages/index/index'
            }
      },

      switchCate: function(event) {
            if (this.data.id == event.currentTarget.dataset.id) {
              return false;
            }
            var that = this;
            var clientX = event.detail.x;
            var currentTarget = event.currentTarget;
            if (clientX < 60) {
              that.setData({
                scrollLeft: currentTarget.offsetLeft - 60
              });
            } else if (clientX > 330) {
              that.setData({
                scrollLeft: currentTarget.offsetLeft
              });
            }
            this.setData({
              id: event.currentTarget.dataset.id
            });
        
        //    this.getCategoryInfo();
          },

            //跳转具体页面
  gotoStockDetail: function (event) {
      var stockName = event.currentTarget.dataset.stockName;
      var stockId = event.currentTarget.dataset.stockId;
      wx.navigateTo({
        url: '/pages/stock/stock?name=' + stockName + '&id=' + stockId,
      });
    },

})