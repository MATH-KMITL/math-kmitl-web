//config to connect to firebase
var config = {
    apiKey: "AIzaSyDHN6epAFTpGwywxeqKpc1vzNERGLYfguE",
    authDomain: "math-web-kmitl.firebaseapp.com",
    databaseURL: "https://math-web-kmitl.firebaseio.com",
    projectId: "math-web-kmitl",
    storageBucket: "math-web-kmitl.appspot.com",
};
firebase.initializeApp(config);
var tdRef = firebase.database().ref('teacher');
var pd = firebase.database().ref('president');
//load data once per refresh not realtime
tdRef.once('value', function (snapshot) {
  count = 0;
  //for in every child of data
  snapshot.forEach(function (childSnapshot) {
    count += 1;
    var key = childSnapshot.key;
    var childData = childSnapshot.val();
    $('#president_choose').append(createOption(childData.title, childData.name, childData.surname, key, pad(count)));
    sessionStorage.setItem('id', pad(count+1));
  });
});

function createOption(title, name, surname, key, count){
    html = '<option value="'+key+'-'+count+'">'+title+' '+name+' '+surname+'</option>';
    return html
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

function changePresident(){
    var president = document.getElementById('president_choose').value;
    if(president == "กรุณาเลือกอาจารย์"){
        swal('คำเตือน', 'กรุณาเลือกอาจารย์', "warning");
    }else{
            pd.set(president).then(function (resp2) {
                // alert('success');
                swal('อัพเดทข้อมูล','เสร็จสิ้น!','success').then(function (value){ window.location.href = 'manage.html';});
            }).catch(function (error) {
                swal('กรุณาตรวจสอบ', 'เครือข่ายอินเทอร์เน็ต', "error");
                // //console.log(error);
            });
        }
 
}

function createAccount(){
    var email = document.getElementById('email_login').value.trim();
    if (validateEmail(email)){
    var password = document.getElementById('pass').value;
    var ver_password = document.getElementById('ver_pass').value;
    var teacher = tdRef.child('user' + sessionStorage.getItem('id'));
    if(password.lenght < 8){
        alert('พาสเวิร์ดต้องมีความยาว 8 ตัวอักษรขึ้นไป');
    }else if(password == ver_password){
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(resp){
            teacher.set(JSON.parse(createJSON(resp.uid))).then(function (resp2) {
                // alert('success');
                swal('อัพเดทข้อมูล','เสร็จสิ้น!','success').then(function (value){ window.location.href = 'manage.html';});
            }).catch(function (error) {
                swal('กรุณาตรวจสอบ', 'เครือข่ายอินเทอร์เน็ต', "error");
                // //console.log(error);
            });
            
        }).catch(function(error) {
            // Handle Errors here.
            swal('คำเตือน', 'กรุณากรอกอีเมลล์ให้ถูกต้อง', "warning");
          });  
    }else{
        swal('คำเตือน', 'กรุณายืนยันรหัสผ่านให้ถูกต้อง', "warning");
    }
    }
    else{
        swal('คำเตือน', 'กรุณากรอกอีเมลล์ให้ถูกต้อง', "warning");
    }
}

function createJSON(uid) {
    var email = document.getElementById('email_login').value;
    var json_str = "";
    json_str += '{';
    json_str += '"uid":"'+uid+'",';
    json_str += '"education" : [""],';
    json_str += '"email" : [""],';
    json_str += '"tel" : [""],';
    json_str += '"specialized_interests" : [""],';
    json_str += '"research" : [""],';
    json_str += '"responsible_course" : [""],';
    json_str += '"status":"teacher",';
    json_str += '"email_login":"'+email+'"';
    json_str += '}';
    return json_str;
}

function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
  }
  
  window.alert = function () {
    $("#myModal .modal-body").text(arguments[0]);
    $("#myModal").modal('show');
};

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }