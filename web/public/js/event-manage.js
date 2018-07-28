//config to connect to firebase
var config = {
    apiKey: "AIzaSyBn6rrMZkB4eFq_XWT9iLawqLw3z-QYyac",
    authDomain: "math-web-kmitl-gallery.firebaseapp.com",
    databaseURL: "https://math-web-kmitl-gallery.firebaseio.com",
    projectId: "math-web-kmitl-gallery",
    storageBucket: "math-web-kmitl-gallery.appspot.com",
    messagingSenderId: "1016085984216"
};
firebase.initializeApp(config);

//prepare to get image from firebase database / storage
var spRef = firebase.database().ref('category');
var StgRef = firebase.storage().ref('event');

//load data once per refresh not realtime
spRef.once('value', function (snapshot) {
    //for in every child of data
    snapshot.forEach(function (category) {
        // var key = category.key;
        var categoryData = category.val();
        // add img zone 
        Object.keys(categoryData.image).forEach(function (imgKey) {
            const key = [categoryData.originalName, category.key, imgKey, categoryData.image[imgKey].name].join('-splitter-')
            $('#imgEvent-table').append(imgTab(key, categoryData.displayName, categoryData.image[imgKey].url));
        })
    });
    $('#imgEvent-table').DataTable({
        "columns": [
            { "width": "35%", className: "columnDataTable" },
            { "width": "25%", className: "columnDataTable" },
            { "width": "25%", className: "columnDataTable" },
            { "width": "15%", className: "columnDataTable" }
        ]
    });
});

function imgTab(key, categoryName, img) {
    const imgFullName = key.split('-splitter-')[3]
    var html = '';
    html += '<tr>';
    // html += `<td> <img class="img" src="${urlIm}" /> </td>`; 
    html += ` <td> <div class="item-gallery-main isotope-item bo-rad-10 hov-img-zoom events ">`
    html += `<img src="${img}" alt="IMG-GALLERY">`
    html += '<div class="overlay-item-gallery trans-0-4 flex-c-m">'
    html += `<a class="btn-show-gallery flex-c-m " href=${img} data-lightbox="gallery"><div class="fa fa-search"></div></a>`
    html += '</div>'
    html += '</div>  </td>'
    html += `<td> ${categoryName} </td>`;
    html += `<td> ${imgFullName} </td>`;
    html += `<td> <button class="btn btn-del" onclick = "deleteEvent(this.id)" id="${key}"> Delete </button> </td>`;
    html += '</tr>';
    return html;
}

window.alert = function () {
    $("#myModal .modal-body").text(arguments[0]);
    $("#myModal").modal('show');
};

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

function page() {
    $('#imgEvent-table').DataTable();
}

function deleteEvent(id) {
    swal({
        title: "คำเตือน",
        text: "ถ้าคุณลบแล้วจะไม่สามารถกู้ข้อมูลกลับมาได้อีก",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then(async (willDelete) => {
            if (willDelete) {
                const temp = id.split('-splitter-')
                const categoryOriginalName = temp[0]
                const categoryKey = temp[1]
                const imgKey = temp[2]
                const imgFullName = temp[3]
                await spRef.child(`${categoryKey}/image/${imgKey}`).remove()
                const refForStorage = `${categoryOriginalName}(ctgKey ${categoryKey})/(imgKey ${imgKey})${imgFullName}`
                await StgRef.child(refForStorage).delete()
                swal("ข้อมูลรูปภาพนี้ถูกลบไปแล้ว", {
                    icon: "success",
                }).then(function (value) { window.location.href = 'event-manage.html' });
            }
        });
}
