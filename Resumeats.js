
        const scoreCache = {};
        let currentFileKey = null;

        // Initialize analysis count
        document.addEventListener('DOMContentLoaded', () => {
            const count = localStorage.getItem('analysisCount') || 0;
            document.getElementById('analysisCount').textContent = `Analyses: ${count}`;
        });

        function displayFileName() {
            const fileInput = document.getElementById("resumeFile");
            const fileNameDisplay = document.getElementById("fileName");
            
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                currentFileKey = `${file.name}-${file.lastModified}`;
                fileNameDisplay.innerHTML = `
                    <i class="fas fa-file-check"></i> 
                    ${file.name}
                `;
            } else {
                currentFileKey = null;
                fileNameDisplay.innerHTML = `<i class="fas fa-file"></i> No file chosen`;
            }
        }

        async function analyzeResume() {
            const fileInput = document.getElementById("resumeFile");
            
            if (fileInput.files.length === 0) {
                alert("Please upload a resume file first!");
                return;
            }

            // Update analysis count
            let currentCount = parseInt(localStorage.getItem('analysisCount')) || 0;
            currentCount += 1;
            localStorage.setItem('analysisCount', currentCount);
            document.getElementById('analysisCount').textContent = `Analyses: ${currentCount}`;

            // Check cache first
            if (currentFileKey && scoreCache[currentFileKey]) {
                updateUI(scoreCache[currentFileKey]);
                return;
            }

            document.getElementById('loader').style.display = 'block';
            
            setTimeout(() => {
                const scores = {
                    Skills: Math.floor(Math.random() * 51) + 50,
                    Experience: Math.floor(Math.random() * 51) + 50,
                    Education: Math.floor(Math.random() * 51) + 50,
                    Certifications: Math.floor(Math.random() * 51) + 50,
                    Projects: Math.floor(Math.random() * 51) + 50
                };
                const overallScore = calculateOverallScore(scores);
                scores.Overall = overallScore;

                // Cache the scores
                if (currentFileKey) {
                    scoreCache[currentFileKey] = scores;
                }

                document.getElementById('loader').style.display = 'none';
                updateUI(scores);
            }, 2000);
        }

        function calculateOverallScore(scores) {
            const total = Object.values(scores).reduce((acc, val) => acc + val, 0);
            return Math.round(total / Object.keys(scores).length);
        }

        function renderChart(scores) {
            const ctx = document.getElementById('scoreChart').getContext('2d');
            new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: Object.keys(scores),
                    datasets: [{
                        label: 'Resume Score',
                        data: Object.values(scores),
                        backgroundColor: 'rgba(52, 152, 219, 0.2)',
                        borderColor: '#3498db',
                        borderWidth: 2,
                        pointBackgroundColor: '#3498db',
                        animation: {
                            duration: 2000,
                            easing: 'easeInOutQuad'
                        }
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        r: { 
                            suggestedMin: 0, 
                            suggestedMax: 100,
                            pointLabels: {
                                color: '#2c3e50',
                                font: {
                                    size: 14
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        function displayScores(scores) {
            let scoreHTML = `<table class='score-table'>
                                <tr><th>Category</th><th>Score</th></tr>`;
            for (let [category, score] of Object.entries(scores)) {
                scoreHTML += `
                    <tr>
                        <td>
                            <i class="fas fa-${getCategoryIcon(category)}"></i> 
                            ${category}
                        </td>
                        <td>${score}</td>
                    </tr>
                `;
            }
            scoreHTML += `</table>`;
            document.getElementById('scoreDisplay').innerHTML = scoreHTML;
        }

        function getCategoryIcon(category) {
            const icons = {
                'Skills': 'tools',
                'Experience': 'briefcase',
                'Education': 'graduation-cap',
                'Certifications': 'certificate',
                'Projects': 'project-diagram'
            };
            return icons[category] || 'check-circle';
        }

        function displayTips(scores) {
            let tips = [];
            
            // Overall tips
            if (scores.Overall < 70) {
                tips.push("Consider enhancing multiple sections of your resume for better results");
            } else if (scores.Overall >= 90) {
                tips.push("Excellent resume! Maintain this quality across all sections");
            }
            
            // Category-specific tips
            Object.entries(scores).forEach(([category, score]) => {
                if (score < 70) {
                    const tip = getTipForCategory(category);
                    tip && tips.push(tip);
                }
            });

            // Advanced tips
            if (scores.Skills >= 85 && scores.Experience >= 85) {
                tips.push("Your strong skills and experience make you a competitive candidate - highlight these prominently");
            }

            if (scores.Certifications >= 80) {
                tips.push("Your certifications are impressive - consider creating a dedicated section for them");
            }

            document.getElementById('tips').innerHTML = `
                <ul style="list-style-type: disc; padding-left: 20px;">
                    ${tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            `;
        }

        function getTipForCategory(category) {
            const tips = {
                'Skills': "Add more industry-specific skills and tools relevant to your target positions",
                'Experience': "Quantify your achievements in work experience with metrics and results",
                'Education': "Include relevant coursework or academic projects if you're a recent graduate",
                'Certifications': "Add certifications from recognized platforms like Coursera or Udemy",
                'Projects': "Describe your role and impact in projects with clear outcomes"
            };
            return tips[category];
        }

        function updateUI(scores) {
            document.getElementById('overallScore').textContent = scores.Overall;
            document.getElementById('results').classList.add('show');
            renderChart(scores);
            displayScores(scores);
            displayTips(scores);
        }