
var mywork = {};
mywork.pageNo = '1';
mywork.type = '10';

mywork.init = function(){
    mywork.lunbo();
    mywork.getCourse();
    mywork.getHotcourse();
    mywork.event();

};

window.onload=function(){
  mywork.init();
}

/*轮播图 start*/
mywork.lunbo = function(){
   var imgwrap = tools.$('.imgwrap')[0];
   var imgs = imgwrap.children;

   var circlewrap = tools.$('.circlewrap')[0];
   var circles = circlewrap.children;
   //自动播放
   var index = 0;
   var autoChange = setInterval(function(){
       if(index < imgs.length -1){
          index++;
       }else {
          index = 0;
       }
       changeTo(index);
   },5000)

   tools.addEvent(imgwrap,'mouseover',function(){
      clearInterval(autoChange);
   });

   tools.addEvent(imgwrap,'mouseout',function(){
      autoChange = setInterval(function(){
       if(index < imgs.length -1){
          index++;
       }else {
          index = 0;
       }

       changeTo(index);
      },5000)
   });

   circleEvent();

   function circleEvent(){
       for (var i = 0; i<circles.length;i++) {
         (function(i){
            tools.addEvent(circles[i],'click',function(){
              clearInterval(autoChange);
              index = circles[i].dataset.index;
              changeTo(i);

              autoChange = setInterval(function(){
               if(index < imgs.length -1){
                 index++;
               }else {
                  index = 0;
               }

               changeTo(index);
               },5000)
            })
         })(i)
       }
   }

   function changeTo(num){
      var curImg = tools.$('.imgon')[0];
      var curCirccle = tools.$('.circleon')[0];
      tools.fadeOut(curImg);
      tools.removeClass(curImg, 'imgon');
      tools.removeClass(curCirccle, 'circleon');
      
      tools.addClass(imgs[num], 'imgon');
      tools.addClass(circles[num], 'circleon');
      tools.fadeIn(imgs[num]);
   }

}
/*轮播图 end*/

/*各种事件*/
mywork.event = function(){
   mywork.pageChange();
   mywork.tipClear();
   mywork.follow();
   mywork.changeTab();
   mywork.vieoPlay();
}
/*提示栏*/

mywork.tipClear = function(){
   var tip = tools.$('#m-tip');
   var tipRight = tools.$('.tipRight')[0];
   tools.addEvent(tipRight, 'click',function(){
      var expiresDays = 30;
      var date = tools.setCookietime(expiresDays);
      tools.setCookie('setInfo', 'noshow', date);
      tip.style.display = 'none';
   });

   var cookie = tools.getCookie()['setInfo'];
   if (cookie == 'noshow') {
     tip.style.display = 'none';
    } else {
      tip.style.display = 'block';
    }
}

