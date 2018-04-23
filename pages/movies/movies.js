var util = require('../../utils/util.js')
var app = getApp();
Page({
  // RESTFul API JSON
  // SOAP XML
  //粒度 不是 力度
  data: {
    inTheaters: {}, // 也可不先声明
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false,
  },

  onLoad: function (event) {
    var inTheatersUrl = app.globalData.doubanBase + '/v2/movie/in_theaters' + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon' + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + '/v2/movie/top250' + "?start=0&count=3";
    this.getMovieListData(inTheatersUrl, 'inTheaters', '正在热映');
    this.getMovieListData(comingSoonUrl, 'comingSoon', '即将上映');
    this.getMovieListData(top250Url, 'top250', '豆瓣top250');
  },

  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category
    })
  },
  // 跳转到详情
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: "movie-detail/movie-detail?id=" + movieId
    })
    // var movieId = event.currentTarget.dataset.movieid;
    // wx.navigateTo({
    //   url: "movie-detail/movie-detail?id=" + movieId
    // })
  },
  // 请求数据
  getMovieListData: function (url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'json'
      },
      success: function (res) {
        that.processDoubanData(res.data, settedKey, categoryTitle);
      },
      // 网络出错时
      fail: function () {
        console.log('fail')
      }
    })
  },

  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      // searchResult: {}
    })
  },

  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  onBindBlur: function (event) {
    console.log('blur')
    // var text = event.detail.value;
    // var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    // this.getMovieListData(searchUrl, "searchResult", "");
  },
  onBindConfirm: function (event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    // 调用搜索接口
    this.getMovieListData(searchUrl, 'searchResult', '');
  },
  // 处理数据
  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
    var movies = [];
    moviesDouban.subjects.forEach(function (item, i) {
      var title = item.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + '...';
      }
      var temp = {
        title: title,
        average: item.rating.average,
        stars: util.convertToStarsArray(item.rating.average / 2),
        coverageUrl: item.images.large,
        movieId: item.id,
      }
      // 存入数组
      movies.push(temp);
    });

    // 储存数据
    var readyData = {};
    // 为了父子绑定的数据变量名一致，统一为movies变量
    readyData[settedKey] = {
      movies: movies,
      categoryTitle: categoryTitle
    };
    this.setData(readyData);
  }
})