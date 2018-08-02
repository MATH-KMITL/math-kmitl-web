//config to connect to firebase
var config = {
  apiKey: "AIzaSyDHN6epAFTpGwywxeqKpc1vzNERGLYfguE",
  authDomain: "math-web-kmitl.firebaseapp.com",
  databaseURL: "https://math-web-kmitl.firebaseio.com",
  projectId: "math-web-kmitl",
  storageBucket: "math-web-kmitl.appspot.com",
};
firebase.initializeApp(config);
//prepare to get image from firebase storage
//prepare to get teacher from firebase database
var tdRef = firebase.database().ref('teacher');
var researchRef = firebase.storage();
var pd = firebase.database().ref('president');
pd.once('value', function (snapshot){
    sessionStorage.setItem('pd', snapshot.val());
});
//load data once per refresh not realtime
tdRef.once('value', function (snapshot) {
  count = 0;
  //for in every child of data
  snapshot.forEach(function (childSnapshot) {
    count += 1;
    var key = childSnapshot.key;
    var childData = childSnapshot.val();
    if (count < 25 || count > 26)
      $('#teacher-list').append(teacherCard(childData, pad(count)));
    else if (count == 25 || count == 26)
      $('#officer-list').append(officerCard(childData, pad(count)));
    //     document.querySelector('#teacher-list')
    // .innerHTML += teacherCard(childData, count);
  });
  //retreive data for president
  var president = snapshot.child(sessionStorage.getItem('pd').split("-")[0]).val();
  $('#president').append(teacherCard(president, sessionStorage.getItem('pd').split("-")[1]));
});

//teacher card 
function teacherCard(teacher, count) {
  var html = '';
  var fileName = 'user' + count + '.jpg';
  var imagesRef = 'user_pic%2F' + fileName;
  var urlIm = 'https://firebasestorage.googleapis.com/v0/b/math-web-kmitl.appspot.com/o/' + imagesRef + '?alt=media';
  html += '<div class="col-md-8 col-lg-4 m-l-r-auto p-b-30">';
  html += '<div class="blo5 pos-relative p-t-60">';
  html += '<div class="pic-blo5 size14 bo4 wrap-cir-pic hov-img-zoom ab-c-t">';
  html += '<img src="' + urlIm + '" alt="IGM-AVATAR">';
  html += '<div class="overlay-item-gallery trans-0-4 flex-c-m">';
  html += '<a class="btn-show-gallery flex-c-m fa fa-search" href="' + urlIm + '" data-lightbox="gallery">';
  html += '</a>';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  html += '<div class="text-blo5 size34 t-center bo-rad-10 bo7 p-t-90 p-l-35 p-r-35 p-b-30">';
  html += '<div class="txt34 dis-block p-b-6">' + teacher.title + '' + teacher.name + ' ' + teacher.surname + '</div>';
  html += '<p class="t-center">';
  var tel = teacher.tel;
  html += tel[0] + '<BR>';
  var email = teacher.email;
  html += email[0] + '<BR>';
  html += teacher.room + '</p>';
  html += '<button class="t-center more-info" id="teacher-' + count + '" value = "' + count + '" data-toggle="modal"' + 'data-target="#modal-teacher' + count + '"' + '">';
  html += 'ดูข้อมูลเพิ่มเติม<i class="fa fa-long-arrow-right m-l-10" aria-hidden="true"></i>';
  html += '</button>'
  html += '</div>';
  html += '</div>';
  html += '</div>';
  return html;
}
tdRef.on('value', function (snapshot) {
  count = 0;
  snapshot.forEach(function (childSnapshot) {
    count += 1;
    var key = childSnapshot.key;
    var childData = childSnapshot.val();
    $('#modal-every-teacher').append(createModal(childData, pad(count),key));
  });

});
//Modal when you click more info

// var urlFile = researchRef.ref('research_file/user02-file1').getDownloadURL().then(function(url){
//   return url;
// });

var getImageUrl = function (name) {
  var storage = firebase.storage();
  return storage.ref('research_file/'+name).getDownloadURL();
};



