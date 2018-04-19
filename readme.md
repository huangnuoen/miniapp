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
5. wx.navigateBack(obj)
  - 关闭当前页面，返回上页或多级页面，getCurrentPages()可获取当前 的页面栈

## 跳转
1. 页面用navigateTo()跳转，在子页面的onload可以用options获取上级页面的参数
2. 页面数据的传递方式
  - options
  - 全局变量
  - 缓存
  - 发收事件