class ColorConverter {
    // из ргб

    static rgbToCmyk(r, g, b) {
        r = r / 255;
        g = g / 255;
        b = b / 255;
        
        let k = 1 - Math.max(r, g, b);
        if (k === 1) return [0, 0, 0, 100];
        
        let c = (1 - r - k) / (1 - k);
        let m = (1 - g - k) / (1 - k);
        let y = (1 - b - k) / (1 - k);
        
        return [
            Math.round(c * 100),
            Math.round(m * 100),
            Math.round(y * 100),
            Math.round(k * 100)
        ];
    }

    static rgbToHsv(r, g, b) {
        r = r / 255;
        b = b / 255;
        g = g / 255;
            
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let delta = max - min;
            
        let h, s, v = max;
            
        if (delta === 0) {
            h = 0;
        } else {
            switch (max) {
                case r: h = ((g - b) / delta) % 6; break;
                case g: h = (b - r) / delta + 2; break;
                case b: h = (r - g) / delta + 4; break;
            }
            h = Math.round(h * 60);
            if (h < 0) h += 360;
        }
            
        s = max === 0 ? 0 : delta / max;
            
        return [
            Math.round(h),
            Math.round(s * 100),
            Math.round(v * 100)
        ];
    }

    static rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
    }

    // в ргб

    static cmykToRgb(c, m, y, k) {
        c = c / 100;
        m = m / 100;
        y = y / 100;
        k = k / 100;
        
        let r = 255 * (1 - c) * (1 - k);
        let g = 255 * (1 - m) * (1 - k);
        let b = 255 * (1 - y) * (1 - k);
        
        return [
            Math.round(r),
            Math.round(g),
            Math.round(b)
        ];
    }

    static hsvToRgb(h, s, v) {
        h = h / 360;
        s = s / 100;
        v = v / 100;
        
        let r, g, b;
        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);
        
        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
        
        return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255)
        ];
    }

    static hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [255, 255, 255];
    }
}

class ColorApp {
    constructor() {
        this.currentRgb = [255, 255, 255];
        this.updatingSource = null;
        this.initializeElements();
        this.setupEventListeners();
        this.updateAllDisplays();
    }

    initializeElements() {
        this.rgbR = document.getElementById('rgbR');
        this.rgbG = document.getElementById('rgbG');
        this.rgbB = document.getElementById('rgbB');
        this.rgbRInput = document.getElementById('rgbRInput');
        this.rgbGInput = document.getElementById('rgbGInput');
        this.rgbBInput = document.getElementById('rgbBInput');
        this.rgbRValue = document.getElementById('rgbRValue');
        this.rgbGValue = document.getElementById('rgbGValue');
        this.rgbBValue = document.getElementById('rgbBValue');


        this.cmykC = document.getElementById('cmykC');
        this.cmykM = document.getElementById('cmykM');
        this.cmykY = document.getElementById('cmykY');
        this.cmykK = document.getElementById('cmykK');
        this.cmykCInput = document.getElementById('cmykCInput');
        this.cmykMInput = document.getElementById('cmykMInput');
        this.cmykYInput = document.getElementById('cmykYInput');
        this.cmykKInput = document.getElementById('cmykKInput');
        this.cmykCValue = document.getElementById('cmykCValue');
        this.cmykMValue = document.getElementById('cmykMValue');
        this.cmykYValue = document.getElementById('cmykYValue');
        this.cmykKValue = document.getElementById('cmykKValue');


        this.hsvH = document.getElementById('hsvH');
        this.hsvS = document.getElementById('hsvS');
        this.hsvV = document.getElementById('hsvV');
        this.hsvHInput = document.getElementById('hsvHInput');
        this.hsvSInput = document.getElementById('hsvSInput');
        this.hsvVInput = document.getElementById('hsvVInput');
        this.hsvHValue = document.getElementById('hsvHValue');
        this.hsvSValue = document.getElementById('hsvSValue');
        this.hsvVValue = document.getElementById('hsvVValue');


        this.colorBox = document.getElementById('colorBox');
        this.colorHex = document.getElementById('colorHex');
        this.colorPicker = document.getElementById('colorPicker');
    }

