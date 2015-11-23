HeadColor = "#d6c9c9";
OptionColor = "#e9eaea";

Json = { "Name":"Interactive Html","value":"Json"}
ISVG = { "Name":"Interactive SVG","value":"Image"}
Image = { "Name":"Image","value":"Image"}
Text = { "Name":"Text","value":"Json"}
Autex = "Initials:\n\t0;\nFinals:\n\t3;\nTransitions:\n\t1.A->2;\n\t0.a->0,1;\n\t0.b->0;\n\t2.A->3;\n"
var documentationReg = '<div> Allowed operations: <ul> <li> R -> A, where "A" is a reserved symbol for the alphabet </li> <li> R -> a for a in {a,...,z,B,...Z} </li><li> R -> 1 (empty word)  </li> <li> Concatenation: R,T -> (R)(T) </li> <li> Power: R -> (R)^k, for k an integer</li> <li> Kleene star: R -> (R)* </li> <li> Union: R,T -> (R)+(T) </li> <li> Difference: R,T -> (R)-(T)</li></ul> The alphabet is automatically detected and case-sensitive or can be specified by adding: <div>A={a,b,....}</div> separated by a ";" after the regular expression. </div>';
var documentationAut = 'The input format is case sensitive and should be of the following form: <div><textarea rows="10" cols="70" style="margin:10px">Initials:\n\tstate_name,state_name,...,state_name;\nFinals:\n\tstate_name,state_name,...,state_name;\nTransitions:\n\tstate_name.letter -> state_name,state_name,...,state_name;\n\tstate_name.letter -> state_name,state_name,...,state_name;\n\t...\n\tstate_name.letter -> state_name,state_name,...,state_name;</textarea></div> <div style="white-space:normal;"> Note that any space, identation and "-" chars will be remove. State_name could be any string, letters should belongs to {a,..z,B..Z}. The "A" letter is reserved for the alphabet and can be used to denote "all" letters at once. The alphabet is automatically computed from the transitions.</div>';
var documentationLogic = "Logic is bad ass";

Options = {
    "RegularExpression":{
        "Name" : "Regular Expression",
        "InputType":"RegularExpression",
        "ExInput": "(A^3)*-(a(ab)*b)*;A={a,b,c}",
        "menuDescription": MenuRegularExpression,   
        "Calculs":{
             "SyntacticMonoid": {"Name":"Syntactic Monoid" ,"Formats":[Json,Image]},
             "SyntacticOrder": {"Name":"Syntactic Order" ,"Formats":[Image]},
             "LeftCayley": {"Name":"Left Cayley graph", "Formats":[Image]},
             "RightCayley": {"Name":"Right Cayley graph", "Formats":[Image]},
             "MinimalAutomaton": {"Name":"Minimal automaton", "Formats":[ISVG,Text]},
             "MembershipMonoids": {"Name":"Lattice of Varieties" ,"Formats":[Image]},
             "DotDepth": {"Name":"Heuristic for the dotdepth" ,"Formats":[Image]},
             "CircuitComplexity": {"Name":"Circuit complexity classes" ,"Formats":[Image]},
                }},         
    "Automata":{
        "Name":"Automata",
        "InputType":"Automata",
        "InputChange":function(){},
        "Height":10,
        "menuDescription": MenuAutomata,   
        "Calculs":{
            "Automaton": {"Name":"Draw Automaton", "Formats":[ISVG,Text]},
            "MinimalAutomaton": {"Name":"Minimal Automaton","Formats":[ISVG,Text]},
            "TransitionMonoid": {"Name":"Transition Monoid","Formats":[Json,Image]}
                }},
    "Logic":{
        "Name":"Logic",
        "InputType":"Logic",
        "menuDescription": MenuLogic,   
        "ExInput":null,
        "Calculs":{
             "SyntacticMonoid": {"Name":"Syntactic Monoid" ,"Formats":[Json,Image]},
             "MinimalAutomaton": {"Name":"Minimal Automaton","Formats":[ISVG,Text]},
        }
        }
    };
    //{"Options":["All","Aperiodic","DA","J"],"TextBefore":"in"}}} 
