async function loadQuestions() {
  try {
    const res = await fetch("assets/data/question_bank.json");
    if (!res.ok) throw new Error("Failed to fetch question data.");
    const data = await res.json();

    const form = document.getElementById('quiz-form');
    const selectedQuestions = [];

    for (const func in data) {
      const shuffled = data[func].sort(() => Math.random() - 0.5).slice(0, 3);
      shuffled.forEach((q, i) => {
        selectedQuestions.push({ ...q, id: `${func}_${i}` });
      });
    }

    selectedQuestions.forEach((q, index) => {
      const container = document.createElement('div');
      container.className = 'question-box p-6 bg-white text-black rounded-lg shadow mb-6';
      container.innerHTML = `
        <p class="mb-4 font-semibold">${index + 1}. (${q.function}) ${q.question}</p>
        ${q.options.map(opt => `
          <label class="block mb-2">
            <input type="radio" name="${q.id}" value="${opt}" class="mr-2" required> ${opt}
          </label>
        `).join('')}
      `;
      form.appendChild(container);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let score = 0;
      selectedQuestions.forEach(q => {
        const selected = form.querySelector(`input[name="${q.id}"]:checked`);
        if (selected && selected.value === q.answer) score++;
      });

      const resultDiv = document.getElementById('results');
      resultDiv.textContent = `You got ${score} out of 24 correct.`;
      resultDiv.classList.remove('hidden');
      resultDiv.scrollIntoView({ behavior: 'smooth' });
    });
  } catch (err) {
    document.getElementById('quiz-form').innerHTML = `<p class="text-red-500 font-bold">Failed to load quiz. Please try again later.</p>`;
    console.error("Error loading quiz:", err);
  }
}

window.onload = loadQuestions;
