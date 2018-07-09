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
var stRef = firebase.storage().ref().child('user_pic');
//prepare to get teacher from firebase database
var tdRef = firebase.database().ref('teacher');
//load data once per refresh not realtime
var email_c = 0;
var phone_c = 0;
var education_c = 0;
var research_c = 0;
var spacial_c = 0;
var response_c = 0;
tdRef.once('value', function (snapshot) {
    count = 0;
    //for in every child of data
    snapshot.forEach(function (childSnapshot) {
        count += 1;
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        if (childData.uid == localStorage.getItem('uid') && childData.status == 'staff') {
            localStorage.setItem('id', pad(count));
            localStorage.setItem('pid', count);
            var fileName = 'user' + pad(count) + '.jpg';
            var imagesRef = 'user_pic%2F' + fileName;
            $('#avatar_p').attr('src', 'https://firebasestorage.googleapis.com/v0/b/math-web-kmitl.appspot.com/o/' + imagesRef + '?alt=media')
            $('#name-show').append(childData.name + ' ' + childData.surname);
            document.getElementById('th_title').value = childData.title;
            document.getElementById('th_fname').value = childData.name;
            document.getElementById('th_lname').value = childData.surname;
            email_lst = childData.email;
            for (i = 0; i < email_lst.length; i++) {
                $('#all-email').append(appendEmail(email_lst[i], i))
                email_c = i;
            }
            phone_lst = childData.tel;
            for (i = 0; i < phone_lst.length; i++) {
                $('#all-phone').append(appendPhone(phone_lst[i], i))
                phone_c = i;
            }
            document.getElementById('rest_room').value = childData.room;
        }else if (childData.uid == localStorage.getItem('uid') && childData.status == 'teacher'){
            window.location.href = 'user.html';
        }
        //     document.querySelector('#teacher-list')
        // .innerHTML += teacherCard(childData, count);
    });
    //retreive data for president
});

function reAuthen() {
    var email = localStorage.getItem('email');
    var password = localStorage.getItem('pass');
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (resp) {
        })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Your password has change. Please Login again.');
                window.location.href = 'login.html';
            } else {
                alert('errorMessage');
            }
        });
}

function signOut() {
    firebase.auth().signOut().then(function () {
        localStorage.clear();
        swal('ออกจากระบบ', 'เสร็จสิ้น!',"success").then(function (value){window.location.href = 'index.html'});
    }).catch(function (error) {
        swal('กรุณาตรวจสอบ', 'เครือข่ายอินเทอร์เน็ต', "error");
        //console.log(error);
    });
}

function resetPassword() {
    var email = localStorage.getItem('email');
    firebase.auth().sendPasswordResetEmail(email).then(
        function () {
            swal('กรุณาตรวจสอบข้อความ', 'ที่เข้าอีเมลของคุณเพื่อเปลี่ยนรหัสผ่าน',"success");
        }).catch(
            function (error) {
                swal('กรุณาตรวจสอบ', 'เครือข่ายอินเทอร์เน็ต', "error");
                //console.log(error);
            }
        )
}

function appendEmail(email, id) {
    html = "";
    if (id == 0) {
        html += '<div id="email0">'
        html += '<input type="email" class="form-control border-input sub_em" placeholder="Email" value="' + email + '">'
        html += '</div>'
        return html
    } else {
        html += '<div style = "margin-top:5px;" id="email' + id + '">'
        html += '<div class="input-group">';
        html += '<input type="email" class="form-control border-input sub_em" placeholder="Email" value="' + email + '">'
        html += '<div class="input-group-append">'
        html += '<span class="input-group-text delete" href="#" onclick="removeEmail(&quot;email' + id + '&quot;)">' + 'X' + '</span>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        return html
    }

}

