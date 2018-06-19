var util = require('../../../../utils/util.js');
class Movie {
  constructor(url) {
    this.url = url;
  }
  // http是异步获取数据，需要有个回调，不能直接赋值
  getMovieData(cb) {
    this.cb = cb;
    // proessDoubanData是回调，回调里的this不是指向movie了，需要手动绑定this
    util.http(this.url, this.processDoubanData.bind(this));
  }

  processDoubanData(data) {
    if (!data) {
      return;
    }
    // 判空处理
    var director = {
      avatar: '',
      name: '',
      id: ''
    }
    // 二级属性需判断
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large;
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    var movie = {
      movieImg: data.images ? data.images.large : '',
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      generes: data.genres.join('、'),
      stars: util.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),
      summary: data.summary
    }
    console.log(this);
    this.cb(movie);
  }


}

export {
  Movie
}
/* var util = require('../../../../utils/util.js')
class Movie {
    constructor(url) {
        this.url = url;
    }

    getMovieData(cb) {
        this.cb = cb;
        util.http(this.url, this.processDoubanData.bind(this));
    }

    processDoubanData(data) {
        if (!data) {
            return;
        }
        var director = {
            avatar: "",
            name: "",
            id: ""
        }
        if (data.directors[0] != null) {
            if (data.directors[0].avatars != null) {
                director.avatar = data.directors[0].avatars.large

            }
            director.name = data.directors[0].name;
            director.id = data.directors[0].id;
        }
        var movie = {
            movieImg: data.images ? data.images.large : "",
            country: data.countries[0],
            title: data.title,
            originalTitle: data.original_title,
            wishCount: data.wish_count,
            commentCount: data.comments_count,
            year: data.year,
            generes: data.genres.join("、"),
            stars: util.convertToStarsArray(data.rating.stars),
            score: data.rating.average,
            director: director,
            casts: util.convertToCastString(data.casts),
            castsInfo: util.convertToCastInfos(data.casts),
            summary: data.summary
        }
        this.cb(movie);
    }
}

export {Movie} */