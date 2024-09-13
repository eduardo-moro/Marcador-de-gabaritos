document.addEventListener('DOMContentLoaded', () => {
    const holder = document.getElementById('holder');
    const toggleCorrectButton = document.getElementById('toggle-correct');
    const highlightQuestionsButton = document.getElementById('highlight-questions');
    const clearAnswersButton = document.getElementById('clear-answers');
    let correctAnswers = JSON.parse(localStorage.getItem('correctAnswers')) || {};
    let answeredCount = 0;
    let correctCount = 0;
    let showCorrectCount = false; // Initially hide correct count
    let highlighting = false; // Track whether highlighting is active

    // Counter element
    const counter = document.createElement('div');
    counter.style.position = 'fixed';
    counter.style.top = '10px';
    counter.style.right = '10px';
    counter.style.backgroundColor = '#f8f8f8';
    counter.style.padding = '10px';
    counter.style.border = '1px solid #ccc';
    counter.style.borderRadius = '5px';
    counter.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    counter.textContent = `Respondidas: ${answeredCount}/90`;
    document.body.appendChild(counter);

    // Create 90 question forms
    for (let i = 1; i <= 90; i++) {
        const form = document.createElement('form');
        form.id = `question-${i}`;
        form.classList.add('flex', 'gap-2', 'items-center', 'px-4'); // Added 'items-center' to align items properly

        const h4 = document.createElement('h4');
        h4.classList.add('p-2');
        h4.textContent = `${i}.`;
        form.appendChild(h4);

        const options = ['A', 'B', 'C', 'D', 'E'];

        options.forEach(option => {
            const label = document.createElement('label');
            label.classList.add('flex', 'mr-2', 'hover:bg-gray-200', 'p-2', 'cursor-pointer');

            const p = document.createElement('p');
            p.classList.add('mr-1', 'cursor-pointer');
            p.textContent = option;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('cursor-pointer');
            checkbox.name = `question-${i}`;
            checkbox.value = option;

            checkbox.addEventListener('change', function () {
                // Uncheck other options in the same question
                const checkboxes = form.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(cb => {
                    if (cb !== this) {
                        cb.checked = false;
                    }
                });
                updateAnswers();
                updateCounter();
                saveAnswers();

                if(highlighting) {
                    highlightQuestions();
                }
            });

            label.appendChild(p);
            label.appendChild(checkbox);
            form.appendChild(label);
        });

        // Create and append the span with the correct answer
        const correctAnswerSpan = document.createElement('span');
        correctAnswerSpan.classList.add('answer-span', 'rounded-lg', 'bg-[#00ff00]', 'w-6', 'text-center', 'font-bold');
        correctAnswerSpan.textContent = showCorrectCount ? (correctAnswers[i] || ' ') : '';
        form.appendChild(correctAnswerSpan);

        holder.appendChild(form);
    }

    function updateAnswers() {
        correctCount = 0;

        for (let i = 1; i <= 90; i++) {
            const selected = document.querySelector(`input[name="question-${i}"]:checked`);
            if (selected) {
                if (correctAnswers[i] === selected.value) {
                    correctCount++;
                }
            }
        }

        updateCounter();
    }

    function updateCounter() {
        answeredCount = 0;
        for (let i = 1; i <= 90; i++) {
            const selected = document.querySelector(`input[name="question-${i}"]:checked`);
            if (selected) {
                answeredCount++;
            }
        }
        counter.textContent = `Respondidas: ${answeredCount}/90 ${showCorrectCount ? "| Corretas: " + correctCount : ""}`;
    }

    function saveAnswers() {
        const answers = {};
        for (let i = 1; i <= 90; i++) {
            const selected = document.querySelector(`input[name="question-${i}"]:checked`);
            if (selected) {
                answers[i] = selected.value;
            }
        }
        localStorage.setItem('answers', JSON.stringify(answers));
    }

    function loadAnswers() {
        const savedAnswers = localStorage.getItem('answers');
        if (savedAnswers) {
            const answers = JSON.parse(savedAnswers);
            for (const [question, answer] of Object.entries(answers)) {
                const checkbox = document.querySelector(`input[name="question-${question}"][value="${answer}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            }
            updateAnswers();
            updateCounter();
        }
    }

    function toggleCorrectAnswers() {
        showCorrectCount = !showCorrectCount;
        toggleCorrectButton.textContent = showCorrectCount ? 'Esconder Correto' : 'Mostrar Correto';

        // Update the display of correct answer spans
        const spans = document.querySelectorAll('form span.answer-span');
        spans.forEach(span => {
            const questionId = parseInt(span.parentElement.id.split('-')[1]);
            span.textContent = showCorrectCount ? (correctAnswers[questionId] || ' ') : '';
        });

        updateCounter();
    }

    function toggleHighlightQuestions() {
        highlighting = !highlighting;
        if (highlighting) {
            highlightQuestions();
            highlightQuestionsButton.textContent = 'Remover Destaques';
        } else {
            removeHighlights();
            highlightQuestionsButton.textContent = 'Destacar Respostas';
        }
    }

    function highlightQuestions() {
        for (let i = 1; i <= 90; i++) {
            const form = document.getElementById(`question-${i}`);
            if (form) {
                const selected = form.querySelector('input[type="checkbox"]:checked');
                if (selected) {
                    const correctOption = correctAnswers[i];
                    if (selected.value === correctOption) {
                        form.style.backgroundColor = 'lime';
                    } else if(correctOption !== undefined){
                        form.style.backgroundColor = 'tomato';
                    } else {
                        form.style.backgroundColor = 'gray';
                    }
                    form.style.borderRadius = '6px';
                }
            }
        }
    }

    function clearAnswers() {
        localStorage.removeItem('answers');
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        updateAnswers();
        updateCounter();

        highlighting = true;
        toggleHighlightQuestions();
    }

    function removeHighlights() {
        for (let i = 1; i <= 90; i++) {
            const form = document.getElementById(`question-${i}`);
            if (form) {
                form.style.backgroundColor = '';
            }
        }
    }

    // Load saved answers on page load
    loadAnswers();

    // Attach event listeners to buttons
    toggleCorrectButton.addEventListener('click', toggleCorrectAnswers);
    highlightQuestionsButton.addEventListener('click', toggleHighlightQuestions);
    clearAnswersButton.addEventListener('click', clearAnswers);

    // Initial update to fill in counter
    updateAnswers();
});
