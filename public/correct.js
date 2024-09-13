document.addEventListener('DOMContentLoaded', () => {
    const holder = document.getElementById('holder');
    holder.innerHTML = ''; // Clear any existing content

    const clearCorrectButton = document.getElementById('clear-correct');
    let correctAnswers = JSON.parse(localStorage.getItem('correctAnswers')) || {};

    // Create 90 question forms for setting correct answers
    for (let i = 1; i <= 90; i++) {
        const form = document.createElement('form');
        form.id = `question-${i}`;
        form.classList.add('flex', 'gap-2', 'flex-wrap');

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

            // Check the saved correct answer if exists
            if (correctAnswers[i] === option) {
                checkbox.checked = true;
            }

            checkbox.addEventListener('change', function () {
                // Uncheck other options in the same question
                const checkboxes = form.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(cb => {
                    if (cb !== this) {
                        cb.checked = false;
                    }
                });

                // Save the correct answer
                if (checkbox.checked) {
                    correctAnswers[i] = option;
                } else {
                    delete correctAnswers[i];
                }
                saveCorrectAnswersToLocalStorage(correctAnswers);
            });

            label.appendChild(p);
            label.appendChild(checkbox);
            form.appendChild(label);
        });

        holder.appendChild(form);
    }

    function clearCorrectAnswers() {
        localStorage.removeItem('correctAnswers');
        holder.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    }

    function saveCorrectAnswersToLocalStorage(answers) {
        localStorage.setItem('correctAnswers', JSON.stringify(answers));
    }

    // Add event listener for the clear button
    clearCorrectButton.addEventListener('click', clearCorrectAnswers);
});
