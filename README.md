
TOPe企微信小程序源码 by Patrick
------------

[小程序官方文档][1]

编码规范
----

1、命名规范
------


文件夹名，CSS 名，资源（图片）名全部小写，用'-'连接
类名开头大写，驼峰写法
方法名开头小写，驼峰写法
资源命名原则 [页面名称]-[功能]-[状态(如果有)：select/normal]-[类型]，类型一般分为 icon、bg。 eg. home-member-count-icon.png
CSS 命名时多用 root、container、main、wrapper、header、footer、content、sub-content
[CSS 命名规范参考][2]

2、文件路径
------

页面文件统一放在 pages 文件夹下 eg. /pages/login/
共用的视图控件放在 components 文件夹下，eg. /components/loading-indicator/
单个页面独有的子视图控件放在该页面文件夹下，eg. /pages/login/views/login-btn/
图片资源存放在 /res/img/ 下，并存入对应的页面文件夹，公用的放入 common 文件夹

3、js 方法
-------

默认生成的生命周期的方法放在上方，
自定义方法放在文件下方，
页面的读取数据请求，一般放在 requestData 方法中

4、公用工具方法
--------

以静态方法的形式写在 /tools/tool.js 中

5、数据存储
------

常用的存储以静态方法的形式写在 /tools/storage.js 中

6、网络
----

operation 定义在 /network/operation.js 中
url 定义在 /network/network.js
一般读操作的请求，以静态方法的形式写在 /network/factory/request-read-factory.js 中
一般写操作的请求，以静态方法的形式写在 /network/factory/request-write-factory.js 中
非一般读写操作，以类的形式写在 /network/requests/ 中

7、全局变量、工具类
----------

全局变量、工具类先挂到 TCGlobal 文件中
再在 /app.js 的 onLaunch 方法中，把变量挂到 global 变量上

8、CSS
-----

尽量用 class 选择器，不要用 id 选择器，多用后代选择器或子选择器
全局样式可以写到 /app.wxss 中，注意不要覆盖别人的样式
尽量用 Flexbox 布局

9、模板
----

多用模板来模块化界面，遵循依赖倒置、单一模块单一功能原则，提高复用，减少耦合

10、git
------

git开发时，多用分支，比较大的改动尽量在自己创建的子分支上开发，基本开发完成后，再合并到 master 分支上。开发的子分支可以命名为 develop-zjt 这种格式，避免冲突




  [1]: https://mp.weixin.qq.com/debug/wxadoc/dev/index.html
  [2]: http://frontenddev.org/link/a-written-order-css-naming-rules-guide.html