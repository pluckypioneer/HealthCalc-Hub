// HealthCalc Hub - Complete JavaScript File with Metabolism Module
const API_CONFIG = {
    key: '5944dab1ebmsh0a79affc99db61ep1d92c0jsn3d89824171a7',
    host: 'health-calculator-api.p.rapidapi.com',
    baseUrl: 'https://health-calculator-api.p.rapidapi.com'
};

const LANGUAGES = { en: 'English', zh: '中文' };
let currentLanguage = 'en';

const translations = {
    en: {
        'Please fill all required fields': 'Please fill all required fields',
        'API request failed': 'API request failed',
        'Your BMI Result': 'Your BMI Result',
        'Your QTc Result': 'Your QTc Result',
        'Your ABI Result': 'Your ABI Result',
        'Your 6MWT Result': 'Your 6MWT Result',
        'Your Diabetes Risk Result': 'Your Diabetes Risk Result',
        'Your TDEE Result': 'Your TDEE Result',
        'Your Maintenance Calories Result': 'Your Maintenance Calories Result',
        'Your LBM Result': 'Your LBM Result',
        'Your BSA Result': 'Your BSA Result',
        'Your Macronutrients Result': 'Your Macronutrients Result',
        'Your Protein Result': 'Your Protein Result',
        'Your Fiber Result': 'Your Fiber Result',
        'Your Water Intake Result': 'Your Water Intake Result',
        'Health Category': 'Health Category',
        'Interpretation': 'Interpretation',
        'Underweight': 'Underweight',
        'Normal': 'Normal',
        'Overweight': 'Overweight',
        'Obese': 'Obese'
    },
    zh: {
        'Please fill all required fields': '请填写所有必填项',
        'API request failed': 'API请求失败',
        'Your BMI Result': '您的BMI结果',
        'Your QTc Result': '您的QTc结果',
        'Your ABI Result': '您的ABI结果',
        'Your 6MWT Result': '您的6MWT结果',
        'Your Diabetes Risk Result': '您的糖尿病风险结果',
        'Your TDEE Result': '您的TDEE结果',
        'Your Maintenance Calories Result': '您的维持热量结果',
        'Your LBM Result': '您的瘦体重结果',
        'Your BSA Result': '您的BSA结果',
        'Your Macronutrients Result': '您的宏量营养素结果',
        'Your Protein Result': '您的蛋白质结果',
        'Your Fiber Result': '您的膳食纤维结果',
        'Your Water Intake Result': '您的水分摄入结果',
        'Health Category': '健康等级',
        'Interpretation': '解读',
        'Underweight': '偏瘦',
        'Normal': '正常',
        'Overweight': '超重',
        'Obese': '肥胖'
    }
};

function t(key) {
    return translations[currentLanguage][key] || key;
}

function showLoading(elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="text-center"><div class="loading-spinner"></div><span class="ms-2">${currentLanguage === 'en' ? 'Calculating...' : '计算中...'}</span></div>`;
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle me-2"></i>${message}</div>`;
}

function showSuccess(elementId, content) {
    const element = document.getElementById(elementId);
    element.innerHTML = content;
    element.classList.add('fade-in');
}

async function makeApiRequest(endpoint, params = {}) {
    try {
        const url = new URL(`${API_CONFIG.baseUrl}${endpoint}`);
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
                url.searchParams.append(key, params[key]);
            }
        });
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': API_CONFIG.key,
                'X-RapidAPI-Host': API_CONFIG.host
            }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('API Request Error:', error);
        return { success: false, error: error.message };
    }
}

// Calculator Functions
async function calculateBMI(event) {
    event.preventDefault();
    const height = parseFloat(document.getElementById('bmi-height').value);
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    if (!height || !weight) {
        showError('bmi-result', t('Please fill all required fields'));
        return;
    }
    showLoading('bmi-result');
    const result = await makeApiRequest('/calculate/bmi', { height, weight });
    if (result.success) {
        const bmi = result.data.bmi;
        let category, statusClass;
        if (bmi < 18.5) { category = t('Underweight'); statusClass = 'status-danger'; }
        else if (bmi < 25) { category = t('Normal'); statusClass = 'status-normal'; }
        else if (bmi < 30) { category = t('Overweight'); statusClass = 'status-warning'; }
        else { category = t('Obese'); statusClass = 'status-danger'; }
        const interpretation = currentLanguage === 'zh' ? 
            (bmi < 18.5 ? '您的BMI偏低，建议增加营养摄入。' :
             bmi < 25 ? '您的BMI处于正常范围，请保持当前的健康生活方式。' :
             bmi < 30 ? '您的BMI偏高，建议控制饮食，增加运动量。' :
             '您的BMI过高，建议咨询医生制定减重计划。') :
            (bmi < 18.5 ? 'Your BMI is below normal range. Consider increasing nutritional intake.' :
             bmi < 25 ? 'Your BMI is in the normal range. Maintain your current healthy lifestyle.' :
             bmi < 30 ? 'Your BMI is above normal range. Consider diet control and increased exercise.' :
             'Your BMI is in the obese range. Consult a healthcare provider.');
        showSuccess('bmi-result', `<div class="result-container ${statusClass}"><h5>${t('Your BMI Result')}:</h5><p class="result-value">${bmi.toFixed(1)}</p><p class="result-category">${t('Health Category')}: ${category}</p><p class="result-interpretation">${t('Interpretation')}: ${interpretation}</p></div>`);
    } else {
        showError('bmi-result', `${t('API request failed')}: ${result.error}`);
    }
}