head = document.getElementById("head");
menu = document.getElementById("menu");
menu.style.display = "inline-block";
menu.style.minWidth = "700px";
for (OptionHead in Options)
{
    divOptionHead = document.createElement("div");
    divOptionHead.setAttribute("class","menu");
    divOptionHead.inputtype = OptionHead;
    divOptionHead.Menu =  Options[OptionHead];
    
    divOptionHead.innerHTML = divOptionHead.Menu["Name"];
    head.appendChild(divOptionHead);
    divOptionHead.setactive = function ()
    {
        this.style.backgroundColor="#FF8080";
        
    };
    divOptionHead.unsetactive = function ()
    {
        this.style.backgroundColor="GhostWhite";
    };
    divOptionHead.onclick = 
    function (){
        head.old.unsetactive();
        head.old = this;
        this.setactive();
        menu.innerHTML = "";
        menu.options = this.Menu.menuDescription()                                 
        menu.appendChild(menu.options);
        menu.options.calculs = this.Menu.Calculs;
        menu.options.inputtype = this.inputtype;
        menu.options.displayCalculs();                                    
        
    };
}
head.old = head.children[0];
head.old.onclick();

function NewCanvas()
{
   var rep = document.getElementById("rep");
   var Canvas = document.createElement("div");
   rep.insertBefore(Canvas,rep.children[0]);
    Canvas.setAttribute("class","canvas");
    var HeadCanvas = document.createElement("div");
    var BodyCanvas = document.createElement("div");
    var OptionCanvas = document.createElement("div");    
    var Title = document.createElement("div");
    Title.style.float = "left";
    Canvas.appendChild(HeadCanvas);
    Canvas.appendChild(BodyCanvas);
    Canvas.appendChild(OptionCanvas);
    HeadCanvas.appendChild(Title)
    Canvas.head = HeadCanvas;
    Canvas.body = BodyCanvas;
    HeadCanvas.style.margin = "5px";
    HeadCanvas.style.parding = "5px";
    HeadCanvas.style.backgroundColor = "white";
    HeadCanvas.style.border = "solid 1px";
    HeadCanvas.style.minHeight = "30px";
    dButton = deleteButton();
    dButton.style.margin = "5px";
    dButton.style.float = "right";
    dButton.canvas = Canvas;
    dButton.action = function ()
    {
        this.canvas.remove();   
    }
    Canvas.deleteButton = dButton;
    HeadCanvas.appendChild(dButton);
    rButton = reduceButton();
    rButton.style.margin = "5px";
    rButton.style.float = "right";
    rButton.canvas = Canvas;
    rButton.action = function ()
    {
        this.canvas.remove();   
    }
    Canvas.reduceButton = rButton;
    Canvas.bodyDisplay = true;
    HeadCanvas.appendChild(rButton);
    rButton.canvas = Canvas;
    rButton.toggleAction = function()
    {
      if (this.canvas.bodyDisplay)
      {
        this.canvas.body.style.display = "none";
      }
      else
      {
        this.canvas.body.style.display = "block";
      }
      this.canvas.bodyDisplay = !this.canvas.bodyDisplay; 

    }    
    
    
    Canvas.titleHolder = Title;
    Title.innerHTML = "Title";
    Title.style.margin = "5px";
    Canvas.body = BodyCanvas;
    Canvas.options = OptionCanvas;
    Canvas.hideHead = function ()
    {   
        this.head.style.display = "none";
    }
    Canvas.showHead = function ()
    {   
        this.head.style.display = "";
    }
    Canvas.setTitle = function (str)
    {
        this.titleHolder.innerHTML = str;
    }
    Canvas.setElement = 
    function (Element) { 
        this.body.innerHTML = ""; 
        this.body.appendChild(Element.Body);
        if ("title" in Element)
        {
            this.setTitle(Element.title);
        }
    };
    Canvas.Wait = 
    function (){
        var Element = {}             
        var wait = document.createElement("img");
        wait.setAttribute("src","image/wait.gif");
        wait.style.margin="20px";
        Element["Body"] = wait;
        this.setElement(Element);
        
    };
    Canvas.AjaxFinished =  function(){};       
    return Canvas; 
}



