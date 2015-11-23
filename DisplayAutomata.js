divAutDoc = document.createElement("div");
divAutDoc.innerHTML = '';
divAutDoc.style.margin = "10px";
divAutDoc.style.maxWidth = "700px";
divAutDoc = {"Body":divAutDoc};


var svgNS = "http://www.w3.org/2000/svg";  

function AutomataImageOptions(Image,Obj)
{
    var div = document.createElement("div");
    var Initial_states = Obj["description"]["Initial states"]
    var Final_states = Obj["description"]["Final states"]
    div["Initial states"] = []
    div["Final states"] = []

    Image.onload = function()
    {
       var svg = Image.getSVGDocument();    
       div["Graph"] = svg.getElementsByTagName("g")[0]; 
       var States = svg.getElementsByTagName("ellipse");       
       div["States"] = States;
       for (var x = 0; x<States.length;x++){
            State = States[x];
            State["Initial"] = false;
            State["Final"] = false;            
            State.makeInitial = 
            function()
            {
                if (!this["Initial"]){
                    this["Initial"] = true;
                    this.style.fill = "green";
                    div["Initial states"].push(this.id);
                    
                } 
            };
            State.removeInitial = 
            function()
            {
                if (this["Initial"]){
                    this["Initial"] = false;
                    this.style.fill = "lightblue";
                    var index = div["Initial states"].indexOf(this.id);    
                    if (index !== -1) {
                        div["Initial states"].splice(index, 1);
                    }                 

                } 
            };
            State.makeFinal = 
            function()
            {
                if (!this["Final"]){
                    this["Final"] = true;
                    div["Final states"].push(this.id);
                    Final = svg.createElementNS(svgNS,"ellipse");
                    Final.setAttribute("cx",this.getAttribute("cx"));
                    Final.setAttribute("cy",this.getAttribute("cy"));
                    Final.setAttribute("rx",parseInt(this.getAttribute("rx"))*1.15);
                    Final.setAttribute("ry",parseInt(this.getAttribute("ry"))*1.15);
                    Final.style.fill ="none";

                    Final.style.stroke ="black";
                    Final.id = this.id+"Final";
                    this["FinalLink"] = Final;
                    div["Graph"].appendChild(Final);
                    
                } 
            };
            State.removeFinal = 
            function()
            {
                if (this["Final"]){
                    this["Final"] = false;
                    this["FinalLink"].remove();
                    var index = div["Final states"].indexOf(this.id);    
                    if (index !== -1) {
                        div["Final states"].splice(index, 1);
                    }                 

                } 
            };

            
       }

       for (var x = 0; x<Initial_states.length;x++)
       {
            State = svg.getElementById(Initial_states[x]);
            State.makeInitial();
       }
       for (var x = 0; x<Final_states.length;x++)
       {
            State = svg.getElementById(Final_states[x]);
            State.makeFinal();
       }
       
    }

    //minimization button
    var minimized = document.createElement("div");
    div.appendChild(minimized);
    minimized.style.marginTop ="10px";
    var Button = document.createElement("input");
    Button.setAttribute("type","submit");    
    Button.setAttribute("value","Minimized Automaton");    
    Button.onclick = 
    function (){
        var Canvas = NewCanvas();
        Canvas.Wait();
        var s = "inputtype=Automata&description=&format=Image&Request=MinimalAutomaton&AutomatonId="+Obj["description"]["id"]+"&InitialStates="+div["Initial states"]+"&FinalStates="+div["Final states"];
        SendAjaxRequest(s,Canvas);

    };
    minimized.appendChild(Button);
    //TransitionSemigroup button
    var TransitionMonoid = document.createElement("div");
    div.appendChild(TransitionMonoid);
    TransitionMonoid.style.marginTop ="10px";
    var Button = document.createElement("input");
    Button.setAttribute("type","submit");    
    Button.setAttribute("value","Transition Monoid");    
    Button.onclick = 
    function (){
        var Canvas = NewCanvas();
        Canvas.Wait();
        var s = "inputtype=Automata&description=&format=Json&Request=TransitionMonoid&AutomatonId="+Obj["description"]["id"]
        SendAjaxRequest(s,Canvas);

    };
    TransitionMonoid.appendChild(Button);

    //change states
    var ChangeStates = document.createElement("div");
    var Button = document.createElement("input");
    ChangeStates.appendChild(Button);
    var Holder = document.createElement("div");
    ChangeStates.appendChild(Holder);
    ChangeStates["Holder"] = Holder;
    ChangeStates["Button"] = Button;

    ChangeStates["active"] = false;
    div.appendChild(ChangeStates);
    ChangeStates.style.marginTop ="10px";
    ChangeStates.open = function ()
    {
        ChangeStates["Holder"].innerHTML = "<div>Click on states to make them initial</div><div>Double click on states to make them Final</div>";
        ChangeStates["Holder"].style.margin = "10px";
        ChangeStates["active"] = true;
        ChangeStates["Button"].value = "x";

 
        for (var i=0;i<div["States"].length;i++)
        {
            State = div["States"][i];
            State.ondblclick = 
            function (){
                if (this["Final"])
                {
                    this.removeFinal();
                }
                else
                {
                    this.makeFinal();
                }

            };
            State.onclick =             
            function (){
                if (this["Initial"])
                {
                    this.removeInitial();
                }
                else
                {
                    this.makeInitial();
                }

            }; 

        }
            
    }
    ChangeStates.close = function ()
    {
        ChangeStates["active"] = false;
        ChangeStates["Holder"].remove()
        var Holder = document.createElement("div");
        ChangeStates.appendChild(Holder);
        ChangeStates["Holder"] = Holder
        ChangeStates["Button"].value = ChangeStates["Button"].permtxt;
        for (var i=0;i<div["States"].length;i++)
        {
            State = div["States"][i];
            State.onclick = function (){};
            State.ondblclick = function (){};
        }
    }    

    Button.setAttribute("type","submit");    
    Button.permtxt = "Modifiate Initial/Final states";    
    Button.setAttribute("value",Button.permtxt);    
    
    Button.onclick = 
    function (){
        if (ChangeStates["active"] == true)
        {
            ChangeStates.close();
        }
        else
        {
            ChangeStates.open();
        }
        
    };

    return div;
}


function JsonDrawAutomata(Obj)
{   
    AutJson = Obj["description"]; 
    Aut = document.createElement("div")
    Aut.style.margin = "10px";
    Aut.innerHTML = '<div>Initials:<div style="margin-left:20px">'+AutJson["Initials"]+'</div></div><div> Finals:<div style="margin-left:20px">'+AutJson["Finals"]+'</div></div><div>Transitions:';
    for (x=0;x<AutJson["Transitions"].length;x++)
    {
        Aut.innerHTML +=  '<div style="margin-left:20px">'+AutJson["Transitions"][x]+"</div>"
    }
    return Aut;
}