/*关注栏*/
mywork.follow = function(){
   var loginTime = tools.setCookietime(7);
   var followTime = tools.setCookietime(365);
   var navAtten = tools.$('#navAtten');
   var navAttened = tools.$('#navAttened');
   var mlogin = tools.$('#m-login');
   var formdata =tools.$('#formdata');
   var username = tools.$('#username');
   var password = tools.$('#password');
   var submit = tools.$('#submit');
   var fail = tools.$('#fail');
   var navFans =tools.$('#navFans');
   var fansNum = tools.$('#fansNum');
   var exit = tools.$('#exit');
   var cancel = tools.$('#cancel');
 
   //初始验证
   var followCookie = tools.getCookie()['followed'];
   if (followCookie == 'yes'){
     navAtten.style.display = 'none' ;
     navAttened.style.display = 'block';
     fansNum.innerHTML = parseInt(fansNum.innerHTML) + 1;
   };
   
   //点击关注
   tools.addEvent(navAtten, 'click',function(){
      checkLogin();
   });

   function checkLogin () {
    var cookie = tools.getCookie()['logined'];
    if (cookie == 'yes') {
      checkFollow();  
    } else {
      mlogin.style.display = 'block';
    }
  }

  function checkFollow () {
    var cookie = tools.getCookie()['followed'];
    if (cookie == 'yes') {
      navAtten.style.display = 'none';
      navAttened.style.display = 'block';
      fansNum.innerHTML = parseInt(fansNum.innerHTML) + 1;
    } else {
      ajaxAttention();
    }
  }

   //登录
   tools.addEvent(submit , 'click', function(){
      if (username.value == '' || password.value == '') {
      fail.innerText = '账号密码不能为空';
    } else {
      ajaxLogin();
    }
   });
   
   function ajaxLogin () {
    tools.ajax({
      method: 'get',
      url: 'http://study.163.com/webDev/login.htm',
      data: {
        'userName': hex_md5(username.value),
        'password': hex_md5(password.value)
      },

      success: function(data) {
        if (data == 1) {
          tools.setCookie('logined', 'yes', loginTime);
          mlogin.style.display = 'none';
          var followcookie = tools.getCookie()['followed'];
          if (followcookie == 'yes') {
            cancelCheckFollow();
          } else {
            ajaxAttention();  
          }
        } else if (data == 0) {
          fail.innerText = '账号不存在或账号密码错误';
        }
      },
      async: true
    });
  }
  // ajax获取关注返回信息
  function ajaxAttention () {
    tools.ajax({
      method: 'get',
      url: 'http://study.163.com/webDev/attention.htm',
      success: function(data) {
        if (data == 1) {
          tools.setCookie('followed', 'yes', followTime);
        }
        checkFollow();
      },
      async: true
    });
  }
  // 关注成功后点击取消按钮取消关注
  tools.addEvent(cancel,'click',function(){
     var logincookie = tools.getCookie()['logined'];
    if (logincookie == 'yes') {
      cancelCheckFollow();  
    } else {
      mlogin.style.display = 'block';
    }
  });

   // 取消关注前检查followSuc的cookie
  function cancelCheckFollow () {
    var followcookie = tools.getCookie()['followed'];
    if (followcookie == 'yes') {
      navAtten.style.display = 'block';
      navAttened.style.display = 'none';
      fansNum.innerHTML = parseInt(fansNum.innerHTML) - 1;
      tools.removeCookie('followed');
    } else {
      navAtten.style.display = 'block';
      navAttened.style.display = 'none';
      fansNum.innerHTML = parseInt(fansNum.innerHTML) - 1;
    }

  }
  // 点出X按钮退出登录框

  tools.addEvent(exit,'click',function(){
    fail.innerText = '';
    mlogin.style.display = 'none';
  })
  
}

/*视屏*/
mywork.vieoPlay = function(){
  var videoShow = tools.$('#videoShow');
  var videoPlayer = tools.$('#videoPlayer');
  var videoexit =tools.$('#videoexit');
  var videoImg = tools.$('#videoImg');
  var videobtn = tools.$('#videobtn');
  var playerVideo = tools.$('#playerVideo');

  tools.addEvent(videoShow, 'click',function(){
    videoPlayer.style.display = 'block';
    videoImg.style.display = 'block';
    videobtn.style.display = 'block';
    playerVideo.style.display = 'none';
  });

  tools.addEvent(videoexit, 'click',function(){
    videoPlayer.style.display = 'none';
    playerVideo.pause();
  });

 tools.addEvent(videobtn, 'click',function(){
    videoImg.style.display = 'none';
    videobtn.style.display = 'none';
    playerVideo.style.display = 'block';
    playerVideo.load();
    playerVideo.play();
  });
}


