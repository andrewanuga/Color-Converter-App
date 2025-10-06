// Get DOM elements
        const colorPreview = document.getElementById('color-preview');
        
        // RGB elements
        const redInput = document.getElementById('red-input');
        const greenInput = document.getElementById('green-input');
        const blueInput = document.getElementById('blue-input');
        const redSlider = document.getElementById('red-slider');
        const greenSlider = document.getElementById('green-slider');
        const blueSlider = document.getElementById('blue-slider');
        const redValue = document.getElementById('red-value');
        const greenValue = document.getElementById('green-value');
        const blueValue = document.getElementById('blue-value');
        
        // HSL elements
        const hueInput = document.getElementById('hue-input');
        const saturationInput = document.getElementById('saturation-input');
        const lightnessInput = document.getElementById('lightness-input');
        const hueSlider = document.getElementById('hue-slider');
        const saturationSlider = document.getElementById('saturation-slider');
        const lightnessSlider = document.getElementById('lightness-slider');
        const hueValue = document.getElementById('hue-value');
        const saturationValue = document.getElementById('saturation-value');
        const lightnessValue = document.getElementById('lightness-value');
        
        // HEX elements
        const hexInput = document.getElementById('hex-input');
        
        // Info elements
        const rgbValue = document.getElementById('rgb-value');
        const hexValue = document.getElementById('hex-value');
        const hslValue = document.getElementById('hsl-value');
        const colorName = document.getElementById('color-name');
        const historyColors = document.getElementById('history-colors');
        const toast = document.getElementById('toast');
        
        // Copy elements
        const rgbBox = document.getElementById('rgb-box');
        const hexBox = document.getElementById('hex-box');
        const hslBox = document.getElementById('hsl-box');
        const nameBox = document.getElementById('name-box');
        const copyAllBtn = document.getElementById('copy-all-btn');
        
        // Action buttons
        const randomBtn = document.getElementById('random-btn');
        const invertBtn = document.getElementById('invert-btn');
        
        // Contrast elements
        const contrastWhiteText = document.getElementById('contrast-white-text');
        const contrastBlackText = document.getElementById('contrast-black-text');
        
        // Initialize color history from localStorage or empty array
        let colorHistory = JSON.parse(localStorage.getItem('colorHistory')) || [];
        
        // Function to update the color preview and values
        function updateColor() {
            const r = parseInt(redInput.value);
            const g = parseInt(greenInput.value);
            const b = parseInt(blueInput.value);
            
            // Update preview color
            const color = `rgb(${r}, ${g}, ${b})`;
            colorPreview.style.backgroundColor = color;
            
            // Update RGB value display
            rgbValue.textContent = color;
            
            // Update HEX value
            const hex = rgbToHex(r, g, b);
            hexValue.textContent = hex;
            
            // Update HSL value
            const hsl = rgbToHsl(r, g, b);
            hslValue.textContent = hsl;
            
            // Update color name
            const name = findColorName(hex);
            colorName.textContent = name;
            
            // Update palette
            updatePalette(r, g, b);
            
            // Update contrast
            updateContrast(r, g, b);
            
            // Add to history if it's a new color
            addToHistory(hex, color);
        }
        
        // Convert RGB to HEX
        function rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
        }
        
        // Convert RGB to HSL
        function rgbToHsl(r, g, b) {
            r /= 255;
            g /= 255;
            b /= 255;
            
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            
            if (max === min) {
                h = s = 0; // achromatic
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                
                h /= 6;
            }
            
            h = Math.round(h * 360);
            s = Math.round(s * 100);
            l = Math.round(l * 100);
            
            return `hsl(${h}, ${s}%, ${l}%)`;
        }
        
        // Convert HSL to RGB
        function hslToRgb(h, s, l) {
            h /= 360;
            s /= 100;
            l /= 100;
            
            let r, g, b;
            
            if (s === 0) {
                r = g = b = l; // achromatic
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
                
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
            
            return [
                Math.round(r * 255),
                Math.round(g * 255),
                Math.round(b * 255)
            ];
        }
        
        // Convert HEX to RGB
        function hexToRgb(hex) {
            // Remove # if present
            hex = hex.replace(/^#/, '');
            
            // Parse hex values
            let r, g, b;
            
            if (hex.length === 3) {
                r = parseInt(hex[0] + hex[0], 16);
                g = parseInt(hex[1] + hex[1], 16);
                b = parseInt(hex[2] + hex[2], 16);
            } else if (hex.length === 6) {
                r = parseInt(hex.slice(0, 2), 16);
                g = parseInt(hex.slice(2, 4), 16);
                b = parseInt(hex.slice(4, 6), 16);
            } else {
                return null;
            }
            
            return [r, g, b];
        }
        
        // Find closest CSS color name
        function findColorName(hex) {
            // A small subset of CSS color names for demonstration
            const colorNames = {
                "#FF0000": "Red",
                "#00FF00": "Lime",
                "#0000FF": "Blue",
                "#FFFF00": "Yellow",
                "#00FFFF": "Cyan",
                "#FF00FF": "Magenta",
                "#C0C0C0": "Silver",
                "#808080": "Gray",
                "#800000": "Maroon",
                "#808000": "Olive",
                "#008000": "Green",
                "#800080": "Purple",
                "#008080": "Teal",
                "#000080": "Navy",
                "#FFA500": "Orange",
                "#A52A2A": "Brown",
                "#FFC0CB": "Pink",
                "#7850C8": "Medium Purple",
                "#4B0082": "Indigo"
            };
            
            // Find the closest color name by hex value
            let closestColor = "Custom Color";
            let minDistance = Infinity;
            
            for (const [colorHex, name] of Object.entries(colorNames)) {
                const distance = colorDistance(hex, colorHex);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestColor = name;
                }
            }
            
            return closestColor;
        }
        
        // Calculate color distance (simplified)
        function colorDistance(hex1, hex2) {
            const r1 = parseInt(hex1.slice(1, 3), 16);
            const g1 = parseInt(hex1.slice(3, 5), 16);
            const b1 = parseInt(hex1.slice(5, 7), 16);
            
            const r2 = parseInt(hex2.slice(1, 3), 16);
            const g2 = parseInt(hex2.slice(3, 5), 16);
            const b2 = parseInt(hex2.slice(5, 7), 16);
            
            return Math.sqrt(
                Math.pow(r1 - r2, 2) + 
                Math.pow(g1 - g2, 2) + 
                Math.pow(b1 - b2, 2)
            );
        }
        
        // Update color palette based on current color
        function updatePalette(r, g, b) {
            // Create darker shade
            const darker = `rgb(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)})`;
            document.getElementById('palette-1').style.backgroundColor = darker;
            
            // Current color is already set
            document.getElementById('palette-2').style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            
            // Create lighter shade
            const lighter = `rgb(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)})`;
            document.getElementById('palette-3').style.backgroundColor = lighter;
            
            // Create lightest shade
            const lightest = `rgb(${Math.min(255, r + 80)}, ${Math.min(255, g + 80)}, ${Math.min(255, b + 80)})`;
            document.getElementById('palette-4').style.backgroundColor = lightest;
        }
        
        // Update contrast information
        function updateContrast(r, g, b) {
            // Calculate relative luminance
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            
            // Calculate contrast ratios
            const whiteContrast = (luminance + 0.05) / (1 + 0.05);
            const blackContrast = (1 + 0.05) / (luminance + 0.05);
            
            // Update contrast displays
            contrastWhiteText.textContent = `White: ${whiteContrast.toFixed(2)}:1`;
            contrastBlackText.textContent = `Black: ${blackContrast.toFixed(2)}:1`;
        }
        
        // Add color to history
        function addToHistory(hex, rgb) {
            // Check if color is already in history
            if (!colorHistory.some(item => item.hex === hex)) {
                colorHistory.unshift({ hex, rgb });
                
                // Keep only the last 12 colors
                if (colorHistory.length > 12) {
                    colorHistory.pop();
                }
                
                // Save to localStorage
                localStorage.setItem('colorHistory', JSON.stringify(colorHistory));
                
                // Update history display
                updateHistoryDisplay();
            }
        }
        
        // Update history display
        function updateHistoryDisplay() {
            historyColors.innerHTML = '';
            
            colorHistory.forEach(item => {
                const colorDiv = document.createElement('div');
                colorDiv.className = 'history-color';
                colorDiv.style.backgroundColor = item.rgb;
                colorDiv.title = `${item.hex} - ${item.rgb}`;
                
                colorDiv.addEventListener('click', () => {
                    // Parse RGB values from the history item
                    const rgbMatch = item.rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                    if (rgbMatch) {
                        const r = parseInt(rgbMatch[1]);
                        const g = parseInt(rgbMatch[2]);
                        const b = parseInt(rgbMatch[3]);
                        
                        // Update all inputs
                        updateAllInputs(r, g, b);
                    }
                });
                
                historyColors.appendChild(colorDiv);
            });
        }
        
        // Update all input fields
        function updateAllInputs(r, g, b) {
            // Update RGB inputs
            redInput.value = r;
            greenInput.value = g;
            blueInput.value = b;
            redSlider.value = r;
            greenSlider.value = g;
            blueSlider.value = b;
            redValue.textContent = r;
            greenValue.textContent = g;
            blueValue.textContent = b;
            
            // Update HSL inputs
            const hsl = rgbToHsl(r, g, b);
            const hslMatch = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
            if (hslMatch) {
                const h = parseInt(hslMatch[1]);
                const s = parseInt(hslMatch[2]);
                const l = parseInt(hslMatch[3]);
                
                hueInput.value = h;
                saturationInput.value = s;
                lightnessInput.value = l;
                hueSlider.value = h;
                saturationSlider.value = s;
                lightnessSlider.value = l;
                hueValue.textContent = `${h}°`;
                saturationValue.textContent = `${s}%`;
                lightnessValue.textContent = `${l}%`;
            }
            
            // Update HEX input
            hexInput.value = rgbToHex(r, g, b);
            
            // Update color
            updateColor();
        }
        
        // Generate random color
        function generateRandomColor() {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            
            updateAllInputs(r, g, b);
        }
        
        // Invert color
        function invertColor() {
            const r = 255 - parseInt(redInput.value);
            const g = 255 - parseInt(greenInput.value);
            const b = 255 - parseInt(blueInput.value);
            
            updateAllInputs(r, g, b);
        }
        
        // Copy text to clipboard
        function copyToClipboard(text) {
            // Create a temporary textarea element
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        
        // Show toast notification
        function showToast(message) {
            toast.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2000);
        }
        
        // Initialize event listeners
        function initEventListeners() {
            // RGB input change events
            redInput.addEventListener('input', () => {
                redSlider.value = redInput.value;
                redValue.textContent = redInput.value;
                const r = parseInt(redInput.value);
                const g = parseInt(greenInput.value);
                const b = parseInt(blueInput.value);
                updateFromRgb(r, g, b);
            });
            
            greenInput.addEventListener('input', () => {
                greenSlider.value = greenInput.value;
                greenValue.textContent = greenInput.value;
                const r = parseInt(redInput.value);
                const g = parseInt(greenInput.value);
                const b = parseInt(blueInput.value);
                updateFromRgb(r, g, b);
            });
            
            blueInput.addEventListener('input', () => {
                blueSlider.value = blueInput.value;
                blueValue.textContent = blueInput.value;
                const r = parseInt(redInput.value);
                const g = parseInt(greenInput.value);
                const b = parseInt(blueInput.value);
                updateFromRgb(r, g, b);
            });
            
            // RGB slider change events
            redSlider.addEventListener('input', () => {
                redInput.value = redSlider.value;
                redValue.textContent = redSlider.value;
                const r = parseInt(redSlider.value);
                const g = parseInt(greenSlider.value);
                const b = parseInt(blueSlider.value);
                updateFromRgb(r, g, b);
            });
            
            greenSlider.addEventListener('input', () => {
                greenInput.value = greenSlider.value;
                greenValue.textContent = greenSlider.value;
                const r = parseInt(redSlider.value);
                const g = parseInt(greenSlider.value);
                const b = parseInt(blueSlider.value);
                updateFromRgb(r, g, b);
            });
            
            blueSlider.addEventListener('input', () => {
                blueInput.value = blueSlider.value;
                blueValue.textContent = blueSlider.value;
                const r = parseInt(redSlider.value);
                const g = parseInt(greenSlider.value);
                const b = parseInt(blueSlider.value);
                updateFromRgb(r, g, b);
            });
            
            // HSL input change events
            hueInput.addEventListener('input', () => {
                hueSlider.value = hueInput.value;
                hueValue.textContent = `${hueInput.value}°`;
                const h = parseInt(hueInput.value);
                const s = parseInt(saturationInput.value);
                const l = parseInt(lightnessInput.value);
                updateFromHsl(h, s, l);
            });
            
            saturationInput.addEventListener('input', () => {
                saturationSlider.value = saturationInput.value;
                saturationValue.textContent = `${saturationInput.value}%`;
                const h = parseInt(hueInput.value);
                const s = parseInt(saturationInput.value);
                const l = parseInt(lightnessInput.value);
                updateFromHsl(h, s, l);
            });
            
            lightnessInput.addEventListener('input', () => {
                lightnessSlider.value = lightnessInput.value;
                lightnessValue.textContent = `${lightnessInput.value}%`;
                const h = parseInt(hueInput.value);
                const s = parseInt(saturationInput.value);
                const l = parseInt(lightnessInput.value);
                updateFromHsl(h, s, l);
            });
            
            // HSL slider change events
            hueSlider.addEventListener('input', () => {
                hueInput.value = hueSlider.value;
                hueValue.textContent = `${hueSlider.value}°`;
                const h = parseInt(hueSlider.value);
                const s = parseInt(saturationSlider.value);
                const l = parseInt(lightnessSlider.value);
                updateFromHsl(h, s, l);
            });
            
            saturationSlider.addEventListener('input', () => {
                saturationInput.value = saturationSlider.value;
                saturationValue.textContent = `${saturationSlider.value}%`;
                const h = parseInt(hueSlider.value);
                const s = parseInt(saturationSlider.value);
                const l = parseInt(lightnessSlider.value);
                updateFromHsl(h, s, l);
            });
            
            lightnessSlider.addEventListener('input', () => {
                lightnessInput.value = lightnessSlider.value;
                lightnessValue.textContent = `${lightnessSlider.value}%`;
                const h = parseInt(hueSlider.value);
                const s = parseInt(saturationSlider.value);
                const l = parseInt(lightnessSlider.value);
                updateFromHsl(h, s, l);
            });
            
            // HEX input change event
            hexInput.addEventListener('input', () => {
                const hex = hexInput.value;
                if (hex.length === 7 && hex.startsWith('#')) {
                    const rgb = hexToRgb(hex);
                    if (rgb) {
                        updateAllInputs(rgb[0], rgb[1], rgb[2]);
                    }
                }
            });
            
            // Action buttons
            randomBtn.addEventListener('click', generateRandomColor);
            invertBtn.addEventListener('click', invertColor);
            
            // Copy events for value boxes
            rgbBox.addEventListener('click', () => {
                copyToClipboard(rgbValue.textContent);
                showToast('RGB value copied to clipboard!');
                
                // Visual feedback
                const indicator = rgbBox.querySelector('.copy-indicator');
                indicator.classList.add('show');
                setTimeout(() => {
                    indicator.classList.remove('show');
                }, 1000);
            });
            
            hexBox.addEventListener('click', () => {
                copyToClipboard(hexValue.textContent);
                showToast('HEX value copied to clipboard!');
                
                // Visual feedback
                const indicator = hexBox.querySelector('.copy-indicator');
                indicator.classList.add('show');
                setTimeout(() => {
                    indicator.classList.remove('show');
                }, 1000);
            });
            
            hslBox.addEventListener('click', () => {
                copyToClipboard(hslValue.textContent);
                showToast('HSL value copied to clipboard!');
                
                // Visual feedback
                const indicator = hslBox.querySelector('.copy-indicator');
                indicator.classList.add('show');
                setTimeout(() => {
                    indicator.classList.remove('show');
                }, 1000);
            });
            
            nameBox.addEventListener('click', () => {
                copyToClipboard(colorName.textContent);
                showToast('Color name copied to clipboard!');
                
                // Visual feedback
                const indicator = nameBox.querySelector('.copy-indicator');
                indicator.classList.add('show');
                setTimeout(() => {
                    indicator.classList.remove('show');
                }, 1000);
            });
            
            // Copy all button
            copyAllBtn.addEventListener('click', () => {
                const allValues = `RGB: ${rgbValue.textContent}\nHEX: ${hexValue.textContent}\nHSL: ${hslValue.textContent}\nName: ${colorName.textContent}`;
                copyToClipboard(allValues);
                showToast('All color values copied to clipboard!');
            });
            
            // Copy palette colors
            document.querySelectorAll('.palette-color').forEach((colorEl, index) => {
                colorEl.addEventListener('click', () => {
                    const color = colorEl.style.backgroundColor;
                    copyToClipboard(color);
                    showToast(`Palette color ${index + 1} copied to clipboard!`);
                });
            });
        }
        
        // Update from RGB values
        function updateFromRgb(r, g, b) {
            // Update HSL inputs
            const hsl = rgbToHsl(r, g, b);
            const hslMatch = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
            if (hslMatch) {
                const h = parseInt(hslMatch[1]);
                const s = parseInt(hslMatch[2]);
                const l = parseInt(hslMatch[3]);
                
                hueInput.value = h;
                saturationInput.value = s;
                lightnessInput.value = l;
                hueSlider.value = h;
                saturationSlider.value = s;
                lightnessSlider.value = l;
                hueValue.textContent = `${h}°`;
                saturationValue.textContent = `${s}%`;
                lightnessValue.textContent = `${l}%`;
            }
            
            // Update HEX input
            hexInput.value = rgbToHex(r, g, b);
            
            // Update color
            updateColor();
        }
        
        // Update from HSL values
        function updateFromHsl(h, s, l) {
            // Convert HSL to RGB
            const rgb = hslToRgb(h, s, l);
            
            // Update RGB inputs
            redInput.value = rgb[0];
            greenInput.value = rgb[1];
            blueInput.value = rgb[2];
            redSlider.value = rgb[0];
            greenSlider.value = rgb[1];
            blueSlider.value = rgb[2];
            redValue.textContent = rgb[0];
            greenValue.textContent = rgb[1];
            blueValue.textContent = rgb[2];
            
            // Update HEX input
            hexInput.value = rgbToHex(rgb[0], rgb[1], rgb[2]);
            
            // Update color
            updateColor();
        }
        
        // Initialize the application
        function init() {
            initEventListeners();
            updateColor();
            updateHistoryDisplay();
        }
        
        // Start the application
        init();