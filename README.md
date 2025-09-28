# HealthCalc Hub - 全功能健康计算器

## 项目概述

HealthCalc Hub 是一个基于 Health Calculator API 的全功能健康计算 Web Demo，提供了包括基础身体指标、心血管健康和临床诊断等多个模块的健康计算功能。

## 已完成的功能

### 1. 基础身体指标计算模块 ✅
- **BMI 计算器**: 计算身体质量指数，提供健康等级评估
- **体脂率计算器**: 基于年龄、性别、身高、体重和腰围计算体脂率
- **BMR 计算器**: 计算基础代谢率，显示每日基础能量需求
- **理想体重计算器**: 计算理想体重范围，可与当前体重对比

### 2. 心血管与临床诊断模块 ✅
- **QTc 间期计算器**: 计算校正QT间期，评估心律失常风险
- **踝肱指数(ABI)计算器**: 评估外周血管疾病
- **6分钟步行测试**: 评估心肺功能状态
- **糖尿病风险计算器**: 评估7.5年糖尿病风险概率

### 3. 代谢与能量需求模块 ✅
- **TDEE计算器**: 每日总能量消耗计算
- **维持热量计算器**: 体重维持所需热量
- **瘦体重(LBM)计算器**: 计算肌肉量和体脂分布
- **体表面积(BSA)计算器**: 医用体表面积计算

### 4. 营养与饮食规划模块 ✅
- **宏量营养素计算器**: 蛋白质、碳水化合物、脂肪需求
- **蛋白质计算器**: 根据活动水平和目标计算蛋白质需求
- **膳食纤维计算器**: 每日纤维素推荐摄入量
- **水分摄入计算器**: 基于体重和活动水平的饮水建议

### 5. 单位换算与辅助计算模块 ✅
- **血糖单位换算**: mmol/L 与 mg/dL 之间转换
- **胆固醇单位换算**: 支持总胆固醇、HDL、LDL换算
- **心率区间计算器**: 基于年龄的运动心率区间
- **身高体重单位换算**: 公制与英制单位转换

### 6. 双语言支持 ✅
- 支持中文和英文界面切换
- 所有计算结果都有中英文解读
- 专业医学术语本地化翻译

### 4. 响应式设计 ✅
- 基于 Bootstrap 5 的现代化界面
- 完美适配桌面和移动设备
- 优雅的卡片式布局和动画效果

## 技术特性

- **前端框架**: 原生JavaScript + Bootstrap 5
- **API集成**: Health Calculator API (RapidAPI)
- **样式框架**: Bootstrap 5 + 自定义CSS
- **图标库**: Font Awesome 6
- **动画效果**: CSS3 transitions 和 animations
- **响应式**: 移动优先的响应式设计

## 项目结构

```
HealthCalc Hub/
├── index.html          # 主页面
├── styles.css          # 自定义样式
├── script.js           # JavaScript功能
└── README.md           # 项目说明
```

## 功能演示

### 基础指标计算
1. **BMI计算**: 输入身高体重，获得BMI值和健康建议
2. **体脂率**: 多参数计算，提供精确的体脂率评估
3. **BMR**: 基础代谢计算，了解每日基础能量需求
4. **理想体重**: 基于身高性别的理想体重范围

### 心血管健康
1. **QTc间期**: 心电图QT间期校正，评估心律风险
2. **踝肱指数**: 外周血管疾病筛查
3. **6分钟步行**: 心肺功能评估
4. **糖尿病风险**: 基于多因素的风险预测

## 安装和运行

### 本地运行
1. 克隆或下载项目文件
2. 在项目目录运行本地服务器:
   ```bash
   # 使用Python
   python -m http.server 8000
   
   # 或使用Node.js
   npx http-server . -p 8000
   ```
3. 在浏览器中访问 `http://localhost:8000`

### Cloudflare Pages 部署
项目已优化支持 Cloudflare Pages 部署：
1. 将代码推送到 Git 仓库
2. 在 Cloudflare Pages 中连接仓库
3. 设置构建配置（无需构建步骤）
4. 部署完成

## API配置

项目使用 Health Calculator API，已包含测试API密钥。生产环境建议：

1. 注册 RapidAPI 账号
2. 订阅 Health Calculator API
3. 在 `script.js` 中更新API密钥:
   ```javascript
   const API_CONFIG = {
       key: 'YOUR_API_KEY_HERE',
       host: 'health-calculator-api.p.rapidapi.com',
       baseUrl: 'https://health-calculator-api.p.rapidapi.com'
   };
   ```

## 用户体验特性

- **即时反馈**: 实时输入验证和错误提示
- **加载状态**: 优雅的加载动画
- **结果解读**: 详细的健康建议和医学解释
- **颜色编码**: 绿色(正常)、黄色(警告)、红色(危险)
- **平滑动画**: CSS3过渡效果和淡入动画

## 医学免责声明

本工具仅供健康参考，不构成医疗建议。任何健康问题请咨询专业医疗人员。

## 未来扩展

主要功能已完成，可能的优化方向：
- [ ] 数据导出功能
- [ ] 个人健康档案
- [ ] 更多的图表展示
- [ ] 移动端原生App

## 技术支持

- Health Calculator API 文档: [RapidAPI](https://rapidapi.com/health-calculator-api/api/health-calculator-api)
- Bootstrap 5 文档: [getbootstrap.com](https://getbootstrap.com/)
- Font Awesome 图标: [fontawesome.com](https://fontawesome.com/)

---

**开发状态**: 核心功能已完成，持续优化中  
**最后更新**: 2025年1月  
**版本**: 1.0.0