/*获取课程*/
mywork.getCourse = function(){
  
  var mainCourse = tools.$('.m-mainCourse')[0];

   tools.ajax({
      method: 'get',
      url: 'http://study.163.com/webDev/couresByCategory.htm',
      data: {
        'pageNo': mywork.pageNo,
        'psize': '20',
        'type': mywork.type
      },
      
      success: function(data) {
        var _data = JSON.parse(data);

        for (var i = 0; i < _data.list.length; i++) {
          /*课程页面*/
          var mainCourcontainer = document.createElement('div');
          if (i%4 == 0) {
            mainCourcontainer.setAttribute('class', 'mCourContainer theyHidden');
          } else {
            mainCourcontainer.setAttribute('class', 'mCourContainer');
          }
          mainCourse.appendChild(mainCourcontainer);

          var mainCour = document.createElement('div');
          mainCour.setAttribute('class', 'mainCour');
          mainCourcontainer.appendChild(mainCour);

          var coursePhoto = document.createElement('img');
          var courseUrl = document.createElement('a');
          var courseName = document.createElement('div');
          var courseProvider = document.createElement('div');
          var courseNum = document.createElement('div');
          var coursePrice = document.createElement('div');

          courseUrl.setAttribute('class', 'courseUrl');
          courseUrl.setAttribute('href', _data.list[i].providerLink);
          coursePhoto.setAttribute('class', 'coursePhoto');
          coursePhoto.setAttribute('src', _data.list[i].bigPhotoUrl);
          courseName.setAttribute('class', 'courseName');
          courseName.innerHTML = _data.list[i].name;
          courseProvider.setAttribute('class', 'courseProvider');
          courseProvider.innerHTML = _data.list[i].provider;
          courseNum.setAttribute('class', 'courseNum');
          courseNum.innerHTML = _data.list[i].learnerCount;
          courseNum.style.fontSize = '8px';
          coursePrice.setAttribute('class', 'coursePrice');
          if (_data.list[i].price == '0') {
            coursePrice.innerHTML = '免费'
            coursePrice.style.color = '#39a030'
          }else{
            coursePrice.innerHTML = '￥' + _data.list[i].price;
          }

          courseUrl.appendChild(coursePhoto)
          mainCour.appendChild(courseUrl);
          mainCour.appendChild(courseName);
          mainCour.appendChild(courseProvider);
          mainCour.appendChild(courseNum);
          mainCour.appendChild(coursePrice);

          /*课程介绍*/
          var courseHover = document.createElement('div');
          courseHover.setAttribute('class', 'courseHover');
          mainCourcontainer.appendChild(courseHover);

          var hoverPhoto = document.createElement('img');
          var hoverName = document.createElement('div');
          var hoverNum = document.createElement('div');
          var hoverProvider = document.createElement('div');
          var hoverCategory = document.createElement('div');
          var hoverDescription = document.createElement('div');
          var desContent = document.createElement('div');
          hoverDescription.appendChild(desContent);

          hoverPhoto.setAttribute('class', 'hoverPhoto');
          hoverPhoto.setAttribute('src', _data.list[i].bigPhotoUrl);
          hoverName.setAttribute('class', 'hoverName');
          hoverName.innerHTML = _data.list[i].name;
          hoverName.title = _data.list[i].name;
          hoverNum.setAttribute('class', 'hoverNum');
          hoverNum.innerHTML = _data.list[i].learnerCount + '人在学';
          hoverProvider.setAttribute('class', 'hoverProvider');
          hoverProvider.innerHTML = '发布者&nbsp;:&nbsp;' + _data.list[i].provider;
          hoverCategory.setAttribute('class', 'hoverCategory');
          if(_data.list[i].categoryName==null){
             hoverCategory.innerHTML = '分类&nbsp;:&nbsp;&nbsp;' + '暂无';
          }else{
             hoverCategory.innerHTML = '分类&nbsp;:&nbsp;&nbsp;' + _data.list[i].categoryName;
          };
          hoverDescription.setAttribute('class', 'hoverDescription');
          desContent.setAttribute('class', 'desContent');
          desContent.innerHTML = _data.list[i].description;
          desContent.title = _data.list[i].description;

          courseHover.appendChild(hoverPhoto);
          courseHover.appendChild(hoverName);
          courseHover.appendChild(hoverNum);
          courseHover.appendChild(hoverProvider);
          courseHover.appendChild(hoverCategory);
          courseHover.appendChild(hoverDescription);
        }

        var maincour2 = tools.$('.mainCour');
        var coursehover2 = tools.$('.courseHover');

        for (var i = 0; i < _data.list.length; i++) {
            (function(_i){
            tools.addEvent(maincour2[_i],'mouseenter',function(){
              coursehover2[_i].style.display = 'block';
              tools.fadeIn(coursehover2[_i]);
            });
            tools.addEvent(coursehover2[i],'mouseleave',function(){
              coursehover2[_i].style.display = 'none';
            })
           
        })(i)
         
        }
    

      },

      async: true
 });

}

