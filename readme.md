## 模板
1. 模板内路径最好用绝对路径，避免复用时路径出错
2. 模板样式的引入
  - 在父页面的wxss引入，A引用B，B引用C，则在B中引入c.wxss, 在A中引入b.wxss
  - 不建议在A中引入c.wxss
  ```
  @import "movie-grid/movie-grid-template.wxss";
  ```
3. <template></template>只是占位符，不会渲染
4. 用data绑定数据，is指定模板
5. 传递数据时，父绑定的变量须和子接收的变量名一致, 
6. 可传递多个数据，并指定变量名


## bind && catch
1. catch 绑定事件，会阻止事件向上冒泡，不会向父节点传递

## 全局变量
1. app.js 中的globalData存放全局变量，
2. 在子页面中可通过getApp()获取
  ```
  var app = getApp();
  app.globalData.a
  ```

## 导航
1. wx.navigateTo(obj)
  - 保留当前页面，跳转到某个页面，wx.navigateBack可返回原页面
  - 最多10层
  - wx.navigateTo 和 wx.redirectTo **不允许跳转到 tabbar 页面**，只能用 **wx.switchTab 跳转到 tabbar 页面**
2. wx.redirectTo(obj)
  - 关闭当前页面，跳转到某个页面
3. wx.reLaunch(obj)
  - 关闭所有页面，打开到某个页面
4. wx.switchTab(obj)
  - 跳转到tabBar页面，并关闭所有非tabBar页面
  - url 跳转的路径需在app.json的tabBar字段定义的页面，不能带参数
  ```
  {
    "tabBar": {
      "list": [{
        "pagePath": "index",
        "text": "首页"
      },{
        "pagePath": "other",
        "text": "其他"
      }]
    }
  }
  ```
  - tarBar的image不要用绝对路径
5. wx.navigateBack(obj)
  - 关闭当前页面，返回上页或多级页面，getCurrentPages()可获取当前 的页面栈

## 跳转
1. 页面用navigateTo()跳转，在子页面的onload可以用options获取上级页面的参数
2. 页面数据的传递方式
  - options
  - 全局变量
  - 缓存
  - 发收事件

## input 组件
1. event.detail 携带表单数据

### scroll-view 组件
1. 要给scroll-view一个固定高度


## 业务逻辑
### 上拉到底部加载更多
1. 方案一：使用scroll-view组件的scrolltolower事件
  ```
  bindscrolltolower="onScrollLower"
  ```
  - 需要设置高度
2. 在onScrollLower中调用下一次请求
  - nextUrl 为再次调用的url
  - totalCount存储当前数据总数，**在每次回调中更新totalCount的值**
  - requestUrl为主url
3. 方案二：使用onReachBottom()监听页面上拉触底事件
  - 可以在app.json的window选项中或页面配置中设置触发距离onReachBottomDistance。
  - 在触发距离内滑动期间，本事件只会被触发一次。
  - 可解决不能用onPullDownRefresh函数的问题
  - 不需要定高度
4. 处理movies数据
  - 判断是否为第一次请求，通过isEmpty判断
  - 非首次加载则将二次加载的数据追加到movies中，再setData

### 下拉刷新
1. 在page中定义onPullDownRefresh处理函数，监听该页面下拉刷新事件
  - 需要在config的window选项中开启enablePullDownRefresh
  - wx.stopPullDownRefresh可停止当前页面的下拉刷新
2. 页面有scroll-view组件，则无法实现下拉刷新，只能在非scroll-view范围内使用