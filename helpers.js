import nodeHtmlToImage from 'node-html-to-image'
import {bot} from "./bot.js";
export const PASSING_DEGREE_IN_ELEMENTARY = 85
export function getDecisionStudent({exceptions, result}) {
    function getDecision({degree, ref, by = "", value}){
        switch (by) {
            case "exception": {
                if(Number(degree) >= Number(ref) && Number(degree) < Number(PASSING_DEGREE_IN_ELEMENTARY)){
                    return {value, degree: ref, special: true}
                } else if(Number(degree) >= Number(PASSING_DEGREE_IN_ELEMENTARY)){
                    return  {value: "ناجح", degree: ref, special: false}
                } else {
                    return  {value: "راسب", degree: ref, special: false}
                }
            }
            default : {
                if(Number(degree) >= Number(ref)){
                    return  {value: "ناجح", degree: ref, special: false}
                } else {
                    return  {value: "راسب", degree: ref, special: false}
                }
            }
        }
    }
    switch (result.typeResult.slug) {
        case 1: {
            if(exceptions.status === "success"){
                return exceptions.data.map(exception => {
                    if(exception.ref === String("state").toLowerCase()){
                        if(exception.name === result.state.name){
                            return getDecision({degree: result.degree, ref: exception.degree, by: "exception", value: exception.value})
                        } else {
                            return getDecision({degree: result.degree, ref: PASSING_DEGREE_IN_ELEMENTARY})
                        }
                    }

                    if(exception.ref === String("county").toLowerCase()){
                        if(exception.name === result.county.name || exception.name === result.county.name){
                            return getDecision({degree: result.degree, ref: PASSING_DEGREE_IN_ELEMENTARY, by: "exception", value: exception.value})
                        } else {
                            return getDecision({degree: result.degree, ref: PASSING_DEGREE_IN_ELEMENTARY})
                        }
                    }

                    if(exception.ref === String("school").toLowerCase()){
                        if(exception.name === result.school.name || exception.name === result.school.name){
                            return getDecision({degree: result.degree, ref: PASSING_DEGREE_IN_ELEMENTARY, by: "exception", value: exception.value})
                        } else {
                            return getDecision({degree: result.degree, ref: PASSING_DEGREE_IN_ELEMENTARY})
                        }
                    }

                    if(exception.ref === String("school").toLowerCase()){
                        if(exception.name === result.center.name || exception.name === result.center.name){
                            return getDecision({degree: result.degree, ref: PASSING_DEGREE_IN_ELEMENTARY, by: "exception", value: exception.value})
                        } else {
                            return getDecision({degree: result.degree, ref: PASSING_DEGREE_IN_ELEMENTARY})
                        }
                    }
                    return getDecision({degree: result.degree, ref: PASSING_DEGREE_IN_ELEMENTARY})
                })
            } else {
                return getDecision({degree: result.degree, ref: PASSING_DEGREE_IN_ELEMENTARY})
            }
        }
        default : {
            switch (result.decision.trim()) {
                case 'Ajourné':
                    return  {value: "راسب", special: false}
                case 'Absent':
                case 'Abscent':
                    return  {value: "غائب", special: false}
                case 'Admis':
                case 'Delibérable':
                    return  {value: "ناجح", special: false}
                case 'Examen annulé':
                    return  {value: "مُلغى", special: false}
                case 'Sessionnaire':
                    return  {value: "الدورة التكميلية", special: false}
                default:
                    return  {value: "---", special: false}
            }
        }
    }
}
export function getGradeStudent(degree, {exceptions, result}) {
    const largestDegree = 200
    const currentNumber = largestDegree - PASSING_DEGREE_IN_ELEMENTARY
    const grade = currentNumber / 8
    if(Number(degree) > (largestDegree - grade) && Number(degree) <= largestDegree){
        return "أ+ - +A"
    } else if(Number(degree) >= (largestDegree - (grade * 2)) && Number(degree) <= (largestDegree - grade)){
        return "أ - A"
    } else if(Number(degree) >= (largestDegree - (grade * 3)) && Number(degree) < (largestDegree - (grade * 2))){
        return "ب+ - +B"
    } else if(Number(degree) >= (largestDegree - (grade * 4)) && Number(degree) < (largestDegree - (grade * 3))){
        return "ب - B"
    } else if(Number(degree) >= (largestDegree - (grade * 5)) && Number(degree) < (largestDegree - (grade * 4))){
        return "ج+ - +C"
    } else if(Number(degree) >= (largestDegree - (grade * 6)) && Number(degree) < (largestDegree - (grade * 5))){
        return "ج - C"
    } else if(Number(degree) >= (largestDegree - (grade * 7)) && Number(degree) < (largestDegree - (grade * 6))){
        return "د+ - +D"
    } else if(Number(degree) >= (largestDegree - (grade * 8)) && Number(degree) < (largestDegree - (grade * 7))){
        return "د - D"
    } else {
        if(getDecisionStudent({exceptions, result})[0]?.special || getDecisionStudent({exceptions, result}).special){
            return "معدل خاص"
        } else {
            return "هـ - F"
        }
    }
}
export function getDegreeStudent(degree) {
    if(degree.toString().trim().split(".").length === 1){
        return degree.toString().trim().split(".")[0]
    }else {
        return  degree.toString().trim().split(".")[0] + '.' + degree.toString().trim().split(".")[1].slice(0, 2)
    }
}
export function getNumberFormat(number) {
    return new Intl.NumberFormat("en-US").format(Number(number))
}
export function getNumberForHuman(number) {
    switch (Number(number)) {
        case 1: {
            return `الأول`
        }
        case 2: {
            return `الثاني`
        }
        case 3: {
            return `الثالث`
        }
        case 4: {
            return `الرابع`
        }
        case 5: {
            return `الخامس`
        }
        case 6: {
            return `السادس`
        }
        case 7: {
            return `السابع`
        }
        case 8: {
            return `الثامن`
        }
        case 9: {
            return `التاسع`
        }
        case 10: {
            return `العاشر`
        }
        default:
            return getNumberFormat(number)
    }
}

