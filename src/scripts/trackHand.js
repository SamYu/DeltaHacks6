cv['onRuntimeInitialized']=()=>{
    // Define upper and lower bounds
    let skinColorLower = src => new cv.Mat(src.rows, src.cols, src.type(), [0, 48, 80, 0]);
    let skinColorUpper = src => new cv.Mat(src.rows, src.cols, src.type(), [150, 150, 150, 255]);
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
    const getHandContour = (src, dest) => {
        const contours = []
        cv.findContours(
            src,
            contours,
          cv.RETR_EXTERNAL,
          cv.CHAIN_APPROX_SIMPLE
        );
        // largest contour
        return contours.sort((c0, c1) => c1.area - c0.area)[0];
    };

    
    let imgElement = document.getElementById('imageSrc');
    let src = cv.imread(imgElement);

    let dst = new cv.Mat();
    makeHandMask(src, dst);
    cv.imshow('outputCanvas', dst);
    src.delete();
    dst.delete();
};