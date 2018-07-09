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
var researchRef = firebase.storage().ref().child('research_file');
//prepare to get teacher from firebase database
var tdRef = firebase.database().ref('teacher');
//load data once per refresh not realtime
var email_c = 0;
var phone_c = 0;
var education_c = 0;
var research_c = 0;
var spacial_c = 0;
var response_c = 0;
var researchLengthGlobal = 0;
var chk_file = 0;
tdRef.once('value', function (snapshot) {
    count = 0;
    //for in every child of data
    snapshot.forEach(function (childSnapshot) {
        count += 1;
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        if (childData.uid == localStorage.getItem('uid') && childData.status == 'teacher') {
            localStorage.setItem('id', pad(count));
            localStorage.setItem('pid', count);
            var fileName = 'user' + pad(count) + '.jpg';
            var imagesRef = 'user_pic%2F' + fileName;
            $('#avatar_p').attr('src', 'https://firebasestorage.googleapis.com/v0/b/math-web-kmitl.appspot.com/o/' + imagesRef + '?alt=media')
            $('#name-show').append(childData.name_en + ' ' + childData.surname_en + '<BR>' + childData.name + ' ' + childData.surname);
            document.getElementById('input-en-title').value = childData.title_en;
            document.getElementById('input-th-title').selectedIndex = document.getElementById('input-en-title').selectedIndex;
            document.getElementById('input-en-title').selectedIndex = document.getElementById('input-th-title').selectedIndex;
            document.getElementById('en_fname').value = childData.name_en;
            document.getElementById('en_lname').value = childData.surname_en;
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
            document.getElementById('homepage').value = childData.homepage;
            education_lst = childData.education;
            for (i = 0; i < education_lst.length; i++) {
                $('#all-education').append(appendEducation(education_lst[i], i))
                education_c = i;
            }
            spacial_lst = childData.specialized_interests;
            for (i = 0; i < spacial_lst.length; i++) {
                $('#all-spacial').append(appendSpacial(spacial_lst[i], i))
                spacial_c = i;
            }
            research_lst = childData.research;
            researchLengthGlobal = research_lst.length;
            try {
                research_f = childData.research_file
                sessionStorage.setItem('re_file', research_f)
            } catch (err) {

            }

            //console.log(typeof (research_lst));
            for (i = 0; i < research_lst.length; i++) {
                $('#all-research').append(appendResearch(research_lst[i], i))
                research_c = i;
            }

            response_lst = childData.responsible_course;
            for (i = 0; i < response_lst.length; i++) {
                $('#all-response').append(appendResponse(response_lst[i], i))
                response_c = i;
            }

        } else if (childData.uid == localStorage.getItem('uid') && childData.status == 'staff') {
            window.location.href = 'admin.html';
        }
        //     document.querySelector('#teacher-list')
        // .innerHTML += teacherCard(childData, count);
    });
    //retreive data for president
});

function reAuthen() {
    var user = firebase.auth().currentUser;
    var credential;
    user.reauthenticateWithCredential(credential).then(function () {
        // User re-authenticated.
    }).catch(function (error) {
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
        swal('ออกจากระบบ', 'เสร็จสิ้น!', "success").then(function (value) { window.location.href = 'index.html' });
    }).catch(function (error) {
        swal('กรุณาตรวจสอบ', 'เครือข่ายอินเทอร์เน็ต', "error");
        //console.log(error);
    });
}

