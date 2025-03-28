// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
    
    // Save preference to localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
});

// Check for saved theme preference
window.addEventListener('load', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        const icon = themeToggle.querySelector('i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
});

// Login Functionality
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username && password) {
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
    } else {
        alert('Please enter both username and password');
    }
}

// Navigation
document.querySelectorAll('.sidebar li').forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all items
        document.querySelectorAll('.sidebar li').forEach(i => i.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Hide all sections
        document.querySelectorAll('.main-content > div').forEach(div => div.classList.add('hidden'));
        
        // Show relevant section
        const text = item.textContent.trim().toLowerCase();
        if (text.includes('dashboard')) {
            document.querySelector('.dashboard-section').classList.remove('hidden');
        } else if (text.includes('emi')) {
            document.querySelector('.emi-calculator').classList.remove('hidden');
        } else if (text.includes('currency')) {
            document.querySelector('.currency-converter').classList.remove('hidden');
        } else if (text.includes('banking')) {
            document.querySelector('.banking-services').classList.remove('hidden');
        }
    });
});

// EMI Calculator
function calculateEMI() {
    const principal = parseFloat(document.getElementById('loanAmount').value);
    const rate = parseFloat(document.getElementById('interestRate').value) / 12 / 100;
    const time = parseFloat(document.getElementById('loanTenure').value);
    
    if (principal && rate && time) {
        const emi = principal * rate * Math.pow(1 + rate, time) / (Math.pow(1 + rate, time) - 1);
        document.getElementById('emiResult').innerHTML = `Monthly EMI: $${emi.toFixed(2)}`;
    } else {
        alert('Please enter all values');
    }
}

// Currency Converter
const dropList = document.querySelectorAll(".drop-list select"),
    fromCurrency = document.querySelector(".from select"),
    toCurrency = document.querySelector(".to select"),
    getButton = document.querySelector("form button");

// Country codes from your codes.js
const country_codes = {
    "AED": "ae", "AFN": "af", "XCD": "ag", "ALL": "al", "AMD": "am", "ANG": "an", 
    "AOA": "ao", "AQD": "aq", "ARS": "ar", "AUD": "au", "AZN": "az", "BAM": "ba", 
    "BBD": "bb", "BDT": "bd", "XOF": "be", "BGN": "bg", "BHD": "bh", "BIF": "bi", 
    "BMD": "bm", "BND": "bn", "BOB": "bo", "BRL": "br", "BSD": "bs", "NOK": "bv", 
    "BWP": "bw", "BYR": "by", "BZD": "bz", "CAD": "ca", "CDF": "cd", "XAF": "cf", 
    "CHF": "ch", "CLP": "cl", "CNY": "cn", "COP": "co", "CRC": "cr", "CUP": "cu", 
    "CVE": "cv", "CYP": "cy", "CZK": "cz", "DJF": "dj", "DKK": "dk", "DOP": "do", 
    "DZD": "dz", "ECS": "ec", "EEK": "ee", "EGP": "eg", "ETB": "et", "EUR": "eu", 
    "FJD": "fj", "FKP": "fk", "GBP": "gb", "GEL": "ge", "GGP": "gg", "GHS": "gh", 
    "GIP": "gi", "GMD": "gm", "GNF": "gn", "GTQ": "gt", "GYD": "gy", "HKD": "hk", 
    "HNL": "hn", "HRK": "hr", "HTG": "ht", "HUF": "hu", "IDR": "id", "ILS": "il", 
    "INR": "in", "IQD": "iq", "IRR": "ir", "ISK": "is", "JMD": "jm", "JOD": "jo", 
    "JPY": "jp", "KES": "ke", "KGS": "kg", "KHR": "kh", "KMF": "km", "KPW": "kp", 
    "KRW": "kr", "KWD": "kw", "KYD": "ky", "KZT": "kz", "LAK": "la", "LBP": "lb", 
    "LKR": "lk", "LRD": "lr", "LSL": "ls", "LTL": "lt", "LVL": "lv", "LYD": "ly", 
    "MAD": "ma", "MDL": "md", "MGA": "mg", "MKD": "mk", "MMK": "mm", "MNT": "mn", 
    "MOP": "mo", "MRO": "mr", "MTL": "mt", "MUR": "mu", "MVR": "mv", "MWK": "mw", 
    "MXN": "mx", "MYR": "my", "MZN": "mz", "NAD": "na", "XPF": "nc", "NGN": "ng", 
    "NIO": "ni", "NPR": "np", "NZD": "nz", "OMR": "om", "PAB": "pa", "PEN": "pe", 
    "PGK": "pg", "PHP": "ph", "PKR": "pk", "PLN": "pl", "PYG": "py", "QAR": "qa", 
    "RON": "ro", "RSD": "rs", "RUB": "ru", "RWF": "rw", "SAR": "sa", "SBD": "sb", 
    "SCR": "sc", "SDG": "sd", "SEK": "se", "SGD": "sg", "SKK": "sk", "SLL": "sl", 
    "SOS": "so", "SRD": "sr", "STD": "st", "SVC": "sv", "SYP": "sy", "SZL": "sz", 
    "THB": "th", "TJS": "tj", "TMT": "tm", "TND": "tn", "TOP": "to", "TRY": "tr", 
    "TTD": "tt", "TWD": "tw", "TZS": "tz", "UAH": "ua", "UGX": "ug", "USD": "us", 
    "UYU": "uy", "UZS": "uz", "VEF": "ve", "VND": "vn", "VUV": "vu", "YER": "ye", 
    "ZAR": "za", "ZMK": "zm", "ZWD": "zw"
};