function DealImage(Obj)
{
    var Answ = {};
    var div = document.createElement("div");
    var ImageHolder= document.createElement("div");
    Answ["Body"] = ImageHolder;

    ImageHolder.style.display ="inline-block";
    ImageHolder.style.margin ="10px";
    var Image = document.createElement("object");
    Image.type ="image/svg+xml";
    Image.data = Obj["description"]["url"];
    Image.id   = Obj["description"]["id"];
    Image.style.maxWidth = "100%";
    ImageHolder.appendChild(Image);
    var options = document.createElement("div");
    Answ["Option"] = options
    options.style.verticalAlign ="top";
    options.style.display ="inline-block";
    options.style.padding = "10px";

    if (Obj["type"] == "Automata")
    {  
        options.appendChild(AutomataImageOptions(Image,Obj));
//        Answ["Documentation"] = divAutDoc;
    }       
    var link = document.createElement("div");
    link.style.margin = "10px";
    link.innerHTML = '<a href="'+Obj["description"]["url"]+'" download>Download image</a>'
    options.appendChild(link);
    var link = document.createElement("div");
    link.style.margin = "10px";
    link.innerHTML = '<a href="/sage_obj/'+Obj["description"]["id"]+'.sobj">Download sage object</a>';
    options.appendChild(link);
    
    return Answ;
}
function DealImages(Obj)
{
    var Answ = {};
    var div = document.createElement("div");
    var ImagesHolder= document.createElement("div");
    ImagesHolder.style.maxWidth = "900px";

    Answ["Body"] = ImagesHolder;
    ImagesHolder.style.display ="inline-block";
    ImagesHolder.style.margin ="10px";
    for (var k = 0; k< Obj["ImagesList"].length;k++) 
    {    
        var ImageHolder= document.createElement("div");
        ImagesHolder.appendChild(ImageHolder);
        ImageHolder.style.display ="inline-block";
        ImageHolder.style.margin ="10px";

        var Image = document.createElement("object");
        Image.type ="image/svg+xml";
        Image.data = Obj["ImagesList"][k]["url"];
        Image.style.maxWidth = "100%";
        ImageHolder.appendChild(Image);
    }    
     var options = document.createElement("div");
    Answ["Option"] = options
    options.style.verticalAlign ="top";
    options.style.display ="inline-block";
    options.style.padding = "10px";
    var link = document.createElement("div");
    link.style.margin = "10px";
    link.innerHTML = '<a href="/sage_obj/'+Obj["description"]["id"]+'.sobj">Download sage object</a>';
    options.appendChild(link);
    return Answ;
}

