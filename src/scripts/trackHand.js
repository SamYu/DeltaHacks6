cv['onRuntimeInitialized']=()=>{
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
      return maxAreaContour;
    };

    
    let imgElement = document.getElementById('imageSrc');
    let src = cv.imread(imgElement);

    let dst = new cv.Mat();
    makeHandMask(src, dst);
    contours = getHandContour(dst, dst);
    cv.imshow('outputCanvas', dst);
    src.delete();
    dst.delete();
};