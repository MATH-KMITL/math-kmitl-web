var eventPicRef = firebase.storage().ref().child('event_comming_pic');

var eventRef = firebase.database().ref('event_comming');

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

var files

//upload image to firebase storage
function uploadImg1(){
    eventPicRef.child('event_1').put(file1).then(snapshot => {
        return snapshot.ref.getDownloadURL();
    })
    .then(downloadURL => {
       eventRef.child('event_1').set(downloadURL)
    })
    inputImg1()
}
function uploadImg2(){
    eventPicRef.child('event_2').put(file2).then(snapshot => {
        return snapshot.ref.getDownloadURL();
    })
    .then(downloadURL => {
       eventRef.child('event_2').set(downloadURL)
    })
    inputImg2()
}
function uploadImg3(){
    eventPicRef.child('event_3').put(file3).then(snapshot => {
        return snapshot.ref.getDownloadURL();
    })
    .then(downloadURL => {
       eventRef.child('event_3').set(downloadURL)
    })
    inputImg3()
}
function uploadImg4(){
    eventPicRef.child('event_4').put(file4).then(snapshot => {
        return snapshot.ref.getDownloadURL();
    })
    .then(downloadURL => {
       eventRef.child('event_4').set(downloadURL)
    })
    inputImg4()
}

//on URL from firebase database
eventRef.child('event_1').once('value', function (snapshot) {
    $('#img1').append(refresh_img1(snapshot.val()));
})
eventRef.child('event_2').once('value', function (snapshot) {
    $('#img2').append(refresh_img2(snapshot.val()));
})
eventRef.child('event_3').once('value', function (snapshot) {
    $('#img3').append(refresh_img3(snapshot.val()));
})
eventRef.child('event_4').once('value', function (snapshot) {
    $('#img4').append(refresh_img4(snapshot.val()));
})


function refresh_img1(Pic1) {
    var html = '';
    html += '<div class="item-ourmenu bo-rad-10 hov-img-zoom pos-relative m-t-30">';
    html += '<img src="' + Pic1 + '" alt="IMG-MENU">';
    html += "</div>";
    return html;
}
function refresh_img2(Pic2) {
    var html = '';
    html += '<div class="item-ourmenu bo-rad-10 hov-img-zoom pos-relative m-t-30">';
    html += '<img src="' + Pic2 + '" alt="IMG-MENU">';
    html += "</div>";
    return html;
}
function refresh_img3(Pic3) {
    var html = '';
    html += '<div class="item-ourmenu bo-rad-10 hov-img-zoom pos-relative m-t-30">';
    html += '<img src="' + Pic3 + '" alt="IMG-MENU">';
    html += "</div>";
    return html;
}
function refresh_img4(Pic4) {
    var html = '';
    html += '<div class="item-ourmenu bo-rad-10 hov-img-zoom pos-relative m-t-30">';
    html += '<img src="' + Pic4 + '" alt="IMG-MENU">';
    html += "</div>";
    return html;
}