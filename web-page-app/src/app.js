let currentForm = 1;
let startTime = 0;
let formTimes = [];
let timerInterval;
let favorites = {};
let selectedFavorites = [];

const extraOptions = {
    fruits: ['Apple', 'Banana', 'Cherry', 'Grape'],
    seasons: ['Spring', 'Summer', 'Fall', 'Winter'],
    colors: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Black'],
    sports: [
        'Basketball', 'Football', 'Tennis', 'Soccer', 'Baseball', 'Swimming',
        'Golf', 'Volleyball', 'Hockey', 'Rugby', 'Cricket', 'Table Tennis', 'Badminton', 'Boxing', 'Wrestling', 'Skateboarding'
    ],
    movies: [
        'Avatar', 'Titanic', 'Avengers', 'Star Wars', 'Jurassic Park', 'The Lion King', 'Frozen', 'Spider-Man', 'Batman', 'Superman', 'Iron Man', 'Thor', 'Captain America', 'Wonder Woman', 'Black Panther', 'Guardians of the Galaxy', 'Doctor Strange', 'Ant-Man', 'Captain Marvel', 'Black Widow', 'Shang-Chi', 'Eternals', 'Spider-Man: No Way Home', 'The Matrix', 'Terminator', 'Alien', 'Predator', 'Rocky', 'Rambo', 'Die Hard', 'Lethal Weapon', 'Mission Impossible', 'James Bond', 'Fast and Furious', 'Transformers', 'X-Men', 'Fantastic Four', 'Deadpool', 'Wolverine', 'Hulk', 'Ghost Rider', 'Daredevil', 'Punisher', 'Blade', 'Constantine', 'Hellboy', 'V for Vendetta', 'Watchmen', 'Sin City', 'The Dark Knight'
    ]
};

function updateTimer() {
    if (startTime === 0) return;

    const elapsed = Date.now() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateProgress() {
    const progress = ((currentForm - 1) / 5) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

function startTest() {
    startTime = Date.now();
    formTimes = [Date.now()];
    timerInterval = setInterval(updateTimer, 100);
    showForm(2);
    updateHistory();
}

function showForm(formNumber) {
    document.querySelectorAll('.form-section').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`form${formNumber}`).classList.add('active');
    currentForm = formNumber;
    updateProgress();

    if (formNumber === 3) setupRadioButtons();
    if (formNumber === 4) setupDropdowns();
    if (formNumber === 5) setupSearchForm();
    if (formNumber === 6) showResults();
}

function nextForm() {
    if (!validateCurrentForm()) return;

    formTimes.push(Date.now());

    if (currentForm < 6) {
        showForm(currentForm + 1);
        updateHistory();
    }
}

function validateCurrentForm() {
    if (currentForm === 2) {
        const fields = ['fruit', 'season', 'color', 'sport', 'movie'];
        for (let field of fields) {
            const value = document.getElementById(field).value.trim();
            if (!value) {
                alert(`Please fill in your favorite ${field}`);
                return false;
            }
            favorites[field] = toTitleCase(value);
        }
    } else if (currentForm === 3) {
        const categories = ['fruit', 'season', 'color', 'sport', 'movie'];
        for (let category of categories) {
            const selected = document.querySelector(`input[name="${category}"]:checked`);
            if (!selected) {
                alert(`Please select your favorite ${category}`);
                return false;
            }
        }
    } else if (currentForm === 4) {
        const selects = ['fruitSelect', 'seasonSelect', 'colorSelect', 'sportSelect', 'movieSelect'];
        for (let select of selects) {
            if (!document.getElementById(select).value) {
                alert(`Please select all options`);
                return false;
            }
        }
    }
    return true;
}

function changeBackgroundColor(colorName) {
    const validColors = [
        'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black', 'white', 
        'brown', 'gray', 'grey', 'silver', 'gold', 'navy', 'teal', 'lime', 'olive', 
        'maroon', 'aqua', 'fuchsia', 'violet', 'indigo', 'cyan', 'magenta', 'coral',
        'salmon', 'khaki', 'plum', 'orchid', 'turquoise', 'crimson', 'lavender'
    ];

    const normalizedColor = colorName.toLowerCase().trim();

    if (validColors.includes(normalizedColor)) {
        document.body.style.backgroundColor = normalizedColor;
    } else {
        document.body.style.backgroundColor = 'hotpink';
    }
}

function setupRadioButtons() {
    const categories = [
        { name: 'fruit', options: [favorites.fruit, ...extraOptions.fruits] },
        { name: 'season', options: [favorites.season, ...extraOptions.seasons] },
        { name: 'color', options: [favorites.color, ...extraOptions.colors] },
        { name: 'sport', options: [favorites.sport, ...extraOptions.sports] },
        { name: 'movie', options: [favorites.movie, ...extraOptions.movies] }
    ];

    categories.forEach(category => {
        const container = document.getElementById(`${category.name}Radios`);
        container.innerHTML = '';

        // Remove duplicates (case-insensitive), then shuffle
        const lowerFavorite = category.options[0].toLowerCase();
        const uniqueOptions = [category.options[0], ...category.options.slice(1)
            .filter(opt => opt.toLowerCase() !== lowerFavorite)];
        const shuffled = shuffleArray(uniqueOptions);

        shuffled.forEach(option => {
            const div = document.createElement('div');
            div.className = 'radio-item';
            div.innerHTML = `
                <input type="radio" name="${category.name}" value="${option}" id="${category.name}_${option}">
                <label for="${category.name}_${option}">${option}</label>
            `;
            container.appendChild(div);
        });
    });
}

function setupDropdowns() {
    const categories = [
        { name: 'fruit', select: 'fruitSelect', options: [favorites.fruit, ...extraOptions.fruits] },
        { name: 'season', select: 'seasonSelect', options: [favorites.season, ...extraOptions.seasons] },
        { name: 'color', select: 'colorSelect', options: [favorites.color, ...extraOptions.colors] },
        { name: 'sport', select: 'sportSelect', options: [favorites.sport, ...extraOptions.sports] },
        { name: 'movie', select: 'movieSelect', options: [favorites.movie, ...extraOptions.movies] }
    ];

    categories.forEach(category => {
        const select = document.getElementById(category.select);
        select.innerHTML = '<option value="">Select...</option>';

        // Remove duplicates (case-insensitive), then shuffle
        const lowerFavorite = category.options[0].toLowerCase();
        const uniqueOptions = [category.options[0], ...category.options.slice(1)
            .filter(opt => opt.toLowerCase() !== lowerFavorite)];
        const shuffled = shuffleArray(uniqueOptions);

        shuffled.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            select.appendChild(optionElement);
        });
    });
}

