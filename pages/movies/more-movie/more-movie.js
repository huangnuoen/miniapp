// pages/movies/more-movie/more-movie.js
var app = getApp()
var util = require('../../../utils/util.js')
Page({
  data: {
    movies: {},
    navigateTitle: "",
    requestUrl: "", // 请求的url
    totalCount: 0, // 当前已经加载的总数
    isEmpty: true, // 当前movies是否为空
  },
  onLoad: function (options) {
    // 获取上级页面的参数
    var category = options.category;
    var category = options.category;
    this.data.navigateTitle = category;
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/coming_soon";
        break;
      case "豆瓣top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
    this.setData({
      requestUrl: dataUrl
    })
    util.http(dataUrl, this.processDoubanData)
  },
  // 上拉刷新加载更多数据 <scroll-view></scroll-view>
  onScrollLower: function (event) {
    // 下次加载的url
    var nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20';
    util.http(nextUrl, this.processDoubanData);
    // 导航loading
    wx.showNavigationBarLoading();
  },
  // 监听下拉刷新
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + '?star=0&count=20';
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
    // 初始化数据
    this.setData({
      movies: {},
      isEmpty: true,
      totalCount: 0
    })
    // this.data.movies = {};
    // this.data.isEmpty = true;
    // this.data.totalCount = 0;
    // util.http(refreshUrl, this.processDoubanData);
    // wx.showNavigationBarLoading();
  },
  // 上滑到底部事件
  onReachBottom(){
    // 下次加载的url
    var nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20';
    util.http(nextUrl, this.processDoubanData);
    // 导航loading
    wx.showNavigationBarLoading();
  },
  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      // [1,1,1,1,1] [1,1,1,0,0]
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    // 所有电影
    var totalMovies = {};
    // 若为空则不是第一次请求，需要合并数据
    if (!this.data.isEmpty) {
      //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
    }
    this.setData({
      movies: totalMovies,
      totalCount: this.data.totalCount + 20,
      isEmpty: false
    });
    // 隐藏loading
    wx.hideNavigationBarLoading();
    // 加载完成停止下拉刷新
    wx.stopPullDownRefresh();
    // wx.hideNavigationBarLoading();
    // wx.stopPullDownRefresh()
  },

  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  },

  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },
})