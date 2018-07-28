//config to connect to firebase 'math-web-kmitl-gallery'
var config = {
    apiKey: "AIzaSyBn6rrMZkB4eFq_XWT9iLawqLw3z-QYyac",
    authDomain: "math-web-kmitl-gallery.firebaseapp.com",
    databaseURL: "https://math-web-kmitl-gallery.firebaseio.com",
    projectId: "math-web-kmitl-gallery",
    storageBucket: "math-web-kmitl-gallery.appspot.com",
    messagingSenderId: "1016085984216"
};
firebase.initializeApp(config);

var eventOtherPicRef = firebase.storage().ref().child('event_other_pic');

var eventOtherRef = firebase.database().ref('event_other');

//show button upload and delete
$("#img1").on('change', function (e) {
    file1 = e.target.files[0]
    document.getElementById('input button img1').hidden = false
    document.getElementById('upload button1').hidden = false
})
$("#img2").on('change', function (e) {
    file2 = e.target.files[0]
    document.getElementById('input button img2').hidden = false
    document.getElementById('upload button2').hidden = false
})
$("#img3").on('change', function (e) {
    file3 = e.target.files[0]
    document.getElementById('input button img3').hidden = false
    document.getElementById('upload button3').hidden = false
})
$("#img4").on('change', function (e) {
    file4 = e.target.files[0]
    document.getElementById('input button img4').hidden = false
    document.getElementById('upload button4').hidden = false
})
$("#img5").on('change', function (e) {
    file5 = e.target.files[0]
    document.getElementById('input button img5').hidden = false
    document.getElementById('upload button5').hidden = false
})
$("#img6").on('change', function (e) {
    file6 = e.target.files[0]
    document.getElementById('input button img6').hidden = false
    document.getElementById('upload button6').hidden = false
})
//delete file
function inputImg1() {
    document.getElementById('input button img1').hidden = true
    document.getElementById('upload button1').hidden = true
    document.getElementById("img1").value = "";
}
function inputImg2() {
    document.getElementById('input button img2').hidden = true
    document.getElementById('upload button2').hidden = true
    document.getElementById("img2").value = "";
}
function inputImg3() {
    document.getElementById('input button img3').hidden = true
    document.getElementById('upload button3').hidden = true
    document.getElementById("img3").value = "";
}
function inputImg4() {
    document.getElementById('input button img4').hidden = true
    document.getElementById('upload button4').hidden = true
    document.getElementById("img4").value = "";
}
function inputImg5() {
    document.getElementById('input button img5').hidden = true
    document.getElementById('upload button5').hidden = true
    document.getElementById("img5").value = "";
}
function inputImg6() {
    document.getElementById('input button img6').hidden = true
    document.getElementById('upload button6').hidden = true
    document.getElementById("img6").value = "";
}

var files

//upload image to firebase storage
function uploadImg1(){
    eventOtherPicRef.child('event_1').put(file1).then(snapshot => {
        return snapshot.ref.getDownloadURL();
    })
    .then(downloadURL => {
        eventOtherRef.child('event_1').set(downloadURL)
    })
    inputImg1()
}
function uploadImg2(){
    eventOtherPicRef.child('event_2').put(file2).then(snapshot => {
        return snapshot.ref.getDownloadURL();
    })
    .then(downloadURL => {
        eventOtherRef.child('event_2').set(downloadURL)
    })
    inputImg2()
}
function uploadImg3(){
    eventOtherPicRef.child('event_3').put(file3).then(snapshot => {
        return snapshot.ref.getDownloadURL();
    })
    .then(downloadURL => {
        eventOtherRef.child('event_3').set(downloadURL)
    })
    inputImg3()
}
function uploadImg4(){
    eventOtherPicRef.child('event_4').put(file4).then(snapshot => {
        return snapshot.ref.getDownloadURL();
    })
    .then(downloadURL => {
        eventOtherRef.child('event_4').set(downloadURL)
    })
    inputImg4()
}
function uploadImg5(){
    eventOtherPicRef.child('event_5').put(file5).then(snapshot => {
        return snapshot.ref.getDownloadURL();
    })
    .then(downloadURL => {
        eventOtherRef.child('event_5').set(downloadURL)
    })
    inputImg5()
}
function uploadImg6(){
    eventOtherPicRef.child('event_6').put(file6).then(snapshot => {
        return snapshot.ref.getDownloadURL();
    })
    .then(downloadURL => {
        eventOtherRef.child('event_6').set(downloadURL)
    })
    inputImg6()
}

