import api from '../../api/api';
import * as echarts from '../../ec-canvas/echarts';
const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;


function initChart(canvas, width, height, dpr) {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      canvas.setChart(chart);
      console.log("-----ecchart-----");
      var data = [];
      var data2 = [];
    
      for (var i = 0; i < 10; i++) {
        data.push(
          [
            Math.round(Math.random() * 100),
            Math.round(Math.random() * 100),
            Math.round(Math.random() * 40)
          ]
        );
        data2.push(
          [
            Math.round(Math.random() * 100),
            Math.round(Math.random() * 100),
            Math.round(Math.random() * 100)
          ]
        );
      }
    
      var axisCommon = {
        axisLabel: {
          textStyle: {
            color: '#C8C8C8'
          }
        },
        axisTick: {
          lineStyle: {
            color: '#fff'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#C8C8C8'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#C8C8C8',
            type: 'solid'
          }
        }
      };
    
      var option = {
        color: ["#FF7070", "#60B6E3"],
        backgroundColor: '#fff',
        xAxis: axisCommon,
        yAxis: axisCommon,
        legend: {
          data: ['aaaa', 'bbbb']
        },
        visualMap: {
          show: false,
          max: 100,
          inRange: {
            symbolSize: [20, 70]
          }
        },
        series: [{
          type: 'scatter',
          name: 'aaaa',
          data: data
        },
        {
          name: 'bbbb',
          type: 'scatter',
          data: data2
        }
        ],
        animationDelay: function (idx) {
          return idx * 50;
        },
        animationEasing: 'elasticOut'
      };
    
    
      chart.setOption(option);
      return chart;
    }

    

