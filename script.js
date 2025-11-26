window.addEventListener('load', () => {
 
    const introScreen = document.getElementById('intro-screen');
    const styleScreen = document.getElementById('style-select-screen');
    const uploadScreen = document.getElementById('upload-screen');
    const editorScreen = document.getElementById('editor-screen');

    const imageUpload = document.getElementById('imageUpload');
    const canvas = document.getElementById('editorCanvas');
    const ctx = canvas.getContext('2d');
    
    const rotateBtn = document.getElementById('rotateBtn');
    const scaleSlider = document.getElementById('scaleSlider');
    const scaleValue = document.getElementById('scaleValue');
    const downloadBtn = document.getElementById('downloadBtn');

    const userImage = new Image();
    const bandImage = new Image();
    let selectedBandSrc = '';

    
    let band = {
        x: 150,
        y: 150,
        scale: 1,
        rotation: 0
    };

    let isDragging = false;
    let dragStartX, dragStartY;

    setTimeout(() => {
        document.body.classList.add('show-background'); 

        introScreen.classList.remove('active');
        styleScreen.classList.add('active');
    }, 5000);

    document.querySelector('.style-card').addEventListener('click', (e) => {
        selectedBandSrc = e.currentTarget.dataset.style;
        styleScreen.classList.remove('active');
        uploadScreen.classList.add('active');
    });

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

    bandImage.onload = () => {
        band.x = canvas.width / 2;
        band.y = canvas.height / 2;
        drawImages();
        uploadScreen.classList.remove('active');
        editorScreen.classList.add('active');
    };

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

    canvas.addEventListener('mousedown', (e) => startDrag(getMousePos(canvas, e)));
    canvas.addEventListener('mouseup', endDrag);
    canvas.addEventListener('mouseout', endDrag);
    canvas.addEventListener('mousemove', (e) => duringDrag(getMousePos(canvas, e)));

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrag(getTouchPos(canvas, e));
    });
    canvas.addEventListener('touchend', endDrag);
    canvas.addEventListener('touchcancel', endDrag);
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault(); 
        duringDrag(getTouchPos(canvas, e));
    });
});