// Currency Converter Initialization
for (let i = 0; i < dropList.length; i++) {
    for (let currency_code in country_codes) {
        // Set USD as "From" currency and INR as "To" currency by default
        let selected = i == 0 ? currency_code == "USD" ? "selected" : "" : currency_code == "INR" ? "selected" : "";
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e => {
        loadFlag(e.target);
    });
}

// Initialize flags on page load
window.addEventListener("load", () => {
    // Set initial flags
    const fromFlag = document.querySelector(".from .select-box img");
    const toFlag = document.querySelector(".to .select-box img");
    
    // Set US flag for "From" currency
    fromFlag.src = `https://flagcdn.com/48x36/us.png`;
    
    // Set Indian flag for "To" currency
    toFlag.src = `https://flagcdn.com/48x36/in.png`;
    
    // Get initial exchange rate
    getExchangeRate();
});

// Function to load flag when currency changes
function loadFlag(element) {
    for (let code in country_codes) {
        if (code == element.value) {
            let imgTag = element.parentElement.querySelector("img");
            // For INR, use 'in' as country code for Indian flag
            const countryCode = code === 'INR' ? 'in' : country_codes[code].toLowerCase();
            imgTag.src = `https://flagcdn.com/48x36/${countryCode}.png`;
        }
    }
}

// Currency Converter
async function getExchangeRate() {
    const amount = document.querySelector(".amount input");
    const exchangeRateTxt = document.querySelector(".exchange-rate");
    let amountVal = amount.value;
    
    // Validate amount
    if (amountVal == "" || amountVal == "0") {
        amount.value = "1";
        amountVal = 1;
    }
    
    exchangeRateTxt.innerText = "Getting exchange rate...";
    
    const from = fromCurrency.value.toLowerCase();
    const to = toCurrency.value.toLowerCase();

    try {
        const rate = await fetchExchangeRate(from, to);
        if (rate) {
            const totalExRate = (amountVal * rate).toFixed(2);
            exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
        } else {
            exchangeRateTxt.innerText = "Unable to fetch exchange rate";
        }
    } catch (error) {
        exchangeRateTxt.innerText = "Something went wrong";
        console.error(error);
    }
}

async function fetchExchangeRate(fromCurrency, toCurrency) {
    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency}.json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const json = await response.json();
        
        // Get the exchange rate
        const rate = json[fromCurrency][toCurrency];
        
        if (!rate) {
            throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
        }

        console.log(`Exchange rate from ${fromCurrency} to ${toCurrency}: ${rate}`);
        return rate;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        return null;
    }
}

// Event Listeners
window.addEventListener("load", () => {
    getExchangeRate();
});

getButton.addEventListener("click", e => {
    e.preventDefault();
    getExchangeRate();
});

const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});

// Populate dummy transactions
const transactions = [
    { description: 'Grocery Store', amount: -85.50, date: '2024-03-15' },
    { description: 'Salary Deposit', amount: 3500.00, date: '2024-03-14' },
    { description: 'Restaurant', amount: -45.75, date: '2024-03-13' },
    { description: 'Online Shopping', amount: -129.99, date: '2024-03-12' }
];

const transactionList = document.querySelector('.transaction-list');
transactions.forEach(transaction => {
    const div = document.createElement('div');
    div.className = 'transaction-item';
    div.innerHTML = `
        <span>${transaction.description}</span>
        <span class="transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}">
            ${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount).toFixed(2)}
        </span>
    `;
    transactionList.appendChild(div);
});

