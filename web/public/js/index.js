var secondaryAppConfig = {
    apiKey: "AIzaSyDHN6epAFTpGwywxeqKpc1vzNERGLYfguE",
    authDomain: "math-web-kmitl.firebaseapp.com",
    databaseURL: "https://math-web-kmitl.firebaseio.com",
    projectId: "math-web-kmitl",
    storageBucket: "math-web-kmitl.appspot.com",
    messagingSenderId: "481311539108"
}

var secondary = firebase.initializeApp(secondaryAppConfig, "secondary");

secondary.database().ref('video_intro').once('value', snapshort => {
    document.getElementById('video-intro').src = `https://www.youtube.com/embed/${snapshort.val()}?rel=0&amp;showinfo=0`
})