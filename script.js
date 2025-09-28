// 本地计算函数集合
const HealthCalculator = {
    // BMI计算
    calculateBMI: (weight, height) => {
        const heightInMeters = height / 100;
        return weight / (heightInMeters * heightInMeters);
    },

    // 体脂率计算 (Deurenberg公式)
    calculateBodyFat: (bmi, age, gender) => {
        const genderFactor = gender === 'male' ? 1 : 0;
        return (1.20 * bmi) + (0.23 * age) - (10.8 * genderFactor) - 5.4;
    },

    // BMR计算 (Harris-Benedict修正公式)
    calculateBMR: (weight, height, age, gender) => {
        if (gender === 'male') {
            return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }
    },

    // 理想体重计算 (Robinson公式)
    calculateIdealWeight: (height, gender) => {
        const heightInInches = height / 2.54;
        if (gender === 'male') {
            return heightInInches <= 60 ? 52 : 52 + 1.9 * (heightInInches - 60);
        } else {
            return heightInInches <= 60 ? 49 : 49 + 1.7 * (heightInInches - 60);
        }
    },

    // QTc计算 (Bazett公式)
    calculateQTc: (qt, rr) => {
        return qt / Math.sqrt(rr / 1000);
    },

    // ABI计算
    calculateABI: (anklePressuere, brachialPressure) => {
        return anklePressuere / brachialPressure;
    },

    // 6分钟步行试验预测值
    calculate6MWT: (age, height, weight, gender) => {
        if (gender === 'male') {
            return 7.57 * height - 5.02 * age - 1.76 * weight - 309;
        } else {
            return 2.11 * height - 2.29 * weight - 5.78 * age + 667;
        }
    },

    // 糖尿病风险评估
    calculateDiabetesRisk: (age, bmi, familyHistory, hypertension, physicalActivity) => {
        let score = 0;
        
        // 年龄评分
        if (age >= 45 && age < 55) score += 2;
        else if (age >= 55 && age < 65) score += 3;
        else if (age >= 65) score += 4;
        
        // BMI评分
        if (bmi >= 25 && bmi < 30) score += 1;
        else if (bmi >= 30) score += 3;
        
        // 家族史
        if (familyHistory === 'yes') score += 3;
        
        // 高血压
        if (hypertension === 'yes') score += 2;
        
        // 缺乏运动
        if (physicalActivity === 'low') score += 2;
        
        // 转换为百分比风险
        const riskMapping = {
            0: 1, 1: 2, 2: 4, 3: 8, 4: 13, 5: 21, 6: 33, 7: 50, 8: 67, 9: 80
        };
        
        return riskMapping[Math.min(score, 9)] || 85;
    },

    // TDEE计算
    calculateTDEE: (bmr, activityLevel) => {
        const activityMultipliers = {
            'sedentary': 1.2,
            'lightly_active': 1.375,
            'moderately_active': 1.55,
            'very_active': 1.725,
            'extremely_active': 1.9
        };
        return bmr * (activityMultipliers[activityLevel] || 1.2);
    },

    // 维持热量计算
    calculateMaintenanceCalories: (bmr, activityLevel) => {
        return HealthCalculator.calculateTDEE(bmr, activityLevel);
    },

    // 瘦体重计算 (Boer公式)
    calculateLBM: (weight, height, gender) => {
        if (gender === 'male') {
            return (0.407 * weight) + (0.267 * height) - 19.2;
        } else {
            return (0.252 * weight) + (0.473 * height) - 48.3;
        }
    },

    // 体表面积计算 (Du Bois公式)
    calculateBSA: (weight, height) => {
        return 0.007184 * Math.pow(weight, 0.425) * Math.pow(height, 0.725);
    },

    // 宏量营养素计算
    calculateMacronutrients: (calories, goal) => {
        let proteinPercent, carbPercent, fatPercent;
        
        switch (goal) {
            case 'weight_loss':
                proteinPercent = 0.35;
                carbPercent = 0.25;
                fatPercent = 0.40;
                break;
            case 'weight_gain':
                proteinPercent = 0.25;
                carbPercent = 0.45;
                fatPercent = 0.30;
                break;
            case 'maintenance':
            default:
                proteinPercent = 0.30;
                carbPercent = 0.40;
                fatPercent = 0.30;
                break;
        }
        
        return {
            protein: Math.round((calories * proteinPercent) / 4), // 4卡路里/克
            carbs: Math.round((calories * carbPercent) / 4),
            fat: Math.round((calories * fatPercent) / 9) // 9卡路里/克
        };
    },

    // 蛋白质需求计算
    calculateProteinNeeds: (weight, activityLevel, goal) => {
        let multiplier;
        
        switch (activityLevel) {
            case 'sedentary':
                multiplier = goal === 'weight_loss' ? 1.2 : 0.8;
                break;
            case 'lightly_active':
                multiplier = goal === 'weight_loss' ? 1.4 : 1.0;
                break;
            case 'moderately_active':
                multiplier = goal === 'weight_loss' ? 1.6 : 1.2;
                break;
            case 'very_active':
            case 'extremely_active':
                multiplier = goal === 'weight_loss' ? 2.0 : 1.6;
                break;
            default:
                multiplier = 1.0;
        }
        
        if (goal === 'weight_gain') multiplier += 0.2;
        
        return weight * multiplier;
    },

    // 膳食纤维需求计算
    calculateFiberNeeds: (calories) => {
        return calories / 1000 * 14; // 每1000卡路里14克纤维
    },

    // 水分摄入量计算
    calculateWaterIntake: (weight, activityLevel, climate) => {
        let baseWater = weight * 35; // 基础35ml/kg
        
        // 活动水平调整
        const activityAdjustment = {
            'sedentary': 0,
            'lightly_active': 300,
            'moderately_active': 500,
            'very_active': 700,
            'extremely_active': 1000
        };
        
        baseWater += activityAdjustment[activityLevel] || 0;
        
        // 气候调整
        if (climate === 'hot') baseWater += 500;
        else if (climate === 'cold') baseWater -= 200;
        
        return Math.max(1500, baseWater); // 最少1500ml
    },

    // 血糖转换
    convertBloodSugar: (value, fromUnit) => {
        if (fromUnit === 'mg/dl') {
            return value / 18.018; // 转换为mmol/L
        } else {
            return value * 18.018; // 转换为mg/dL
        }
    },

    // 胆固醇转换
    convertCholesterol: (value, fromUnit) => {
        if (fromUnit === 'mg/dl') {
            return value / 38.67; // 转换为mmol/L
        } else {
            return value * 38.67; // 转换为mg/dL
        }
    },

    // 心率区间计算
    calculateHeartRateZones: (age, restingHR) => {
        const maxHR = 220 - age;
        const hrReserve = maxHR - restingHR;
        
        return {
            zone1: {
                name: '恢复区',
                min: Math.round(restingHR + hrReserve * 0.6),
                max: Math.round(restingHR + hrReserve * 0.7)
            },
            zone2: {
                name: '有氧基础区',
                min: Math.round(restingHR + hrReserve * 0.7),
                max: Math.round(restingHR + hrReserve * 0.8)
            },
            zone3: {
                name: '有氧强化区',
                min: Math.round(restingHR + hrReserve * 0.8),
                max: Math.round(restingHR + hrReserve * 0.9)
            },
            zone4: {
                name: '乳酸阈值区',
                min: Math.round(restingHR + hrReserve * 0.9),
                max: Math.round(maxHR)
            }
        };
    }
};
        