async function calculateBodyFat(event) {
    event.preventDefault();
    const age = parseInt(document.getElementById('bf-age').value);
    const gender = document.getElementById('bf-gender').value;
    const height = parseFloat(document.getElementById('bf-height').value);
    const weight = parseFloat(document.getElementById('bf-weight').value);
    const waist = parseFloat(document.getElementById('bf-waist').value);
    if (!age || !gender || !height || !weight) {
        showError('bodyfat-result', t('Please fill all required fields'));
        return;
    }
    showLoading('bodyfat-result');
    const params = { age, gender, height, weight };
    if (waist) params.waist = waist;
    const result = await makeApiRequest('/calculate/body-fat-percentage', params);
    if (result.success) {
        const bodyFat = result.data.body_fat_percentage || result.data.bodyFatPercentage;
        showSuccess('bodyfat-result', `<div class="result-container status-normal"><h5>${t('Your Body Fat Result')}:</h5><p class="result-value">${bodyFat.toFixed(1)}%</p><p class="result-interpretation">${currentLanguage === 'zh' ? '体脂率已计算完成，请参考健康标准进行调整。' : 'Body fat percentage calculated. Please refer to health standards for adjustments.'}</p></div>`);
    } else {
        showError('bodyfat-result', `${t('API request failed')}: ${result.error}`);
    }
}

async function calculateBMR(event) {
    event.preventDefault();
    const age = parseInt(document.getElementById('bmr-age').value);
    const gender = document.getElementById('bmr-gender').value;
    const height = parseFloat(document.getElementById('bmr-height').value);
    const weight = parseFloat(document.getElementById('bmr-weight').value);
    if (!age || !gender || !height || !weight) {
        showError('bmr-result', t('Please fill all required fields'));
        return;
    }
    showLoading('bmr-result');
    const result = await makeApiRequest('/calculate/bmr', { age, gender, height, weight });
    if (result.success) {
        const bmr = result.data.bmr;
        showSuccess('bmr-result', `<div class="result-container status-normal"><h5>${t('Your BMR Result')}:</h5><p class="result-value">${bmr.toFixed(0)} <small>cal/day</small></p><p class="result-interpretation">${currentLanguage === 'zh' ? `您的基础代谢率为 ${bmr.toFixed(0)} 千卡/天。这是您身体在完全静息状态下维持基本生理功能所需的能量。` : `Your Basal Metabolic Rate is ${bmr.toFixed(0)} calories per day. This is the energy your body needs to maintain basic physiological functions at complete rest.`}</p></div>`);
    } else {
        showError('bmr-result', `${t('API request failed')}: ${result.error}`);
    }
}

async function calculateIdealWeight(event) {
    event.preventDefault();
    const height = parseFloat(document.getElementById('iw-height').value);
    const gender = document.getElementById('iw-gender').value;
    const currentWeight = parseFloat(document.getElementById('iw-current-weight').value) || null;
    if (!height || !gender) {
        showError('ideal-weight-result', t('Please fill all required fields'));
        return;
    }
    showLoading('ideal-weight-result');
    const result = await makeApiRequest('/calculate/ibw', { height, gender });
    if (result.success) {
        const idealWeight = result.data.ideal_body_weight || result.data.ibw;
        showSuccess('ideal-weight-result', `<div class="result-container status-normal"><h5>${t('Your Ideal Weight Result')}:</h5><p class="result-value">${idealWeight.toFixed(1)} <small>kg</small></p>${currentWeight ? `<p class="result-category">${currentLanguage === 'zh' ? '当前体重' : 'Current Weight'}: ${currentWeight.toFixed(1)} kg</p>` : ''}<p class="result-interpretation">${currentLanguage === 'zh' ? `您的理想体重约为 ${idealWeight.toFixed(1)} kg。` : `Your ideal weight is approximately ${idealWeight.toFixed(1)} kg.`}</p></div>`);
    } else {
        showError('ideal-weight-result', `${t('API request failed')}: ${result.error}`);
    }
}

async function calculateQTc(event) {
    event.preventDefault();
    const qt = parseFloat(document.getElementById('qtc-qt').value);
    const hr = parseFloat(document.getElementById('qtc-hr').value);
    if (!qt || !hr) {
        showError('qtc-result', t('Please fill all required fields'));
        return;
    }
    showLoading('qtc-result');
    const result = await makeApiRequest('/calculate/qtc', { qt_interval: qt, heart_rate: hr });
    if (result.success) {
        const qtcBazett = result.data.qtc_bazett || result.data.bazett;
        const statusClass = qtcBazett < 450 ? 'status-normal' : qtcBazett < 500 ? 'status-warning' : 'status-danger';
        const interpretation = currentLanguage === 'zh' ? (qtcBazett < 450 ? 'QTc间期正常，无心律失常风险。' : qtcBazett < 500 ? 'QTc间期轻度延长，建议监测心电图变化。' : 'QTc间期明显延长，存在心律失常风险，建议就医。') : (qtcBazett < 450 ? 'QTc interval is normal. No arrhythmia risk detected.' : qtcBazett < 500 ? 'QTc interval is mildly prolonged. Monitor ECG changes.' : 'QTc interval is significantly prolonged. High risk of arrhythmia, consult physician.');
        showSuccess('qtc-result', `<div class="result-container ${statusClass}"><h5>${t('Your QTc Result')}:</h5><p class="result-value">${qtcBazett.toFixed(0)} <small>ms</small></p><p class="result-interpretation">${interpretation}</p></div>`);
    } else {
        showError('qtc-result', `${t('API request failed')}: ${result.error}`);
    }
}

