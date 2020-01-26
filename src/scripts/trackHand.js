cv['onRuntimeInitialized']=()=>{
  (function() {
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        video = document.getElementById('video');
        vendorUrl = window.URL || window.webkitURL;
  
    navigator.getMedia =  navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;
          
    navigator.getUserMedia({
      video: true,
      audio: false
    }, function(stream) {
      // video.src = vendorUrl.createObjectURL(stream); // depracated for chrome :c
      video.srcObject = stream;
      video.play();
    }, function(error) {
      // An error occured
    })
  
    video.addEventListener('play', function(){
      setTimeout(track);
      draw(this, context, 400, 280);
    }, false);
  
    function draw(video, context, width, height) {
      context.drawImage(video, 0, 0, width, height);
      var can = document.getElementById('canvas');
      track();
      setTimeout(draw, 10, video, context, width, height);
    }
  
  })();

  function track() {
    // Define upper and lower bounds
    let skinColorLower = src => new cv.Mat(src.rows, src.cols, src.type(), [45, 48, 75, 0]);
    let skinColorUpper = src => new cv.Mat(src.rows, src.cols, src.type(), [130, 150, 190, 255]);
    // Make mask
    const makeHandMask = (src, dest) => {
        // filter by skin color
        console.log('test');
          cv.cvtColor(src, dest, cv.COLOR_BGR2HSV);
          cv.inRange(dest, skinColorLower(dest), skinColorUpper(dest), dest);
          cv.blur(dest, dest, new cv.Size(10, 10));
        // remove noise
          cv.threshold(dest, dest, 200, 255, cv.THRESH_BINARY);
    };

    // Get Contour
    const getHandContour = (src, dst) => {
        const contours = new cv.MatVector()
        const hierarchy = new cv.Mat()
        cv.findContours(
            src,
            contours,
            hierarchy,
            cv.RETR_EXTERNAL,
            cv.CHAIN_APPROX_SIMPLE
        );
        let maxAreaContour = contours.size() > 0 ? contours.get(0) : null;
        for (let i = 0; i < contours.size(); ++i) {
          // let color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
          //                           Math.round(Math.random() * 255));
          // cv.drawContours(dst, contours, i, color, 2, cv.LINE_8, hierarchy, 100);
          const area = cv.contourArea(contours.get(i));
          if (area > cv.contourArea(maxAreaContour)) {
            maxAreaContour = contours.get(i);
          }
      }
      console.log(contours);
      const maxContour = new cv.MatVector()
      maxContour.push_back(maxAreaContour);
      return {maxContour, hierarchy};
    };

    const getConvexHull = (contours, hierarchy, dst) => {
      // approximates each contour to convex hull
      let hull = new cv.MatVector();
      let indices = new cv.MatVector();
      
      for (let i = 0; i < contours.size(); ++i) {
        let tmpHull = new cv.Mat();
        let index = new cv.Mat();
        let defect = new cv.Mat();
        let cnt = contours.get(i);
        cv.convexHull(cnt, tmpHull, false, true);
        cv.convexHull(cnt, index, false, false);
        cv.convexityDefects(cnt, index, defect);
        hull.push_back(tmpHull);
        indices.push_back(index);
        for (let i = 0; i < defect.rows; ++i) {
          let start = new cv.Point(cnt.data32S[defect.data32S[i * 4] * 2],
                                   cnt.data32S[defect.data32S[i * 4] * 2 + 1]);
          let end = new cv.Point(cnt.data32S[defect.data32S[i * 4 + 1] * 2],
                                 cnt.data32S[defect.data32S[i * 4 + 1] * 2 + 1]);
          let far = new cv.Point(cnt.data32S[defect.data32S[i * 4 + 2] * 2],
                                 cnt.data32S[defect.data32S[i * 4 + 2] * 2 + 1]);
          cv.line(dst, start, end, new cv.Scalar(255, 0, 0), 2, cv.LINE_AA, 0);
          cv.circle(dst, far, 3, new cv.Scalar(255, 0, 0, 255), 5);
        }
        cnt.delete(); tmpHull.delete(); index.delete(); defect.delete();
      }
      // draw contours with random Scalar
      for (let i = 0; i < contours.size(); ++i) {
        let colorHull = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
                                      Math.round(Math.random() * 255));
        cv.drawContours(dst, hull, i, colorHull, 5, 8, hierarchy, 0);
      }
      console.log(hull.get(0));
      console.log(indices.get(0))
      return {hull, indices};
    }

    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let src = cv.matFromImageData(imgData);

    let dst = new cv.Mat();
    makeHandMask(src, dst);
    handContour = getHandContour(dst, dst);
    convexHull = getConvexHull(handContour.maxContour, handContour.hierarchy, dst);
    cv.imshow('outputCanvas', dst);
    src.delete();
    dst.delete();
  };
};