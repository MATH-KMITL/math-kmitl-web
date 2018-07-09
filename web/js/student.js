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
var tdRef = firebase.database().ref('student');
var yRef = firebase.database().ref('max_year');
yRef.once('value', function (snapshot) {
    sessionStorage.setItem("max_year", snapshot.val())
});
//load data once per refresh not realtime
tdRef.once('value', function (snapshot) {
    count = 5;
    //for in every child of data
    snapshot.forEach(function (childSnapshot) {
        count_s = 0;
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        if (parseInt(key.slice(4, 6)) > parseInt(String(sessionStorage.getItem("max_year"))) - 4) {
            count -= 1;
            for (i in childData) {
                count_s += 1;
                $('#student-' + pad(count)).append(studentCard(childData[i], pad(count_s), key));
            }
        }
        //     document.querySelector('#teacher-list')
        // .innerHTML += teacherCard(childData, count);
    });
});

function studentCard(teacher, count, year) {
    var html = '';
    var fileName = 'user' + count + '.jpg';
    var imagesRef = 'student_pic%2F' + year + '%2F' + fileName;
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
    html += '<div class="text-blo5 size35 t-center bo-rad-10 bo7 p-t-90 p-l-35 p-r-35 p-b-30">';
    html += '<div class="txt34 dis-block p-b-6">' + teacher.title + '' + teacher.name + ' ' + teacher.surname + '</div>';
    html += '<p class="t-center">';
    html += 'รหัสนักศึกษา : ' + teacher.user_id + '</p>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    return html;
}

{/* <div id="freshmen" class="row">
                <div class="col-md-8 col-lg-4 m-l-r-auto p-b-30">
                    <div class="blo5 pos-relative p-t-60">
                        <div class="pic-blo5 size14 bo4 wrap-cir-pic hov-img-zoom ab-c-t">
                            <img src="https://firebasestorage.googleapis.com/v0/b/math-web-kmitl.appspot.com/o/user_pic%2Fuser01.jpg?alt=media" alt="IGM-AVATAR">
                            <div class="overlay-item-gallery trans-0-4 flex-c-m">
                                <a class="btn-show-gallery flex-c-m fa fa-search" href="https://firebasestorage.googleapis.com/v0/b/math-web-kmitl.appspot.com/o/user_pic%2Fuser01.jpg?alt=media"
                                    data-lightbox="gallery"></a>
                            </div>
                        </div>
                    </div>
                    <div class="text-blo5 size34 t-center bo-rad-10 bo7 p-t-90 p-l-35 p-r-35 p-b-30">
                        <div class="txt34 dis-block p-b-6">ผศ.ดร. กาญจนา คำนึงกิจ</div>
                        <p class="t-center">0-2329-8400-11 (Ext.320)
                        </p>
                    </div>
                </div>
            </div> */}


function pad(d) {
    return (d < 10) ? '00' + d.toString() : (d < 100) ? '0' + d.toString() : d.toString();
}

window.alert = function () {
    $("#myModal .modal-body").text(arguments[0]);
    $("#myModal").modal('show');
};