function createModal(teacher, count,key) {
  var html = '';
  var fileName = 'user' + count + '.jpg';
  var imagesRef = 'user_pic%2F' + fileName;
  var urlIm = 'https://firebasestorage.googleapis.com/v0/b/math-web-kmitl.appspot.com/o/' + imagesRef + '?alt=media';
  html += '<div class="modal fade modal-teacher" id="modal-teacher' + count + '" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">';
  html += '<div class="modal-dialog modal-lg" role="document">';
  html += '<div class="modal-content">';
  html += '<div class="modal-header">';
  html += '<h5 class="modal-title" id="myLargeModalLabel">ข้อมูลบุคลากร</h5>';
  html += '</div>';
  html += '<div class="modal-body">';
  html += '<section class="dados">';
  html += '<img src="' + urlIm + '" id="profile-img">';
  html += '<section class="user-info">';
  html += '<h3 id="username" style="color:black;">ชื่อ-นามสกุล</h3>';
  html += '<h1 class="title-name" id="firstname" style="color: #212529;">'+ teacher.title + teacher.name + '</h1>';
  html += '<h1 class="title-name" id="lastname" style="color: #212529;">' + teacher.surname + '</h1><BR>';
  html += '<h1 class="title-name" id="firstname_en" style="color: #212529;">' + teacher.title_en + teacher.name_en + '</h1>';
  html += '<h1 class="title-name" id="lastname_en" style="color: #212529;">' + teacher.surname_en + '</h1><BR>';
  html += '</section>';
  html += '<h3 id="bio-text" style="color:black;">อีเมลล์</h3>';
  html += '<section class="user-bio">';
  var email = teacher.email;
  for (i = 0; i < email.length; i++) {
    html += ' - ' + email[i] + '<BR>';
  }
  html += '</section>';
  html += '<h3 style="color:black;">โทรศัพท์</h3>';
  html += '<section class="user-bio">';
  var tel = teacher.tel;
  for (i = 0; i < tel.length; i++) {
    html += ' - ' + tel[i] + '<BR>';
  }
  html += '</section>';
  html += '<h3 style="color:black;">ห้องพัก</h3>';
  html += '<section class="user-bio">';
  html += ' - ' + teacher.room;
  html += '</section>';
  html += '<h3 style="color:black;">โฮมเพจ</h3>';
  html += '<section class="user-bio">';
  if (teacher.homepage == '-') {
    html += ' - ';
  }
  else {
    html += ' - ' + '<a href="'+teacher.homepage+'">'+teacher.homepage+'</a>';
  }
  html += '</section>';
  html += '<h3 style="color:black;">การศึกษา</h3>';
  html += '<section class="user-bio">';
  var education = teacher.education;
  if(education){
    for (i = 0; i < education.length; i++) {
      if (education[i] != '-')
        html += ' - ' + education[i] + '<BR>';
    }
  }
  html += '</section>';
  html += '<h3 style="color:black;">สาขาที่เชี่ยวชาญ/สนใจ</h3>';
  html += '<section class="user-bio">';
  var specialized_interests = teacher.specialized_interests;
  if(specialized_interests){
    for (i = 0; i < specialized_interests.length; i++) {
      if (specialized_interests[i] != '-')
        html += ' - ' + specialized_interests[i] + '<BR>';
    }
  }
  var re_flag = false;
  var research_file_arr = new Array();
  var research_file = teacher.research_file;
  if(research_file != undefined){
    for (i = 0; i < research_file.length; i++) {
      if (research_file[i] != ''){
          research_file_arr.push(research_file[i].substring(research_file[i].length-1));
      }
    }
    // console.log(research_file_arr)
  }

  // console.log(key);
  // console.log(urlFile);

  html += '</section>';
  html += '<h3 style="color:black;">งานวิจัย/สิ่งตีพิมพ์</h3>';
  html += '<section class="user-bio">';
  var url;
  var research = teacher.research;
  if(research){
    for (i = 0; i < research.length; i++) {
      if (research[i] != '-'){
        for(j = 0; j < research_file_arr.length; j++){
          re_flag = false;
          if(i == research_file_arr[j]){
            re_flag = true;
            url = 'https://firebasestorage.googleapis.com/v0/b/math-web-kmitl.appspot.com/o/research_file%2F'+key+'-file'+research_file_arr[j]+'.pdf'+'?alt=media';
            break;
          }
        }
        if(re_flag){
          // console.log(url);
          html += '<a href="'+ url +'" target="_blank">'+ ' - ' + research[i] +'</a>'  + '<BR>';
        }else{
          html += ' - ' + research[i] + '<BR>';
        }
      }
    }
  }

  html += '</section>';
  html += '<h3 style="color:black;">รายวิชาที่รับผิดชอบ</h3>';
  html += '<section class="user-bio">';
  var responsible_course = teacher.responsible_course;
  if(responsible_course){
    for (i = 0; i < responsible_course.length; i++) {
      if (responsible_course[i] != '-')
        html += ' - ' + responsible_course[i] + '<BR>';
    }
  }
  html += '</section>';
  html += '</section>';
  html += '</div>';
  html += '<div class="modal-footer"><button type="button" class="btn btn-all" data-dismiss="modal">ปิด</button></div>';
  html += '</div></div></div>';
  return html;
}


//officer card 
function officerCard(teacher, count) {
  var html = '';
  var fileName = 'user' + count + '.jpg';
  var imagesRef = 'user_pic%2F' + fileName;
  var urlIm = 'https://firebasestorage.googleapis.com/v0/b/math-web-kmitl.appspot.com/o/' + imagesRef + '?alt=media';
  // var urlIm  = stRef.child(imagesRef).getDownloadURL().then(function(url) {
  //     console.log(url); }).catch(function(error){console.log("Fuck you"); });
  html += '<div class="col-md-8 col-lg-4 m-l-r-auto p-b-30">';
  html += '<div class="blo5 pos-relative p-t-60">';
  html += '<div class="pic-blo5 size14 bo4 wrap-cir-pic hov-img-zoom ab-c-t">';
  html += '<img src="' + urlIm + '" alt="IGM-AVATAR">';
  html += '<div class="overlay-item-gallery trans-0-4 flex-c-m">';
  html += '<a class="btn-show-gallery flex-c-m fa fa-search" href="' + urlIm + '" data-lightbox="gallery">';
  html += '</a>';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  html += '<div class="text-blo5 size34 t-center bo-rad-10 bo7 p-t-90 p-l-35 p-r-35 p-b-30">';
  html += '<div class="txt34 dis-block p-b-6">' + teacher.title + '' + teacher.name + ' ' + teacher.surname + '</div>';
  html += '<p class="t-center">';
  var tel = teacher.tel;
  html += tel[0] + '<BR>';
  var email = teacher.email;
  html += email[0] + '<BR>';
  html += teacher.room + '</p>';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  return html;
}

//pad number one length with zero
function pad(d) {
  return (d < 10) ? '0' + d.toString() : d.toString();
}
