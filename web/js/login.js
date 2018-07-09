var config = {
  apiKey: "AIzaSyDHN6epAFTpGwywxeqKpc1vzNERGLYfguE",
  authDomain: "math-web-kmitl.firebaseapp.com",
  databaseURL: "https://math-web-kmitl.firebaseio.com",
  projectId: "math-web-kmitl",
  storageBucket: "math-web-kmitl.appspot.com",
};
if (localStorage.getItem('uid')) {
  window.location.href = 'user.html';
}
firebase.initializeApp(config);
var tdRef = firebase.database().ref('teacher');
function Login() {
  var email = document.getElementById('username').value.trim();
  var password = document.getElementById('password').value;
  if (validateEmail(email)) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function (resp) {
        localStorage.setItem("uid", resp.uid);
        localStorage.setItem("email", resp.email)
        tdRef.once('value', function (snapshot) {
          count = 0;
          //for in every child of data
          snapshot.forEach(function (childSnapshot) {
            count += 1;
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            if (childData.uid == localStorage.getItem('uid')) {
              if (childData.status == 'teacher') {
                swal("การเข้าสู่ระบบ!", "เสร็จสิ้น!", "success").then(function (test) { window.location.href = 'user.html'; });

              }
              else if (childData.status == 'staff') {
                swal("การเข้าสู่ระบบ!", "เสร็จสิ้น!", "success").then(function (test) { window.location.href = 'admin.html'; })
              }
            }
            //     document.querySelector('#teacher-list')
            // .innerHTML += teacherCard(childData, count);
          });
          //retreive data for president
        });
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          swal("คำเตือน", "รหัสผ่านไม่ถูกต้อง!", "error")
        } else {
          swal("คำเตือน", "โปรดตรวจสอบระบบอินเทอร์เน็ต", "error")
        }
      });
  }
  else {
    swal("คำเตือน", "กรุณากรอกอีเมลให้ถูกต้อง", "warning")
  }


}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

window.alert = function () {
  $("#myModal .modal-body").text(arguments[0]);
  $("#myModal").modal('show');
};