$(function () {
    setValidations();
    initCustomSelect();

    const cooperationForm = dc.query('form#cooperation');
    if (cooperationForm) {

        const resetButton = dc.query('button#resetBTN');
        const clearForm = () => {
            cooperationForm.reset();
            clearValidationAlerts(cooperationForm);
        };

        resetButton.onclick = () => {
            clearForm();
        }
        cooperationForm.onsubmit = e => {
            e.preventDefault();
            //check if form info is correct
            validateSection(cooperationForm)
            .then(() => {
                alert('با موفقیت ثبت شد');
                clearForm();
            })
            .catch(() => {
                alert('برو اطلاعاتت رو درست وارد کن گورخر');
            })
        }
    }

    //group checkbox
    dc.queries('input[type="checkbox"][data-groupWith]').forEach(item => {
        const groupName = item.dataset.groupwith;
        const group = dc.queries(`[data-groupWith="${groupName}"]`);
        if (!group) return
        item.addEventListener("change", () => {
            group.forEach(i => i.checked = false);
            item.checked = true;
        })
        item.checked = false;
    })

    const teacherCarousel = dc.query('body > .teachers.owl-carousel');
    if (teacherCarousel) {
        $(teacherCarousel).owlCarousel({
            autoWidth: false,
            rtl: true,
            nav: true,
            items: 1,
            loop: true,
            autoplay: true,
            navText: '',
            autoplayTimeout: 3200,
            autoplayHoverPause: true,
            autoplaySpeed: 900,
        });
    }

    const commonQ = dc.queries('.commonQ .Q');
    if (commonQ) {
        commonQ.forEach(Q => {
            Q.onclick = _ => {
                Q.nextElementSibling.classList.toggle('active');
                Q.classList.toggle('active');
            }
        })
    }
})