function JsonDrawVarietyList(Obj)
{
    div = document.createElement('div');
    div.innerHTML =  JSON.stringify(Obj["description"]);
    div.style.margin='10px';
    return div;
}

