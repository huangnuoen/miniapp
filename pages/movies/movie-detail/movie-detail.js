import {
  Movie
} from './class/Movie'
var app = getApp();
Page({
  data: {
    movie: {}
  },
  onLoad: function (options) {
    var movieId = options.id;
    var url = app.globalData.doubanBase +
      "/v2/movie/subject/" + movieId;
    var movie = new Movie(url);
    // 获取数据是异步的，需要在回调中赋值
    movie.getMovieData( (movie) => {
      this.setData({
        movie: movie
      })
    });
    console.log(movie);

    // util.http(url, this.processDoubanData);
    // 
    // var movie = new Movie(url);
    // var movieData = movie.getMovieData();
    // var that = this;
    // movie.getMovieData(function (movie) {
    //   that.setData({
    //     movie: movie
    //   })
    // })
    //C#、Java、Python lambda
    // movie.getMovieData((movie) => {
    //   this.setData({
    //     movie: movie
    //   })
    // })
  },

  /*查看图片*/
  viewMoviePostImg: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },


})