Page({

      /**
       * ?????????????????????
       */
      data: {
            first_title: true,
            place: '',
            ec: {
                  onInit: initChart
                },
            /*
            photos:['http://img1.imgtn.bdimg.com/it/u=1915011011,2156126360&fm=26&gp=0.jpg',
            'http://img1.imgtn.bdimg.com/it/u=1915011011,2156126360&fm=26&gp=0.jpg',
            'http://img1.imgtn.bdimg.com/it/u=1915011011,2156126360&fm=26&gp=0.jpg'],
            */
            photos:'',
            show: false,
            personDetail:'',
            company:{},
            itemShow: [{name: 'A',value: '?????????'},{name: 'B',value: '?????????'},
            {name: 'C',value: '????????????'},{name: 'D',value: '??????'},
            {name: 'E',value: '??????'},{name: 'F',value:'??????'},{name: 'G',value: '??????'},{name: 'H',value: '??????'}],
            itemYou: [{name: 'A',value: '??????'},{name: 'B',value: '?????????'},
            {name: 'C',value: '?????????'},{name: 'D',value: '?????????'}]
      },

      showPopup() {
            this.setData({ show: true });
          },
        
          onClose() {
            this.setData({ show: false });
          }
          ,


  async getPerson(id) {
      const json = await api.getPersonDetail({
        query: {
          id:id
      }
      });
  
      console.log("getPersonDetail:"+JSON.stringify(json));
  
      if (json.code == 1000) {

                  

            // for(var j=0; j<json.data.friendshow.split(",").length;j++){

            //       for(var i=0; i<this.data.itemShow.length;i++){
            //           if(json.data.friendshow.split(",")[j]==this.data.itemShow[i].name){
            //                 if(typeof(json.data.friendShowValue)!="undefined"){
            //           json.data.friendShowValue=   json.data.friendShowValue+","+this.data.itemShow[i].value;
            //                 }else{
            //                   json.data.friendShowValue=this.data.itemShow[i].value; 
            //                 }
            //           }
            //            }
            //     }
          
            //     for(var m=0; m<json.data.you.split(",").length;m++){

            //           for(var n=0; n<this.data.itemYou.length;n++){
            //               if(json.data.you.split(",")[m]==this.data.itemYou[n].name){
            //                   if(typeof(json.data.youValue)!="undefined"){
            //               json.data.youValue= json.data.youValue+","+this.data.itemYou[n].value;
            //                   } else{
            //               json.data.youValue= this.data.itemYou[n].value;         
            //                   }
            //               }
            //                }
            //         }


      this.setData({
        personDetail: json.data
      });
  
   
      
      //   // ??????????????????
      //   for(var m=0; m<this.data.countries.length;m++){
      //       if(json.data.education==this.data.countries[m]){
  
                 
      //       }
      //   }
      


  
      } else {}
    },

   async listImage(id) {
      const json = await api.listimageId({
        query: {
             page:0,
             size:0,
             id:id
        }
      });
  
      console.log("listImage:"+JSON.stringify(json));
  
      if (json.code == 200) {
        this.setData({
            photos: json.data.list
      });
       
      /*
       for(var??i = 0; i < json.data.length; i++){
    
       }
       */
  
      } else {}
    },

      onLoad(e) {
      //    this.getuserdetail();
      console.log(" ---person----",e.id);
      let obj=JSON.parse(e.company);
      console.log("------company--",obj);
    
            this.data.id = e.id;

       //     this.listImage(e.id);
          this.getPerson(e.id)

            this.setData({
                  company:obj
            });

      },
      changeTitle(e) {
            let that = this;
            that.setData({
                  first_title: e.currentTarget.dataset.id
            })
      },

      previewPhoto: function (e) {
            console.log("preview photo--"+e.currentTarget.dataset.src);
            wx.previewImage({
                urls: e.currentTarget.dataset.src.split('_'),
                current: e.currentTarget.id
            });
        },

      //??????????????????
      getPublish(e) {
            let that = this;
            db.collection('publish').doc(e).get({
                  success: function(res) {
                        that.setData({
                              collegeName: JSON.parse(config.data).college[parseInt(res.data.collegeid) + 1],
                              publishinfo: res.data
                        })
                        that.getSeller(res.data._openid, res.data.bookinfo._id)
                  }
            })
      },
      //??????????????????
      getSeller(m, n) {
            let that = this;
            db.collection('user').where({
                  _openid: m
            }).get({
                  success: function(res) {
                        that.setData({
                              userinfo: res.data[0]
                        })
                        that.getBook(n)
                  }
            })
      },
      //??????????????????
      getBook(e) {
            let that = this;
            db.collection('books').doc(e).get({
                  success: function(res) {
                        that.setData({
                              bookinfo: res.data
                        })
                  }
            })
      },
      //????????????
      home() {
            wx.switchTab({
                  url: '/pages/index/index',
            })
      },
      //????????????
      buy() {
            let that = this;
            /*
            if (!app.openid) {
                  wx.showModal({
                        title: '????????????',
                        content: '?????????????????????????????????????????????????????????',
                        success(res) {
                              if (res.confirm) {
                                    wx.navigateTo({
                                          url: '/pages/login/login',
                                    })
                              }
                        }
                  })
                  return false
            }
            if (that.data.publishinfo.deliveryid == 1) {
                  if (that.data.place == '') {
                        wx.showToast({
                              title: '???????????????????????????',
                              icon: 'none'
                        })
                        return false
                  }
                  that.getStatus();
            }
            */
            that.getStatus();
      },
      //??????????????????
      getStatus() {
            let that = this;
            let _id = that.data.publishinfo._id;
            that.paypost();

            /*
            db.collection('publish').doc(_id).get({
                  success(e) {
                        if (e.data.status == 0) {
                              that.paypost();
                        } else {
                              wx.showToast({
                                    title: '????????????????????????~',
                                    icon: 'none'
                              })
                        }
                  }
            })*/
      },
      //????????????
      paypost() {
            let that = this;
            wx.showLoading({
                  title: '????????????',
            });
            // ???????????????????????????????????????????????????
            wx.cloud.callFunction({
                  name: 'pay',
                  data: {
                        $url: "pay", //?????????????????????
                        goodId: that.data.publishinfo._id
                  },
                  success: res => {
                        wx.hideLoading();
                        that.pay(res.result)
                  },
                  fail(e) {
                        wx.hideLoading();
                        wx.showToast({
                              title: '?????????????????????????????????????????????',
                              icon: 'none'
                        })
                  }
            });
      },
      //?????????????????????
      pay(payData) {
            let that = this;
            //???????????????????????????
            wx.requestPayment({
                  timeStamp: payData.timeStamp,
                  nonceStr: payData.nonceStr,
                  package: payData.package, //??????????????????????????? prepay_id ????????????prepay_id=***
                  signType: 'MD5',
                  paySign: payData.paySign, //??????
                  success(res) {
                        that.setStatus();
                  },
            })
      },
      //????????????????????????
      setStatus() {
            let that = this
            wx.showLoading({
                  title: '????????????',
            })
            // ???????????????????????????????????????????????????
            wx.cloud.callFunction({
                  name: 'pay',
                  data: {
                        $url: "changeP", //?????????????????????
                        _id: that.data.publishinfo._id,
                        status: 1
                  },
                  success: res => {
                        console.log('????????????????????????')
                        that.creatOrder();
                  },
                  fail(e) {
                        wx.hideLoading();
                        wx.showToast({
                              title: '???????????????????????????????????????????????????',
                              icon: 'none'
                        })
                  }
            })
      },
      //????????????
      creatOrder() {
            let that = this;
            db.collection('order').add({
                  data: {
                        creat: new Date().getTime(),
                        status: 1, //0?????????1???????????????????????????????????????2????????????????????????????????????3????????????????????????????????????
                        price: that.data.publishinfo.price, //??????
                        deliveryid: that.data.publishinfo.deliveryid, //0???1???
                        ztplace: that.data.publishinfo.place, //???????????????
                        psplace: that.data.place, //???????????????????????????
                        bookinfo: {
                              _id: that.data.bookinfo._id,
                              author: that.data.bookinfo.author,
                              edition: that.data.bookinfo.edition,
                              pic: that.data.bookinfo.pic,
                              title: that.data.bookinfo.title,
                        },
                        seller: that.data.publishinfo._openid,
                        sellid: that.data.publishinfo._id,
                  },
                  success(e) {
                        that.history('????????????', that.data.publishinfo.price, 2, e._id)
                  },
                  fail() {
                        wx.hideLoading();
                        wx.showToast({
                              title: '???????????????????????????????????????????????????',
                              icon: 'none'
                        })
                  }
            })
      },
      //??????
      go(e) {
            wx.navigateTo({
                  url: e.currentTarget.dataset.go,
            })
      },
      //????????????
      placeInput(e) {
            this.data.place = e.detail.value
      },
      onShareAppMessage() {
            return {
                  title: '?????????' + this.data.bookinfo.title + '????????????' + this.data.publishinfo.price + '?????????????????????',
                  path: '/pages/detail/detail?scene=' + this.data.publishinfo._id,
            }
      },
      //????????????
      //??????????????????????????????????????????????????????????????????????????????????????????
      history(name, num, type, id) {
            let that = this;
            db.collection('history').add({
                  data: {
                        stamp: new Date().getTime(),
                        type: 1, //1??????2??????
                        name: '????????????',
                        num: num,
                        oid: app.openid,
                  },
                  success: function(res) {
                        db.collection('history').add({
                              data: {
                                    stamp: new Date().getTime(),
                                    type: type, //1??????2??????
                                    name: name,
                                    num: num,
                                    oid: app.openid,
                              },
                              success: function(res) {
                                    wx.hideLoading();
                                    that.sms();
                                    that.tip();
                                    wx.redirectTo({
                                          url: '/pages/success/success?id=' + id,
                                    })
                              }
                        })
                  },
            })
      },
      //????????????
      sms() {
            let that = this;
            wx.cloud.callFunction({
                  name: 'sms',
                  data: {
                        mobile: that.data.userinfo.phone,
                        title: that.data.bookinfo.title,
                  },
                  success: res => {
                        console.log(res)
                  },
            })
      },
      //??????????????????
      tip() {
            let that = this;
            wx.cloud.callFunction({
                  name: 'email',
                  data: {
                        type: 1, //1????????????2????????????
                        email: that.data.userinfo.email,
                        title: that.data.bookinfo.title,
                  },
                  success: res => {
                        console.log(res)
                  },
            })
      },
      //???????????????????????????????????????????????????????????????
      getuserdetail() {
            if (!app.openid) {
                  wx.cloud.callFunction({
                        name: 'regist', // ??????????????????
                        data: {
                              $url: "getid", //?????????????????????
                        },
                        success: re => {
                              db.collection('user').where({
                                    _openid: re.result
                              }).get({
                                    success: function(res) {
                                          if (res.data.length !== 0) {
                                                app.openid = re.result;
                                                app.userinfo = res.data[0];
                                                console.log(app)
                                          }
                                          console.log(res)
                                    }
                              })
                        }
                  })
            }
      },
      //????????????
      creatPoster() {
            let that = this;
            let pubInfo = {
                  id: that.data.publishinfo._id,
                  name: that.data.publishinfo.bookinfo.title,
                  pic: that.data.publishinfo.bookinfo.pic.replace('http', 'https'),
                  origin: that.data.publishinfo.bookinfo.price,
                  now: that.data.publishinfo.price,
            }
            wx.navigateTo({
                  url: "/pages/poster/poster?bookinfo=" + JSON.stringify(pubInfo)
            })
      },
      //??????????????????
      kefuani: function() {
            let that = this;
            let i = 0
            let ii = 0
            let animationKefuData = wx.createAnimation({
                  duration: 1000,
                  timingFunction: 'ease',
            });
            animationKefuData.translateY(10).step({
                  duration: 800
            }).translateY(0).step({
                  duration: 800
            });
            that.setData({
                  animationKefuData: animationKefuData.export(),
            })
            setInterval(function() {
                  animationKefuData.translateY(20).step({
                        duration: 800
                  }).translateY(0).step({
                        duration: 800
                  });
                  that.setData({
                              animationKefuData: animationKefuData.export(),
                        })
                        ++ii;
                  console.log(ii);
            }.bind(that), 1800);
      },
      onReady() {
      //      this.kefuani();
      }
})