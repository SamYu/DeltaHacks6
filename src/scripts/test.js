document.body.classList.add("loading");

const skinColorUpper = hue => new cv.Vec(hue, 0.8 * 255, 0.6 * 255);
const skinColorLower = hue => new cv.Vec(hue, 0.1 * 255, 0.05 * 255);

const makeHandMask = (img) => {
  // filter by skin color
  const imgHLS = img.cvtColor(cv.COLOR_BGR2HLS);
  const rangeMask = imgHLS.inRange(skinColorLower(0), skinColorUpper(15));

  // remove noise
  const blurred = rangeMask.blur(new cv.Size(10, 10));
  const thresholded = blurred.threshold(
    200,
    255,
    cv.THRESH_BINARY
  );

  return thresholded;
};

cv['onRuntimeInitialized']=()=>{
    let imgElement = document.getElementById('imageSrc');
    let src = cv.imread(imgElement);
    console.log(src);
    // cv.imshow("outputCanvas", mat);


    let dst = new cv.Mat();
    // To distinguish the input and output, we graying the image.
    // You can try different conversions.
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.imshow('outputCanvas', dst);
    src.delete();
    dst.delete();
};