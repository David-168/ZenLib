  import * as THREE from "three";

  
  export class ZenEsti {
        depth = 1.0;
        constructor() {
                console.log("ZenEsti.constructor");
        }

        estimateDepth(landmarks, imageWidth, imageHeight,fovDeg) {

//                console.log("ZenEsti.estimateDepth tag0");
                
                let leftEye = landmarks[33];
                leftEye={ x:leftEye.x*imageWidth, y:leftEye.y*imageHeight, z:leftEye.z*5};
//                  console.log("ZenEsti.estimateDepth tag1");

                let rightEye = landmarks[263];
                rightEye={ x:rightEye.x*imageWidth, y:rightEye.y*imageHeight, z:rightEye.z*5};
                const dx = (leftEye.x - rightEye.x);
                const dy = (leftEye.y - rightEye.y);
                const pixelDistance = Math.sqrt(dx * dx + dy * dy);
  
                //let focalLength = focalLengthFromFOV(fovDeg, imageWidth);
//                  console.log("ZenEsti.estimateDepth tag2");

                let focalLength = imageHeight;//videoElement.videoHeight;//1080;//320;//272;//424;// (2.65-focal length/4-focal width)*640
                const realIPD = 0.063; // meters
  
                const depthMeters = (focalLength * realIPD) / pixelDistance;

                this.depth = depthMeters;
                //console.log("ZenEsti.estimateDepth tag6");
        //        console.log("LeftEye Meters:",worldPoint.x,",",worldPoint.y,",",worldPoint.z);
                return depthMeters;
                };
        
        pixelToWorld(inx, iny, Z, f, cx, cy) {
                return {
                        x: ((inx - cx) * Z) / f,
                        y: -1 * ((iny - cy) * Z) / f,
                        z: Z
                };
                }
        

        getProjection(eyepos)
        {
  
  //        console.log("FrustumProjection tag00");
  
                const widthPx = window.innerWidth;//screen.width;              // CSS pixels
                const heightPx = window.innerHeight;//screen.height;            // CSS pixels
                const dpr = window.devicePixelRatio || 1; // pixels per CSS pixel
  
                const realWidthPx = widthPx * dpr;
                const realHeightPx = heightPx * dpr;
  
  //        console.log("Real pixels:", realWidthPx, realHeightPx);
  
                const ppi = 460; // replace with your device's PPI
                const widthInches = realWidthPx / ppi;
                const heightInches = realHeightPx / ppi;
  //        console.log("Real pixels:", realWidthPx, realHeightPx);
//          console.log("FrustumProjection tag01");
  
          const widthMeters = widthInches * 0.0254;
          const heightMeters = heightInches * 0.0254;
//          console.log("Real meters:", widthMeters, heightMeters);
  
                const EyePos = new THREE.Vector3(eyepos.x,eyepos.y,eyepos.z);
//          console.log("FrustumProjection tag02");
                const LeftTop =new THREE.Vector3(-0.032,0.05,0);
  //        const LeftTop =new THREE.Vector3(-1*widthMeters,heightMeters,0);
                const RightBottom =new THREE.Vector3(0.032,-0.05,0);
  //        const RightBottom =new THREE.Vector3(widthMeters,-1*heightMeters,0);
//          console.log("FrustumProjection tag03");
                const LeftTopCameraSpace = LeftTop.sub(EyePos);//LeftTop.clone().applyMatrix4(camera.matrixWorldInverse);
  //        console.log("LeftTop:", LeftTopCameraSpace);
//          console.log("FrustumProjection tag04");
  
                const RightBottomCameraSpace = RightBottom.sub(EyePos);//RightBottom.clone().applyMatrix4(camera.matrixWorldInverse);

                var projmat = new THREE.Matrix4().makePerspective(LeftTopCameraSpace.x,
                RightBottomCameraSpace.x,
                LeftTopCameraSpace.y,
                RightBottomCameraSpace.y,
                -1*LeftTopCameraSpace.z,
                100
                );
  
//                console.log("FrustumProjection tag05");//  };
  
                return projmat;
        };

                     
        }
        