//on URL from firebase database

eventOtherRef.child('event_1').once('value', function (snapshot) {
    $('#img_other1').append(refresh_imgo_other1(snapshot.val()));
})
eventOtherRef.child('event_2').once('value', function (snapshot) {
    $('#img_other2').append(refresh_imgo_other2(snapshot.val()));
})
eventOtherRef.child('event_3').once('value', function (snapshot) {
    $('#img_other3').append(refresh_imgo_other3(snapshot.val()));
})
eventOtherRef.child('event_4').once('value', function (snapshot) {
    $('#img_other4').append(refresh_imgo_other4(snapshot.val()));
})
eventOtherRef.child('event_5').once('value', function (snapshot) {
    $('#img_other5').append(refresh_imgo_other5(snapshot.val()));
})
eventOtherRef.child('event_6').once('value', function (snapshot) {
    $('#img_other6').append(refresh_imgo_other6(snapshot.val()));
})

function refresh_imgo_other1(Pic1) {
    var html = '';
    html += '<img src="' + Pic1 + '" alt="IMG-MENU">';
    html += "<div class='overlay-item-gallery trans-0-4 flex-c-m'>";
    html += '<a class="btn-show-gallery flex-c-m fa fa-search" href="' + Pic1 + '"data-lightbox="gallery"';
    html += "</a>";
    html += "</div>";
    return html;
}
function refresh_imgo_other2(Pic2) {
    var html = '';
    html += '<img src="' + Pic2 + '" alt="IMG-MENU">';
    html += "<div class='overlay-item-gallery trans-0-4 flex-c-m'>";
    html += '<a class="btn-show-gallery flex-c-m fa fa-search" href="' + Pic2 + '"data-lightbox="gallery"';
    html += "</a>";
    html += "</div>";
    return html;
}
function refresh_imgo_other3(Pic3) {
    var html = '';
    html += '<img src="' + Pic3 + '" alt="IMG-MENU">';
    html += "<div class='overlay-item-gallery trans-0-4 flex-c-m'>";
    html += '<a class="btn-show-gallery flex-c-m fa fa-search" href="' + Pic3 + '"data-lightbox="gallery"';
    html += "</a>";
    html += "</div>";
    return html;
}
function refresh_imgo_other4(Pic4) {
    var html = '';
    html += '<img src="' + Pic4 + '" alt="IMG-MENU">';
    html += "<div class='overlay-item-gallery trans-0-4 flex-c-m'>";
    html += '<a class="btn-show-gallery flex-c-m fa fa-search" href="' + Pic4 + '"data-lightbox="gallery"';
    html += "</a>";
    html += "</div>";
    return html;
}
function refresh_imgo_other5(Pic5) {
    var html = '';
    html += '<img src="' + Pic5 + '" alt="IMG-MENU">';
    html += "<div class='overlay-item-gallery trans-0-4 flex-c-m'>";
    html += '<a class="btn-show-gallery flex-c-m fa fa-search" href="' + Pic5 + '"data-lightbox="gallery"';
    html += "</a>";
    html += "</div>";
    return html;
}
function refresh_imgo_other6(Pic6) {
    var html = '';
    html += '<img src="' + Pic6 + '" alt="IMG-MENU">';
    html += "<div class='overlay-item-gallery trans-0-4 flex-c-m'>";
    html += '<a class="btn-show-gallery flex-c-m fa fa-search" href="' + Pic6 + '"data-lightbox="gallery"';
    html += "</a>";
    html += "</div>";
    return html;
}