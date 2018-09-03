//config to connect to firebase
// var config = {
//     apiKey: "AIzaSyDHN6epAFTpGwywxeqKpc1vzNERGLYfguE",
//     authDomain: "math-web-kmitl.firebaseapp.com",
//     databaseURL: "https://math-web-kmitl.firebaseio.com",
//     projectId: "math-web-kmitl",
//     storageBucket: "math-web-kmitl.appspot.com",
// };
var config = {
    apiKey: "AIzaSyDHN6epAFTpGwywxeqKpc1vzNERGLYfguE",
    authDomain: "math-web-kmitl.firebaseapp.com",
    databaseURL: "https://math-web-kmitl.firebaseio.com",
    projectId: "math-web-kmitl",
    storageBucket: "math-web-kmitl.appspot.com",
    messagingSenderId: "481311539108"
};
firebase.initializeApp(config);
//prepare to get image from firebase storage
//prepare to get teacher from firebase database
var tdRef = firebase.database().ref('student');

//load data once per refresh not realtime
tdRef.once('value', function (snapshot) {
    const result = snapshot.val()
    const freshy = result['freshy']
    let count = 0
    //for in every child of data
    Object.keys(result).reverse().forEach(function (key) {
        if (key !== 'freshy') {
            console.log(key.substr(4, 2), parseInt(freshy, 10) - count)
            if (key.substr(4, 2) == parseInt(freshy, 10) - count) {
                var childData = result[key];
                count++
                Object.keys(childData).forEach(id => {
                    $(`#student-00${count}`).append(studentCard(id, `${childData[id].title}${childData[id].name} ${childData[id].surname}`, key));
                })
                //     document.querySelector('#teacher-list')
                // .innerHTML += teacherCard(childData, count);
            }
        }

    });
});

function studentCard(sID, fullName, yearID) {
    var html = '';
    var imagesRef = `student_pic%2F${yearID}%2F${sID}.jpg`
    var urlIm = 'https://firebasestorage.googleapis.com/v0/b/math-web-kmitl.appspot.com/o/' + imagesRef + '?alt=media';
    // var urlIm = 'https://firebasestorage.googleapis.com/v0/b/math-web-kmitl2.appspot.com/o/' + imagesRef + '?alt=media';
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
    html += '<div class="txt34 dis-block p-b-6">' + fullName + '</div>';
    html += '<p class="t-center">';
    html += 'รหัสนักศึกษา : ' + sID + '</p>';
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

window.alert = function () {
    $("#myModal .modal-body").text(arguments[0]);
    $("#myModal").modal('show');
};