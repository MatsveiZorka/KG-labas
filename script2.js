class ImageProcessor {
    constructor() {
        this.originalImage = null;
        this.setupEventListeners();
        this.updateParameterVisibility();
    }

    setupEventListeners() {
        document.getElementById('imageInput').addEventListener('change', this.handleImageUpload.bind(this));
        document.getElementById('exampleSelect').addEventListener('change', this.handleExampleSelect.bind(this));
        document.getElementById('methodSelect').addEventListener('change', this.updateParameterVisibility.bind(this));
        document.getElementById('applyButton').addEventListener('click', this.applyProcessing.bind(this));
        
        document.getElementById('brightness').addEventListener('input', (e) => {
            document.getElementById('brightnessValue').textContent = e.target.value;
        });
        
        document.getElementById('contrast').addEventListener('input', (e) => {
            document.getElementById('contrastValue').textContent = e.target.value;
        });
        
        this.setupCanvas();
    }

    setupCanvas() {
        const originalCanvas = document.getElementById('originalCanvas');
        const resultCanvas = document.getElementById('resultCanvas');
        
        originalCanvas.width = 500;
        originalCanvas.height = 400;
        resultCanvas.width = 500;
        resultCanvas.height = 400;
        
        this.originalCtx = originalCanvas.getContext('2d');
        this.resultCtx = resultCanvas.getContext('2d');
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.loadImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    handleExampleSelect(event) {
        const exampleKey = event.target.value;
        if (exampleKey && exampleImages[exampleKey]) {
            this.loadImage(exampleImages[exampleKey]);
        }
        event.target.value = ''; 
    }

    loadImage(src) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            this.originalImage = img;
            this.drawOriginalImage();
        };
        img.onerror = () => {
            alert('Ошибка загрузки изображения. Попробуйте другое.');
        };
        img.src = src;
    }

    drawOriginalImage() {
        if (!this.originalImage) return;
        
        const canvas = document.getElementById('originalCanvas');
        const ctx = this.originalCtx;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const scale = Math.min(
            canvas.width / this.originalImage.width,
            canvas.height / this.originalImage.height
        );
        
        const scaledWidth = this.originalImage.width * scale;
        const scaledHeight = this.originalImage.height * scale;
        const offsetX = (canvas.width - scaledWidth) / 2;
        const offsetY = (canvas.height - scaledHeight) / 2;
        
        this.imageBounds = {
            x: offsetX,
            y: offsetY,
            width: scaledWidth,
            height: scaledHeight,
            scale: scale
        };
        
        ctx.drawImage(this.originalImage, offsetX, offsetY, scaledWidth, scaledHeight);
    }

    updateParameterVisibility() {
        const method = document.getElementById('methodSelect').value;
        document.getElementById('morphologyParams').classList.toggle('hidden', method !== 'morphology');
        document.getElementById('pixelwiseParams').classList.toggle('hidden', method !== 'pixelwise');
        document.getElementById('contrastParams').classList.toggle('hidden', method !== 'contrast');
    }

    applyProcessing() {
        if (!this.originalImage || !this.imageBounds) {
            alert('Сначала загрузите изображение!');
            return;
        }
        
        const method = document.getElementById('methodSelect').value;
        
        const imageData = this.originalCtx.getImageData(
            this.imageBounds.x, 
            this.imageBounds.y, 
            this.imageBounds.width, 
            this.imageBounds.height
        );
        
        let resultImageData;
        
        switch (method) {
            case 'morphology':
                resultImageData = this.applyMorphology(imageData);
                break;
            case 'pixelwise':
                resultImageData = this.applyPixelwiseOperations(imageData);
                break;
            case 'contrast':
                const processedData = this.applyPixelwiseOperations(imageData);
                resultImageData = this.applyLinearContrast(processedData);
                break;
            default:
                resultImageData = imageData;
        }
        
        this.displayResult(resultImageData);
    }

    convertToGrayscale(imageData) {
        const data = imageData.data;
        const result = new ImageData(new Uint8ClampedArray(data.length), imageData.width, imageData.height);
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            
            result.data[i] = gray;
            result.data[i + 1] = gray;
            result.data[i + 2] = gray;
            result.data[i + 3] = data[i + 3];
        }
        return result;
    }

    applyPixelwiseOperations(imageData) {
        const brightness = parseInt(document.getElementById('brightness').value);
        const contrast = parseInt(document.getElementById('contrast').value) / 100;
        const invert = document.getElementById('invert').checked;
        
        const data = imageData.data;
        const result = new ImageData(new Uint8ClampedArray(data.length), imageData.width, imageData.height);
        
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i], g = data[i + 1], b = data[i + 2];
            
          
            r = this.clamp(r + brightness);
            g = this.clamp(g + brightness);
            b = this.clamp(b + brightness);
            
            if (contrast !== 0) {
                const factor = (259 * (contrast + 1)) / (255 * (1 - contrast));
                r = this.clamp(factor * (r - 128) + 128);
                g = this.clamp(factor * (g - 128) + 128);
                b = this.clamp(factor * (b - 128) + 128);
            }
           
            if (invert) {
                r = 255 - r;
                g = 255 - g;
                b = 255 - b;
            }
            
            result.data[i] = r;
            result.data[i + 1] = g;
            result.data[i + 2] = b;
            result.data[i + 3] = data[i + 3];
        }
        return result;
    }

    applyLinearContrast(imageData) {
    const data = imageData.data;
    
    let rMin = 255, rMax = 0;
    let gMin = 255, gMax = 0;
    let bMin = 255, bMax = 0;
    
    for (let i = 0; i < data.length; i += 4) {
        rMin = Math.min(rMin, data[i]);
        rMax = Math.max(rMax, data[i]);
        gMin = Math.min(gMin, data[i + 1]);
        gMax = Math.max(gMax, data[i + 1]);
        bMin = Math.min(bMin, data[i + 2]);
        bMax = Math.max(bMax, data[i + 2]);
    }
    
    if (rMax === rMin) rMax = rMin + 1;
    if (gMax === gMin) gMax = gMin + 1;
    if (bMax === bMin) bMax = bMin + 1;
    
    const result = new ImageData(new Uint8ClampedArray(data.length), imageData.width, imageData.height);
    
    const rFactor = 255 / (rMax - rMin);
    const gFactor = 255 / (gMax - gMin);
    const bFactor = 255 / (bMax - bMin);
    
    for (let i = 0; i < data.length; i += 4) {

        result.data[i] = this.clamp(rFactor * (data[i] - rMin)); 
        result.data[i + 1] = this.clamp(gFactor * (data[i + 1] - gMin)); 
        result.data[i + 2] = this.clamp(bFactor * (data[i + 2] - bMin)); 
        result.data[i + 3] = data[i + 3]; 
    }
    
    return result;
}

    clamp(value) {
        return Math.max(0, Math.min(255, value));
    }

    applyMorphology(imageData) {
        const operation = document.querySelector('input[name="morphOperation"]:checked').value;
        const elementType = document.getElementById('structuringElement').value;
        const size = parseInt(document.getElementById('elementSize').value);
        const grayData = this.convertToGrayscale(imageData);
        const se = this.createStructuringElement(elementType, size);
        const result = new ImageData(new Uint8ClampedArray(grayData.data.length), grayData.width, grayData.height);
        
        for (let i = 0; i < grayData.data.length; i += 4) {
            result.data[i + 3] = 255;
        }
        
    
        for (let y = 0; y < grayData.height; y++) {
            for (let x = 0; x < grayData.width; x++) {
                const index = (y * grayData.width + x) * 4;
                let value;
                
                if (operation === 'erosion') {
                    value = this.applyErosion(grayData, x, y, se);
                } else {
                    value = this.applyDilation(grayData, x, y, se);
                }
                
                result.data[index] = value;
                result.data[index + 1] = value;
                result.data[index + 2] = value;
            }
        }
        return result;
    }

    createStructuringElement(type, size) {
    const radius = Math.floor(size / 2);
    const se = [];
    
    for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
            if (type === 'rect') {
                se.push({x, y});
            }
            else if (type === 'cross' && (x === 0 || y === 0)) {
                se.push({x, y});
            }
        }
    }
    return se;
}

    applyErosion(imageData, x, y, se) {
        let minVal = 255;
        for (const point of se) {
            const nx = x + point.x;
            const ny = y + point.y;
            if (nx >= 0 && nx < imageData.width && ny >= 0 && ny < imageData.height) {
                const idx = (ny * imageData.width + nx) * 4;
                minVal = Math.min(minVal, imageData.data[idx]);
            }
        }
        return minVal;
    }

    applyDilation(imageData, x, y, se) {
        let maxVal = 0;
        for (const point of se) {
            const nx = x + point.x;
            const ny = y + point.y;
            if (nx >= 0 && nx < imageData.width && ny >= 0 && ny < imageData.height) {
                const idx = (ny * imageData.width + nx) * 4;
                maxVal = Math.max(maxVal, imageData.data[idx]);
            }
        }
        return maxVal;
    }

    displayResult(imageData) {
        const canvas = document.getElementById('resultCanvas');
        const ctx = this.resultCtx;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const offsetX = (canvas.width - imageData.width) / 2;
        const offsetY = (canvas.height - imageData.height) / 2;
        
        ctx.putImageData(imageData, offsetX, offsetY);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ImageProcessor();
});