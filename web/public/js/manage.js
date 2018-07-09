//config to connect to firebase
var config = {
    apiKey: "AIzaSyDHN6epAFTpGwywxeqKpc1vzNERGLYfguE",
    authDomain: "math-web-kmitl.firebaseapp.com",
    databaseURL: "https://math-web-kmitl.firebaseio.com",
    projectId: "math-web-kmitl",
    storageBucket: "math-web-kmitl.appspot.com",
};
firebase.initializeApp(config);

//prepare to get teacher from firebase database
var tdRef = firebase.database().ref('teacher');
//load data once per refresh not realtime
tdRef.once('value', function (snapshot) {
  count = 0;
  //for in every child of data
  snapshot.forEach(function (childSnapshot) {
    count += 1;
    var key = childSnapshot.key;
    var childData = childSnapshot.val();
    var table = $('#teacher-table tbody');
    table.append(teacherTab(childData, pad(count),key));
  });
  page();
});

function teacherTab(teacher, id, key){
    var html = '';
    html += '<tr>';
    html += '<td>'+teacher.name+'</td>';
    html += '<td>'+teacher.surname+'</td>';
    html += '<td>'+teacher.email_login+'</td>';
    html += '<td>'+teacher.uid+'</td>';
    html += '<td>' + '<button class="btn btn-del" onclick = "deleteTeacher(this.id)" id="' + key + '">' + 'Delete' + '</button>' + '</td>';
    html += '</tr>';
    return html;
}

//pad number one length with zero
function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
  }
  
  window.alert = function () {
    $("#myModal .modal-body").text(arguments[0]);
    $("#myModal").modal('show');
};

function signOut() {
  firebase.auth().signOut().then(function () {
      localStorage.clear();
      alert('ออกจากระบบเสร็จสิ้น');
      window.location.href = 'index.html';
  }).catch(function (error) {
      //console.log(error);
  });
}

function resetPassword() {
  var email = localStorage.getItem('email');
  firebase.auth().sendPasswordResetEmail(email).then(
      function () {
          alert('กรุณาตรวจสอบข้อความที่เข้าอีเมลของคุณเพื่อเปลี่ยนรหัสผ่าน');
      }).catch(
          function (error) {
              alert('กรุณาตรวจสอบเครือข่ายอินเทอร์เน็ต');
              //console.log(error);
          }
      )
}

function deleteTeacher(id) {
    swal({
        title: "คำเตือน",
        text: "ถ้าคุณลบแล้วจะไม่สามารถกู้ข้อมูลกลับมาได้อีก",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                tdRef.child(id).remove();
                swal("ข้อมูลบุคลากรคนนี้ถูกลบไปแล้ว", {
                    icon: "success",
                }).then(function (value) { window.location.href = 'manage.html' });
            }
        });
}
function page() {
    $('#teacher-table').DataTable();
}