async function calculateABI(event) {
    event.preventDefault();
    const ankle = parseFloat(document.getElementById('abi-ankle').value);
    const brachial = parseFloat(document.getElementById('abi-brachial').value);
    if (!ankle || !brachial) {
        showError('abi-result', t('Please fill all required fields'));
        return;
    }
    showLoading('abi-result');
    const result = await makeApiRequest('/calculate/abi', { ankle_systolic: ankle, brachial_systolic: brachial });
    if (result.success) {
        const abi = result.data.abi;
        const statusClass = (abi >= 1.0 && abi <= 1.4) ? 'status-normal' : abi >= 0.7 ? 'status-warning' : 'status-danger';
        const interpretation = currentLanguage === 'zh' ? (abi >= 1.0 && abi <= 1.4 ? '踝肱指数正常，未发现外周血管疾病征象。' : abi >= 0.7 ? '踝肱指数显示轻度至中度外周动脉疾病。' : '踝肱指数显示严重外周动脉疾病，建议立即就医。') : (abi >= 1.0 && abi <= 1.4 ? 'ABI is normal, no peripheral vascular disease detected.' : abi >= 0.7 ? 'ABI indicates mild to moderate peripheral artery disease.' : 'ABI indicates severe peripheral artery disease, seek immediate medical attention.');
        showSuccess('abi-result', `<div class="result-container ${statusClass}"><h5>${t('Your ABI Result')}:</h5><p class="result-value">${abi.toFixed(2)}</p><p class="result-interpretation">${interpretation}</p></div>`);
    } else {
        showError('abi-result', `${t('API request failed')}: ${result.error}`);
    }
}

async function calculate6MWT(event) {
    event.preventDefault();
    const age = parseInt(document.getElementById('mwt-age').value);
    const gender = document.getElementById('mwt-gender').value;
    const distance = parseFloat(document.getElementById('mwt-distance').value);
    if (!age || !gender || !distance) {
        showError('6mwt-result', t('Please fill all required fields'));
        return;
    }
    showLoading('6mwt-result');
    const result = await makeApiRequest('/calculate/6mwt', { age, gender, distance });
    if (result.success) {
        const predicted = result.data.predicted_distance || result.data.predicted;
        const percent = (distance / predicted) * 100;
        const statusClass = percent >= 80 ? 'status-normal' : percent >= 60 ? 'status-warning' : 'status-danger';
        showSuccess('6mwt-result', `<div class="result-container ${statusClass}"><h5>${t('Your 6MWT Result')}:</h5><p class="result-value">${distance} <small>m</small></p><p class="result-category">${currentLanguage === 'zh' ? '预期距离' : 'Predicted Distance'}: ${predicted.toFixed(0)}m (${percent.toFixed(0)}%)</p><p class="result-interpretation">${currentLanguage === 'zh' ? `您的6分钟步行距离为 ${distance}m，达到预期值的${percent.toFixed(0)}%。` : `Your 6-minute walk distance is ${distance}m, achieving ${percent.toFixed(0)}% of predicted value.`}</p></div>`);
    } else {
        showError('6mwt-result', `${t('API request failed')}: ${result.error}`);
    }
}

async function calculateDiabetesRisk(event) {
    event.preventDefault();
    const age = parseInt(document.getElementById('diab-age').value);
    const bmi = parseFloat(document.getElementById('diab-bmi').value);
    const sbp = parseFloat(document.getElementById('diab-sbp').value);
    const family = document.getElementById('diab-family').value === 'yes';
    if (!age || !bmi || !sbp || document.getElementById('diab-family').value === '') {
        showError('diabetes-result', t('Please fill all required fields'));
        return;
    }
    showLoading('diabetes-result');
    const result = await makeApiRequest('/calculate/diabetes-risk', { age, bmi, systolic_bp: sbp, family_history: family });
    if (result.success) {
        const risk = result.data.risk_percentage || result.data.risk;
        const statusClass = risk < 5 ? 'status-normal' : risk < 15 ? 'status-warning' : 'status-danger';
        showSuccess('diabetes-result', `<div class="result-container ${statusClass}"><h5>${t('Your Diabetes Risk Result')}:</h5><p class="result-value">${risk.toFixed(1)}%</p><p class="result-interpretation">${currentLanguage === 'zh' ? `您未来7.5年内患糖尿病的风险为${risk.toFixed(1)}%。` : `Your 7.5-year diabetes risk is ${risk.toFixed(1)}%.`}</p></div>`);
    } else {
        showError('diabetes-result', `${t('API request failed')}: ${result.error}`);
    }
}

