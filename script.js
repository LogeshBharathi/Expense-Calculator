class IncomeExpenseCalculator {
    constructor() {
        this.entries = JSON.parse(localStorage.getItem('entries')) || [];
        this.initializeElements();
        this.addEventListeners();
        this.updateUI();
    }

    initializeElements() {
        this.form = document.getElementById('entryForm');
        this.descriptionInput = document.getElementById('description');
        this.amountInput = document.getElementById('amount');
        this.typeInput = document.getElementById('type');
        this.entriesList = document.getElementById('entriesList');
        this.resetBtn = document.getElementById('resetBtn');
        this.filterInputs = document.querySelectorAll('input[name="filter"]');
    }

    addEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.resetBtn.addEventListener('click', () => this.resetForm());
        this.filterInputs.forEach(input => {
            input.addEventListener('change', () => this.updateUI());
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const entry = {
            id: Date.now(),
            description: this.descriptionInput.value,
            amount: parseFloat(this.amountInput.value),
            type: this.typeInput.value,
            date: new Date().toISOString()
        };

        this.entries.push(entry);
        this.saveToLocalStorage();
        this.updateUI();
        this.resetForm();
    }

    resetForm() {
        this.form.reset();
    }

    deleteEntry(id) {
        this.entries = this.entries.filter(entry => entry.id !== id);
        this.saveToLocalStorage();
        this.updateUI();
    }

    editEntry(id) {
        const entry = this.entries.find(entry => entry.id === id);
        if (entry) {
            this.descriptionInput.value = entry.description;
            this.amountInput.value = entry.amount;
            this.typeInput.value = entry.type;
            this.deleteEntry(id);
        }
    }

    getFilteredEntries() {
        const filterValue = document.querySelector('input[name="filter"]:checked').value;
        if (filterValue === 'all') return this.entries;
        return this.entries.filter(entry => entry.type === filterValue);
    }

    calculateSummary() {
        const summary = this.entries.reduce((acc, entry) => {
            if (entry.type === 'income') {
                acc.totalIncome += entry.amount;
            } else {
                acc.totalExpense += entry.amount;
            }
            return acc;
        }, { totalIncome: 0, totalExpense: 0 });

        summary.netBalance = summary.totalIncome - summary.totalExpense;
        return summary;
    }

    updateUI() {
        const { totalIncome, totalExpense, netBalance } = this.calculateSummary();
        
        document.getElementById('totalIncome').textContent = `₹${totalIncome.toFixed(2)}`;
        document.getElementById('totalExpense').textContent = `₹${totalExpense.toFixed(2)}`;
        document.getElementById('netBalance').textContent = `₹${netBalance.toFixed(2)}`;

        const filteredEntries = this.getFilteredEntries();
        this.entriesList.innerHTML = filteredEntries.map(entry => `
            <div class="entry-item">
                <div class="entry-info">
                    <strong>${entry.description}</strong>
                    <span class="${entry.type}">₹${entry.amount.toFixed(2)}</span>
                </div>
                <div class="entry-actions">
                    <button onclick="calculator.editEntry(${entry.id})" class="edit-btn">Edit</button>
                    <button onclick="calculator.deleteEntry(${entry.id})" class="delete-btn">Delete</button>
                </div>
            </div>
        `).join('');
    }

    saveToLocalStorage() {
        localStorage.setItem('entries', JSON.stringify(this.entries));
    }
}

const calculator = new IncomeExpenseCalculator(); 