// tab
mywork.changeTab = function(){
  var leftTab = tools.$('#leftTab');
  var rightTab = tools.$('#rightTab');
  var pageNum = tools.$('#pageNum');
  var page = pageNum.children;

  tools.addEvent(leftTab,'click',function(){
    leftTab.style.backgroundColor = '#39a030';
    leftTab.style.color = '#fff';
    rightTab.style.backgroundColor = '#fff';
    rightTab.style.color = '#000';
    if(mywork.type != '10'){
      mywork.type = '10';
      mywork.pageNo = '1';
      var pageOn = tools.$('.pageOn')[0];
      tools.removeClass(pageOn, 'pageOn');
      tools.addClass(page[0], 'pageOn');
      mywork.changeCourse();
    }
  });

  tools.addEvent(rightTab,'click',function(){
    leftTab.style.backgroundColor = '#fff';
    leftTab.style.color = '#000';
    rightTab.style.backgroundColor = '#39a030';
    rightTab.style.color = '#fff';
    if(mywork.type != '20'){
      mywork.type = '20';
      mywork.pageNo = '1';
      var pageOn = tools.$('.pageOn')[0];
      tools.removeClass(pageOn, 'pageOn');
      tools.addClass(page[0], 'pageOn');
      mywork.changeCourse();
    }
  });
}

// 改变课程列表
mywork.changeCourse =function() {
  var mainCourse = tools.$('.m-mainCourse')[0];
  
    tools.ajax({
      method: 'get',
      url: 'http://study.163.com/webDev/couresByCategory.htm',
      data: {
        'pageNo': mywork.pageNo,
        'psize': '20',
        'type': mywork.type
      },
      success: function (data) {
        var _data = JSON.parse(data);
        if(_data.list != undefined){
           mainCourse.style.display = 'block';
           var mCourContainer = tools.$('.mCourContainer');

            if(_data.list.length<20){
              for(var i = _data.list.length; i < 20; i++){
                mCourContainer[i].style.display = 'none';
             };
            }else{

              for (var i = 0; i < _data.list.length; i++) {
              mCourContainer[i].style.display = 'block';
              var courseUrl =tools.$('.courseUrl')[i]
              var coursePhoto = tools.$('.coursePhoto')[i];
              var courseName = tools.$('.courseName')[i];
              var courseProvider = tools.$('.courseProvider')[i];
              var courseNum = tools.$('.courseNum')[i];
              var coursePrice = tools.$('.coursePrice')[i];

               coursePhoto.src = _data.list[i].bigPhotoUrl;
               courseName.innerHTML = _data.list[i].name;
               courseProvider.innerHTML = _data.list[i].provider;
               courseNum.innerHTML = _data.list[i].learnerCount;
               if (_data.list[i].price == '0') {
                 coursePrice.innerHTML = '免费'
                 coursePrice.style.color = '#39a030'
               }else{
                 coursePrice.innerHTML = '￥' + _data.list[i].price;
               }

               var hoverPhoto = tools.$('.hoverPhoto')[i];
               var hoverName = tools.$('.hoverName')[i];
               var hoverNum = tools.$('.hoverNum')[i];
               var hoverProvider = tools.$('.hoverProvider')[i];
               var hoverCategory = tools.$('.hoverCategory')[i];
               var desContent = tools.$('.desContent')[i];

               hoverPhoto.src = _data.list[i].bigPhotoUrl;
               hoverName.innerHTML = _data.list[i].name;
               hoverName.title = _data.list[i].name;
               hoverNum.innerHTML = _data.list[i].learnerCount + '人在学';
               hoverProvider.innerHTML = '发布者&nbsp;:&nbsp;' + _data.list[i].provider;
               if(_data.list[i].categoryName==null){
                  hoverCategory.innerHTML = '分类&nbsp;:&nbsp;&nbsp;' + '暂无';
               }else{
                  hoverCategory.innerHTML = '分类&nbsp;:&nbsp;&nbsp;' + _data.list[i].categoryName;
               };
               desContent.innerHTML = _data.list[i].description;
               desContent.title = _data.list[i].description;
              }
            }
       }else {
         mainCourse.style.display = 'none';
       }
      },
      async: true
    });
  }


