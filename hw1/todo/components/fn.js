// Fn to create div with a class
const d = (classname)=>{
    let d = document.createElement("div");
    d.classList.add(classname)

    return d;
}

const icn = (nm) => {
    return `<span class="material-icons-outlined">${nm}</span>`
}

const btn = (classname, innerText, icon)=>{
    let b = document.createElement("button");
    b.classList.add(classname);

    if (innerText)
        b.innerText = innerText

    if (icon)
        b.innerHTML = icn(icon);

    return b;
}


function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }


export 
{
    d, btn, icn, uuidv4
}