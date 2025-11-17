window.addEventListener('load', () => {

    // --- Screen References ---
    const introScreen = document.getElementById('intro-screen');
    const styleScreen = document.getElementById('style-select-screen');
    const uploadScreen = document.getElementById('upload-screen');
    const editorScreen = document.getElementById('editor-screen');

    // --- Editor References ---
    const imageUpload = document.getElementById('imageUpload');
    const canvas = document.getElementById('editorCanvas');
    const ctx = canvas.getContext('2d');

    // --- Controls ---
    const rotateBtn = document.getElementById('rotateBtn');
    const scaleSlider = document.getElementById('scaleSlider');
    const scaleValue = document.getElementById('scaleValue');
    const downloadBtn = document.getElementById('downloadBtn');

    // --- Image Objects ---
    const userImage = new Image();
    const bandImage = new Image();
    let selectedBandSrc = '';

    // --- Band Properties ---
    let band = {
        x: 150,
        y: 150,
        scale: 1,
        rotation: 0
    };

    // --- Dragging Logic ---
    let isDragging = false;
    let dragStartX, dragStartY;

    // --- Logic for Intro Screen ---
    setTimeout(() => {
        introScreen.classList.remove('active');
        styleScreen.classList.add('active');
    }, 5000);

    // --- Logic for Style Selection ---
    document.querySelector('.style-card').addEventListener('click', (e) => {
        selectedBandSrc = e.currentTarget.dataset.style;
        styleScreen.classList.remove('active');
        uploadScreen.classList.add('active');
    });

    // --- Logic for Image Upload ---
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            userImage.onload = () => {
                canvas.width = userImage.width;
                canvas.height = userImage.height;
                bandImage.src = selectedBandSrc;
                URL.revokeObjectURL(imageURL); 
            };
            userImage.src = imageURL;
        }
    });

    // When the band image is loaded, draw everything and switch to editor
    bandImage.onload = () => {
        band.x = canvas.width / 2;
        band.y = canvas.height / 2;
        drawImages();
        uploadScreen.classList.remove('active');
        editorScreen.classList.add('active');
    };

    // --- Main Drawing Function ---
    function drawImages() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(userImage, 0, 0);
        ctx.save();
        ctx.translate(band.x, band.y);
        ctx.rotate(band.rotation * Math.PI / 180);
        ctx.scale(band.scale, band.scale);
        ctx.drawImage(bandImage, -bandImage.width / 2, -bandImage.height / 2);
        ctx.restore();
    }

    // --- Controls Logic ---
    rotateBtn.addEventListener('click', () => {
        band.rotation = (band.rotation + 15) % 360;
        drawImages();
    });

  rotateBackBtn.addEventListener('click', () => {
        band.rotation = (band.rotation - 15 + 360) % 360;
        drawImages();
    });

    scaleSlider.addEventListener('input', (e) => {
        band.scale = parseFloat(e.target.value);
        scaleValue.textContent = `${band.scale.toFixed(1)}x`;
        drawImages();
    });
    
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 're-creation.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    // --- Drag and Drop Logic for BOTH Mouse and Touch ---

    function getMousePos(canvasEl, evt) {
        const rect = canvasEl.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) * (canvasEl.width / rect.width),
            y: (evt.clientY - rect.top) * (canvasEl.height / rect.height)
        };
    }

    function getTouchPos(canvasEl, evt) {
        const rect = canvasEl.getBoundingClientRect();
        return {
            x: (evt.touches[0].clientX - rect.left) * (canvasEl.width / rect.width),
            y: (evt.touches[0].clientY - rect.top) * (canvasEl.height / rect.height)
        };
    }
    
    function startDrag(pos) {
        if (Math.abs(pos.x - band.x) < (bandImage.width / 2 * band.scale) && Math.abs(pos.y - band.y) < (bandImage.height / 2 * band.scale)) {
            isDragging = true;
            dragStartX = pos.x - band.x;
            dragStartY = pos.y - band.y;
        }
    }

    function duringDrag(pos) {
        if (isDragging) {
            band.x = pos.x - dragStartX;
            band.y = pos.y - dragStartY;
            drawImages();
        }
    }

    function endDrag() {
        isDragging = false;
    }

    // Mouse Event Listeners
    canvas.addEventListener('mousedown', (e) => startDrag(getMousePos(canvas, e)));
    canvas.addEventListener('mouseup', endDrag);
    canvas.addEventListener('mouseout', endDrag);
    canvas.addEventListener('mousemove', (e) => duringDrag(getMousePos(canvas, e)));

    // Touch Event Listeners
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevents page from scrolling
        startDrag(getTouchPos(canvas, e));
    });
    canvas.addEventListener('touchend', endDrag);
    canvas.addEventListener('touchcancel', endDrag);
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevents page from scrolling
        duringDrag(getTouchPos(canvas, e));
    });
});