function appendPhone(phone, id) {
    html = "";
    if (id == 0) {
        html += '<div id="phone0">'
        html += '<input type="text" class="form-control border-input sub_ph" placeholder="Phone" value="' + phone + '">'
        html += '</div>'
        return html
    } else {
        html += '<div style = "margin-top:5px;" id="phone' + id + '">'
        html += '<div class="input-group">';
        html += '<input type="text" class="form-control border-input sub_ph" placeholder="Phone" value="' + phone + '">'
        html += '<div class="input-group-append">'
        html += '<span class="input-group-text delete" href="#" onclick="removePhone(&quot;phone' + id + '&quot;)">' + 'X' + '</span>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        return html
    }

}

function createEmail() {
    email_c += 1;
    html = "";
    html += '<div style = "margin-top:5px;" id="email' + email_c + '">'
    html += '<div class="input-group">';
    html += '<input type="text" class="form-control border-input sub_em" placeholder="Email">'
    html += '<div class="input-group-append">'
    html += '<span class="input-group-text delete" href="#" onclick="removeEmail(&quot;email' + email_c + '&quot;)">' + 'X' + '</span>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    $('#all-email').append(html);
}

function createPhone() {
    phone_c += 1;
    html = "";
    html += '<div style = "margin-top:5px;" id="phone' + phone_c + '">'
    html += '<div class="input-group">';
    html += '<input type="text" class="form-control border-input sub_ph" placeholder="Phone">'
    html += '<div class="input-group-append">'
    html += '<span class="input-group-text delete" href="#" onclick="removePhone(&quot;phone' + phone_c + '&quot;)">' + 'X' + '</span>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    $('#all-phone').append(html);
}


function removeEmail(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
    email_c -= 1;
}

function removePhone(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
    phone_c -= 1;
}

function saveData() {
    var teacher = tdRef.child('user' + localStorage.getItem('id'));
    var file = $('#profile_pic').get(0).files[0];
    var file_exten = '';
    if(file){
        file_exten = file.name.replace(/^.*\./, '');
    }
    var check_pic = 1;
    //console.log(file_exten);
    if (file && file_exten == 'jpg') {
        
            var task = stRef.child('user' + localStorage.getItem('id') + '.' + file_exten).put(file);
            task
                .then(function (resp) {
                })
                .catch(function (error) {
                    swal('ข้อมูลผิดพลาด','โปรดตรวจสอบ',"error");
                });
    } else if (file_exten!=''){
        swal('กรุณาอัพโหลด','ไฟล์นามสกุล .jpg',"warning");
        //console.log('che');
        check_pic = 0;
    }
    if (check_pic == 1) {
        
        teacher.update(JSON.parse(createJSON())).then(function (resp) {
            // alert('success');
            swal('อัพเดทข้อมูล', 'เสร็จสิ้น!', "success").then(function (value){window.location.href = 'admin.html';});
        }).catch(function (error) {
            swal('ข้อมูลผิดพลาด','โปรดตรวจสอบ',"error");
            // //console.log(error);
        });
    }
}

function createJSON() {
    var em = new Array();
    var ph = new Array();
    for (i = 0; i < $('.sub_em').length; i++) {
        em.push('"' + $('.sub_em')[i].value + '"');
    }
    for (i = 0; i < $('.sub_ph').length; i++) {
        ph.push('"' + $('.sub_ph')[i].value + '"');
    }
    var json_str = "";
    json_str += '{';
    json_str += '"email" : [' + em.toString() + '],';
    json_str += '"tel" : [' + ph.toString() + '],';
    json_str += '"name" : "' + document.getElementById('th_fname').value + '",';
    json_str += '"surname" : "' + document.getElementById('th_lname').value + '",';
    json_str += '"title" : "' + document.getElementById('th_title').value + '",';
    json_str += '"room" : "' + document.getElementById('rest_room').value+'"';
    json_str += '}';
    return json_str;
}
//pad number one length with zero
function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}

window.alert = function () {
    $("#myModal .modal-body").text(arguments[0]);
    $("#myModal").modal('show');
};