async function calculateTDEE(event) {
    event.preventDefault();
    const age = parseInt(document.getElementById('tdee-age').value);
    const gender = document.getElementById('tdee-gender').value;
    const height = parseFloat(document.getElementById('tdee-height').value);
    const weight = parseFloat(document.getElementById('tdee-weight').value);
    const activity = document.getElementById('tdee-activity').value;
    if (!age || !gender || !height || !weight || !activity) {
        showError('tdee-result', t('Please fill all required fields'));
        return;
    }
    showLoading('tdee-result');
    const result = await makeApiRequest('/calculate/tdee', { age, gender, height, weight, activity_level: activity });
    if (result.success) {
        const tdee = result.data.tdee;
        const activityDescriptions = { 'sedentary': currentLanguage === 'zh' ? '久坐型生活方式' : 'Sedentary lifestyle', 'lightly_active': currentLanguage === 'zh' ? '轻度活跃' : 'Lightly active', 'moderately_active': currentLanguage === 'zh' ? '中度活跃' : 'Moderately active', 'very_active': currentLanguage === 'zh' ? '高度活跃' : 'Very active', 'extra_active': currentLanguage === 'zh' ? '极度活跃' : 'Extra active' };
        showSuccess('tdee-result', `<div class="result-container status-normal"><h5>${t('Your TDEE Result')}:</h5><p class="result-value">${tdee.toFixed(0)} <small>cal/day</small></p><p class="result-interpretation">${currentLanguage === 'zh' ? `您的每日总能量消耗为 ${tdee.toFixed(0)} 千卡。这包括了基础代谢和活动消耗。基于您的${activityDescriptions[activity]}水平计算。` : `Your Total Daily Energy Expenditure is ${tdee.toFixed(0)} calories. This includes basal metabolism and activity expenditure based on your ${activityDescriptions[activity]} level.`}</p></div>`);
    } else {
        showError('tdee-result', `${t('API request failed')}: ${result.error}`);
    }
}

async function calculateMaintenanceCalories(event) {
    event.preventDefault();
    const age = parseInt(document.getElementById('mc-age').value);
    const gender = document.getElementById('mc-gender').value;
    const height = parseFloat(document.getElementById('mc-height').value);
    const weight = parseFloat(document.getElementById('mc-weight').value);
    const activity = document.getElementById('mc-activity').value;
    if (!age || !gender || !height || !weight || !activity) {
        showError('maintenance-result', t('Please fill all required fields'));
        return;
    }
    showLoading('maintenance-result');
    const result = await makeApiRequest('/calculate/maintenance-calories', { age, gender, height, weight, activity_level: activity });
    if (result.success) {
        const maintenance = result.data.maintenance_calories || result.data.calories;
        showSuccess('maintenance-result', `<div class="result-container status-normal"><h5>${t('Your Maintenance Calories Result')}:</h5><p class="result-value">${maintenance.toFixed(0)} <small>cal/day</small></p><p class="result-interpretation">${currentLanguage === 'zh' ? `您的维持体重所需的每日热量为 ${maintenance.toFixed(0)} 千卡。若想减重，可在此基础上每日减少300-500千卡。若想增重，可每日增加300-500千卡。` : `Your maintenance calories are ${maintenance.toFixed(0)} calories per day. For weight loss, reduce by 300-500 calories daily. For weight gain, add 300-500 calories daily.`}</p><div class="mt-3"><div class="row text-center"><div class="col-4"><small class="text-success"><strong>${currentLanguage === 'zh' ? '减重' : 'Weight Loss'}</strong><br>${(maintenance - 400).toFixed(0)} cal</small></div><div class="col-4"><small class="text-primary"><strong>${currentLanguage === 'zh' ? '维持' : 'Maintenance'}</strong><br>${maintenance.toFixed(0)} cal</small></div><div class="col-4"><small class="text-warning"><strong>${currentLanguage === 'zh' ? '增重' : 'Weight Gain'}</strong><br>${(maintenance + 400).toFixed(0)} cal</small></div></div></div>`);
    } else {
        showError('maintenance-result', `${t('API request failed')}: ${result.error}`);
    }
}

async function calculateLBM(event) {
    event.preventDefault();
    const gender = document.getElementById('lbm-gender').value;
    const height = parseFloat(document.getElementById('lbm-height').value);
    const weight = parseFloat(document.getElementById('lbm-weight').value);
    if (!gender || !height || !weight) {
        showError('lbm-result', t('Please fill all required fields'));
        return;
    }
    showLoading('lbm-result');
    const result = await makeApiRequest('/calculate/lbm', { gender, height, weight });
    if (result.success) {
        const lbm = result.data.lean_body_mass || result.data.lbm;
        const bodyFatMass = weight - lbm;
        const bodyFatPercentage = (bodyFatMass / weight) * 100;
        showSuccess('lbm-result', `<div class="result-container status-normal"><h5>${t('Your LBM Result')}:</h5><p class="result-value">${lbm.toFixed(1)} <small>kg</small></p><p class="result-category">${currentLanguage === 'zh' ? '肌肉含量比例' : 'Muscle Mass Ratio'}: ${((lbm/weight)*100).toFixed(1)}%</p><p class="result-interpretation">${currentLanguage === 'zh' ? `您的瘦体重为 ${lbm.toFixed(1)}kg，占总体重的${((lbm/weight)*100).toFixed(1)}%。瘦体重包括肌肉、骨骼、器官和水分，不包括脂肪。` : `Your lean body mass is ${lbm.toFixed(1)}kg, representing ${((lbm/weight)*100).toFixed(1)}% of your total weight. LBM includes muscle, bone, organs, and water, excluding fat.`}</p><div class="mt-3"><small class="text-muted">${currentLanguage === 'zh' ? `估算体脂重：${bodyFatMass.toFixed(1)}kg (${bodyFatPercentage.toFixed(1)}%)` : `Estimated body fat: ${bodyFatMass.toFixed(1)}kg (${bodyFatPercentage.toFixed(1)}%)`}</small></div></div>`);
    } else {
        showError('lbm-result', `${t('API request failed')}: ${result.error}`);
    }
}

