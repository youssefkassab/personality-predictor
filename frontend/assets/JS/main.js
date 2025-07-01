document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.modern-form');
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const data = {
            Features: [
                parseFloat(form.Time_spent_Alone.value),
                parseFloat(form.Social_event_attendance.value),
                parseFloat(form.Going_outside.value),
                parseFloat(form.Post_frequency.value),
                0, 0, 0 // Placeholder for remaining features if needed
            ]
        };
        try {
            const response = await fetch('/api/result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.text();
            // Remove alert, show result in a modern way
            let resultBox = document.querySelector('.result-box');
            if (!resultBox) {
                resultBox = document.createElement('div');
                resultBox.className = 'result-box';
                form.parentNode.appendChild(resultBox);
            }
            resultBox.innerHTML = `<div class="result-content"><span class="result-label">Predicted Personality:</span> <span class="result-value">${result}</span></div>`;
            resultBox.style.display = 'block';
        } catch (error) {
            // Remove alert for error, show error in result box
            resultBox.innerHTML = `<div class="result-content error">Error: ${error}</div>`;
            resultBox.style.display = 'block';
        }
    });
});