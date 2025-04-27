document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('upi-form');
    const qrSection = document.getElementById('qr-section');
    const qrCodeContainer = document.getElementById('qr-code');
    const upiLinkInput = document.getElementById('upi-link');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const downloadBtn = document.getElementById('download-btn');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const themeToggleBtn = document.getElementById('theme-toggle');


    // Toggle dark/light mode
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggleBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    // Generate UPI Payment URL
    function generateUPILink(upiId, name, amount, note) {
        return `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR&tn=${note}`;
    }

    // Generate QR Code
    function generateQRCode(upiLink) {
        qrCodeContainer.innerHTML = ''; // Clear previous QR code
        new QRCode(qrCodeContainer, {
            text: upiLink,
            width: 128,
            height: 128
        });
    }

    // Handle form submission
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const upiId = form['upi-id'].value;
        const name = form['payee-name'].value;
        const amount = form['amount'].value;
        const note = form['note'].value || '';

        const upiLink = generateUPILink(upiId, name, amount, note);
        upiLinkInput.value = upiLink;
        generateQRCode(upiLink);
        qrSection.style.display = 'block';

        // Save to history
        saveToHistory(upiId, name, amount, note, upiLink);
    });

    // Copy UPI link to clipboard
    copyLinkBtn.addEventListener('click', () => {
        upiLinkInput.select();
        document.execCommand('copy');
        alert('UPI link copied to clipboard!');
    });

    // Download QR code as PNG
    downloadBtn.addEventListener('click', () => {
        const qrCanvas = qrCodeContainer.querySelector('canvas');
        const link = document.createElement('a');
        link.href = qrCanvas.toDataURL('image/png');
        link.download = 'upi_qr.png';
        link.click();
    });

    // Save to history
    function saveToHistory(upiId, name, amount, note, upiLink) {
        const history = JSON.parse(localStorage.getItem('qrHistory')) || [];
        history.push({ upiId, name, amount, note, upiLink });
        localStorage.setItem('qrHistory', JSON.stringify(history));
        displayHistory();
    }

    // Display history
    function displayHistory() {
        const history = JSON.parse(localStorage.getItem('qrHistory')) || [];
        historyList.innerHTML = '';
        history.forEach((entry, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${entry.name} - ₹${entry.amount} - ${entry.upiId}`;
            historyList.appendChild(listItem);
        });
    }

    // Clear history
    clearHistoryBtn.addEventListener('click', () => {
        localStorage.removeItem('qrHistory');
        displayHistory();
    });

    // Initial display of history
    displayHistory();
});