async function calculateBSA(event) {
    event.preventDefault();
    const height = parseFloat(document.getElementById('bsa-height').value);
    const weight = parseFloat(document.getElementById('bsa-weight').value);
    if (!height || !weight) {
        showError('bsa-result', t('Please fill all required fields'));
        return;
    }
    showLoading('bsa-result');
    const result = await makeApiRequest('/calculate/bsa', { height, weight });
    if (result.success) {
        const bsa = result.data.body_surface_area || result.data.bsa;
        const statusClass = (bsa >= 1.5 && bsa <= 2.0) ? 'status-normal' : 'status-warning';
        showSuccess('bsa-result', `<div class="result-container ${statusClass}"><h5>${t('Your BSA Result')}:</h5><p class="result-value">${bsa.toFixed(2)} <small>m²</small></p><p class="result-interpretation">${currentLanguage === 'zh' ? `您的体表面积为 ${bsa.toFixed(2)} 平方米。BSA常用于医疗领域，如药物剂量计算、化疗方案制定等。成人正常BSA范围为1.5-2.0㎡。` : `Your Body Surface Area is ${bsa.toFixed(2)} square meters. BSA is commonly used in medical settings for drug dosage calculations and chemotherapy protocols. Normal adult BSA ranges from 1.5-2.0 m².`}</p><div class="mt-3"><small class="text-muted">${currentLanguage === 'zh' ? '基于 Du Bois 公式计算' : 'Calculated using Du Bois formula'}</small></div></div>`);
    }
}

// Nutrition Calculator Functions
async function calculateMacronutrients(event) {
    event.preventDefault();
    const age = parseInt(document.getElementById('macro-age').value);
    const gender = document.getElementById('macro-gender').value;
    const weight = parseFloat(document.getElementById('macro-weight').value);
    const activity = document.getElementById('macro-activity').value;
    const goal = document.getElementById('macro-goal').value;
    if (!age || !gender || !weight || !activity || !goal) {
        showError('macro-result', t('Please fill all required fields'));
        return;
    }
    showLoading('macro-result');
    const result = await makeApiRequest('/calculate/macronutrients', { age, gender, weight, activity_level: activity, goal });
    if (result.success) {
        const data = result.data;
        const protein = data.protein || (weight * 1.6);
        const carbs = data.carbohydrates || (weight * 3);
        const fat = data.fat || (weight * 0.8);
        const calories = data.calories || (protein * 4 + carbs * 4 + fat * 9);
        showSuccess('macro-result', `<div class="result-container status-normal"><h5>${t('Your Macronutrients Result')}:</h5><div class="row text-center mb-3"><div class="col-4"><h6>蛋白质/Protein</h6><p class="result-value">${protein.toFixed(0)}g</p></div><div class="col-4"><h6>碳水/Carbs</h6><p class="result-value">${carbs.toFixed(0)}g</p></div><div class="col-4"><h6>脂肪/Fat</h6><p class="result-value">${fat.toFixed(0)}g</p></div></div><p class="result-interpretation">${currentLanguage === 'zh' ? `每日总热量：${calories.toFixed(0)}千卡。根据您的${goal === 'lose_weight' ? '减重' : goal === 'gain_weight' ? '增重' : goal === 'muscle_gain' ? '增肌' : '维持'}目标设计。` : `Daily total calories: ${calories.toFixed(0)} kcal. Designed for your ${goal.replace('_', ' ')} goal.`}</p></div>`);
    } else {
        showError('macro-result', `${t('API request failed')}: ${result.error}`);
    }
}

async function calculateProtein(event) {
    event.preventDefault();
    const weight = parseFloat(document.getElementById('protein-weight').value);
    const activity = document.getElementById('protein-activity').value;
    const goal = document.getElementById('protein-goal').value;
    if (!weight || !activity || !goal) {
        showError('protein-result', t('Please fill all required fields'));
        return;
    }
    showLoading('protein-result');
    const result = await makeApiRequest('/calculate/protein', { weight, activity_level: activity, goal });
    if (result.success) {
        const protein = result.data.protein || result.data.daily_protein;
        const perKg = protein / weight;
        showSuccess('protein-result', `<div class="result-container status-normal"><h5>${t('Your Protein Result')}:</h5><p class="result-value">${protein.toFixed(0)}g <small>/day</small></p><p class="result-category">${perKg.toFixed(1)}g/kg 体重</p><p class="result-interpretation">${currentLanguage === 'zh' ? `根据您的${activity === 'sedentary' ? '久坐' : activity === 'light' ? '轻度运动' : activity === 'moderate' ? '中度运动' : activity === 'intense' ? '高强度运动' : '运动员'}水平和${goal === 'maintenance' ? '维持' : goal === 'muscle_gain' ? '增肌' : '减脂'}目标计算。` : `Calculated based on your ${activity} activity level and ${goal.replace('_', ' ')} goal.`}</p></div>`);
    } else {
        showError('protein-result', `${t('API request failed')}: ${result.error}`);
    }
}

