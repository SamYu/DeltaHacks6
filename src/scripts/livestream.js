navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

navigator.mediaDevices.getUserMedia({ 
    audio: true, 
    video: true 
}).then(function(stream) {
    console.log("stream: ", stream);
}).catch(function(e){
    console.error(e);
})

