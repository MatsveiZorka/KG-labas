class RasterAlgorithms {
    constructor() {
        this.canvas = document.getElementById('rasterCanvas');
        this.ctx = this.canvas.getContext('2d');
       
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.drawCoordinateSystem();
        this.updateScaleValue();
    }
    
    setupEventListeners() {
        document.getElementById('drawBtn').addEventListener('click', () => this.draw());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearCanvas());
        
        const scaleInput = document.getElementById('scale');
        scaleInput.addEventListener('input', (e) => {
            this.updateScaleValue();
            this.drawCoordinateSystem();
        });
        
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        setTimeout(() => {
            this.draw();
            this.measureAllAlgorithms();
        }, 100);
    }
    
    updateScaleValue() {
        const scale = 0.25* document.getElementById('scale').value;
        document.getElementById('scaleValue').textContent = 4 * scale;
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scale = parseFloat(document.getElementById('scale').value);
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        const x = Math.round((e.clientX - rect.left - centerX) / scale);
        const y = Math.round(-(e.clientY - rect.top - centerY) / scale);
        
        document.getElementById('coordinates').textContent = `(${x}, ${y})`;
    }
    
    drawCoordinateSystem() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const scale = parseFloat(document.getElementById('scale').value);
        const showGrid = true;
        const showAxes = true;
        
        this.ctx.save();
        this.ctx.scale(scale, scale);
        
        const centerX = this.canvas.width / (2 * scale);
        const centerY = this.canvas.height / (2 * scale);
        
        if (showGrid) {
            this.ctx.strokeStyle = '#d0d0d0';
            this.ctx.lineWidth = 0.7 / scale;
            
            for (let x = -1000; x <= 1000; x += 20) {
                if (x === 0 && showAxes) continue;
                this.ctx.beginPath();
                this.ctx.moveTo(centerX + x, 0);
                this.ctx.lineTo(centerX + x, this.canvas.height / scale);
                this.ctx.stroke();
            }
            
            for (let y = -1000; y <= 1000; y += 20) {
                if (y === 0 && showAxes) continue;
                this.ctx.beginPath();
                this.ctx.moveTo(0, centerY - y);
                this.ctx.lineTo(this.canvas.width / scale, centerY - y);
                this.ctx.stroke();
            }
            
            this.ctx.strokeStyle = '#a0a0a0';
            this.ctx.lineWidth = 1 / scale;
            
            for (let x = -1000; x <= 1000; x += 100) {
                if (x === 0 && showAxes) continue;
                this.ctx.beginPath();
                this.ctx.moveTo(centerX + x, 0);
                this.ctx.lineTo(centerX + x, this.canvas.height / scale);
                this.ctx.stroke();
            }
            
            for (let y = -1000; y <= 1000; y += 100) {
                if (y === 0 && showAxes) continue;
                this.ctx.beginPath();
                this.ctx.moveTo(0, centerY - y);
                this.ctx.lineTo(this.canvas.width / scale, centerY - y);
                this.ctx.stroke();
            }
        }
        
        if (showAxes) {
            this.ctx.strokeStyle = '#000000'; 
            this.ctx.lineWidth = 1.8 / scale;
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, centerY);
            this.ctx.lineTo(this.canvas.width / scale, centerY);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, 0);
            this.ctx.lineTo(centerX, this.canvas.height / scale);
            this.ctx.stroke();
            
            this.ctx.fillStyle = '#000000';
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.canvas.width / scale - 10 / scale, centerY);
            this.ctx.lineTo(this.canvas.width / scale - 20 / scale, centerY - 5 / scale);
            this.ctx.lineTo(this.canvas.width / scale - 20 / scale, centerY + 5 / scale);
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, 10 / scale);
            this.ctx.lineTo(centerX - 5 / scale, 20 / scale);
            this.ctx.lineTo(centerX + 5 / scale, 20 / scale);
            this.ctx.closePath();
            this.ctx.fill();
            

            this.ctx.font = `${14 / scale}px Arial`;
            this.ctx.fillStyle = '#000000';
            this.ctx.fillText('X', this.canvas.width / scale - 20 / scale, centerY - 12 / scale);
            this.ctx.fillText('Y', centerX + 12 / scale, 20 / scale);
            
            this.ctx.font = `${11 / scale}px Arial`;
            this.ctx.fillStyle = '#000000';
            
            for (let i = 10; i <= 1000; i += 10) {
                if (i % 100 === 0) { 
                    this.ctx.fillText(i.toString() / 2, centerX + i - 8 / scale, centerY + 18 / scale);
                    this.ctx.fillText((-i).toString() / 2, centerX - i - 12 / scale, centerY + 18 / scale);
                }
            }
            
            for (let i = 10; i <= 1000; i += 10) {
                if (i % 100 === 0) { 
                    this.ctx.fillText(i.toString() / 2, centerX - 25 / scale, centerY - i + 4 / scale);
                    this.ctx.fillText((-i).toString() / 2, centerX - 25 / scale, centerY + i + 4 / scale);
                }
            }
            
            this.ctx.fillText('0', centerX - 15 / scale, centerY + 18 / scale);
        }
        
        this.ctx.restore();
    }
    
    clearCanvas() {
        this.drawCoordinateSystem();
        document.getElementById('calculations').innerHTML = '<p>Холст очищен</p>';
    }
    
    draw() {
        this.drawCoordinateSystem();
        
        const algorithm = document.getElementById('algorithmSelect').value;
        const lineColor = document.getElementById('lineColor').value;
        
        switch (algorithm) {
            case 'step':
                this.drawStepByStep(lineColor);
                break;
            case 'dda':
                this.drawDDA(lineColor);
                break;
            case 'bresenham':
                this.drawBresenhamLine(lineColor);
                break;
            case 'circle':
                this.drawBresenhamCircle(lineColor);
                break;
        }
    }
    
    drawStepByStep(color) {
        const x1 = 2 * parseInt(document.getElementById('x1').value);
        const y1 = 2 * parseInt(document.getElementById('y1').value);
        const x2 = 2 * parseInt(document.getElementById('x2').value);
        const y2 = 2 * parseInt(document.getElementById('y2').value);
        
        const startTime = performance.now();
        
        const dx = x2 - x1;
        const dy = y2 - y1;
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        
        const xIncrement = dx / steps;
        const yIncrement = dy / steps;
        
        this.ctx.save();
        const scale = parseFloat(document.getElementById('scale').value);
        this.ctx.scale(scale, scale);
        
        const centerX = this.canvas.width / (2 * scale);
        const centerY = this.canvas.height / (2 * scale);
        
        this.ctx.fillStyle = color;
        
        let x = x1;
        let y = y1;
        
        for (let i = 0; i <= steps; i++) {
            const pixelX = Math.round(centerX + x);
            const pixelY = Math.round(centerY - y);
            
            this.ctx.fillRect(pixelX, pixelY, 1, 1);
            
            x += xIncrement;
            y += yIncrement;
        }
        
        this.ctx.restore();
        
        const endTime = performance.now();
        this.timeResults.step = (endTime - startTime).toFixed(3);
        this.updateTimeDisplay();
    }
    
    drawDDA(color) {
        const x1 = 2 * parseInt(document.getElementById('x1').value);
        const y1 = 2 * parseInt(document.getElementById('y1').value);
        const x2 = 2 * parseInt(document.getElementById('x2').value);
        const y2 = 2 * parseInt(document.getElementById('y2').value);
        
        const startTime = performance.now();
        
        const dx = x2 - x1;
        const dy = y2 - y1;
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        
        const xIncrement = dx / steps;
        const yIncrement = dy / steps;
        
        this.ctx.save();
        const scale = parseFloat(document.getElementById('scale').value);
        this.ctx.scale(scale, scale);
        
        const centerX = this.canvas.width / (2 * scale);
        const centerY = this.canvas.height / (2 * scale);
        
        this.ctx.fillStyle = color;
        
        let x = x1 + 0.5;
        let y = y1 + 0.5;
        
        for (let i = 0; i <= steps; i++) {
            const pixelX = Math.floor(centerX + x);
            const pixelY = Math.floor(centerY - y);
            
            this.ctx.fillRect(pixelX, pixelY, 1, 1);
            
            x += xIncrement;
            y += yIncrement;
        }
        
        this.ctx.restore();
        
        const endTime = performance.now();
        this.timeResults.dda = (endTime - startTime).toFixed(3);
        this.updateTimeDisplay();
    }
    
    drawBresenhamLine(color) {
        const x1 = 2 * parseInt(document.getElementById('x1').value);
        const y1 = 2 * parseInt(document.getElementById('y1').value);
        const x2 = 2 * parseInt(document.getElementById('x2').value);
        const y2 = 2 * parseInt(document.getElementById('y2').value);
        
        let x = x1;
        let y = y1;
        let dx = Math.abs(x2 - x1);
        let dy = Math.abs(y2 - y1);
        let sx = (x1 < x2) ? 1 : -1;
        let sy = (y1 < y2) ? 1 : -1;
        let err = dx - dy;
        
        this.ctx.save();
        const scale = parseFloat(document.getElementById('scale').value);
        this.ctx.scale(scale, scale);
        
        const centerX = this.canvas.width / (2 * scale);
        const centerY = this.canvas.height / (2 * scale);
        
        this.ctx.fillStyle = color;
        
        while (true) {
            const pixelX = Math.round(centerX + x);
            const pixelY = Math.round(centerY - y);
            
            this.ctx.fillRect(pixelX, pixelY, 1, 1);
            
            if (x === x2 && y === y2) break;
            
            let e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
        }
        
        this.ctx.restore();
        
        const endTime = performance.now();
        this.timeResults.bresenham = (endTime - startTime).toFixed(3);
        this.updateTimeDisplay();
    }
    
    drawBresenhamCircle(color) {
        const cx = 2 * parseInt(document.getElementById('circleX').value);
        const cy = 2 * parseInt(document.getElementById('circleY').value);
        const radius = 2 * parseInt(document.getElementById('radius').value);
        
        const startTime = performance.now();
        
        this.ctx.save();
        const scale = parseFloat(document.getElementById('scale').value);
        this.ctx.scale(scale, scale);
        
        const centerX = this.canvas.width / (2 * scale);
        const centerY = this.canvas.height / (2 * scale);
        
        this.ctx.fillStyle = color;
        
        let x = 0;
        let y = radius;
        let d = 3 - 2 * radius;
        
        const drawCirclePoints = (x, y, cx, cy) => {
            const points = [
                [cx + x, cy + y], [cx - x, cy + y],
                [cx + x, cy - y], [cx - x, cy - y],
                [cx + y, cy + x], [cx - y, cy + x],
                [cx + y, cy - x], [cx - y, cy - x]
            ];
            
            points.forEach(([px, py]) => {
                const pixelX = Math.round(centerX + px);
                const pixelY = Math.round(centerY - py);
                this.ctx.fillRect(pixelX, pixelY, 1, 1);
            });
        };
        
        drawCirclePoints(x, y, cx, cy);
        
        while (y >= x) {
            x++;
            
            if (d > 0) {
                y--;
                d = d + 4 * (x - y) + 10;
            } else {
                d = d + 4 * x + 6;
            }
            
            drawCirclePoints(x, y, cx, cy);
        }
        
        this.ctx.restore();
        
        const endTime = performance.now();
        this.timeResults.circle = (endTime - startTime).toFixed(3);
        this.updateTimeDisplay();
    }
    
    
    updateTimeDisplay() {
        document.querySelectorAll('.time-value').forEach((el, i) => {
            const times = Object.values(this.timeResults);
            if (i < times.length) {
                el.textContent = times[i];
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RasterAlgorithms();
});