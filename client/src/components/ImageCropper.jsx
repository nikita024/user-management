import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { Dismiss24Regular  } from "@fluentui/react-icons"

const ImageCropper = ({ 
  previewImage, 
  onCropComplete,
  handleCropCancel
 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onCropCompleteHandler = useCallback(
    (croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const onCropConfirm = async () => {
    try {
      const croppedImage = await getCroppedImg(previewImage, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };


  return (
     <div className="modal-crop-overlay">
          <div className="modal-crop">
            <div className="modal-crop-content">
                <div className="crop-header">
                  <h2>Crop Image</h2>
                  <Dismiss24Regular
                    onClick={handleCropCancel}
                    className='dismiss-button' 
                  />
                </div>
                <div className="crop-container">
                    <div className="cropper-wrapper">
                        <Cropper
                            image={previewImage}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={onCropChange}
                            onZoomChange={setZoom}
                            onCropComplete={onCropCompleteHandler}
                        />
                    </div>
                </div>
                <button className='crop-button' onClick={onCropConfirm}>Confirm Crop</button>
            </div>
        </div>
    </div>
  );
};

export default ImageCropper;