async function calculateFiber(event) {
    event.preventDefault();
    const age = parseInt(document.getElementById('fiber-age').value);
    const gender = document.getElementById('fiber-gender').value;
    if (!age || !gender) {
        showError('fiber-result', t('Please fill all required fields'));
        return;
    }
    showLoading('fiber-result');
    const result = await makeApiRequest('/calculate/fiber', { age, gender });
    if (result.success) {
        const fiber = result.data.fiber || result.data.daily_fiber;
        showSuccess('fiber-result', `<div class="result-container status-normal"><h5>${t('Your Fiber Result')}:</h5><p class="result-value">${fiber.toFixed(0)}g <small>/day</small></p><p class="result-interpretation">${currentLanguage === 'zh' ? `每日推荐膳食纤维摄入量。建议通过全谷物、蔬菜、水果等获取。` : `Recommended daily fiber intake. Obtain through whole grains, vegetables, and fruits.`}</p></div>`);
    } else {
        showError('fiber-result', `${t('API request failed')}: ${result.error}`);
    }
}

async function calculateWaterIntake(event) {
    event.preventDefault();
    const weight = parseFloat(document.getElementById('water-weight').value);
    const activity = document.getElementById('water-activity').value;
    const climate = document.getElementById('water-climate').value;
    if (!weight || !activity || !climate) {
        showError('water-result', t('Please fill all required fields'));
        return;
    }
    showLoading('water-result');
    
    // Calculate water intake based on weight and factors
    let baseWater = weight * 35; // Base: 35ml per kg
    if (activity === 'moderate') baseWater *= 1.2;
    else if (activity === 'high') baseWater *= 1.4;
    if (climate === 'hot') baseWater *= 1.2;
    else if (climate === 'humid') baseWater *= 1.3;
    
    const waterLiters = baseWater / 1000;
    const waterCups = Math.round(waterLiters * 4); // 1 cup = 250ml
    
    showSuccess('water-result', `<div class="result-container status-normal"><h5>${t('Your Water Intake Result')}:</h5><p class="result-value">${waterLiters.toFixed(1)}L <small>/day</small></p><p class="result-category">约 ${waterCups} 杯水 (250ml/杯)</p><p class="result-interpretation">${currentLanguage === 'zh' ? `根据您的体重、活动水平和气候条件计算。建议分次少量饮用。` : `Calculated based on your weight, activity level, and climate. Recommend drinking in small amounts throughout the day.`}</p></div>`);
}

// Unit Converter Functions
function convertBloodSugar(event) {
    event.preventDefault();
    const value = parseFloat(document.getElementById('bs-value').value);
    const unit = document.getElementById('bs-unit').value;
    if (!value || !unit) {
        showError('blood-sugar-result', t('Please fill all required fields'));
        return;
    }
    
    let convertedValue, toUnit, normalRange;
    if (unit === 'mmol/L') {
        convertedValue = value * 18.016;
        toUnit = 'mg/dL';
        normalRange = currentLanguage === 'zh' ? '空腹血糖正常范围：70-99 mg/dL' : 'Normal fasting range: 70-99 mg/dL';
    } else {
        convertedValue = value / 18.016;
        toUnit = 'mmol/L';
        normalRange = currentLanguage === 'zh' ? '空腹血糖正常范围：3.9-5.5 mmol/L' : 'Normal fasting range: 3.9-5.5 mmol/L';
    }
    
    const statusClass = (unit === 'mmol/L' && value >= 3.9 && value <= 5.5) || (unit === 'mg/dL' && value >= 70 && value <= 99) ? 'status-normal' : 'status-warning';
    
    showSuccess('blood-sugar-result', `<div class="result-container ${statusClass}"><h5>血糖换算结果:</h5><p class="result-value">${convertedValue.toFixed(1)} ${toUnit}</p><p class="result-category">原值: ${value} ${unit}</p><p class="result-interpretation">${normalRange}</p></div>`);
}

function convertCholesterol(event) {
    event.preventDefault();
    const value = parseFloat(document.getElementById('chol-value').value);
    const unit = document.getElementById('chol-unit').value;
    const type = document.getElementById('chol-type').value;
    if (!value || !unit || !type) {
        showError('cholesterol-result', t('Please fill all required fields'));
        return;
    }
    
    let convertedValue, toUnit, normalRange;
    const factor = 38.67; // Conversion factor for cholesterol
    
    if (unit === 'mmol/L') {
        convertedValue = value * factor;
        toUnit = 'mg/dL';
    } else {
        convertedValue = value / factor;
        toUnit = 'mmol/L';
    }
    
    // Normal ranges based on type
    if (type === 'total') {
        normalRange = currentLanguage === 'zh' ? '理想范围: <200 mg/dL (<5.2 mmol/L)' : 'Ideal range: <200 mg/dL (<5.2 mmol/L)';
    } else if (type === 'hdl') {
        normalRange = currentLanguage === 'zh' ? '理想范围: >40 mg/dL (>1.0 mmol/L) 男性, >50 mg/dL (>1.3 mmol/L) 女性' : 'Ideal range: >40 mg/dL (>1.0 mmol/L) men, >50 mg/dL (>1.3 mmol/L) women';
    } else {
        normalRange = currentLanguage === 'zh' ? '理想范围: <100 mg/dL (<2.6 mmol/L)' : 'Ideal range: <100 mg/dL (<2.6 mmol/L)';
    }
    
    showSuccess('cholesterol-result', `<div class="result-container status-normal"><h5>胆固醇换算结果:</h5><p class="result-value">${convertedValue.toFixed(1)} ${toUnit}</p><p class="result-category">原值: ${value} ${unit}</p><p class="result-interpretation">${normalRange}</p></div>`);
}

