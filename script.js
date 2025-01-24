const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
let isDrawing = false;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineWidth = brushSize.value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = colorPicker.value;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function drawBackground() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

drawBackground();

document.getElementById('clearCanvas').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
});

document.getElementById('sendDrawing').addEventListener('click', async () => {
    const imageData = canvas.toDataURL('image/png');
    
    const byteString = atob(imageData.split(',')[1]);
    const mimeString = imageData.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    const formData = new FormData();
    formData.append('file', blob, 'drawing.png');
    formData.append('content', 'New drawing from your website!');
    
    const webhookUrl = 'https://discord.com/api/webhooks/1332452710074810589/_BbprX2ImLzTNgy2INyPxzZaICMhYW7l6e6-w29rh9AI0O-QjaeVTKrVhWzjLwek7j_w';
    
    try {
        await fetch(webhookUrl, {
            method: 'POST',
            body: formData
        });
        alert('Drawing sent successfully!');
    } catch (error) {
        alert('Error sending drawing: ' + error.message);
    }
});

document.getElementById('messageForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('visitorName').value;
    const message = document.getElementById('message').value;
    
    try {
        await fetch('https://discord.com/api/webhooks/1332452710074810589/_BbprX2ImLzTNgy2INyPxzZaICMhYW7l6e6-w29rh9AI0O-QjaeVTKrVhWzjLwek7j_w', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: `New message!\nFrom: ${name}\nMessage: ${message}`
            })
        });
        alert('Message sent successfully!');
        e.target.reset();
    } catch (error) {
        alert('Error sending message: ' + error.message);
    }
}); 