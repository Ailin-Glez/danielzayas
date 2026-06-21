import { useState, useCallback } from 'react';
import * as EasyCrop from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Cropper = (EasyCrop as any).default ?? EasyCrop;

type Area = { x: number; y: number; width: number; height: number };

interface Props {
  src: string;
  onDone: (croppedBase64: string) => void;
  onCancel: () => void;
}

async function getCroppedImg(src: string, cropArea: Area): Promise<string> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = src;
  });

  const canvas = document.createElement('canvas');
  const targetW = Math.min(cropArea.width, 1400);
  const scale = targetW / cropArea.width;
  canvas.width = targetW;
  canvas.height = cropArea.height * scale;

  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(
    img,
    cropArea.x, cropArea.y, cropArea.width, cropArea.height,
    0, 0, canvas.width, canvas.height,
  );

  return canvas.toDataURL('image/jpeg', 0.88);
}

export default function ImageCropper({ src, onDone, onCancel }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedArea(areaPixels);
  }, []);

  const handleDone = async () => {
    if (!croppedArea) return;
    const result = await getCroppedImg(src, croppedArea);
    onDone(result);
  };

  return (
    <div className="image-cropper-overlay">
      <div className="image-cropper-modal">
        <div className="image-cropper-header">
          <span>Selecciona el encuadre</span>
          <button type="button" className="image-cropper-close" onClick={onCancel}>✕</button>
        </div>
        <div className="image-cropper-canvas">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="image-cropper-controls">
          <label>Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
          />
          <div className="image-cropper-actions">
            <button type="button" className="btn btn-outline" onClick={onCancel}>Cancelar</button>
            <button type="button" className="btn btn-primary" onClick={handleDone}>Usar esta imagen</button>
          </div>
        </div>
      </div>
    </div>
  );
}