    setupEventListeners() {

        [this.rgbR, this.rgbG, this.rgbB].forEach(slider => {
            slider.addEventListener('input', (e) => this.onRgbSliderChange(e));
        });


        [this.rgbRInput, this.rgbGInput, this.rgbBInput].forEach(input => {
            input.addEventListener('input', (e) => this.onRgbInputChange(e));
        });


        [this.cmykC, this.cmykM, this.cmykY, this.cmykK].forEach(slider => {
            slider.addEventListener('input', (e) => this.onCmykSliderChange(e));
        });
        

        [this.cmykCInput, this.cmykMInput, this.cmykYInput, this.cmykKInput].forEach(input => {
            input.addEventListener('input', (e) => this.onCmykInputChange(e));
        });


        [this.hsvH, this.hsvS, this.hsvV].forEach(slider => {
            slider.addEventListener('input', (e) => this.onHsvSliderChange(e));
        });
        

        [this.hsvHInput, this.hsvSInput, this.hsvVInput].forEach(input => {
            input.addEventListener('input', (e) => this.onHsvInputChange(e));
        });


        this.colorPicker.addEventListener('input', (e) => this.onColorPickerChange(e));
    }

    onRgbSliderChange(e) {
        if (this.updatingSource === 'cmyk' || this.updatingSource === 'hsv' || this.updatingSource === 'hex') return;
        
        this.updatingSource = 'rgb';
        const r = parseInt(this.rgbR.value);
        const g = parseInt(this.rgbG.value);
        const b = parseInt(this.rgbB.value);
        
        this.updateFromRgb(r, g, b);
        this.updatingSource = null;
    }

    onRgbInputChange(e) {
        if (this.updatingSource === 'cmyk' || this.updatingSource === 'hsv' || this.updatingSource === 'hex') return;
        
        this.updatingSource = 'rgb';
        const r = Math.min(255, Math.max(0, parseInt(this.rgbRInput.value) || 0));
        const g = Math.min(255, Math.max(0, parseInt(this.rgbGInput.value) || 0));
        const b = Math.min(255, Math.max(0, parseInt(this.rgbBInput.value) || 0));
        
        this.updateFromRgb(r, g, b);
        this.updatingSource = null;
    }

    onCmykSliderChange(e) {
        if (this.updatingSource === 'rgb' || this.updatingSource === 'hsv' || this.updatingSource === 'hex') return;
        
        this.updatingSource = 'cmyk';
        const c = parseInt(this.cmykC.value);
        const m = parseInt(this.cmykM.value);
        const y = parseInt(this.cmykY.value);
        const k = parseInt(this.cmykK.value);
        
        this.updateFromCmyk(c, m, y, k);
        this.updatingSource = null;
    }

    onCmykInputChange(e) {
        if (this.updatingSource === 'rgb' || this.updatingSource === 'hsv' || this.updatingSource === 'hex') return;
        
        this.updatingSource = 'cmyk';
        const c = Math.min(100, Math.max(0, parseInt(this.cmykCInput.value) || 0));
        const m = Math.min(100, Math.max(0, parseInt(this.cmykMInput.value) || 0));
        const y = Math.min(100, Math.max(0, parseInt(this.cmykYInput.value) || 0));
        const k = Math.min(100, Math.max(0, parseInt(this.cmykKInput.value) || 0));
        
        this.updateFromCmyk(c, m, y, k);
        this.updatingSource = null;
    }

    onHsvSliderChange(e) {
        if (this.updatingSource === 'rgb' || this.updatingSource === 'cmyk' || this.updatingSource === 'hex') return;
        
        this.updatingSource = 'hsv';
        const h = parseInt(this.hsvH.value);
        const s = parseInt(this.hsvS.value);
        const v = parseInt(this.hsvV.value);
        
        this.updateFromHsv(h, s, v);
        this.updatingSource = null;
    }

    onHsvInputChange(e) {
        if (this.updatingSource === 'rgb' || this.updatingSource === 'cmyk' || this.updatingSource === 'hex') return;
        
        this.updatingSource = 'hsv';
        const h = Math.min(360, Math.max(0, parseInt(this.hsvHInput.value) || 0));
        const s = Math.min(100, Math.max(0, parseInt(this.hsvSInput.value) || 0));
        const v = Math.min(100, Math.max(0, parseInt(this.hsvVInput.value) || 0));
        
        this.updateFromHsv(h, s, v);
        this.updatingSource = null;
    }

