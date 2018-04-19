var postsData = require('../../../data/posts-data.js');
var app = getApp(); // 拿到全局变量
Page({
    data: {},
    onLoad: function (option) {
        var postId = option.id;
        this.setData({
            currentPostId: postId
        });
        var postData = postsData.postList[postId];
        this.setData({
            postData: postData
        });

        // var postsCollected = {
        //     1: 'true',
        //     2: 'false'
        // }

        var postsCollected = wx.getStorageSync('posts_collected');
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            })
        } else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected)
        }

        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
            this.setData({
                isPlayingMusic: true
            })
        }
        this.setAudioMonitor();
    },
    setAudioMonitor: function () {
        var that = this;
        // 全局监听音乐播放
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isPlayingMusic: true
            });
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicPostId = that.data.currentPostId;
        });
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });
    },
    onColletionTap: function () {
        this.getPostsCollectedSync(); // 同步
        // this.getPostsCollectedAsy(); 异步
        // 弹窗
        // this.showModal(postsCollected, postCollected);
        // 提示
    },
    getPostsCollectedAsy: function () {
        var that = this;
        wx.getStorage({
            key: 'posts_collected',
            success: function (res) {
                var postsCollected = res.data;
                var postCollected = postsCollected[that.data.currentPostId];
                postCollected = !postCollected;
                postsCollected[that.data.currentPostId] = postCollected;
                that.showToast(postsCollected, postCollected);
            }
        })
    },
    getPostsCollectedSync: function () {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentPostId];
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        this.showToast(postsCollected, postCollected);

    },
    showModal: function (postsCollected, postCollected) {
        var that = this;
        wx.showModal({
            title: '收藏',
            content: postCollected ? '收藏该文章' : '取消收藏该文章',
            showCancel: true,
            cancelColor: '#333',
            confirmColor: '#405f80',
            success: function (res) {
                if (res.confirm) {
                    // 更新收藏缓存
                    wx.setStorageSync('posts_collected', postsCollected);
                    // 更新数据
                    that.setData({
                        collected: postCollected
                    })
                }
            }
        })
    },
    showToast: function (postsCollected, postCollected) {
        // 更新收藏缓存
        wx.setStorageSync('posts_collected', postsCollected);
        // 更新数据
        this.setData({
            collected: postCollected
        })
        wx.showToast({
            title: postCollected ? '收藏成功' : '取消成功',
            duration: 1000,
        })

    },
    onShareTap: function (event) {
        var itemList = [
            '分享到微信好友', '分享到朋友圈', '分享到QQ', '分享到微博'
        ]
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                // res.cancel 是否取消
                // res.tapIndex 点击数组元素的序号
                console.log(res.cancel, itemList[res.tapIndex])
            }
        })
    },

    onMusicTap: function () {
        var isPlayingMusic = this.data.isPlayingMusic;
        var postData = postsData.postList[this.data.currentPostId];
        console.log(postData.music.url)
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            })
        } else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg
            });
            this.setData({
                isPlayingMusic: true
            })
        }

    },
})