function calculateHeartRateZones(event) {
    event.preventDefault();
    const age = parseInt(document.getElementById('hr-age').value);
    const restingHR = parseInt(document.getElementById('hr-resting').value) || 60;
    if (!age) {
        showError('hr-zone-result', t('Please fill all required fields'));
        return;
    }
    
    const maxHR = 220 - age;
    const hrReserve = maxHR - restingHR;
    
    const zones = {
        zone1: { min: Math.round(restingHR + hrReserve * 0.5), max: Math.round(restingHR + hrReserve * 0.6), name: currentLanguage === 'zh' ? '有氧基础区' : 'Active Recovery' },
        zone2: { min: Math.round(restingHR + hrReserve * 0.6), max: Math.round(restingHR + hrReserve * 0.7), name: currentLanguage === 'zh' ? '有氧耐力区' : 'Aerobic Base' },
        zone3: { min: Math.round(restingHR + hrReserve * 0.7), max: Math.round(restingHR + hrReserve * 0.8), name: currentLanguage === 'zh' ? '有氧力量区' : 'Aerobic Power' },
        zone4: { min: Math.round(restingHR + hrReserve * 0.8), max: Math.round(restingHR + hrReserve * 0.9), name: currentLanguage === 'zh' ? '乳酸阈值区' : 'Lactate Threshold' },
        zone5: { min: Math.round(restingHR + hrReserve * 0.9), max: maxHR, name: currentLanguage === 'zh' ? '神经肌肉力量区' : 'Neuromuscular Power' }
    };
    
    const resultHtml = `
        <div class="result-container status-normal">
            <h5>心率区间结果:</h5>
            <p class="result-category">最大心率: ${maxHR} bpm</p>
            ${Object.entries(zones).map(([key, zone]) => 
                `<div class="d-flex justify-content-between align-items-center mb-2">
                    <span><strong>${zone.name}</strong></span>
                    <span class="badge bg-primary">${zone.min}-${zone.max} bpm</span>
                </div>`
            ).join('')}
        </div>
    `;
    
    showSuccess('hr-zone-result', resultHtml);
}

function handleUnitTypeChange() {
    const convType = document.getElementById('conv-type').value;
    const fromUnitSelect = document.getElementById('conv-from-unit');
    
    fromUnitSelect.innerHTML = '<option value="">Choose...</option>';
    
    if (convType === 'weight') {
        fromUnitSelect.innerHTML += '<option value="kg">Kilograms (kg)</option><option value="lb">Pounds (lb)</option><option value="stone">Stones</option>';
    } else if (convType === 'height') {
        fromUnitSelect.innerHTML += '<option value="cm">Centimeters (cm)</option><option value="ft">Feet & Inches</option><option value="in">Inches</option><option value="m">Meters (m)</option>';
    }
}

