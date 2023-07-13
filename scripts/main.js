const cooperationForm = dc.query('form#cooperation');

if (cooperationForm) {
    cooperationForm.onsubmit = e => {
        e.preventDefault();
        alert('submit');
    }
}


//group checkbox
dc.queries('input[type="checkbox"][data-groupWith]').forEach(item=>{
    const groupName = item.dataset.groupwith;
    const group = dc.queries(`[data-groupWith="${groupName}"]`);
    if (!group) return
    item.onchange = () => {
        group.forEach(i => i.checked  = false );
        item.checked = true;
    }
})