# ParseWebPageList
simply save specific web page content to database and preview data from custom web page

## Open Source

* Express (http://expressjs.com/)
* antd - An enterprise-class UI design language and React-based implementation. (https://github.com/ant-design/ant-design)
* SQLite3 (http://expressjs.com/en/guide/database-integration.html#sqlite)
* cheerio   server-side jquery-like tool (https://github.com/cheeriojs/cheerio)
* PhantomJS   a headless WebKit scriptable with a JavaScript API  (http://phantomjs.org/)

## express server

quickly set up express server according to the demo(https://github.com/kenanpengyou/express-webpack-full-live-reload-example)

## requirements

* provide output param to run this package
* provide IPC to notify process percentage
* error log and catch, time record

## webpage query

爱奇艺热播总榜及分频道榜单top50：
http://top.iqiyi.com/rebobang.html

http://top.iqiyi.com/dianshiju.html 电视剧
http://top.iqiyi.com/zongyi.html  综艺
http://top.iqiyi.com/dongman.html 动漫

var alist = window.minJQuery('.topDetails-list>li').find('h2>a[title]').toArray();
alist.forEach(function(element) {
    console.log(element.innerText);
});  // get all <a> element


腾讯视频热播分频道数据

http://v.qq.com/x/list/variety 综艺
http://v.qq.com/x/list/tv  电视剧
http://v.qq.com/x/list/cartoon 动漫
var alist = $('.figures_list').find('.figure_title>a[title]').toArray();


优酷视频热搜总榜及分频道榜单top30（有少量外站数据，需要剔除）： 
http://index.youku.com/rank_top/ 

http://index.youku.com/rank_top_detail/?m=97&type=1  电视剧
http://index.youku.com/rank_top_detail/?m=85&type=1 综艺
http://index.youku.com/rank_top_detail/?m=100&type=1 动漫

var alist = $('#expRank').find('a.name').toArray();

乐视视频热播总榜及分频道榜单top50： 
http://top.le.com/filmhp.html 

http://top.le.com/tvhp.html 电视剧
http://top.le.com/varhp.html 综艺
http://top.le.com/comichp.html 动漫

$('.chart-list').eq(0)  // first list is hot item per day
$('ol.chart-list').eq(0).find('.t-2>a').toArray();

var alist = [];
$('ol.chart-list').eq(0).children().each(function() {
    var subA = $(this).find('a').toArray();
    if (subA.length > 1) {
        alist.push(subA[1]);
    }
})

搜狐视频热播分频道排行榜top100： 
http://tv.sohu.com/hotdrama/ 

http://tv.sohu.com/hotdrama/
http://tv.sohu.com/hotshow/
http://tv.sohu.com/hotcomic/

$('.rList_subCon').eq(0).find('.rList>li div.vName a.at').toArray();


PPTV聚力热播总榜及分频道排行榜： 
http://top.pptv.com/ 

http://top.pptv.com/?type=2 电视剧
http://top.pptv.com?type=3   动漫
http://top.pptv.com?type=4   综艺

document.getElementsByClassName('main')[1].querySelectorAll('.plist1>ul.cf>li>div.tit>a')

芒果TV热播分频道排行榜： 
http://www.mgtv.com/top/ 

http://www.mgtv.com/top/tv/ 电视剧
http://www.mgtv.com/top/show/  动漫
http://www.mgtv.com/top/cartoon/ 综艺

$('.m-list-item')

A站热播排行榜：
http://www.acfun.cn/rank/list/#cid=68;range=2

http://www.acfun.cn/rank/list/#cid=68;range=1 电视剧
http://www.acfun.cn/rank/list/#cid=1;range=1 动漫

$('.title')

B站热播排行榜：
http://www.bilibili.com/ranking#!/all/11/0/3/  电视剧
http://www.bilibili.com/ranking#!/all/1/0/3/   动漫

$('.title').parent()