// Rewards Calculator Functions
function calculateRewards() {
    const monthlySpend = parseFloat(document.getElementById('monthlySpend').value);
    const cardType = document.getElementById('cardType').value;
    const resultDisplay = document.getElementById('rewardsResult');

    // Validate input
    if (!monthlySpend || monthlySpend <= 0) {
        showError('Please enter a valid monthly spend amount');
        return;
    }

    // Calculate annual spend
    const annualSpend = monthlySpend * 12;

    // Define reward rates and benefits for each card type
    const cardRewards = {
        basic: {
            cashbackRate: 0.01, // 1% cashback
            welcomeBonus: 1000,
            annualFee: 0,
            additionalBenefits: {
                fuelSurcharge: 250, // Estimated monthly fuel surcharge savings
                movieDiscount: 150  // Estimated monthly movie ticket savings
            }
        },
        premium: {
            rewardRate: 4, // 4X points on travel
            pointValue: 0.01, // 1 point = ₹0.01
            welcomeBonus: 5000,
            annualFee: 3000,
            additionalBenefits: {
                loungeAccess: 1000, // Estimated value per lounge visit
                travelInsurance: 2000 // Annual travel insurance value
            }
        },
        business: {
            cashbackRate: 0.02, // 2% cashback
            welcomeBonus: 10000,
            annualFee: 5000,
            additionalBenefits: {
                gstBenefits: 1000, // Estimated monthly GST filing benefits
                expenseManagement: 500 // Estimated monthly tool value
            }
        }
    };

    let annualRewards = 0;
    let rewardsSummary = '';

    switch (cardType) {
        case 'basic':
            const basicCashback = annualSpend * cardRewards.basic.cashbackRate;
            const basicAnnualBenefits = (cardRewards.basic.additionalBenefits.fuelSurcharge + 
                                       cardRewards.basic.additionalBenefits.movieDiscount) * 12;
            annualRewards = basicCashback + cardRewards.basic.welcomeBonus + basicAnnualBenefits;

            rewardsSummary = `
                <h3>Basic Rewards Card Benefits</h3>
                <div class="rewards-breakdown">
                    <p>Annual Cashback: ₹${basicCashback.toFixed(2)}</p>
                    <p>Welcome Bonus: ₹${cardRewards.basic.welcomeBonus}</p>
                    <p>Fuel Surcharge Savings: ₹${cardRewards.basic.additionalBenefits.fuelSurcharge * 12}</p>
                    <p>Movie Discount Value: ₹${cardRewards.basic.additionalBenefits.movieDiscount * 12}</p>
                    <p class="total-rewards">Total Annual Value: ₹${annualRewards.toFixed(2)}</p>
                </div>`;
            break;

        case 'premium':
            const premiumPoints = annualSpend * cardRewards.premium.rewardRate;
            const premiumPointsValue = premiumPoints * cardRewards.premium.pointValue;
            const premiumAnnualBenefits = cardRewards.premium.additionalBenefits.loungeAccess * 4 + // Assuming 4 lounge visits
                                        cardRewards.premium.additionalBenefits.travelInsurance;
            annualRewards = premiumPointsValue + cardRewards.premium.welcomeBonus + 
                           premiumAnnualBenefits - cardRewards.premium.annualFee;

            rewardsSummary = `
                <h3>Premium Travel Card Benefits</h3>
                <div class="rewards-breakdown">
                    <p>Points Earned: ${premiumPoints.toFixed(0)} points</p>
                    <p>Points Value: ₹${premiumPointsValue.toFixed(2)}</p>
                    <p>Welcome Bonus: ₹${cardRewards.premium.welcomeBonus}</p>
                    <p>Lounge Access Value: ₹${cardRewards.premium.additionalBenefits.loungeAccess * 4}</p>
                    <p>Travel Insurance: ₹${cardRewards.premium.additionalBenefits.travelInsurance}</p>
                    <p>Annual Fee: -₹${cardRewards.premium.annualFee}</p>
                    <p class="total-rewards">Total Annual Value: ₹${annualRewards.toFixed(2)}</p>
                </div>`;
            break;

        case 'business':
            const businessCashback = annualSpend * cardRewards.business.cashbackRate;
            const businessAnnualBenefits = (cardRewards.business.additionalBenefits.gstBenefits + 
                                          cardRewards.business.additionalBenefits.expenseManagement) * 12;
            annualRewards = businessCashback + cardRewards.business.welcomeBonus + 
                           businessAnnualBenefits - cardRewards.business.annualFee;

            rewardsSummary = `
                <h3>Business Card Benefits</h3>
                <div class="rewards-breakdown">
                    <p>Annual Cashback: ₹${businessCashback.toFixed(2)}</p>
                    <p>Welcome Bonus: ₹${cardRewards.business.welcomeBonus}</p>
                    <p>GST Benefits Value: ₹${cardRewards.business.additionalBenefits.gstBenefits * 12}</p>
                    <p>Expense Management Value: ₹${cardRewards.business.additionalBenefits.expenseManagement * 12}</p>
                    <p>Annual Fee: -₹${cardRewards.business.annualFee}</p>
                    <p class="total-rewards">Total Annual Value: ₹${annualRewards.toFixed(2)}</p>
                </div>`;
            break;
    }

    // Add CSS animation class
    resultDisplay.className = 'result-display fade-in';
    resultDisplay.innerHTML = rewardsSummary;
}

// Error handling function
function showError(message) {
    const resultDisplay = document.getElementById('rewardsResult');
    resultDisplay.className = 'result-display error fade-in';
    resultDisplay.innerHTML = `<p class="error-message">${message}</p>`;
}
