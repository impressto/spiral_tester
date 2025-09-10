import { useState, useRef } from 'react';
import { spiralImages } from './spiralImages';
import './App.css';

function App() {
  // Save image as BMP file
  async function saveAsBMP() {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;
    await new Promise(resolve => { img.onload = resolve; });
    const w = img.width;
    const h = img.height;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    // Use canvas toBlob for BMP (supported in Chromium-based browsers)
    if (canvas.toBlob) {
      canvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'spiral_image.bmp';
        a.click();
      }, 'image/bmp');
    } else {
      alert('BMP export is not supported in this browser.');
    }
  }
  // Convert a single pixel [r,g,b] to RGB565
  function rgbTo565(r, g, b) {
    return ((r & 0xf8) << 8) | ((g & 0xfc) << 3) | (b >> 3);
  }

  // Convert image to C header file
  async function saveAsHeader() {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;
    await new Promise(resolve => { img.onload = resolve; });
    const w = img.width;
    const h = img.height;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    let arr = [];
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i+1], b = data[i+2];
      arr.push('0x' + rgbTo565(r, g, b).toString(16).padStart(4, '0'));
    }
    const arrayName = uploadedImage ? 'uploaded_spiral' : 'selected_spiral';
    let header = `// array size is ${arr.length}\nconst uint16_t ${arrayName}[] PROGMEM = {\n  `;
    for (let i = 0; i < arr.length; i += 12) {
      header += arr.slice(i, i+12).join(', ') + ',\n  ';
    }
    header = header.replace(/,\n  $/, '\n');
    header += '};\n';
    const blob = new Blob([header], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${arrayName}.h`;
    a.click();
  }
  const [selectedImage, setSelectedImage] = useState(spiralImages[0]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [rotationSpeed, setRotationSpeed] = useState(5);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef();

  const handleImageSelect = (img) => {
    setSelectedImage(img);
    setUploadedImage(null);
  };

  const handleUpload = (e) => {
    setUploadError('');
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Only PNG and JPEG files are allowed.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImage(ev.target.result);
        setSelectedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const imageSrc = uploadedImage || selectedImage;

  return (
    <div className="spiral-app">
      <div className="spiral-controls">
        <div>
          <label>Select a spiral:</label>
          <div className="spiral-list">
            {spiralImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Spiral ${idx + 1}`}
                className={`spiral-thumb${selectedImage === img ? ' selected' : ''}`}
                onClick={() => handleImageSelect(img)}
                style={{ width: 60, height: 60, margin: 8, cursor: 'pointer', borderRadius: '50%' }}
              />
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="spiral-upload" className="spiral-file-label">Upload your own file</label>
          <input
            id="spiral-upload"
            type="file"
            accept="image/png, image/jpeg"
            ref={fileInputRef}
            onChange={handleUpload}
            className="spiral-file-input"
          />
          <div style={{ color: '#b00', fontSize: '0.95em', marginTop: 6 }}>
            <strong>Warning:</strong> Avoid uploading images over 1000 pixels wide. Most common TFT displays cannot display images that large.
          </div>
          {uploadError && (
            <div style={{ color: '#b00', fontSize: '0.95em', marginTop: 4 }}>
              {uploadError}
            </div>
          )}
        </div>
        <div>
          <label>Rotation Speed (seconds per revolution):</label>
          <input
            type="range"
            min={1}
            max={20}
            value={rotationSpeed}
            onChange={e => setRotationSpeed(Number(e.target.value))}
          />
          <span>{rotationSpeed}s</span>
        </div>
      </div>
      <div className="spiral-display">
        {imageSrc && (
          <>
            <div
              className="spiral-circle"
              style={{
                animation: `spin ${rotationSpeed}s linear infinite`,
                borderRadius: '50%',
                width: 320,
                height: 320,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                border: '2px solid #eee',
                boxShadow: '0 0 4px #aaa',
                background: '#fff',
                padding: 0,
              }}
            >
              <img
                src={imageSrc}
                alt="Spiral"
                style={{ width: 300, height: 300, borderRadius: '50%' }}
              />
            </div>
            <button className="spiral-btn" style={{marginTop: 16}} onClick={saveAsHeader}>
              Save as C header file
            </button>
            <button className="spiral-btn" style={{marginTop: 8}} onClick={saveAsBMP}>
              Save as BMP file
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
