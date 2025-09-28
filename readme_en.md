# HealthCalc Hub - Complete Health Calculator

## Project Overview

HealthCalc Hub is a fully client-side health calculator that provides over 50 professional medical calculation tools. All computations run locally in the browser—no external API calls—preserving user privacy and keeping data on the user's device.

## Key Features

- Comprehensive set of medical calculations (50+ endpoints)
- Local calculations with no external dependencies
- Persistent user profile for auto-filling calculators
- Bilingual UI (Chinese / English) with easy toggle
- Responsive design built with Bootstrap 5
- Instant results and readable medical interpretation

## Quick Start

1. Clone the repository:

```bash
git clone <repository-url>
cd "HealthCalc Hub"
```

2. Start a local static server (recommended):

```bash
# Using Python
python -m http.server 8080

# Or using Node.js http-server
npx http-server -p 8080
```

3. Open the app in your browser:

http://localhost:8080

## How to use

1. Fill your personal profile in the "Personal Health Profile" section.
2. Use the "Auto Fill" buttons inside calculators to quickly populate fields.
3. Submit calculators to get instant results and professional interpretation.

## Modules and Calculators

1. Basic Body Metrics
   - BMI Calculator
   - Body Fat Percentage (Deurenberg formula)
   - BMR Calculator (Harris-Benedict)
   - Ideal Weight (Robinson formula)

2. Cardiovascular & Clinical Tools
   - QTc Calculator (Bazett correction)
   - ABI Calculator
   - 6-Minute Walk Test (6MWT)
   - Diabetes Risk Assessment

3. Metabolic & Energy
   - TDEE Calculator
   - Maintenance Calories
   - Lean Body Mass (Boer formula)
   - Body Surface Area (Du Bois formula)

4. Nutrition & Diet Planning
   - Macronutrient Allocation
   - Protein Needs
   - Fiber Recommendations
   - Water Intake Estimation

5. Unit Converters
   - Blood Sugar mg/dL ⇄ mmol/L
   - Cholesterol mg/dL ⇄ mmol/L
   - Unit converters for height and weight

## Technology Stack

- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5 for layout and components
- Font Awesome icons
- Chart.js for charts (where applicable)

## Formulas (Reference)

- BMI: weight (kg) / height² (m)
- BMR: Harris-Benedict equations
- Body Fat: Deurenberg formula
- QTc: Bazett formula
- BSA: Du Bois formula
- LBM: Boer formula

## File Structure

```
HealthCalc Hub/
├── index.html
├── styles.css
├── script.js
├── README.md
├── readme_en.md
└── images/
```

## Contributing

Contributions are welcome. Open issues or submit pull requests. For local testing, use a static server.

## License

MIT License