/*获取排行榜*/
mywork.getHotcourse = function(){

  var hotCourse = tools.$('.hotCourse')[0];
  
   tools.ajax({
      method: 'get',
      url: 'http://study.163.com/webDev/hotcouresByCategory.htm',
      
      success: function(data) {
        
        var _data = JSON.parse(data);

          for (var i = 0; i < 20; i++) {

          var hotcoursecontainer = document.createElement('div');
          if(i<10){
            hotcoursecontainer.setAttribute('class', 'hotcoursecontainer f-clear');
          }else{
            hotcoursecontainer.setAttribute('class', 'hotcoursecontainer f-clear hotCoursenone');
          };
          hotCourse.appendChild(hotcoursecontainer);
        
          var hotcoursePhoto = document.createElement('img');
          hotcoursePhoto.setAttribute('class', 'hotcoursePhoto');
          hotcoursePhoto.setAttribute('src', _data[i].smallPhotoUrl);
          var hotcourseNum = document.createElement('div');
          hotcourseNum.setAttribute('class', 'hotcourseNum');
          hotcourseNum.innerHTML = _data[i].learnerCount;
          var hotcourseName = document.createElement('div');
          hotcourseName.setAttribute('class', 'hotcourseName');
          hotcourseName.innerHTML = _data[i].name;

          var hotLeft = document.createElement('div');
          hotLeft.setAttribute('class', 'hotLeft');
          var hotRight =document.createElement('div');
          hotRight.setAttribute('class', 'hotRight');

          hotLeft.appendChild(hotcoursePhoto);
          hotRight.appendChild(hotcourseName);
          hotRight.appendChild(hotcourseNum);       

          hotcoursecontainer.appendChild(hotLeft);
          hotcoursecontainer.appendChild(hotRight);
        }

        setInterval(function(){
          var hotcoursecontainer2 = tools.$('.hotcoursecontainer');
          for (var i = 0; i < 20; i++) {
            if(tools.hasClass(hotcoursecontainer2[i],'hotCoursenone')){
              tools.removeClass(hotcoursecontainer2[i],'hotCoursenone');
            }else{
              tools.addClass(hotcoursecontainer2[i],'hotCoursenone');
            }
          }
           
        },5000);
      },

      async: true
 });

}

/*页码*/
mywork.pageChange = function(){
  var pageNum = tools.$('#pageNum');
  var page = pageNum.children;
  var pageLen = page.length;
  var pre = tools.$('#pre');
  var next = tools.$('#next');

  for(var i = 0; i < pageLen; i++){
      (function (_i) {
        tools.addEvent(page[_i],'click',function () {
          var pageOn = tools.$('.pageOn')[0];
          tools.removeClass(pageOn, 'pageOn');
          tools.addClass(page[_i], 'pageOn');
          mywork.pageNo = (_i + 1).toString();
          mywork.changeCourse();
        });
      })(i);
    }

    var pre = tools.$('#pre');
    tools.addEvent(pre,'click',function(){
      var pageOn = tools.$('.pageOn')[0];
      var pageNumber = parseInt(pageOn.innerText);
      if (pageNumber > 1) {
        tools.removeClass(pageOn, 'pageOn');
        tools.addClass(page[pageNumber - 2], 'pageOn');
        mywork.pageNo = (pageNumber - 1).toString();
        mywork.changeCourse();
      }
    })

    var next = tools.$('#next');
    tools.addEvent(next,'click',function(){
      var pageOn = tools.$('.pageOn')[0];
      var pageNumber = parseInt(pageOn.innerText);
      if (pageNumber < pageLen) {
        tools.removeClass(pageOn, 'pageOn');
        tools.addClass(page[pageNumber], 'pageOn');
        mywork.pageNo = (pageNumber + 1).toString();
        mywork.changeCourse();
      }
    })


}