    onColorPickerChange(e) {
        if (this.updatingSource === 'rgb' || this.updatingSource === 'cmyk' || this.updatingSource === 'hsv') return;
    
        this.updatingSource = 'hex';
        const hex = this.colorPicker.value;
        const rgb = ColorConverter.hexToRgb(hex);
    

        this.updateFromRgbForHex(rgb[0], rgb[1], rgb[2]);
    
        this.updatingSource = null;
    }


    updateFromRgbForHex(r, g, b) {
        this.currentRgb = [r, g, b];
       
        this.updateAllDisplays();
    }

    // апдейты

    updateFromRgb(r, g, b) {
        this.currentRgb = [r, g, b];
        this.updateDisplaysExcept('rgb');
    }

    updateFromCmyk(c, m, y, k) {
        const rgb = ColorConverter.cmykToRgb(c, m, y, k);
        this.currentRgb = rgb;
        this.updateDisplaysExcept('cmyk');
    }

    updateFromHsv(h, s, v) {
        const rgb = ColorConverter.hsvToRgb(h, s, v);
        this.currentRgb = rgb;
        this.updateDisplaysExcept('hsv');
    }

    updateDisplaysExcept(excludeModel) {
        const [r, g, b] = this.currentRgb;
        
        // обновляем RGB, если это не источник изменений
        if (excludeModel !== 'rgb') {
            this.updateRgbDisplay(r, g, b);
        }
        

        if (excludeModel !== 'cmyk') {
            const [c, m, y, k] = ColorConverter.rgbToCmyk(r, g, b);
            this.updateCmykDisplay(c, m, y, k);
        }


        if (excludeModel !== 'hsv') {
            const [h, s, v] = ColorConverter.rgbToHsv(r, g, b);
            this.updateHsvDisplay(h, s, v);
        }
        

        this.updateColorVisual(r, g, b);
    }

    updateAllDisplays() {
        const [r, g, b] = this.currentRgb;
        this.updateRgbDisplay(r, g, b);
        
        const [c, m, y, k] = ColorConverter.rgbToCmyk(r, g, b);
        this.updateCmykDisplay(c, m, y, k);

        const [h, s, v] = ColorConverter.rgbToHsv(r, g, b);
        this.updateHsvDisplay(h, s, v);
        
        this.updateColorVisual(r, g, b);
    }

    updateRgbDisplay(r, g, b) {
        this.rgbR.value = r;
        this.rgbG.value = g;
        this.rgbB.value = b;
        this.rgbRInput.value = r;
        this.rgbGInput.value = g;
        this.rgbBInput.value = b;
        this.rgbRValue.textContent = r;
        this.rgbGValue.textContent = g;
        this.rgbBValue.textContent = b;
    }

    updateCmykDisplay(c, m, y, k) {
        this.cmykC.value = c;
        this.cmykM.value = m;
        this.cmykY.value = y;
        this.cmykK.value = k;
        this.cmykCInput.value = c;
        this.cmykMInput.value = m;
        this.cmykYInput.value = y;
        this.cmykKInput.value = k;
        this.cmykCValue.textContent = c;
        this.cmykMValue.textContent = m;
        this.cmykYValue.textContent = y;
        this.cmykKValue.textContent = k;
    }

    updateHsvDisplay(h, s, v) {
        this.hsvH.value = h;
        this.hsvS.value = s;
        this.hsvV.value = v;
        this.hsvHInput.value = h;
        this.hsvSInput.value = s;
        this.hsvVInput.value = v;
        this.hsvHValue.textContent = h;
        this.hsvSValue.textContent = s;
        this.hsvVValue.textContent = v;
    }

    updateColorVisual(r, g, b) {
        const hex = ColorConverter.rgbToHex(r, g, b);
        this.colorBox.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        this.colorHex.textContent = hex;
        this.colorPicker.value = hex;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ColorApp();
});