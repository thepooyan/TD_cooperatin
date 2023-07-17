//! ------my validation
function checkValidation(element) {
    const vaidationProiorities = {
        notEmpty: 0,
        number: 1,
        email: 1,
        NEQ: 1,
        length: 2,
        noSpace: 3
    };

    let validation = JSON.parse(element.dataset.validate);
    let msgBox = element.nextElementSibling;
    element.errorList = {};
    if (element.classList.contains('noValidate')) return
    function addError(err, msg) {
        element.errorList[err] = { order: vaidationProiorities[err], content: msg };
    }
    function removeError(key) {
        delete element.errorList[key];
    }
    function errorCheck(condition, msg, vali, proiority) {
        if (typeof condition === 'function')
            condition = condition();
        if (condition) {
            addError(vali, msg, proiority);
        }
        else {
            removeError(vali);
        }
    }
    function validateEmail(email) {
        return String(email)
            .toLowerCase()
            .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }
    ;
    function runValidation(vali, value) {
        switch (vali) {
            case 'notEmpty':
                errorCheck(value === '', 'لطفا کادر را خالی نگذارید!', vali);
                break;
            case 'length':
                if (element.dataset.length)
                    errorCheck(value.length != element.dataset.length, `طول کاراکتر وارد شده باید ${element.dataset.length} باشد`, vali);

                if (element.dataset.minlength)
                    errorCheck(value.length < element.dataset.minlength, `طول کاراکتر وارد شده باید بیشتر از ${element.dataset.minlength} باشد`, vali);

                if (element.dataset.maxlength)
                    errorCheck(value.length > element.dataset.maxlength, `طول کاراکتر وارد شده باید کمتر از ${element.dataset.maxlength} باشد`, vali);

                break;
            case 'number':
                errorCheck(_ => isNaN(value), 'فرمت کاراکتر وارد شده صحیح نمیباشد', vali);
                break;
            case 'email':
                errorCheck(_ => !validateEmail(value), 'ایمیل وارد شده نادرست میباشد', vali);
                break;
            case 'NEQ':
                let errorMsg = `مقدار نمی‌تواند برابر با ${element.dataset.neq} باشد`;
                if (element.dataset.neqerror) {
                    errorMsg = element.dataset.neqerror;
                }
                errorCheck(value === element.dataset.neq, errorMsg, vali);
                break;
            case 'EQU':
                let equ;
                if (element.dataset.equ.startsWith('ele=>')) {
                    let query = element.dataset.equ.substring(5);
                    let target = dc.query(query);
                    equ = target.value || target.innerHTML;
                } else {
                    equ = element.dataset.equ;
                }
                errorCheck(value !== equ, 'تکرار کلمه عبور مطابقت ندارد', vali);
                break;
            case 'noSpace':
                errorCheck(value.includes(' '), 'لطفا از فاصله استفاده نکنید', vali);
                break;
        }
    }
    if (!msgBox || !msgBox.classList.contains('validationMsg')) {
        console.log(element);
        console.log(`above logged input has no validation box. please add a span with "validationMsg" classname next to it!`);
        return;
    }
    validation.forEach(vali => {
        runValidation(vali, element.value);
    });
}
function alertValidationErrs(element, reject) {
    let msgBox = element.nextElementSibling;
    if (Object.keys(element.errorList).length === 0) {
        msgBox.classList.remove('show');
    }
    else {
        let HigherOrder = Object.values(element.errorList).reduce((p, c) => p.order < c.order ? p : c).order;
        let targetErrors = Object.values(element.errorList).filter(i => i.order === HigherOrder);
        targetErrors.forEach((i, index) => {
            if (index === 0) {
                /*editNumber*/
                msgBox.innerHTML = i.content;
            }
            else {
                msgBox.innerHTML += ` و ${i.content}`;
            }
            msgBox.classList.add('show');
            reject && reject();
        });
    }
}
//*validate section
function validateSection(section) {
    return new Promise((resolve, reject) => {
        section.querySelectorAll('[data-validate]').forEach(i => {
            checkValidation(i);
            alertValidationErrs(i, reject);
        });
        resolve();
    });
}
//* set all vaidations
function setValidations() {
    dc.queries('[data-validate]').forEach(i => {
        let msgBox = i.nextElementSibling;
        if (!msgBox || !msgBox.classList.contains('validationMsg')) {
            console.log(i);
            console.log(`above logged input has no validation box. please add a span with "validationMsg" classname next to it!`);
            return;
        } else {
            i.onchange = () => {
                checkValidation(i);
                alertValidationErrs(i);
            };
        }

    });
}