function setupSearchForm() {
    const allOptions = [
        ...extraOptions.fruits, ...extraOptions.seasons, ...extraOptions.colors, 
        ...extraOptions.sports, ...extraOptions.movies
    ];

    Object.values(favorites).forEach(favorite => {
        if (!allOptions.includes(favorite)) {
            allOptions.push(favorite);
        }
    });

    const uniqueOptions = [...new Set(allOptions)].sort();

    // Only reset selectedFavorites if we're entering this form for the first time
    if (selectedFavorites.length === 0) {
        selectedFavorites = [];
    }

    const grid = document.getElementById('favoritesGrid');
    grid.innerHTML = '';

    uniqueOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'favorite-btn';
        button.textContent = option;
        if (selectedFavorites.includes(option)) {
            button.classList.add('selected');
        }
        button.onclick = () => selectFavorite(button, option);
        grid.appendChild(button);
    });
}

function filterFavorites() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    const buttons = document.querySelectorAll('.favorite-btn');

    buttons.forEach(button => {
        if (button.textContent.toLowerCase().includes(searchTerm)) {
            button.classList.remove('hidden');
        } else {
            button.classList.add('hidden');
        }
    });
}

function selectFavorite(button, option) {
    const userFavorites = [
        favorites.fruit,
        favorites.season,
        favorites.color,
        favorites.sport,
        favorites.movie
    ];

    // Only allow selection if it's one of the user's favorites
    if (userFavorites.includes(option)) {
        if (!selectedFavorites.includes(option)) {
            selectedFavorites.push(option);
            button.classList.add('selected');
        }

        if (selectedFavorites.length === 5) {
            setTimeout(() => {
                formTimes.push(Date.now());
                showForm(6);
                updateHistory();
            }, 500);
        }
    }
}

function showResults() {
    clearInterval(timerInterval);

    const resultsDiv = document.getElementById('timeResults');
    resultsDiv.innerHTML = '';

    for (let i = 1; i < formTimes.length; i++) {
        const time = (formTimes[i] - formTimes[i-1]) / 1000;
        const formNames = ['Text Fields', 'Radio Buttons', 'Dropdowns', 'Search & Select'];

        const resultDiv = document.createElement('div');
        resultDiv.className = 'time-result';
        resultDiv.innerHTML = `<strong>Form ${i+1} (${formNames[i-1]}):</strong> ${time.toFixed(1)} seconds`;
        resultsDiv.appendChild(resultDiv);
    }
}

function showHint() {
    document.getElementById('hintText').style.display = 'block';
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function updateHistory() {
    try {
        history.pushState({ form: currentForm }, '', `#form${currentForm}`);
    } catch (e) {
        window.location.hash = `form${currentForm}`;
    }
}

window.addEventListener('popstate', function(event) {
    try {
        if (event.state && event.state.form) {
            showForm(event.state.form);
        } else if (currentForm > 1) {
            showForm(currentForm - 1);
        }
    } catch (e) {
        if (currentForm > 1) {
            showForm(currentForm - 1);
        }
    }
});

window.addEventListener('hashchange', function() {
    const hash = window.location.hash;
    const match = hash.match(/form(\d+)/);
    if (match) {
        const formNumber = parseInt(match[1]);
        if (formNumber >= 1 && formNumber <= 6) {
            showForm(formNumber);
        }
    }
});

updateProgress();
try {
    history.replaceState({ form: 1 }, '', '#form1');
} catch (e) {
    window.location.hash = 'form1';
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );

}

// Make startTest available globally for inline HTML onclick
window.startTest = startTest;