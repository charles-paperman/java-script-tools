
    
function SendAjaxRequest(s,target)
{
    var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() 
        {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
            {      		
            
          	    var rep =  xmlhttp.responseText;
          	    var Dealt = DealAnswer(rep)
                target.setElement(Dealt);                
                target["rep"] = rep;
                target.AjaxFinished();
            }
         }                 
    s = "request.php?"+s;
    xmlhttp.open("GET", s, true);
    xmlhttp.send();	
    
}


function Request()
{
    var Canvas = NewCanvas();
    Canvas.Wait();
	var inputtype = document.getElementById("head").old.inputtype;
	var description = document.getElementById("description").value;
	var format = document.getElementById("formatSelect").value;
	var calcul = document.getElementById("calculSelect").value;
    var s = "inputtype="+inputtype+"&description="+description+"&format="+format+"&Request="+calcul;
    SendAjaxRequest(s,Canvas);
}
function ErrorMessage(str)
{
   var div = document.createElement("div");
   div.setAttribute("class","subdescription");
   div.innerHTML = '<img src="image/error.svg" style="display:block;margin: 5px auto;"> '+str;
   div.style.margin = "10px";
   div["error"] = true;
   return {"Body":div} 
 
}
function DealAnswer(s)
{
    try{
        Obj = JSON.parse(s);
    }
    catch (e) {
        Dealt =  ErrorMessage("The returned JSON is not correct: "+s+"\n error: "+e.message);
        Dealt["title"] = "Error";
        return Dealt;
    }
    if (Obj["type"] == "error")
    {
        Dealt = ErrorMessage(Obj["description"]);
    }
   
    if (Obj["format"] == "Image")
    {
        Dealt =  DealImage(Obj);
    } 
    if (Obj["format"] == "Images")
    {
        Dealt =  DealImages(Obj);
    } 

    if (Obj["format"] == "Json")
    {
        Dealt = JsonDraw(Obj);
    } 
    if ("title" in Obj)
    {
        Dealt["title"] = Obj["title"];
    }
    return Dealt;
}
function JsonDraw(Obj)
{
    if (Obj["type"] == "Automata")
    {
        return JsonDrawAutomata(Obj);
    }
    if (Obj["type"] == "Monoid")
    {
        return JsonDrawMonoid(Obj["description"],Obj["id"]);
    }
    if (Obj["type"] == "Word")
    {
        return JsonDrawWord(Obj);
    }
    if (Obj["type"] == "Group")
    {
        return JsonDrawWord(Obj);
    }

    if (Obj["type"] == "VarietyList")
    {
        return JsonDrawVarietyList(Obj);
    }

}

    