// 全局用户档案管理
const UserProfile = {
    // 获取用户档案
    get: function() {
        const saved = localStorage.getItem('healthcalc_profile');
        return saved ? JSON.parse(saved) : {};
    },

    // 保存用户档案
    save: function(data) {
        const profile = { ...this.get(), ...data };
        localStorage.setItem('healthcalc_profile', JSON.stringify(profile));
        this.updateStatus();
        return profile;
    },

    // 清除用户档案
    clear: function() {
        localStorage.removeItem('healthcalc_profile');
        this.updateStatus();
    },

    // 更新档案状态显示
    updateStatus: function() {
        const profile = this.get();
        const statusDiv = document.getElementById('profile-status');
        if (!statusDiv) return;

        const hasData = profile.age && profile.gender && profile.height && profile.weight;
        
        if (hasData) {
            const bmi = HealthCalculator.calculateBMI(profile.weight, profile.height);
            statusDiv.innerHTML = `
                <div class="alert alert-success">
                    <h6><i class="fas fa-check-circle me-2"></i>档案已保存</h6>
                    <div class="row text-center">
                        <div class="col-3"><small>年龄</small><div class="fw-bold">${profile.age}</div></div>
                        <div class="col-3"><small>性别</small><div class="fw-bold">${profile.gender === 'male' ? '男性' : '女性'}</div></div>
                        <div class="col-3"><small>BMI</small><div class="fw-bold text-primary">${bmi.toFixed(1)}</div></div>
                        <div class="col-3"><small>状态</small><div class="fw-bold text-success">自动填充已启用</div></div>
                    </div>
                </div>
            `;
        } else {
            statusDiv.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    After filling in your profile information, all calculators will automatically fill in your data to improve your efficiency.
                </div>
            `;
        }
    },

    // 加载演示数据
    loadDemo: function() {
        const demoData = {
            age: 28, gender: 'male', height: 175, weight: 70, waist: 80, activity: 'moderately_active'
        };
        
        Object.keys(demoData).forEach(key => {
            const element = document.getElementById(`profile-${key}`);
            if (element) element.value = demoData[key];
        });
        
        this.save(demoData);
        showNotification('演示数据已加载', 'success');
    }
};

// 自动填充表单函数
function autoFillForm(formType) {
    const profile = UserProfile.get();
    
    if (!profile.age || !profile.gender || !profile.height || !profile.weight) {
        showNotification('请先在"个人健康档案"中填写基础信息', 'warning');
        document.getElementById('profile-setup').scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    const fillMappings = {
        bmi: { 'bmi-height': profile.height, 'bmi-weight': profile.weight },
        bodyfat: { 'bf-age': profile.age, 'bf-gender': profile.gender, 'bf-height': profile.height, 'bf-weight': profile.weight, 'bf-waist': profile.waist },
        bmr: { 'bmr-age': profile.age, 'bmr-gender': profile.gender, 'bmr-height': profile.height, 'bmr-weight': profile.weight },
        idealweight: { 'iw-height': profile.height, 'iw-gender': profile.gender, 'iw-current-weight': profile.weight },
        qtc: { 'qtc-hr': 72 }, // 默认心率
        abi: {}, // ABI需要具体的血压数据，暂无自动填充
        sixmwt: { 'mwt-age': profile.age, 'mwt-gender': profile.gender },
        diabetes: { 'diab-age': profile.age, 'diab-bmi': profile.height && profile.weight ? HealthCalculator.calculateBMI(profile.weight, profile.height).toFixed(1) : '' },
        tdee: { 'tdee-age': profile.age, 'tdee-gender': profile.gender, 'tdee-height': profile.height, 'tdee-weight': profile.weight, 'tdee-activity': profile.activity },
        maintenance: { 'mc-age': profile.age, 'mc-gender': profile.gender, 'mc-height': profile.height, 'mc-weight': profile.weight, 'mc-activity': profile.activity },
        lbm: { 'lbm-gender': profile.gender, 'lbm-height': profile.height, 'lbm-weight': profile.weight },
        bsa: { 'bsa-height': profile.height, 'bsa-weight': profile.weight },
        macro: { 'macro-age': profile.age, 'macro-gender': profile.gender, 'macro-weight': profile.weight, 'macro-activity': profile.activity },
        protein: { 'protein-weight': profile.weight, 'protein-activity': profile.activity },
        fiber: { 'fiber-age': profile.age, 'fiber-gender': profile.gender },
        water: { 'water-weight': profile.weight, 'water-activity': profile.activity },
        bloodsugar: {}, // 血糖转换不需要个人数据
        cholesterol: {}, // 胆固醇转换不需要个人数据
        heartrate: { 'hr-age': profile.age, 'hr-resting': 60 }, // 默认静息心率60
        convert: {} // 单位转换不需要个人数据
    };
    
    const mapping = fillMappings[formType];
    if (!mapping) return;
    
    let filledCount = 0;
    Object.entries(mapping).forEach(([fieldId, value]) => {
        const element = document.getElementById(fieldId);
        if (element && value !== null && value !== '') {
            element.value = value;
            filledCount++;
            element.style.backgroundColor = '#e3f2fd';
            setTimeout(() => element.style.backgroundColor = '', 1000);
        }
    });
    
    if (filledCount > 0) {
        showNotification(`已自动填充 ${filledCount} 个字段`, 'success');
    }
}

const LANGUAGES = { en: 'English', zh: '中文' };
let currentLanguage = 'en';

const translations = {
    en: {
        'Please fill all required fields': 'Please fill all required fields',
        'Your BMI Result': 'Your BMI Result',
        'Your Body Fat Result': 'Your Body Fat Result',
        'Your BMR Result': 'Your BMR Result',
        'Your Ideal Weight Result': 'Your Ideal Weight Result',
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
        'Your BMI Result': '您的BMI结果',
        'Your Body Fat Result': '您的体脂率结果',
        'Your BMR Result': '您的BMR结果',
        'Your Ideal Weight Result': '您的理想体重结果',
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

// 计算函数
async function calculateBMI(event) {
    event.preventDefault();
    const height = parseFloat(document.getElementById('bmi-height').value);
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    
    if (!height || !weight) {
        showError('bmi-result', t('Please fill all required fields'));
        return;
    }
    
    showLoading('bmi-result');
    
    setTimeout(() => {
        const bmi = HealthCalculator.calculateBMI(weight, height);
        
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
    }, 300);
}

async function calculateBodyFat(event) {
    event.preventDefault();
    const age = parseInt(document.getElementById('bf-age').value);
    const gender = document.getElementById('bf-gender').value;
    const height = parseFloat(document.getElementById('bf-height').value);
    const weight = parseFloat(document.getElementById('bf-weight').value);
    
    if (!age || !gender || !height || !weight) {
        showError('bodyfat-result', t('Please fill all required fields'));
        return;
    }
    
    showLoading('bodyfat-result');
    
    setTimeout(() => {
        const bmi = HealthCalculator.calculateBMI(weight, height);
        const bodyFat = HealthCalculator.calculateBodyFat(bmi, age, gender);
        
        const interpretation = currentLanguage === 'zh' ? 
            '体脂率已计算完成，请参考健康标准进行调整。' : 
            'Body fat percentage calculated. Please refer to health standards for adjustments.';
        
        showSuccess('bodyfat-result', `<div class="result-container status-normal"><h5>${t('Your Body Fat Result')}:</h5><p class="result-value">${Math.max(5, bodyFat).toFixed(1)}%</p><p class="result-interpretation">${interpretation}</p></div>`);
    }, 300);
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
    
    setTimeout(() => {
        const bmr = HealthCalculator.calculateBMR(weight, height, age, gender);
        
        showSuccess('bmr-result', `<div class="result-container status-normal"><h5>${t('Your BMR Result')}:</h5><p class="result-value">${bmr.toFixed(0)} <small>cal/day</small></p><p class="result-interpretation">${currentLanguage === 'zh' ? `您的基础代谢率为 ${bmr.toFixed(0)} 千卡/天。这是您身体在完全静息状态下维持基本生理功能所需的能量。` : `Your Basal Metabolic Rate is ${bmr.toFixed(0)} calories per day. This is the energy your body needs to maintain basic physiological functions at complete rest.`}</p></div>`);
    }, 300);
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
    
    setTimeout(() => {
        const idealWeight = HealthCalculator.calculateIdealWeight(height, gender);
        
        showSuccess('ideal-weight-result', `<div class="result-container status-normal"><h5>${t('Your Ideal Weight Result')}:</h5><p class="result-value">${idealWeight.toFixed(1)} <small>kg</small></p>${currentWeight ? `<p class="result-category">${currentLanguage === 'zh' ? '当前体重' : 'Current Weight'}: ${currentWeight.toFixed(1)} kg</p>` : ''}<p class="result-interpretation">${currentLanguage === 'zh' ? `您的理想体重约为 ${idealWeight.toFixed(1)} kg。` : `Your ideal weight is approximately ${idealWeight.toFixed(1)} kg.`}</p></div>`);
    }, 300);
}

// 继续实现其他计算函数...

async function calculateQTc(event) {
    event.preventDefault();
    const qt = parseFloat(document.getElementById('qtc-qt').value);
    const hr = parseFloat(document.getElementById('qtc-hr').value);
    
    if (!qt || !hr) {
        showError('qtc-result', t('Please fill all required fields'));
        return;
    }
    
    showLoading('qtc-result');
    
    setTimeout(() => {
        const rr = 60000 / hr; // 转换为毫秒
        const qtc = HealthCalculator.calculateQTc(qt, rr);
        
        let category, statusClass;
        if (qtc > 450) { category = '延长'; statusClass = 'status-warning'; }
        else if (qtc < 350) { category = '缩短'; statusClass = 'status-warning'; }
        else { category = '正常'; statusClass = 'status-normal'; }
        
        const interpretation = currentLanguage === 'zh' ? 
            (qtc < 450 ? 'QTc间期正常，无心律失常风险。' : 
             qtc < 500 ? 'QTc间期轻度延长，建议监测心电图变化。' : 
             'QTc间期明显延长，存在心律失常风险，建议就医。') :
            (qtc < 450 ? 'QTc interval is normal. No arrhythmia risk detected.' : 
             qtc < 500 ? 'QTc interval is mildly prolonged. Monitor ECG changes.' : 
             'QTc interval is significantly prolonged. High risk of arrhythmia, consult physician.');
        
        showSuccess('qtc-result', `<div class="result-container ${statusClass}"><h5>${t('Your QTc Result')}:</h5><p class="result-value">${qtc.toFixed(1)} <small>ms</small></p><p class="result-category">${currentLanguage === 'zh' ? '类别' : 'Category'}: ${category}</p><p class="result-interpretation">${interpretation}</p></div>`);
    }, 300);
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
    
    setTimeout(() => {
        const abi = HealthCalculator.calculateABI(ankle, brachial);
        
        const statusClass = (abi >= 1.0 && abi <= 1.4) ? 'status-normal' : abi >= 0.7 ? 'status-warning' : 'status-danger';
        const interpretation = currentLanguage === 'zh' ? 
            (abi >= 1.0 && abi <= 1.4 ? '踝肱指数正常，未发现外周血管疾病征象。' : 
             abi >= 0.7 ? '踝肱指数显示轻度至中度外周动脉疾病。' : 
             '踝肱指数显示严重外周动脉疾病，建议立即就医。') :
            (abi >= 1.0 && abi <= 1.4 ? 'ABI is normal, no peripheral vascular disease detected.' : 
             abi >= 0.7 ? 'ABI indicates mild to moderate peripheral artery disease.' : 
             'ABI indicates severe peripheral artery disease, seek immediate medical attention.');
        
        showSuccess('abi-result', `<div class="result-container ${statusClass}"><h5>${t('Your ABI Result')}:</h5><p class="result-value">${abi.toFixed(2)}</p><p class="result-interpretation">${interpretation}</p></div>`);
    }, 300);
}

async function calculate6MWT(event) {
    event.preventDefault();
    const age = parseInt(document.getElementById('mwt-age').value);
    const gender = document.getElementById('mwt-gender').value;
    const distance = parseFloat(document.getElementById('mwt-distance').value);
    const height = 170; // 默认身高，可以从其他地方获取
    const weight = 70;  // 默认体重，可以从其他地方获取
    
    if (!age || !gender || !distance) {
        showError('6mwt-result', t('Please fill all required fields'));
        return;
    }
    
    showLoading('6mwt-result');
    
    setTimeout(() => {
        const predicted = HealthCalculator.calculate6MWT(age, height, weight, gender);
        const percent = (distance / predicted) * 100;
        const statusClass = percent >= 80 ? 'status-normal' : percent >= 60 ? 'status-warning' : 'status-danger';
        
        showSuccess('6mwt-result', `<div class="result-container ${statusClass}"><h5>${t('Your 6MWT Result')}:</h5><p class="result-value">${distance} <small>m</small></p><p class="result-category">${currentLanguage === 'zh' ? '预期距离' : 'Predicted Distance'}: ${Math.max(200, predicted).toFixed(0)}m (${percent.toFixed(0)}%)</p><p class="result-interpretation">${currentLanguage === 'zh' ? `您的6分钟步行距离为 ${distance}m，达到预期值的${percent.toFixed(0)}%。` : `Your 6-minute walk distance is ${distance}m, achieving ${percent.toFixed(0)}% of predicted value.`}</p></div>`);
    }, 300);
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
    
    setTimeout(() => {
        const hypertension = sbp >= 140 ? 'yes' : 'no';
        const risk = HealthCalculator.calculateDiabetesRisk(age, bmi, family ? 'yes' : 'no', hypertension, 'normal');
        
        const statusClass = risk < 5 ? 'status-normal' : risk < 15 ? 'status-warning' : 'status-danger';
        
        showSuccess('diabetes-result', `<div class="result-container ${statusClass}"><h5>${t('Your Diabetes Risk Result')}:</h5><p class="result-value">${risk.toFixed(1)}%</p><p class="result-interpretation">${currentLanguage === 'zh' ? `您未来7.5年内患糖尿病的风险为${risk.toFixed(1)}%。` : `Your 7.5-year diabetes risk is ${risk.toFixed(1)}%.`}</p></div>`);
    }, 300);
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
    
    setTimeout(() => {
        const bmr = HealthCalculator.calculateBMR(weight, height, age, gender);
        const tdee = HealthCalculator.calculateTDEE(bmr, activity);
        
        const activityDescriptions = {
            'sedentary': currentLanguage === 'zh' ? '久坐型生活方式' : 'Sedentary lifestyle',
            'lightly_active': currentLanguage === 'zh' ? '轻度活跃' : 'Lightly active',
            'moderately_active': currentLanguage === 'zh' ? '中度活跃' : 'Moderately active',
            'very_active': currentLanguage === 'zh' ? '高度活跃' : 'Very active',
            'extremely_active': currentLanguage === 'zh' ? '极度活跃' : 'Extremely active'
        };
        
        showSuccess('tdee-result', `<div class="result-container status-normal"><h5>${t('Your TDEE Result')}:</h5><p class="result-value">${tdee.toFixed(0)} <small>cal/day</small></p><p class="result-interpretation">${currentLanguage === 'zh' ? `您的每日总能量消耗为 ${tdee.toFixed(0)} 千卡。这包括了基础代谢和活动消耗。基于您的${activityDescriptions[activity]}水平计算。` : `Your Total Daily Energy Expenditure is ${tdee.toFixed(0)} calories. This includes basal metabolism and activity expenditure based on your ${activityDescriptions[activity]} level.`}</p></div>`);
    }, 300);
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
    
    setTimeout(() => {
        const bmr = HealthCalculator.calculateBMR(weight, height, age, gender);
        const maintenance = HealthCalculator.calculateMaintenanceCalories(bmr, activity);
        
        showSuccess('maintenance-result', `<div class="result-container status-normal"><h5>${t('Your Maintenance Calories Result')}:</h5><p class="result-value">${maintenance.toFixed(0)} <small>cal/day</small></p><p class="result-interpretation">${currentLanguage === 'zh' ? `您的维持体重所需的每日热量为 ${maintenance.toFixed(0)} 千卡。若想减重，可在此基础上每日减少300-500千卡。若想增重，可每日增加300-500千卡。` : `Your maintenance calories are ${maintenance.toFixed(0)} calories per day. For weight loss, reduce by 300-500 calories daily. For weight gain, add 300-500 calories daily.`}</p><div class="mt-3"><div class="row text-center"><div class="col-4"><small class="text-success"><strong>${currentLanguage === 'zh' ? '减重' : 'Weight Loss'}</strong><br>${(maintenance - 400).toFixed(0)} cal</small></div><div class="col-4"><small class="text-primary"><strong>${currentLanguage === 'zh' ? '维持' : 'Maintenance'}</strong><br>${maintenance.toFixed(0)} cal</small></div><div class="col-4"><small class="text-warning"><strong>${currentLanguage === 'zh' ? '增重' : 'Weight Gain'}</strong><br>${(maintenance + 400).toFixed(0)} cal</small></div></div></div>`);
    }, 300);
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
    
    setTimeout(() => {
        const lbm = HealthCalculator.calculateLBM(weight, height, gender);
        const bodyFatMass = weight - lbm;
        const bodyFatPercentage = (bodyFatMass / weight) * 100;
        
        showSuccess('lbm-result', `<div class="result-container status-normal"><h5>${t('Your LBM Result')}:</h5><p class="result-value">${Math.max(30, lbm).toFixed(1)} <small>kg</small></p><p class="result-category">${currentLanguage === 'zh' ? '肌肉含量比例' : 'Muscle Mass Ratio'}: ${((Math.max(30, lbm)/weight)*100).toFixed(1)}%</p><p class="result-interpretation">${currentLanguage === 'zh' ? `您的瘦体重为 ${Math.max(30, lbm).toFixed(1)}kg，占总体重的${((Math.max(30, lbm)/weight)*100).toFixed(1)}%。瘦体重包括肌肉、骨骼、器官和水分，不包括脂肪。` : `Your lean body mass is ${Math.max(30, lbm).toFixed(1)}kg, representing ${((Math.max(30, lbm)/weight)*100).toFixed(1)}% of your total weight. LBM includes muscle, bone, organs, and water, excluding fat.`}</p><div class="mt-3"><small class="text-muted">${currentLanguage === 'zh' ? `估算体脂重：${Math.max(5, bodyFatMass).toFixed(1)}kg (${Math.max(5, bodyFatPercentage).toFixed(1)}%)` : `Estimated body fat: ${Math.max(5, bodyFatMass).toFixed(1)}kg (${Math.max(5, bodyFatPercentage).toFixed(1)}%)`}</small></div></div>`);
    }, 300);
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
    
    setTimeout(() => {
        const bsa = HealthCalculator.calculateBSA(weight, height);
        const statusClass = (bsa >= 1.5 && bsa <= 2.0) ? 'status-normal' : 'status-warning';
        
        showSuccess('bsa-result', `<div class="result-container ${statusClass}"><h5>${t('Your BSA Result')}:</h5><p class="result-value">${bsa.toFixed(2)} <small>m²</small></p><p class="result-interpretation">${currentLanguage === 'zh' ? `您的体表面积为 ${bsa.toFixed(2)} 平方米。BSA常用于医疗领域，如药物剂量计算、化疗方案制定等。成人正常BSA范围为1.5-2.0㎡。` : `Your Body Surface Area is ${bsa.toFixed(2)} square meters. BSA is commonly used in medical settings for drug dosage calculations and chemotherapy protocols. Normal adult BSA ranges from 1.5-2.0 m².`}</p><div class="mt-3"><small class="text-muted">${currentLanguage === 'zh' ? '基于 Du Bois 公式计算' : 'Calculated using Du Bois formula'}</small></div></div>`);
    }, 300);
}

// 营养计算器函数
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
    
    setTimeout(() => {
        const bmr = HealthCalculator.calculateBMR(weight, 170, age, gender);
        const tdee = HealthCalculator.calculateTDEE(bmr, activity);
        const macros = HealthCalculator.calculateMacronutrients(tdee, goal);
        
        showSuccess('macro-result', `<div class="result-container status-normal"><h5>${t('Your Macronutrients Result')}:</h5><div class="row text-center mb-3"><div class="col-4"><h6>蛋白质/Protein</h6><p class="result-value">${macros.protein}g</p></div><div class="col-4"><h6>碳水/Carbs</h6><p class="result-value">${macros.carbs}g</p></div><div class="col-4"><h6>脂肪/Fat</h6><p class="result-value">${macros.fat}g</p></div></div><p class="result-interpretation">${currentLanguage === 'zh' ? `每日总热量：${tdee.toFixed(0)}千卡。根据您的${goal === 'weight_loss' ? '减重' : goal === 'weight_gain' ? '增重' : goal === 'muscle_gain' ? '增肌' : '维持'}目标设计。` : `Daily total calories: ${tdee.toFixed(0)} kcal. Designed for your ${goal.replace('_', ' ')} goal.`}</p></div>`);
    }, 300);
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
    
    setTimeout(() => {
        const protein = HealthCalculator.calculateProteinNeeds(weight, activity, goal);
        
        showSuccess('protein-result', `<div class="result-container status-normal"><h5>${t('Your Protein Result')}:</h5><p class="result-value">${protein.toFixed(1)} <small>g/day</small></p><p class="result-interpretation">${currentLanguage === 'zh' ? `您每日需要摄入 ${protein.toFixed(1)} 克蛋白质。建议分次摄入，每餐约20-30克。` : `You need ${protein.toFixed(1)}g of protein daily. It's recommended to distribute this across meals, about 20-30g per meal.`}</p><div class="mt-3"><small class="text-muted">${currentLanguage === 'zh' ? '基于体重、活动水平和目标计算' : 'Based on weight, activity level and goals'}</small></div></div>`);
    }, 300);
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
    
    setTimeout(() => {
        const estimatedCalories = gender === 'male' ? 2500 : 2000;
        const fiber = HealthCalculator.calculateFiberNeeds(estimatedCalories);
        
        showSuccess('fiber-result', `<div class="result-container status-normal"><h5>${t('Your Fiber Result')}:</h5><p class="result-value">${fiber.toFixed(0)} <small>g/day</small></p><p class="result-interpretation">${currentLanguage === 'zh' ? `您每日应摄入 ${fiber.toFixed(0)} 克膳食纤维。多吃全谷物、豆类、蔬菜和水果。` : `You should consume ${fiber.toFixed(0)}g of dietary fiber daily. Include whole grains, legumes, vegetables, and fruits in your diet.`}</p><div class="mt-3"><small class="text-muted">${currentLanguage === 'zh' ? '每1000卡路里14克纤维标准' : 'Based on 14g fiber per 1000 calories standard'}</small></div></div>`);
    }, 300);
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
    
    setTimeout(() => {
        const water = HealthCalculator.calculateWaterIntake(weight, activity, climate);
        const cups = Math.round(water / 250);
        
        showSuccess('water-result', `<div class="result-container status-normal"><h5>${t('Your Water Intake Result')}:</h5><p class="result-value">${water.toFixed(0)} <small>ml/day</small></p><p class="result-category">${currentLanguage === 'zh' ? '约' : 'About'} ${cups} ${currentLanguage === 'zh' ? '杯水' : 'cups'}</p><p class="result-interpretation">${currentLanguage === 'zh' ? `您每日应摄入 ${water.toFixed(0)} 毫升水分，约等于 ${cups} 杯水。建议分次饮用，避免一次性大量饮水。` : `You should consume ${water.toFixed(0)}ml of water daily, about ${cups} cups. Drink gradually throughout the day, avoid consuming large amounts at once.`}</p></div>`);
    }, 300);
}

// 单位转换函数
function convertBloodSugar(event) {
    event.preventDefault();
    const value = parseFloat(document.getElementById('bs-value').value);
    const fromUnit = document.getElementById('bs-unit').value;
    
    if (!value || !fromUnit) {
        showError('blood-sugar-result', t('Please fill all required fields'));
        return;
    }
    
    const converted = HealthCalculator.convertBloodSugar(value, fromUnit);
    const toUnit = fromUnit === 'mg/dl' ? 'mmol/L' : 'mg/dL';
    
    showSuccess('blood-sugar-result', `<div class="result-container status-normal"><h5>血糖转换结果:</h5><p class="result-value">${converted.toFixed(1)} <small>${toUnit}</small></p><p class="result-interpretation">${value} ${fromUnit} = ${converted.toFixed(1)} ${toUnit}</p></div>`);
}

function convertCholesterol(event) {
    event.preventDefault();
    const value = parseFloat(document.getElementById('chol-value').value);
    const fromUnit = document.getElementById('chol-unit').value;
    
    if (!value || !fromUnit) {
        showError('cholesterol-result', t('Please fill all required fields'));
        return;
    }
    
    const converted = HealthCalculator.convertCholesterol(value, fromUnit);
    const toUnit = fromUnit === 'mg/dl' ? 'mmol/L' : 'mg/dL';
    
    showSuccess('cholesterol-result', `<div class="result-container status-normal"><h5>胆固醇转换结果:</h5><p class="result-value">${converted.toFixed(1)} <small>${toUnit}</small></p><p class="result-interpretation">${value} ${fromUnit} = ${converted.toFixed(1)} ${toUnit}</p></div>`);
}

function calculateHeartRateZones(event) {
    event.preventDefault();
    const age = parseInt(document.getElementById('hr-age').value);
    const restingHR = parseFloat(document.getElementById('hr-resting').value);
    
    if (!age || !restingHR) {
        showError('heart-rate-result', t('Please fill all required fields'));
        return;
    }
    
    const zones = HealthCalculator.calculateHeartRateZones(age, restingHR);
    
    showSuccess('heart-rate-result', `<div class="result-container status-normal"><h5>心率区间结果:</h5><div class="mt-3">${Object.values(zones).map(zone => `<div class="row mb-2"><div class="col-6"><strong>${zone.name}</strong></div><div class="col-6">${zone.min}-${zone.max} bpm</div></div>`).join('')}</div></div>`);
}

function convertUnits(event) {
    event.preventDefault();
    const value = parseFloat(document.getElementById('convert-value').value);
    const type = document.getElementById('convert-type').value;
    const fromUnit = document.getElementById('convert-from').value;
    
    if (!value || !type || !fromUnit) {
        showError('convert-result', t('Please fill all required fields'));
        return;
    }
    
    let converted, toUnit;
    
    if (type === 'weight') {
        if (fromUnit === 'kg') {
            converted = value * 2.20462;
            toUnit = 'lbs';
        } else {
            converted = value / 2.20462;
            toUnit = 'kg';
        }
    } else if (type === 'height') {
        if (fromUnit === 'cm') {
            const feet = Math.floor(value / 30.48);
            const inches = Math.round((value % 30.48) / 2.54);
            converted = `${feet}'${inches}"`;
            toUnit = 'ft/in';
        } else {
            converted = value * 30.48;
            toUnit = 'cm';
        }
    }
    
    showSuccess('convert-result', `<div class="result-container status-normal"><h5>单位转换结果:</h5><p class="result-value">${typeof converted === 'number' ? converted.toFixed(2) : converted} <small>${toUnit}</small></p><p class="result-interpretation">${value} ${fromUnit} = ${typeof converted === 'number' ? converted.toFixed(2) : converted} ${toUnit}</p></div>`);
}

