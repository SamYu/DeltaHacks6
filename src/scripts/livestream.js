

$("#checkbox").change(function() {
    if(this.checked) {
        let video = document.getElementById("player");
        video.style.display = "block";

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        navigator.mediaDevices.getUserMedia({ 
            audio: false, 
            video: true 
        }).then(function(stream) {
            console.log("stream: ", stream);
            video.srcObject = stream;
            video.play();
        }).catch(function(e){
            console.error(e);
        })
    }
});