function resetPassword() {
    var email = localStorage.getItem('email');
    firebase.auth().sendPasswordResetEmail(email).then(
        function () {
            swal('กรุณาตรวจสอบข้อความ', 'ที่เข้าอีเมลของคุณเพื่อเปลี่ยนรหัสผ่าน', "success");
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

function appendEducation(education, id) {
    html = "";
    if (id == 0) {
        html += '<div id="education0">'
        html += '<input type="text" class="form-control border-input sub_ed" placeholder="Education" value="' + education + '">'
        html += '</div>'
        return html
    } else {
        html += '<div style = "margin-top:5px;" id="education' + id + '">'
        html += '<div class="input-group">';
        html += '<input type="text" class="form-control border-input sub_ed" placeholder="Education" value="' + education + '">'
        html += '<div class="input-group-append">'
        html += '<span class="input-group-text delete" href="#" onclick="removeEducation(&quot;education' + id + '&quot;)">' + 'X' + '</span>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        return html
    }

}

function appendSpacial(spacial, id) {
    html = "";
    if (id == 0) {
        html += '<div id="spacial0">'
        html += '<input type="text" class="form-control border-input sub_sp" placeholder="Interest" value="' + spacial + '">'
        html += '</div>'
        return html
    } else {
        html += '<div style = "margin-top:5px;" id="spacial' + id + '">'
        html += '<div class="input-group">';
        html += '<input type="text" class="form-control border-input sub_sp" placeholder="Interest" value="' + spacial + '">'
        html += '<div class="input-group-append">'
        html += '<span class="input-group-text delete" href="#" onclick="removeSpacial(&quot;spacial' + id + '&quot;)">' + 'X' + '</span>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        return html
    }

}

function appendResearch(research, id) {
    html = "";
    if (id == 0) {
        html += '<div id="research0">'
        html += '<div class="input-group">'
        html += '<textarea rows="3" class="form-control border-input sub_rs" placeholder="Here can be your description" value="Research">' + research + '</textarea>'
        html += '<div class="input-group-append">'
        html += '<span class="btn btn-primary btn-file upload">  Browse <input id="research' + id + '-file" type="file" accept="application/pdf" class="sub_rs_file"></span>'
        html += '<span class="input-group-text delete" href="#" onclick="removeResearch(&quot;research' + id + '&quot;)">' + 'X' + '</span>';
        html += '</div>'
        html += '</div>'
        html += '</div>'
        return html
    } else {
        html += '<div style = "margin-top:5px;" id="research' + id + '">'
        html += '<div class="input-group">';
        html += '<textarea rows="3" class="form-control border-input sub_rs" placeholder="Here can be your description" value="Research">' + research + '</textarea>'
        html += '<div class="input-group-append">'
        html += '<span class="btn btn-primary btn-file upload">  Browse <input id="research' + id + '-file"  type="file" accept="application/pdf" class="sub_rs_file"></span>'
        html += '<span class="input-group-text delete" href="#" onclick="removeResearch(&quot;research' + id + '&quot;)">' + 'X' + '</span>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        return html
    }

}

function appendResponse(response, id) {
    html = "";
    if (id == 0) {
        html += '<div id="response0">'
        html += '<input type="text" class="form-control border-input sub_rp" placeholder="รายวิชาที่รับผิดชอบ" value="' + response + '">'
        html += '</div>'
        return html
    } else {
        html += '<div style = "margin-top:5px;" id="response' + id + '">'
        html += '<div class="input-group">';
        html += '<input type="text" class="form-control border-input sub_rp" placeholder="Interest" value="' + response + '">'
        html += '<div class="input-group-append">'
        html += '<span class="input-group-text delete" href="#" onclick="removeResponse(&quot;response' + id + '&quot;)">' + 'X' + '</span>';
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

function createEducation() {
    education_c += 1;
    html = "";
    html += '<div style = "margin-top:5px;" id="education' + education_c + '">'
    html += '<div class="input-group">';
    html += '<input type="text" class="form-control border-input sub_ed" placeholder="Education">'
    html += '<div class="input-group-append">'
    html += '<span class="input-group-text delete" href="#" onclick="removeEducation(&quot;education' + education_c + '&quot;)">' + 'X' + '</span>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    $('#all-education').append(html);
}

function createSpacial() {
    spacial_c += 1;
    html = "";
    html += '<div style = "margin-top:5px;" id="spacial' + spacial_c + '">'
    html += '<div class="input-group">';
    html += '<input type="text" class="form-control border-input sub_sp" placeholder="Interest">'
    html += '<div class="input-group-append">'
    html += '<span class="input-group-text delete" href="#" onclick="removeSpacial(&quot;spacial' + spacial_c + '&quot;)">' + 'X' + '</span>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    $('#all-spacial').append(html);
}

function createResearch() {
    research_c += 1;
    researchLengthGlobal += 1;
    html = "";
    html += '<div style = "margin-top:5px;" id="research' + research_c + '">'
    html += '<div class="input-group">';
    html += '<textarea rows="3" class="form-control border-input sub_rs" placeholder="Here can be your description" value="Research"></textarea>'
    html += '<div class="input-group-append">'
    html += '<span class="btn btn-primary btn-file upload">  Browse <input id="research' + research_c + '-file"  type="file" accept="application/pdf" class="sub_rs_file"></span>'
    html += '<span class="input-group-text delete" href="#" onclick="removeResponse(&quot;research' + research_c + '&quot;)">' + 'X' + '</span>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    $('#all-research').append(html);
}

function createResponse() {
    response_c += 1;
    html = "";
    html += '<div style = "margin-top:5px;" id="response' + response_c + '">'
    html += '<div class="input-group">';
    html += '<input type="text" class="form-control border-input sub_rp" placeholder="Response Subject">'
    html += '<div class="input-group-append">'
    html += '<span class="input-group-text delete" href="#" onclick="removeResponse(&quot;response' + response_c + '&quot;)">' + 'X' + '</span>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    $('#all-response').append(html);
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

function removeEducation(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
    phone_c -= 1;
}

function removeSpacial(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
    spacial_c -= 1;
}

function removeResearch(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
    research_c -= 1;
    researchLengthGlobal -= 1;
}

function removeResponse(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
    response_c -= 1;
}

function saveData() {
    var teacher = tdRef.child('user' + localStorage.getItem('id'));
    var file = $('#profile_pic').get(0).files[0];
    var file_exten = '';
    if (file) {
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
                swal('ข้อมูลผิดพลาด', 'โปรดตรวจสอบ', "error");
            });
    } else if (file_exten != '') {
        swal('กรุณาอัพโหลด', 'ไฟล์นามสกุล .jpg', "warning");
        check_pic = 0;
    }
    if ((researchLengthGlobal) >= 0) {
        for (i = 0; i < researchLengthGlobal; i++) {
            // console.log(researchLengthGlobal)
            var fileResearch = $('#research' + i + '-file').get(0).files[0];
            if (fileResearch != undefined) {
                researchRef.child('user' + localStorage.getItem('id') + '-file' + i + '.pdf').put(fileResearch)
                    .then(function (resp) {
                    })
                    .catch(function (error) {
                        swal('ข้อมูลผิดพลาด', 'โปรดตรวจสอบ', "error");
                    });
            }
        }
    }

    if (check_pic == 1) {

        teacher.update(JSON.parse(createJSON())).then(function (resp) {
            // alert('success');
            swal('อัพเดทข้อมูล', 'เสร็จสิ้น!', "success").then(function (value) { window.location.href = 'user.html'; });
        }).catch(function (error) {
            swal('ข้อมูลผิดพลาด', 'โปรดตรวจสอบ', "error");
            // //console.log(error);
        });
    }
}

function createJSON() {
    var ed = new Array();
    var em = new Array();
    var ph = new Array();
    var sp = new Array();
    var rs = new Array();
    var rsf = new Array();
    var rp = new Array();
    for (i = 0; i < $('.sub_ed').length; i++) {
        ed.push('"' + $('.sub_ed')[i].value + '"');
    }
    for (i = 0; i < $('.sub_em').length; i++) {
        if (validateEmail($('.sub_em')[i].value)) {
            em.push('"' + $('.sub_em')[i].value + '"');
        }
        else {
            swal("คำเตือน", "กรุณากรอกอีเมลล์ในช่องที่ " + String(i + 1) + " ให้ถูกต้อง", "warning")
            return
        }
    }
    for (i = 0; i < $('.sub_ph').length; i++) {
        ph.push('"' + $('.sub_ph')[i].value + '"');
    }
    for (i = 0; i < $('.sub_sp').length; i++) {
        sp.push('"' + $('.sub_sp')[i].value + '"');
    }
    for (i = 0; i < $('.sub_rs').length; i++) {
        rs.push('"' + $('.sub_rs')[i].value + '"');
    }
    for (i = 0; i < $('.sub_rs_file').length; i++) {
        if ($('.sub_rs_file')[i].value != "") {
            chk_file += 1
            rsf.push('"' + 'user' + localStorage.getItem('id') + '-file' + (i) + '"');
        }
    }
    try {
        if (sessionStorage.getItem('re_file').toString().split(",").length > 1) {
            for (i = 0; i < sessionStorage.getItem('re_file').toString().split(",").length; i++) {
                if (sessionStorage.getItem('re_file').toString().split(",")[i] != "undefined") {
                    rsf.push('"' + sessionStorage.getItem('re_file').toString().split(",")[i] + '"');
                }
            }
        }
        else if (sessionStorage.getItem('re_file') != "undefined") {
            rsf.push('"' + sessionStorage.getItem('re_file') + '"');
        }
    }
    catch (err) {

    }
    for (i = 0; i < $('.sub_rp').length; i++) {
        rp.push('"' + $('.sub_rp')[i].value + '"');
    }
    var json_str = "";
    json_str += '{';
    json_str += '"education" : [' + ed.toString() + '],';
    json_str += '"email" : [' + em.toString() + '],';
    json_str += '"tel" : [' + ph.toString() + '],';
    json_str += '"specialized_interests" : [' + sp.toString() + '],';
    json_str += '"research" : [' + rs.toString() + '],';
    if (chk_file > 0) {
        json_str += '"research_file" : [' + rsf.toString() + '],';
    }
    json_str += '"responsible_course" : [' + rp.toString() + '],';
    json_str += '"name" : "' + document.getElementById('th_fname').value + '",';
    json_str += '"surname" : "' + document.getElementById('th_lname').value + '",';
    json_str += '"name_en" : "' + document.getElementById('en_fname').value + '",';
    json_str += '"surname_en" : "' + document.getElementById('en_lname').value + '",';
    if (document.getElementById('input-th-title').value != "กรุณาเลือกคำนำหน้า") {
        json_str += '"title" : "' + document.getElementById('input-th-title').value + '",';
    }
    else {
        swal('กรุณาเลือก', 'คำนำหน้า', "warning");
        return
    }
    if (document.getElementById('input-en-title').value != "กรุณาเลือกคำนำหน้า") {
        json_str += '"title_en" : "' + document.getElementById('input-en-title').value + '",';
    }
    else {
        swal('กรุณาเลือก', 'คำนำหน้า', "warning");
        return
    }
    if (document.getElementById('rest_room').value != "กรุณาเลือกห้องพัก" || document.getElementById('rest_room').value == "") {
        json_str += '"room" : "' + document.getElementById('rest_room').value + '",';
    }
    else {
        swal('กรุณาเลือก', 'ห้องพัก', "warning");
        return
    }
    json_str += '"homepage" : "' + document.getElementById('homepage').value + '"';
    json_str += '}';
    return json_str;
}
//pad number one length with zero
function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

window.alert = function () {
    $("#myModal .modal-body").text(arguments[0]);
    $("#myModal").modal('show');
};