export async function getImage({chatId, result, exceptions}) {
    await nodeHtmlToImage({
        output: './image.png',
        html: `
<html>
    <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@160..700&display=swap" rel="stylesheet">
        <style>
            body {
                direction: rtl;
                box-sizing: border-box;
                margin: 0;
                padding: 0;
                font-family: 'Readex Pro';
            }
        </style>
    </head>
    <body style="padding: 16px; width: 365px; overflow: hidden;">
        <section style="display: flex; background-color: #fafaf9; flex-direction: column; border-radius: 0.5rem; border: 1px solid #e2e8f0; gap: 0.25rem;">
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <div style="display: flex; padding-left: 0.5rem;padding-right: 0.5rem; flex-direction: column; gap: 0.25rem; ">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" style="color: #6366F1; font-size: 2.25rem;line-height: 2.5rem; text-align: center; width: 100%; " height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M622.34 153.2L343.4 67.5c-15.2-4.67-31.6-4.67-46.79 0L17.66 153.2c-23.54 7.23-23.54 38.36 0 45.59l48.63 14.94c-10.67 13.19-17.23 29.28-17.88 46.9C38.78 266.15 32 276.11 32 288c0 10.78 5.68 19.85 13.86 25.65L20.33 428.53C18.11 438.52 25.71 448 35.94 448h56.11c10.24 0 17.84-9.48 15.62-19.47L82.14 313.65C90.32 307.85 96 298.78 96 288c0-11.57-6.47-21.25-15.66-26.87.76-15.02 8.44-28.3 20.69-36.72L296.6 284.5c9.06 2.78 26.44 6.25 46.79 0l278.95-85.7c23.55-7.24 23.55-38.36 0-45.6zM352.79 315.09c-28.53 8.76-52.84 3.92-65.59 0l-145.02-44.55L128 384c0 35.35 85.96 64 192 64s192-28.65 192-64l-14.18-113.47-145.03 44.56z"></path></svg>
                    <span style="color: #6366F1; font-size: 0.875rem;line-height: 1.25rem; font-weight: 600; text-align: center; width: 100%; ">#23700</span>
                    <h1 style="color: #4338CA; font-size: 1.25rem;line-height: 1.75rem; font-weight: 700; text-align: center; text-transform: uppercase; width: 100%; ">{{name}}</h1>
                </div>
                <div style="display: flex; justify-content: center; align-items: center; gap: 0.75rem; ">
                    <span style="font-size: 1.25rem;">🎉</span>
                    <span style="color: #047857; font-size: 1.5rem;line-height: 2rem; font-weight: 700; ">{{decision}}</span>
                    <span style="line-height: 1.75rem; ">🎉</span>
                </div>
                <div style="display: flex; padding: 0.5rem; background-color: #ffffff; justify-content: space-between; align-items: center; border-top-width: 1px; border-right-width: 0; border-left-width: 0; border-bottom-width: 1px; border-style: solid; border-color: #e2e8f0">
                    <div style="display: flex; font-size: 0.75rem;line-height: 1rem; font-weight: 500; flex-direction: column; align-items: center; gap: 0.5rem; color: #475569; ">
                        <span style="color: #059669; font-size: 0.875rem;line-height: 1.25rem; font-weight: 700; ">{{rankingInCountry}}</span>
                        <div style="display: flex; align-items: center; gap: 0.25rem; ">
                            <span>في الوطن</span>
                        </div>
                    </div>
                    <hr style="align-self: center; height: 1.5rem; border-width: 1px; border-style: dashed; border-color: #e2e8f0; " />
                    <div style="display: flex; font-size: 0.75rem;line-height: 1rem; font-weight: 500; flex-direction: column; align-items: center; gap: 0.5rem; color: #475569; ">
                        <span style="color: #4F46E5; font-size: 0.875rem;line-height: 1.25rem; font-weight: 700; ">{{rankingInState}}</span>
                        <div style="display: flex; align-items: center; gap: 0.25rem; ">
                            <span>في الولاية</span>
                        </div>
                    </div>
                    <hr style="align-self: center; height: 1.5rem; border-width: 1px; border-style: dashed; border-color: #e2e8f0; " />
                    <div style="display: flex; font-size: 0.75rem;line-height: 1rem; font-weight: 500; flex-direction: column; align-items: center; gap: 0.5rem; color: #475569; ">
                        <span style="color: #ea580c; font-size: 0.875rem;line-height: 1.25rem; font-weight: 700; ">{{rankingInCounty}}</span>
                        <div style="display: flex; align-items: center; gap: 0.25rem; ">
                            <span>في المقاطعة</span>
                        </div>
                    </div>
                    <hr style="align-self: center; height: 1.5rem; border-width: 1px; border-style: dashed; border-color: #e2e8f0; " />
                    <div style="display: flex; font-size: 0.75rem;line-height: 1rem; font-weight: 500; flex-direction: column; align-items: center; gap: 0.5rem; color: #475569; ">
                        <span style="color: #0891b2; font-size: 0.875rem;line-height: 1.25rem; font-weight: 700; ">{{rankingInSchool}}</span>
                        <div style="display: flex; align-items: center; gap: 0.25rem; ">
                            <span>في المدرسة</span>
                        </div>
                    </div>
                </div>
            </div>
            <div style="display: flex; padding: 0.5rem; font-size: 0.875rem;line-height: 1.25rem; font-weight: 500; justify-content: space-between; align-items: center; ">
                <div style="display: flex; flex-direction: column; cursor: pointer; gap: 0.25rem; ">
                    <label style="font-weight: 600; cursor: pointer; color: #334155;">المدرسة</label>
                    <p style="color: #4338CA; font-size: 0.75rem;line-height: 1rem; ">{{school}}</p>
                </div>
                <div style="display: flex; flex-direction: column; cursor: pointer; gap: 0.25rem; ">
                    <label style="font-weight: 600; cursor: pointer; color: #334155;">المركز</label>
                    <p style="color: #4338CA; font-size: 0.75rem;line-height: 1rem; ">{{center}}</p>
                </div>
            </div>
            <hr style="height: 0; margin: 0; width: 100%; border-width: 1px; border-style: solid; border-color: #e2e8f0; " />
            <div style="display: flex; padding: 0.5rem; font-size: 0.875rem;line-height: 1.25rem; font-weight: 500; justify-content: space-between; align-items: center; ">
                <div style="display: flex; flex-direction: column; cursor: pointer; gap: 0.25rem; ">
                    <label style="font-weight: 600; cursor: pointer; color: #334155;">الولاية</label>
                    <p style="color: #4338CA; font-size: 0.75rem;line-height: 1rem; ">{{state}}</p>
                </div>
                <div style="display: flex; flex-direction: column; cursor: pointer; gap: 0.25rem; ">
                    <label style="font-weight: 600; cursor: pointer; color: #334155;">المقاطعة</label>
                    <p style="color: #4338CA; font-size: 0.75rem;line-height: 1rem; ">{{county}}</p>
                </div>
            </div>
            <hr style="height: 0; margin: 0;; width: 100%; border-width: 1px; border-style: solid; border-color: #e2e8f0; " />
            <div style="display: flex; padding: 0.5rem; font-size: 0.875rem;line-height: 1.25rem; font-weight: 500; justify-content: space-between; align-items: center; ">
                <div style="display: flex; flex-direction: column; cursor: pointer; gap: 0.25rem; ">
                    <label style="font-weight: 600; cursor: pointer; color: #334155;">الشعبة</label>
                    <p style="color: #4338CA; font-size: 0.75rem;line-height: 1rem; ">{{type}}</p>
                </div>
                <div style="display: flex; flex-direction: column; cursor: pointer; gap: 0.25rem; ">
                    <label style="font-weight: 600; cursor: pointer; color: #334155;">الدرجة</label>
                    <p style="font-size: 0.75rem;line-height: 1rem; ">{{degree}}</p>
                </div>
            </div>
        </section>
    </body>
</html>
`,
        content: {
            id: result.id,
            result: result.result,
            type: result.typeResult.slug === 5 ? result.type.nameAr : null,
            slug: result.typeResult.slug,
            grade: result.typeResult.slug === 1 ? getGradeStudent(result.degree, {exceptions, result}) : null,
            decision: getDecisionStudent({exceptions, result})[0]?.value || getDecisionStudent({exceptions, result}).value,
            degree: getDegreeStudent(result.degree),
            rankingInCountry: getNumberForHuman(result.rankingInCountry),
            rankingInCounty: getNumberForHuman(result.rankingInCounty),
            rankingInState: getNumberForHuman(result.rankingInState),
            rankingInSchool: getNumberForHuman(result.rankingInSchool),
            rankingInCenter: getNumberForHuman(result.rankingInCenter),
            name: result.student.name,
            number: result.student.number,
            center: result.center.name,
            county: result.county.name,
            school: result.school.name,
            state: result.state.name,
            session: result.session,
            typeResult: result.typeResult,
            year: result.year.name,
        },
    })

    await bot.api.sendPhoto(chatId, './image.png')
}