function Menu(Title)
{
    var divOptionMenu = document.createElement("div");
    var title = document.createElement("div");
    divOptionMenu.appendChild(title);
    title.innerHTML = Title;
    divOptionMenu.title = Title;
    title.setAttribute("class","mainMenuElement");
    var inputHolder = document.createElement("div");
    var buttonHolder = document.createElement("div");
    divOptionMenu.style.border = "solid 1px";
    divOptionMenu.style.backgroundColor = "ghostwhite";
    divOptionMenu.style.padding = "10px";
    menu.appendChild(divOptionMenu);                                
 
    divOptionMenu.inputHolder = inputHolder;
    divOptionMenu.optionsHolder = buttonHolder;
    divOptionMenu.appendChild(buttonHolder);
    divOptionMenu.appendChild(inputHolder);

    inputHolder.style.padding = "10px";
    inputHolder.style.minWidth = "550px";
    
    inputHolder.style.display = "inline-block";
    buttonHolder.style.display = "inline-block";
    buttonHolder.style.display = "inline-block";

    helpHolder = newButton();
    buttonHolder.appendChild(helpHolder);
    
    helpHolder.innerHTML = "Documentation";
    Alphabet = newButton();
    labelAlphabet = document.createElement("div");
    Alphabet.appendChild(labelAlphabet);
    labelAlphabet.innerHTML = "Alphabet:";
    labelAlphabet.style.margin = "5px";
    labelAlphabet.style.display = "inline-block";
    labelAlphabet.style.padding = "5px";    
    inputAlphabet = document.createElement("div");
    inputAlphabet.setAttribute("contenteditable",true);
    inputAlphabet.innerHTML = "autodetect";
    inputAlphabet.style.padding = "5px";
    inputAlphabet.style.margin = "5px";
    inputAlphabet.onclick = function ()
    {
        this.set = true;
        this.style.color = "green";
        this.innerHTML = "";        
    }    
    inputAlphabet.style.border = "solid 1px";
    inputAlphabet.style.color = "red";
    inputAlphabet.style.display = "inline-block";
    inputAlphabet.set = false;
    helpHolder.menu = divOptionMenu;
    divOptionMenu.documentation = "";
    divOptionMenu.alphabet = inputAlphabet;
    Alphabet.appendChild(inputAlphabet);
    buttonHolder.appendChild(Alphabet);    
    helpHolder.onclick = function ()
    {
        Canvas = NewCanvas();
        rep.appendChild(Canvas);
        div = document.createElement("div");
        Canvas.appendChild(div)
        Canvas.setTitle("Documentation about "+this.menu.title);
        div.innerHTML = this.menu.documentation;
        div.style.margin = "10px";
        div.style.width = "800px";
        Canvas.resizeHead();
    }
    divOptionMenu.displayCalculs = function ()
    {
        calculsMenu = verticalSlideMenu();
        calculsMenu.setAttribute("class","mainMenuElement");
        calculsMenu.chooseLabel("Calculs");
        calculsMenu.expandFactor = "32";
        for (l in this.calculs)
        {
            choice = calculsMenu.addChoice(this.calculs[l].Name,function(){});
            choice.style.margin = "5px";           
            choice.style.padding = "5px";
            choice.inputtype = this.inputtype;
            choice.description = this.description;  
            choice.calcultype = l;
            choice.alphabet = this.alphabet;
            choice.action = function()
            {
                var Canvas = NewCanvas();
                Canvas.Wait();
	            var description = this.description.getTextValue();
                var s = "inputtype="+this.inputtype+"&description="+description+"&Request="+this.calcultype;
                if (this.alphabet.set)
                {
                    s += "&alphabet="+this.alphabet.innerHTML;
                }
                SendAjaxRequest(s,Canvas);

            }                          
 
        }
        this.optionsHolder.appendChild(calculsMenu);        
    }
    return divOptionMenu;
}

function MenuLogic()
{
    var menu = Menu("Logic");
    var f = new_formula(null);
    f.appendTo(menu.inputHolder);
    menu.description = f;
    f.getTextValue = function()
    {
        J = this.getClean();
        return JSON.stringify(J);
    }
    menu.doc = documentationLogic;
    return menu;
}
function MenuAutomata()
{
    var menu = Menu("Automaton");
    var input = document.createElement("textarea");
    input.style.verticalAlign = "top"; 
    input.cols = 60;
    input.rows = 15;
    menu.description = input;
    input.getTextValue = function()
    {
        return this.value;
    };
    input.value = Autex;
    menu.inputHolder.appendChild(input);
    menu.documentation = documentationAut;

    return menu;
}
function MenuRegularExpression()
{
    var menu = Menu("Regular Expression");
    var input = document.createElement("textarea");
    input.cols = 60;
    input.rows = 5;
    input.value = "A*(ab+1)cdA*xA*";
    input.getTextValue = function()
    {
        return this.value;
    };
    input.style.verticalAlign = "top";
    menu.inputHolder.appendChild(input);
    menu.description = input;
    menu.documentation = documentationReg;
    return menu;
}

function newButton()
{
    var button = document.createElement("div");
    button.setAttribute("class","mainMenuElement");
    return button;
}
