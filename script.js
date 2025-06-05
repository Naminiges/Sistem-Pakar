let currentQuestion = 1;
const totalQuestions = 10;
let completedQuestions = 0;

// Update progress bar
function updateProgress() {
    const progress = (completedQuestions / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = `Pertanyaan ${completedQuestions} dari ${totalQuestions}`;
    
    // Enable submit button when all questions are answered
    if (completedQuestions === totalQuestions) {
        document.getElementById('analyzeBtn').classList.add('ready');
    }
}

// Handle form input changes
function handleInputChange(element) {
    const questionCard = element.closest('.question-card');
    const questionNumber = parseInt(questionCard.dataset.question);
    
    if (element.value) {
        if (!questionCard.classList.contains('completed')) {
            questionCard.classList.add('completed');
            completedQuestions++;
            updateProgress();
        }
        
        // Activate next question
        const nextQuestion = questionNumber + 1;
        if (nextQuestion <= totalQuestions) {
            const nextCard = document.querySelector(`[data-question="${nextQuestion}"]`);
            if (nextCard) {
                nextCard.classList.add('active');
                // Smooth scroll to next question
                setTimeout(() => {
                    nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        }
    } else {
        if (questionCard.classList.contains('completed')) {
            questionCard.classList.remove('completed');
            completedQuestions--;
            updateProgress();
            document.getElementById('analyzeBtn').classList.remove('ready');
        }
    }
}

// Add event listeners to all form inputs
document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('change', () => handleInputChange(input));
    input.addEventListener('input', () => handleInputChange(input));
});

// Original analysis button functionality with enhancements
document.getElementById('analyzeBtn').addEventListener('click', function() {
    if (!this.classList.contains('ready')) {
        // Highlight unanswered questions
        const form = document.getElementById('mentalHealthForm');
        const inputs = form.querySelectorAll('input, select');
        let firstEmpty = null;
        
        inputs.forEach(input => {
            if (!input.value) {
                input.style.borderColor = '#e74c3c';
                input.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
                if (!firstEmpty) firstEmpty = input;
            } else {
                input.style.borderColor = '#e9ecef';
                input.style.boxShadow = 'none';
            }
        });
        
        if (firstEmpty) {
            firstEmpty.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstEmpty.focus();
        }
        
        // Show notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        notification.innerHTML = '⚠️ Mohon lengkapi semua pertanyaan untuk analisis yang akurat';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
        
        return;
    }
    
    // Show loading animation
    document.getElementById('loading').style.display = 'block';
    this.style.display = 'none';
    
    // Simulate processing time
    setTimeout(() => {
        // mengumpulkan data
        const data = {
            screenTime: parseFloat(document.getElementById('screenTime').value),
            socialMediaTime: parseFloat(document.getElementById('socialMediaTime').value),
            nightUse: document.getElementById('nightUse').value,
            contentType: document.getElementById('contentType').value,
            socialComparison: document.getElementById('socialComparison').value,
            sleepChange: document.getElementById('sleepChange').value,
            fomo: document.getElementById('fomo').value,
            realWorldActivities: parseFloat(document.getElementById('realWorldActivities').value),
            moodChange: document.getElementById('moodChange').value,
            notifications: document.getElementById('notifications').value
        };
        
        // menyembunyikan semua hasil
        document.querySelectorAll('.result').forEach(el => {
            el.style.display = 'none';
        });
        
        // menjalankan inference engine (forward chaining)
        const riskLevel = assessRisk(data);
        
        // Hide loading
        document.getElementById('loading').style.display = 'none';
        
        // menampilkan hasil yang sesuai
        document.getElementById('result' + riskLevel).style.display = 'block';
        
        // scroll ke hasil
        document.getElementById('result' + riskLevel).scrollIntoView({
            behavior: 'smooth'
        });
    }, 2000);
});

// inference Engine menggunakan Forward Chaining
function assessRisk(data) {
    // Inisialisasi skor risiko
    let riskScore = 0;
    
    // rules untuk waktu layar (R1-R3)
    if (data.screenTime > 8) {
        riskScore += 3;
    } else if (data.screenTime > 5) {
        riskScore += 2;
    } else if (data.screenTime > 3) {
        riskScore += 1;
    }
    
    // rules untuk penggunaan media sosial (R4-R6)
    if (data.socialMediaTime > 5) {
        riskScore += 3;
    } else if (data.socialMediaTime > 3) {
        riskScore += 2;
    } else if (data.socialMediaTime > 1) {
        riskScore += 1;
    }
    
    // rules untuk penggunaan malam hari (R7-R10)
    switch (data.nightUse) {
        case 'always':
            riskScore += 3;
            break;
        case 'often':
            riskScore += 2;
            break;
        case 'sometimes':
            riskScore += 1;
            break;
        case 'rarely':
            riskScore += 0;
            break;
    }
    
    // rules untuk jenis konten (R11-R14)
    switch (data.contentType) {
        case 'negative':
            riskScore += 3;
            break;
        case 'mixed':
            riskScore += 2;
            break;
        case 'neutral':
            riskScore += 1;
            break;
        case 'positive':
            riskScore += 0;
            break;
    }
    
    // rules untuk perbandingan sosial (R15-R18)
    switch (data.socialComparison) {
        case 'always':
            riskScore += 3;
            break;
        case 'often':
            riskScore += 2;
            break;
        case 'sometimes':
            riskScore += 1;
            break;
        case 'rarely':
            riskScore += 0;
            break;
    }
    
    // rules untuk pengaruh tidur (R19-R22)
    switch (data.sleepChange) {
        case 'significantly':
            riskScore += 3;
            break;
        case 'moderately':
            riskScore += 2;
            break;
        case 'slightly':
            riskScore += 1;
            break;
        case 'no':
            riskScore += 0;
            break;
    }
    
    // rules untuk FOMO (R23-R26)
    switch (data.fomo) {
        case 'always':
            riskScore += 3;
            break;
        case 'often':
            riskScore += 2;
            break;
        case 'sometimes':
            riskScore += 1;
            break;
        case 'rarely':
            riskScore += 0;
            break;
    }
    
    // rules untuk aktivitas dunia nyata (R27-R30)
    if (data.realWorldActivities < 7) {
        riskScore += 3;
    } else if (data.realWorldActivities < 14) {
        riskScore += 2;
    } else if (data.realWorldActivities < 21) {
        riskScore += 1;
    }
    
    // rules untuk perubahan suasana hati (R31-R34)
    switch (data.moodChange) {
        case 'worse':
            riskScore += 3;
            break;
        case 'volatile':
            riskScore += 2;
            break;
        case 'nochange':
            riskScore += 0;
            break;
        case 'better':
            riskScore -= 1; // Bonus untuk dampak positif
            break;
    }
    
    // rules untuk notifikasi (R35-R38)
    switch (data.notifications) {
        case 'excessive':
            riskScore += 3;
            break;
        case 'many':
            riskScore += 2;
            break;
        case 'moderate':
            riskScore += 1;
            break;
        case 'few':
            riskScore += 0;
            break;
    }
    
    // rule khusus untuk kombinasi berisiko tinggi (R39)
    if (data.screenTime > 6 && data.nightUse === 'always' && data.sleepChange === 'significantly') {
        riskScore += 2; // Faktor risiko tambahan untuk kombinasi berisiko tinggi
    }
    
    // rule khusus untuk kombinasi berisiko tinggi lainnya (R40)
    if (data.socialComparison === 'always' && data.moodChange === 'worse' && data.fomo === 'always') {
        riskScore += 2; // Faktor risiko tambahan untuk kombinasi berisiko tinggi
    }
    
    // penentuan tingkat risiko berdasarkan skor total
    if (riskScore >= 15) {
        return 'High';
    } else if (riskScore >= 8) {
        return 'Moderate';
    } else {
        return 'Low';
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize first question
updateProgress();
    