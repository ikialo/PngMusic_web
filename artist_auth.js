var audio;

var db = firebase.database();



function stopButton() {
  audio.pause();
  audio.currentTime = 0;

}
function onclickListMuicsItem(e) {


  if (audio != null) {
    audio.pause();
    audio.currentTime = 0;
  }
  //get the element that is clicked

  var user = firebase.auth().currentUser;
  var ele = e.target;

  //get the element id of the element that is clicked


  //get the element 'rel attribute of the element that is clicked
  var eleRel = ele.getAttribute('rel');
  console.log('on click list ' + eleRel)
  var artistdb = firebase.database();

  var thisArtistDB = artistdb.ref("Artists/" + user.uid + "/Songs");

  thisArtistDB.on('value', function (snapshot) {

    snapshot.forEach(function (childSnapShot) {

      var song = childSnapShot.child("SongName").val();

      if (song == eleRel) {


        audio = new Audio(childSnapShot.child("URL").val());
        audio.play();


      }

    })
  })

}

function signout() {
  firebase.auth().signOut().then(function () {
    console.log('Signed Out');

    window.location.href = "index.html";

  }, function (error) {
    console.error('Sign Out Error', error);
  });
}


function SongLisdisplay(user) {
  var storageRef = firebase.storage().ref();


  if (user) {
    // Create a reference under which you want to list
    var listRef = storageRef.child(user.uid);
    var ul = document.createElement('ul');

    document.getElementById('SongList').appendChild(ul);
    // Find all the prefixes and items.
    listRef.listAll().then(function (res) {
      res.prefixes.forEach(function (folderRef) {
        // All the prefixes under listRef.
        // You may call listAll() recursively on them.
      });
      res.items.forEach(function (itemRef) {
        // All the items under listRef.
        console.log('list item')
        let li = document.createElement('li');
        ul.appendChild(li);

        li.style.borderBottomColor = 'red';
        li.style.marginBottom = '20px'
        li.style.color = "white"

        li.innerHTML += itemRef.name;
        li.setAttribute("rel", itemRef.name);
        li.onclick = addEventListener('click', onclickListMuicsItem);

      });



    }).catch(function (error) {
      // Uh-oh, an error occurred!
    });

  } else {
    console.log("no user")
  }
}


firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.

    user.getIdTokenResult().then(idTokenResults => {
      console.log(idTokenResults.claims.adminmmm)

      var admin = idTokenResults.claims.adminmmm;

      if (admin) {

        if (user.displayName === null) {
          window.location.href = "registration.html";

        } else {
          SongLisdisplay(user);

          var nameDis = "Signed In as " + user.displayName;
          document.getElementById("userName").innerHTML = nameDis;

        }



      }
      else {
        alert("Not Signed in as Artist/Band")
        window.location.href = "index.html";

      }


    })

    // Or inserted into an <img> element:


  } else {
    // No user is signed in.

    alert('no sign in')
    window.location.href = "sign_in.html";


  }
});



function uploadFile() {

  // Created a Storage Reference with root dir
  var user = firebase.auth().currentUser;

  if (user) {
    // User is signed in.

    userGlobe = user;
    var databa = firebase.database();
    var storageRef = firebase.storage().ref();
    // Get the file from DOM
    var file = document.getElementById("files").files;
    console.log(file);

    //dynamically set reference to the file name
    var thisDb = databa.ref("Artists/" + user.uid);

    thisDb.set({
      ArtistName: user.displayName
    })

    for (var i = 0; i < file.length; i++) {

      var fileName = file[i].name;
      var thisRef = storageRef.child(user.uid + "/" + fileName);

      thisRef.put(file[i]).then(function (snapshot) {
        //alert("File Uploaded")
        console.log('Uploaded a blob or file!');

        snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log('File available at', downloadURL);

          console.log(snapshot.ref.name)
          thisDb.child("Songs").push({
            SongName: snapshot.ref.name,
            URL: downloadURL,
          })
        });


      });
    }




    //put request upload file to firebase storage

  } else {
    // No user is signed in.

    window.location.href = "Signin.html";


  }


}