export function generateHtml() {
    return `<html>

<head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@160..700&display=swap" rel="stylesheet">
    <style>
        body {
            direction: rtl;
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Readex Pro';
        }
    </style>
</head>

<body style="width: 365px; padding: 15px;background-color: rgb(250 250 249 / 1);">
    <div style="direction: rtl;
    box-sizing: border-box;
    border-style: solid;
    border-color: #e5e7eb;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    border-radius: 0.5rem;
    border-width: 1px;
    background-color: rgb(250 250 249 / var(--tw-bg-opacity))">
        <div style="direction: rtl;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;">
            <div style="line-height: inherit;
    direction: rtl;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" style="direction: rtl;
    stroke: currentcolor;
    fill: currentcolor;
    stroke-width: 0;
    height: 1em;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: block;
    vertical-align: middle;
    width: 100%;
    text-align: center;
    font-size: 2.25rem;
    line-height: 2.5rem;
    color: rgb(99 102 241 / 1)" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M622.34 153.2L343.4 67.5c-15.2-4.67-31.6-4.67-46.79 0L17.66 153.2c-23.54 7.23-23.54 38.36 0 45.59l48.63 14.94c-10.67 13.19-17.23 29.28-17.88 46.9C38.78 266.15 32 276.11 32 288c0 10.78 5.68 19.85 13.86 25.65L20.33 428.53C18.11 438.52 25.71 448 35.94 448h56.11c10.24 0 17.84-9.48 15.62-19.47L82.14 313.65C90.32 307.85 96 298.78 96 288c0-11.57-6.47-21.25-15.66-26.87.76-15.02 8.44-28.3 20.69-36.72L296.6 284.5c9.06 2.78 26.44 6.25 46.79 0l278.95-85.7c23.55-7.24 23.55-38.36 0-45.6zM352.79 315.09c-28.53 8.76-52.84 3.92-65.59 0l-145.02-44.55L128 384c0 35.35 85.96 64 192 64s192-28.65 192-64l-14.18-113.47-145.03 44.56z">
                    </path>
                </svg>
                <span style="direction: rtl;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    width: 100%;
    text-align: center;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 600;
    color: rgb(99 102 241 / 1);">#53535 - 2024</span>
                <h1 style="direction: rtl;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    margin: 0;
    width: 100%;
    text-align: center;
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 700;
    color: rgb(79 70 229 / 1);">يسلم أحمد ناجم</h1>
            </div>
            <div style="line-height: inherit;
    direction: rtl;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;">

                <span style="direction: rtl;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    font-size: 1.25rem;
    line-height: 1.75rem;">🎉</span>
                <span style="direction: rtl;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
    --tw-text-opacity: 1;
    color: rgb(21 128 61 / 1);">ناحج</span>
                <span style="direction: rtl;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    font-size: 1.25rem;
    line-height: 1.75rem;">🎉</span>
            </div>
            <div style="direction: rtl;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top-width: 1px;
    border-bottom-width: 1px;
    background-color: rgb(255 255 255 / 1);
    padding: 0.5rem;">
                <div style="direction: rtl;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 500;
    color: rgb(71 85 105 / 1);">
                    <div style="direction: rtl;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 500;
    color: rgb(71 85 105 / 1);
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    align-items: center;
    gap: 0.25rem;">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" style="direction: rtl;
    font-weight: 500;
    color: rgb(71 85 105 / 1);
    stroke: currentcolor;
    fill: currentcolor;
    stroke-width: 0;
    height: 1em;
    width: 1em;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: block;
    vertical-align: middle;
    font-size: 1.125rem;
    line-height: 1.75rem;" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M97.12 362.63c-8.69-8.69-4.16-6.24-25.12-11.85-9.51-2.55-17.87-7.45-25.43-13.32L1.2 448.7c-4.39 10.77 3.81 22.47 15.43 22.03l52.69-2.01L105.56 507c8 8.44 22.04 5.81 26.43-4.96l52.05-127.62c-10.84 6.04-22.87 9.58-35.31 9.58-19.5 0-37.82-7.59-51.61-21.37zM382.8 448.7l-45.37-111.24c-7.56 5.88-15.92 10.77-25.43 13.32-21.07 5.64-16.45 3.18-25.12 11.85-13.79 13.78-32.12 21.37-51.62 21.37-12.44 0-24.47-3.55-35.31-9.58L252 502.04c4.39 10.77 18.44 13.4 26.43 4.96l36.25-38.28 52.69 2.01c11.62.44 19.82-11.27 15.43-22.03zM263 340c15.28-15.55 17.03-14.21 38.79-20.14 13.89-3.79 24.75-14.84 28.47-28.98 7.48-28.4 5.54-24.97 25.95-45.75 10.17-10.35 14.14-25.44 10.42-39.58-7.47-28.38-7.48-24.42 0-52.83 3.72-14.14-.25-29.23-10.42-39.58-20.41-20.78-18.47-17.36-25.95-45.75-3.72-14.14-14.58-25.19-28.47-28.98-27.88-7.61-24.52-5.62-44.95-26.41-10.17-10.35-25-14.4-38.89-10.61-27.87 7.6-23.98 7.61-51.9 0-13.89-3.79-28.72.25-38.89 10.61-20.41 20.78-17.05 18.8-44.94 26.41-13.89 3.79-24.75 14.84-28.47 28.98-7.47 28.39-5.54 24.97-25.95 45.75-10.17 10.35-14.15 25.44-10.42 39.58 7.47 28.36 7.48 24.4 0 52.82-3.72 14.14.25 29.23 10.42 39.59 20.41 20.78 18.47 17.35 25.95 45.75 3.72 14.14 14.58 25.19 28.47 28.98C104.6 325.96 106.27 325 121 340c13.23 13.47 33.84 15.88 49.74 5.82a39.676 39.676 0 0 1 42.53 0c15.89 10.06 36.5 7.65 49.73-5.82zM97.66 175.96c0-53.03 42.24-96.02 94.34-96.02s94.34 42.99 94.34 96.02-42.24 96.02-94.34 96.02-94.34-42.99-94.34-96.02z">
                            </path>
                        </svg>
                        <span>الوطن</span>
                    </div>
                    <span style="direction: rtl;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 700;
    color: rgb(234 88 12 / 1);">877</span>
                </div>
                <hr style="direction: rtl;
    box-sizing: border-box;
    border-color: #e5e7eb;
    color: inherit;
    margin: 0;
    height: 1.5rem;
    align-self: center;
    border-width: 1px;
    border-style: dashed;" />
                <div style="direction: rtl;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 500;
    color: rgb(71 85 105 / 1);">
                    <div style="direction: rtl;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 500;
    color: rgb(71 85 105 / 1);
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    align-items: center;
    gap: 0.25rem;">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" style="direction: rtl;
    font-weight: 500;
    color: rgb(71 85 105 / 1);
    stroke: currentcolor;
    fill: currentcolor;
    stroke-width: 0;
    height: 1em;
    width: 1em;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: block;
    vertical-align: middle;
    font-size: 1.125rem;
    line-height: 1.75rem;" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M97.12 362.63c-8.69-8.69-4.16-6.24-25.12-11.85-9.51-2.55-17.87-7.45-25.43-13.32L1.2 448.7c-4.39 10.77 3.81 22.47 15.43 22.03l52.69-2.01L105.56 507c8 8.44 22.04 5.81 26.43-4.96l52.05-127.62c-10.84 6.04-22.87 9.58-35.31 9.58-19.5 0-37.82-7.59-51.61-21.37zM382.8 448.7l-45.37-111.24c-7.56 5.88-15.92 10.77-25.43 13.32-21.07 5.64-16.45 3.18-25.12 11.85-13.79 13.78-32.12 21.37-51.62 21.37-12.44 0-24.47-3.55-35.31-9.58L252 502.04c4.39 10.77 18.44 13.4 26.43 4.96l36.25-38.28 52.69 2.01c11.62.44 19.82-11.27 15.43-22.03zM263 340c15.28-15.55 17.03-14.21 38.79-20.14 13.89-3.79 24.75-14.84 28.47-28.98 7.48-28.4 5.54-24.97 25.95-45.75 10.17-10.35 14.14-25.44 10.42-39.58-7.47-28.38-7.48-24.42 0-52.83 3.72-14.14-.25-29.23-10.42-39.58-20.41-20.78-18.47-17.36-25.95-45.75-3.72-14.14-14.58-25.19-28.47-28.98-27.88-7.61-24.52-5.62-44.95-26.41-10.17-10.35-25-14.4-38.89-10.61-27.87 7.6-23.98 7.61-51.9 0-13.89-3.79-28.72.25-38.89 10.61-20.41 20.78-17.05 18.8-44.94 26.41-13.89 3.79-24.75 14.84-28.47 28.98-7.47 28.39-5.54 24.97-25.95 45.75-10.17 10.35-14.15 25.44-10.42 39.58 7.47 28.36 7.48 24.4 0 52.82-3.72 14.14.25 29.23 10.42 39.59 20.41 20.78 18.47 17.35 25.95 45.75 3.72 14.14 14.58 25.19 28.47 28.98C104.6 325.96 106.27 325 121 340c13.23 13.47 33.84 15.88 49.74 5.82a39.676 39.676 0 0 1 42.53 0c15.89 10.06 36.5 7.65 49.73-5.82zM97.66 175.96c0-53.03 42.24-96.02 94.34-96.02s94.34 42.99 94.34 96.02-42.24 96.02-94.34 96.02-94.34-42.99-94.34-96.02z">
                            </path>
                        </svg>
                        <span>الولاية</span>
                    </div>
                    <span style="direction: rtl;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 700;
    color: rgb(234 88 12 / 1);">2122</span>
                </div>
                <hr style="direction: rtl;
    box-sizing: border-box;
    border-color: #e5e7eb;
    color: inherit;
    margin: 0;
    height: 1.5rem;
    align-self: center;
    border-width: 1px;
    border-style: dashed;" />
                <div style="direction: rtl;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 500;
    color: rgb(71 85 105 / 1);">
                    <div style="direction: rtl;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 500;
    color: rgb(71 85 105 / 1);
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    align-items: center;
    gap: 0.25rem;">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" style="direction: rtl;
    font-weight: 500;
    color: rgb(71 85 105 / 1);
    stroke: currentcolor;
    fill: currentcolor;
    stroke-width: 0;
    height: 1em;
    width: 1em;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: block;
    vertical-align: middle;
    font-size: 1.125rem;
    line-height: 1.75rem;" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M97.12 362.63c-8.69-8.69-4.16-6.24-25.12-11.85-9.51-2.55-17.87-7.45-25.43-13.32L1.2 448.7c-4.39 10.77 3.81 22.47 15.43 22.03l52.69-2.01L105.56 507c8 8.44 22.04 5.81 26.43-4.96l52.05-127.62c-10.84 6.04-22.87 9.58-35.31 9.58-19.5 0-37.82-7.59-51.61-21.37zM382.8 448.7l-45.37-111.24c-7.56 5.88-15.92 10.77-25.43 13.32-21.07 5.64-16.45 3.18-25.12 11.85-13.79 13.78-32.12 21.37-51.62 21.37-12.44 0-24.47-3.55-35.31-9.58L252 502.04c4.39 10.77 18.44 13.4 26.43 4.96l36.25-38.28 52.69 2.01c11.62.44 19.82-11.27 15.43-22.03zM263 340c15.28-15.55 17.03-14.21 38.79-20.14 13.89-3.79 24.75-14.84 28.47-28.98 7.48-28.4 5.54-24.97 25.95-45.75 10.17-10.35 14.14-25.44 10.42-39.58-7.47-28.38-7.48-24.42 0-52.83 3.72-14.14-.25-29.23-10.42-39.58-20.41-20.78-18.47-17.36-25.95-45.75-3.72-14.14-14.58-25.19-28.47-28.98-27.88-7.61-24.52-5.62-44.95-26.41-10.17-10.35-25-14.4-38.89-10.61-27.87 7.6-23.98 7.61-51.9 0-13.89-3.79-28.72.25-38.89 10.61-20.41 20.78-17.05 18.8-44.94 26.41-13.89 3.79-24.75 14.84-28.47 28.98-7.47 28.39-5.54 24.97-25.95 45.75-10.17 10.35-14.15 25.44-10.42 39.58 7.47 28.36 7.48 24.4 0 52.82-3.72 14.14.25 29.23 10.42 39.59 20.41 20.78 18.47 17.35 25.95 45.75 3.72 14.14 14.58 25.19 28.47 28.98C104.6 325.96 106.27 325 121 340c13.23 13.47 33.84 15.88 49.74 5.82a39.676 39.676 0 0 1 42.53 0c15.89 10.06 36.5 7.65 49.73-5.82zM97.66 175.96c0-53.03 42.24-96.02 94.34-96.02s94.34 42.99 94.34 96.02-42.24 96.02-94.34 96.02-94.34-42.99-94.34-96.02z">
                            </path>
                        </svg>
                        <span>المقاطعة</span>
                    </div>
                    <span style="direction: rtl;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 700;
    color: rgb(234 88 12 / 1);">322</span>
                </div>
                <hr style="direction: rtl;
    box-sizing: border-box;
    border-color: #e5e7eb;
    color: inherit;
    margin: 0;
    height: 1.5rem;
    align-self: center;
    border-width: 1px;
    border-style: dashed;" />
                <div style="direction: rtl;
                box-sizing: border-box;
                border-width: 0;
                border-style: solid;
                border-color: #e5e7eb;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.75rem;
                line-height: 1rem;
                font-weight: 500;
                color: rgb(71 85 105 / 1);">
                                <div style="direction: rtl;
                font-size: 0.75rem;
                line-height: 1rem;
                font-weight: 500;
                color: rgb(71 85 105 / 1);
                box-sizing: border-box;
                border-width: 0;
                border-style: solid;
                border-color: #e5e7eb;
                display: flex;
                align-items: center;
                gap: 0.25rem;">
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" style="direction: rtl;
                font-weight: 500;
                color: rgb(71 85 105 / 1);
                stroke: currentcolor;
                fill: currentcolor;
                stroke-width: 0;
                height: 1em;
                width: 1em;
                box-sizing: border-box;
                border-width: 0;
                border-style: solid;
                border-color: #e5e7eb;
                display: block;
                vertical-align: middle;
                font-size: 1.125rem;
                line-height: 1.75rem;" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M97.12 362.63c-8.69-8.69-4.16-6.24-25.12-11.85-9.51-2.55-17.87-7.45-25.43-13.32L1.2 448.7c-4.39 10.77 3.81 22.47 15.43 22.03l52.69-2.01L105.56 507c8 8.44 22.04 5.81 26.43-4.96l52.05-127.62c-10.84 6.04-22.87 9.58-35.31 9.58-19.5 0-37.82-7.59-51.61-21.37zM382.8 448.7l-45.37-111.24c-7.56 5.88-15.92 10.77-25.43 13.32-21.07 5.64-16.45 3.18-25.12 11.85-13.79 13.78-32.12 21.37-51.62 21.37-12.44 0-24.47-3.55-35.31-9.58L252 502.04c4.39 10.77 18.44 13.4 26.43 4.96l36.25-38.28 52.69 2.01c11.62.44 19.82-11.27 15.43-22.03zM263 340c15.28-15.55 17.03-14.21 38.79-20.14 13.89-3.79 24.75-14.84 28.47-28.98 7.48-28.4 5.54-24.97 25.95-45.75 10.17-10.35 14.14-25.44 10.42-39.58-7.47-28.38-7.48-24.42 0-52.83 3.72-14.14-.25-29.23-10.42-39.58-20.41-20.78-18.47-17.36-25.95-45.75-3.72-14.14-14.58-25.19-28.47-28.98-27.88-7.61-24.52-5.62-44.95-26.41-10.17-10.35-25-14.4-38.89-10.61-27.87 7.6-23.98 7.61-51.9 0-13.89-3.79-28.72.25-38.89 10.61-20.41 20.78-17.05 18.8-44.94 26.41-13.89 3.79-24.75 14.84-28.47 28.98-7.47 28.39-5.54 24.97-25.95 45.75-10.17 10.35-14.15 25.44-10.42 39.58 7.47 28.36 7.48 24.4 0 52.82-3.72 14.14.25 29.23 10.42 39.59 20.41 20.78 18.47 17.35 25.95 45.75 3.72 14.14 14.58 25.19 28.47 28.98C104.6 325.96 106.27 325 121 340c13.23 13.47 33.84 15.88 49.74 5.82a39.676 39.676 0 0 1 42.53 0c15.89 10.06 36.5 7.65 49.73-5.82zM97.66 175.96c0-53.03 42.24-96.02 94.34-96.02s94.34 42.99 94.34 96.02-42.24 96.02-94.34 96.02-94.34-42.99-94.34-96.02z">
                                        </path>
                                    </svg>
                                    <span>الولاية</span>
                                </div>
                                <span style="direction: rtl;
                box-sizing: border-box;
                border-width: 0;
                border-style: solid;
                border-color: #e5e7eb;
                font-size: 0.875rem;
                line-height: 1.25rem;
                font-weight: 700;
                color: rgb(234 88 12 / 1);">2122</span>
                            </div>
            </div>
        </div>
        <div style="direction: rtl;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: rgb(71 85 105 / 1);">
            <div style="direction: rtl;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: rgb(71 85 105 / 1);
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;">
                <div style="direction: rtl;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: rgb(71 85 105 / 1);
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    align-items: center;
    gap: 0.5rem;">
                    <label style="direction: rtl;
    font-size: 0.875rem;
    line-height: 1.25rem;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    font-weight: 600;
    color: rgb(51 65 85 / 1);">المدرسة</label>

                </div>
                <span style="direction: rtl;
    font-weight: 500;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    text-decoration: inherit;
    font-size: 0.75rem;
    line-height: 1rem;
    color: rgb(67 56 202 / 1);">المدرسة</span>
            </div>
            <div style="direction: rtl;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: rgb(71 85 105 / 1);
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;">
                <div style="direction: rtl;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: rgb(71 85 105 / 1);
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    align-items: center;
    gap: 0.5rem;">
                    <label style="direction: rtl;
    font-size: 0.875rem;
    line-height: 1.25rem;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    font-weight: 600;
    color: rgb(51 65 85 / 1);">المركز</label>

                </div>
                <span style="direction: rtl;
    font-weight: 500;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    text-decoration: inherit;
    font-size: 0.75rem;
    line-height: 1rem;
    color: rgb(67 56 202 / 1);">المركز</span>
            </div>
        </div>
        <hr style="direction: rtl;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    height: 0;
    border-top-width: 1px;
    margin: 0;" />
        <div style="direction: rtl;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: rgb(71 85 105 / 1);">
            <div style="direction: rtl;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: rgb(71 85 105 / 1);
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;">
                <div style="direction: rtl;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: rgb(71 85 105 / 1);
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    align-items: center;
    gap: 0.5rem;">
                    <label style="direction: rtl;
    font-size: 0.875rem;
    line-height: 1.25rem;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    font-weight: 600;
    color: rgb(51 65 85 / 1);">الولاية</label>

                </div>
                <span style="direction: rtl;
    font-weight: 500;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    text-decoration: inherit;
    font-size: 0.75rem;
    line-height: 1rem;
    color: rgb(67 56 202 / 1);">الولاية</span>
            </div>
            <div style="direction: rtl;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: rgb(71 85 105 / 1);
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;">
                <div style="direction: rtl;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: rgb(71 85 105 / 1);
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    align-items: center;
    gap: 0.5rem;">
                    <label style="direction: rtl;
    font-size: 0.875rem;
    line-height: 1.25rem;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    font-weight: 600;
    color: rgb(51 65 85 / 1);">المقاطعة</label>

                </div>
                <span style="direction: rtl;
    font-weight: 500;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    text-decoration: inherit;
    font-size: 0.75rem;
    line-height: 1rem;
    color: rgb(67 56 202 / 1);">المقاطعة</span>
            </div>
        </div>
        <hr style="direction: rtl;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    height: 0;
    border-top-width: 1px;
    margin: 0;" />
        <div style="direction: rtl;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: rgb(71 85 105 / 1);">
            <div style="direction: rtl;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: rgb(71 85 105 / 1);
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;">

                <div style="direction: rtl;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: rgb(71 85 105 / 1);
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    align-items: center;
    gap: 0.5rem;">
                    <label style="direction: rtl;
    font-size: 0.875rem;
    line-height: 1.25rem;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    font-weight: 600;
    color: rgb(51 65 85 / 1);">الشعبة</label>

                </div>
                <span style="direction: rtl;
    font-weight: 500;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    text-decoration: inherit;
    font-size: 0.75rem;
    line-height: 1rem;
    color: rgb(67 56 202 / 1);">الشعبة</span>
            </div>
            <div style="direction: rtl;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: rgb(71 85 105 / 1);
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;">
                <div style="direction: rtl;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: rgb(71 85 105 / 1);
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    display: flex;
    align-items: center;
    gap: 0.5rem;">
                    <label style="direction: rtl;
    font-size: 0.875rem;
    line-height: 1.25rem;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    font-weight: 600;
    color: rgb(51 65 85 / 1);">الدرجة</label>

                </div>
                <span style="direction: rtl;
    font-weight: 500;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
    text-decoration: inherit;
    font-size: 0.75rem;
    line-height: 1rem;
    color: rgb(67 56 202 / 1);">الدرجة</span>
            </div>
        </div>
    </div>
</body>

</html>`
}