function convertUnits(event) {
    event.preventDefault();
    const convType = document.getElementById('conv-type').value;
    const value = parseFloat(document.getElementById('conv-value').value);
    const fromUnit = document.getElementById('conv-from-unit').value;
    
    if (!convType || !value || !fromUnit) {
        showError('unit-converter-result', t('Please fill all required fields'));
        return;
    }
    
    let results = [];
    
    if (convType === 'weight') {
        if (fromUnit === 'kg') {
            results.push({ unit: 'lb', value: value * 2.20462, label: 'Pounds' });
            results.push({ unit: 'stone', value: value * 0.157473, label: 'Stones' });
        } else if (fromUnit === 'lb') {
            results.push({ unit: 'kg', value: value * 0.453592, label: 'Kilograms' });
            results.push({ unit: 'stone', value: value * 0.0714286, label: 'Stones' });
        } else if (fromUnit === 'stone') {
            results.push({ unit: 'kg', value: value * 6.35029, label: 'Kilograms' });
            results.push({ unit: 'lb', value: value * 14, label: 'Pounds' });
        }
    } else if (convType === 'height') {
        if (fromUnit === 'cm') {
            const feet = Math.floor(value / 30.48);
            const inches = Math.round((value / 30.48 - feet) * 12);
            results.push({ unit: 'ft', value: `${feet}'${inches}"`, label: 'Feet & Inches' });
            results.push({ unit: 'in', value: value / 2.54, label: 'Inches' });
            results.push({ unit: 'm', value: value / 100, label: 'Meters' });
        } else if (fromUnit === 'ft') {
            const totalInches = value * 12;
            results.push({ unit: 'cm', value: totalInches * 2.54, label: 'Centimeters' });
            results.push({ unit: 'in', value: totalInches, label: 'Inches' });
            results.push({ unit: 'm', value: (totalInches * 2.54) / 100, label: 'Meters' });
        } else if (fromUnit === 'in') {
            results.push({ unit: 'cm', value: value * 2.54, label: 'Centimeters' });
            results.push({ unit: 'm', value: (value * 2.54) / 100, label: 'Meters' });
            const feet = Math.floor(value / 12);
            const inches = Math.round(value % 12);
            results.push({ unit: 'ft', value: `${feet}'${inches}"`, label: 'Feet & Inches' });
        } else if (fromUnit === 'm') {
            results.push({ unit: 'cm', value: value * 100, label: 'Centimeters' });
            results.push({ unit: 'in', value: value * 39.3701, label: 'Inches' });
            const totalInches = value * 39.3701;
            const feet = Math.floor(totalInches / 12);
            const inches = Math.round(totalInches % 12);
            results.push({ unit: 'ft', value: `${feet}'${inches}"`, label: 'Feet & Inches' });
        }
    }
    
    const resultHtml = `
        <div class="result-container status-normal">
            <h5>单位换算结果:</h5>
            <p class="result-category">原值: ${value} ${fromUnit}</p>
            ${results.map(result => 
                `<div class="d-flex justify-content-between align-items-center mb-2">
                    <span><strong>${result.label}</strong></span>
                    <span class="badge bg-success">${typeof result.value === 'number' ? result.value.toFixed(2) : result.value} ${result.unit}</span>
                </div>`
            ).join('')}
        </div>
    `;
    
    showSuccess('unit-converter-result', resultHtml);
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    document.getElementById('langText').textContent = LANGUAGES[currentLanguage === 'en' ? 'zh' : 'en'];
    const elements = document.querySelectorAll('[data-en][data-zh]');
    elements.forEach(element => {
        const text = currentLanguage === 'en' ? element.getAttribute('data-en') : element.getAttribute('data-zh');
        element.textContent = text;
    });
    const selectOptions = document.querySelectorAll('option[data-en][data-zh]');
    selectOptions.forEach(option => {
        const text = currentLanguage === 'en' ? option.getAttribute('data-en') : option.getAttribute('data-zh');
        option.textContent = text;
    });
}

function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });
}

function initEventListeners() {
    document.getElementById('bmi-form').addEventListener('submit', calculateBMI);
    document.getElementById('bodyfat-form').addEventListener('submit', calculateBodyFat);
    document.getElementById('bmr-form').addEventListener('submit', calculateBMR);
    document.getElementById('ideal-weight-form').addEventListener('submit', calculateIdealWeight);
    if (document.getElementById('qtc-form')) document.getElementById('qtc-form').addEventListener('submit', calculateQTc);
    if (document.getElementById('abi-form')) document.getElementById('abi-form').addEventListener('submit', calculateABI);
    if (document.getElementById('6mwt-form')) document.getElementById('6mwt-form').addEventListener('submit', calculate6MWT);
    if (document.getElementById('diabetes-form')) document.getElementById('diabetes-form').addEventListener('submit', calculateDiabetesRisk);
    if (document.getElementById('tdee-form')) document.getElementById('tdee-form').addEventListener('submit', calculateTDEE);
    if (document.getElementById('maintenance-form')) document.getElementById('maintenance-form').addEventListener('submit', calculateMaintenanceCalories);
    if (document.getElementById('lbm-form')) document.getElementById('lbm-form').addEventListener('submit', calculateLBM);
    if (document.getElementById('bsa-form')) document.getElementById('bsa-form').addEventListener('submit', calculateBSA);
    if (document.getElementById('macro-form')) document.getElementById('macro-form').addEventListener('submit', calculateMacronutrients);
    if (document.getElementById('protein-form')) document.getElementById('protein-form').addEventListener('submit', calculateProtein);
    if (document.getElementById('fiber-form')) document.getElementById('fiber-form').addEventListener('submit', calculateFiber);
    if (document.getElementById('water-form')) document.getElementById('water-form').addEventListener('submit', calculateWaterIntake);
    if (document.getElementById('blood-sugar-form')) document.getElementById('blood-sugar-form').addEventListener('submit', convertBloodSugar);
    if (document.getElementById('cholesterol-form')) document.getElementById('cholesterol-form').addEventListener('submit', convertCholesterol);
    if (document.getElementById('hr-zone-form')) document.getElementById('hr-zone-form').addEventListener('submit', calculateHeartRateZones);
    if (document.getElementById('unit-converter-form')) document.getElementById('unit-converter-form').addEventListener('submit', convertUnits);
    if (document.getElementById('conv-type')) document.getElementById('conv-type').addEventListener('change', handleUnitTypeChange);
    document.getElementById('langToggle').addEventListener('click', toggleLanguage);
    initSmoothScrolling();
}

document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => { card.classList.add('fade-in'); }, index * 100);
    });
});

window.HealthCalcHub = {
    calculateBMI, calculateBodyFat, calculateBMR, calculateIdealWeight, calculateQTc, calculateABI, calculate6MWT, calculateDiabetesRisk, calculateTDEE, calculateMaintenanceCalories, calculateLBM, calculateBSA, calculateMacronutrients, calculateProtein, calculateFiber, calculateWaterIntake, convertBloodSugar, convertCholesterol, calculateHeartRateZones, convertUnits, handleUnitTypeChange, toggleLanguage, makeApiRequest, t
};