function handleUnitTypeChange() {
    const type = document.getElementById('convert-type').value;
    const fromSelect = document.getElementById('convert-from');
    
    fromSelect.innerHTML = '';
    
    if (type === 'weight') {
        fromSelect.innerHTML = '<option value="kg">千克 (kg)</option><option value="lbs">磅 (lbs)</option>';
    } else if (type === 'height') {
        fromSelect.innerHTML = '<option value="cm">厘米 (cm)</option><option value="ft">英尺 (ft)</option>';
    }
}

// 语言切换函数
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    updateLanguage();
}

function updateLanguage() {
    document.querySelectorAll('[data-en][data-zh]').forEach(element => {
        element.textContent = element.getAttribute(`data-${currentLanguage}`);
    });
    
    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
        langBtn.textContent = currentLanguage === 'en' ? '中文' : 'English';
    }
}

// 通知函数
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    notification.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// 初始化函数
function init() {
    updateLanguage();
    
    // 初始化用户档案状态
    UserProfile.updateStatus();
    
    // 绑定事件监听器
    const eventBindings = [
        ['bmi-form', calculateBMI],
        ['bodyfat-form', calculateBodyFat],
        ['bmr-form', calculateBMR],
        ['ideal-weight-form', calculateIdealWeight],
        ['qtc-form', calculateQTc],
        ['abi-form', calculateABI],
        ['6mwt-form', calculate6MWT],
        ['diabetes-form', calculateDiabetesRisk],
        ['tdee-form', calculateTDEE],
        ['maintenance-form', calculateMaintenanceCalories],
        ['lbm-form', calculateLBM],
        ['bsa-form', calculateBSA],
        ['macro-form', calculateMacronutrients],
        ['protein-form', calculateProtein],
        ['fiber-form', calculateFiber],
        ['water-form', calculateWaterIntake],
        ['blood-sugar-form', convertBloodSugar],
        ['cholesterol-form', convertCholesterol],
        ['heart-rate-form', calculateHeartRateZones],
        ['convert-form', convertUnits],
        ['profile-form', saveProfile]
    ];
    
    eventBindings.forEach(([formId, handler]) => {
        const form = document.getElementById(formId);
        if (form) form.addEventListener('submit', handler);
    });
    
    // 绑定其他事件
    const langToggle = document.getElementById('langToggle');
    if (langToggle) langToggle.addEventListener('click', toggleLanguage);
    
    const convertType = document.getElementById('convert-type');
    if (convertType) convertType.addEventListener('change', handleUnitTypeChange);
    
    const clearProfile = document.getElementById('clear-profile');
    if (clearProfile) clearProfile.addEventListener('click', clearUserProfile);
    
    const autoFillDemo = document.getElementById('auto-fill-demo');
    if (autoFillDemo) autoFillDemo.addEventListener('click', () => UserProfile.loadDemo());
    
    // 初始化单位转换选项
    handleUnitTypeChange();

    // 绑定复制 USDT 地址按钮（如果存在）
    const copyUsdtBtn = document.getElementById('copy-usdt');
    if (copyUsdtBtn) {
        copyUsdtBtn.addEventListener('click', async (e) => {
            const addrEl = document.getElementById('usdt-address');
            if (!addrEl) return;
            const addr = addrEl.textContent.trim();
            try {
                await navigator.clipboard.writeText(addr);
                const old = copyUsdtBtn.textContent;
                copyUsdtBtn.textContent = '已复制';
                copyUsdtBtn.classList.remove('btn-outline-primary');
                copyUsdtBtn.classList.add('btn-success');
                setTimeout(() => {
                    copyUsdtBtn.textContent = old;
                    copyUsdtBtn.classList.remove('btn-success');
                    copyUsdtBtn.classList.add('btn-outline-primary');
                }, 1500);
            } catch (err) {
                // 兼容回退
                const ta = document.createElement('textarea');
                ta.value = addr;
                document.body.appendChild(ta);
                ta.select();
                try { document.execCommand('copy');
                    const old = copyUsdtBtn.textContent;
                    copyUsdtBtn.textContent = '已复制';
                    setTimeout(() => { copyUsdtBtn.textContent = old; }, 1500);
                } catch (e) {
                    alert('请手动复制地址: ' + addr);
                }
                document.body.removeChild(ta);
            }
        });
    }

    // 绑定 donate-trigger 按钮，使用 Bootstrap modal 显示大图
    const donateTriggers = document.querySelectorAll('.donate-trigger');
    if (donateTriggers && donateTriggers.length) {
        donateTriggers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const img = btn.getAttribute('data-img');
                const title = btn.getAttribute('data-title') || '';
                const modalEl = document.getElementById('donateImageModal');
                const modalImg = document.getElementById('donateImageModalImg');
                const modalTitle = document.getElementById('donateImageModalLabel');
                if (modalImg && modalEl) {
                    modalImg.src = img;
                    modalImg.alt = title;
                    if (modalTitle) modalTitle.textContent = title;
                    // 使用 Bootstrap 的 Modal API 打开
                    const bsModal = new bootstrap.Modal(modalEl);
                    bsModal.show();
                }
            });
        });
    }
}

// 档案管理函数
function saveProfile(event) {
    event.preventDefault();
    
    const profileData = {
        age: parseInt(document.getElementById('profile-age').value) || null,
        gender: document.getElementById('profile-gender').value || '',
        height: parseFloat(document.getElementById('profile-height').value) || null,
        weight: parseFloat(document.getElementById('profile-weight').value) || null,
        waist: parseFloat(document.getElementById('profile-waist').value) || null,
        activity: document.getElementById('profile-activity').value || ''
    };
    
    UserProfile.save(profileData);
    showNotification('个人档案已保存', 'success');
}

function clearUserProfile() {
    // 清除表单
    ['age', 'gender', 'height', 'weight', 'waist', 'activity'].forEach(field => {
        const element = document.getElementById(`profile-${field}`);
        if (element) element.value = '';
    });
    
    // 清除存储的数据
    UserProfile.clear();
    showNotification('档案已清除', 'info');
}

// 当页面加载完成时初始化
document.addEventListener('DOMContentLoaded', init);