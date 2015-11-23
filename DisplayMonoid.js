divEggBoxDoc = document.createElement("div");
divEggBoxDoc.innerHTML = 'This diagram is an egg-box representation of the ideal structure of the semigroup. It represents its <a href="https://en.wikipedia.org/wiki/Green%27s_relations">Green relations</a> in a compact way. Each "big" box is a D-classes, horizontal lines of a D-class are R-classes, vertical lines are L-class, each "small" box is a H-class. The <font color="red">red elements</font> are the idempotents. If an H-class contains an idempotent, then it is a (possibly trivial) group. By clicking on the idempotent, you will get a string representation of the group computed by <a href="http://groupprops.subwiki.org/wiki/GAP:StructureDescription">Gap</a>.<div style="margin-top:10px;margin-bottom:10px">Two interactive options are available: <div style="margin-top:5px"><b>Compute preimages:</b> which provides an automaton corresponding to the preimage of element selected by being clicked at. Reclicking a selected element unselect it.</div><div style="margin-top:5px"><b>Compute image:</b> which provides the image of the element in the available text area. The image is furthermore selected in the diagram.</div></div>Please refer to <a href="http://www.liafa.univ-paris-diderot.fr/~jep/PDF/MPRI/MPRI.pdf">Mathematical Foundations of Automata Theory</a> of Jean-&Eacute;ric Pin for more details about semigroup and automata theory.';
divEggBoxDoc.style.margin = "10px";
divEggBoxDoc.style.maxWidth = "700px";
eggBoxDoc = {"Body":divEggBoxDoc};

function toggleselect(obj)
{
    var selected = obj["selected"] 
    if (selected)
    {
        obj["selected"]= false;
        obj.style.backgroundColor="transparent";                           
   } 
    else
    {
        obj["selected"]= true;
        obj.style.backgroundColor=obj["bgcolor"];                           
   } 

}
function unselect(obj)
{
    var selected = obj["selected"] 
    if (selected)
    {
        obj["selected"]= false;
        obj.style.backgroundColor="transparent";                           
   } 
}


function JsonDrawWord(Obj)
{   word = Obj["description"];
    var element = document.createElement("div");
    element.setAttribute("class","element");
    element.innerHTML = word;
    element["error"] = false;
    return element
}

function JsonDrawMonoid(obj,id)
{
           
     var max_depth = parseInt(obj["Jgraph"]["max_depth"]);        		            
     var div = document.createElement('div');
     var sgdraw = document.createElement('div');
     sgdraw.style.display="inline-block";
     sgdraw.enable_selection = true;
     var Elements = [];
     var SelectedElements = []
     var Idempotents = [];    
     div["Elements"] = Elements;     
     div["Idempotents"] = Idempotents;
     
     div.appendChild(sgdraw);     
     for (i = 0; i <= max_depth; i++)  		      	   
       {
          var eggbox = document.createElement('div');
          sgdraw.appendChild(eggbox);
          eggbox.style.margin = "20px";
          eggbox.setAttribute("align","center");       
          for (var j in obj["Jgraph"]["depth"][i.toString()])
          {
                
               var u = obj["Jgraph"]["depth"][i.toString()][j]
               var box =  document.createElement('table');
               box.setAttribute("class","dclass");       
               box.setAttribute("cellspacing","10px");      
               box.setAttribute("cellpadding","10px");      
               box.setAttribute("id","dclass"+u);   
               box["selected"] = false;
               box["bgcolor"] = "#8AB8E6";
               //box.onclick = toggleselect();             
               var tbox = document.createElement('tbody');
               box.appendChild(tbox);
               eggbox.appendChild(box);   
               for (var k in obj["box"][u])
               {
                    var L = obj["box"][u][k]
                    var tr =  document.createElement('tr');
                    tbox.appendChild(tr)
                    for (var l in obj["box"][u][k])
                    {
                        var td =  document.createElement('td');
                       td.setAttribute("class","hclass");       
                       td.setAttribute("align","center");      
                       td["selected"]= false;  
                       td["bgcolor"] = '#8AB8E6'; 
                       tr.appendChild(td);
                        for (var n in obj["box"][u][k][l])
                        {
                            value = obj["box"][u][k][l][n];
                            var element =  document.createElement('div');
                            div["Elements"].push(element);
                            element.setAttribute("id",id+value);
                            element.setAttribute("class","element");
                            element["value"] = value;
                            element["Hclass"] = td;
                            element["selected"] = false;
                            element["bgcolor"] = "#8AB8E6";
                            if (obj["idempotents"].indexOf(obj["box"][u][k][l][n])>-1)
                            {
                                element["idempotent"] = true;
                                div["Idempotents"].push(element);
                                element.style.color = "red";
                                element["ToggleGroup"] = false;
                                element.toggleGroup = function  ()
                                {  
                                    if (!this["ToggleGroup"])
                                    {
                                        var div = document.createElement("div")
                                        var wait = document.createElement("img");
                                        wait.setAttribute("src","image/wait2.gif");
                                        div["wait"] = wait;
                                        div.AjaxFinished = function () { div["wait"].remove()};
                                        div.style.marginTop="5px";
                                        div.appendChild(wait);
                                        div.setElement = 
                                        function (Element)
                                        {
                                            this.appendChild(Element); 
                                        }    
                                        this["Hclass"].appendChild(div);
                                        this["Group"] = div;
                                        s = "inputtype=Words&Request=GroupOfHclass&format=Image&description="+this["value"]+"&MonoidId="+id;
                                        SendAjaxRequest(s,div);

                                    }
                                    else
                                    {
                                        this["Group"].remove()
                                    }    
                                    this["ToggleGroup"] = !this["ToggleGroup"];  
                                    
                                };
                                element.onclick = element.toggleGroup;

                            }
                            else 
                            {
                                element["idempotent"] = false;
                                element.style.color = "black";
                                element.onclick = function () { };

                            }   
                            element.textContent = obj["box"][u][k][l][n];
                            td.appendChild(element);
                            
                            element.select = function() {
                                toggleselect(this);                         
                                }; 
                          

                        }
                    }
               }                    
          }
       }
    // Create option right panel   
    var options = document.createElement("div");
    div.unselectelements =  function (){        
        for (var i; i<Elements.length; i++)
        {
            Elements[i].unselect();
        }
    };
    options.style.verticalAlign = "top";
    options.style.display="inline-block";
    options.style.padding = "10px";    
    options.CloseMenus = function ()
    {
    for (var i=0;i<this["menus"].length ;i++)
    {
        this["menus"][i].close();
    }
     };
    
    options["menus"] = []
    
    // Create preimage computation object
    var Preimage = newOptionMenu(function () { return PreimageTool(div,id);},"Compute preimages");
    options.appendChild(Preimage);
    options["menus"].push(Preimage);
    // Create Word tool object
    var Word = newOptionMenu(function () { return WordTool(div,id);},"Compute image");
    options.appendChild(Word);
    options["menus"].push(Word);
    
    Preimage.starting = function () {Word.close()};
    Word.starting = function () {Preimage.close()};

    // Create link to Sobj object
    var link = document.createElement("div");
    link.innerHTML = '<a href="/sage_obj/'+id+'.sobj">Download sage object</a>';
    link.setAttribute("class","options");
    link.style.display = "block";
    link.style.margin = "5px"; 
    options.appendChild(link);
    return  {"Body":div,"Option":options,"Documentation":eggBoxDoc};  
}

function sendWordImage(word,target,id)
{
    s = "inputtype=Words&Request=WordImage&format=Json&description="+word+"&MonoidId="+id;
    SendAjaxRequest(s,target);
}
function sendPreimageRequest(words,Canvas,id)
{
    if (Canvas.children.length == 2){
        Canvas.children[1].remove();
    }
    s = "inputtype=Words&Request=WordsPreImage&format=Image&description="+words+"&MonoidId="+id;
    SendAjaxRequest(s,Canvas);
}

function WordTool(EggBox,id)
{
    var Canvas = NewCanvas();
    Canvas.style.position = "absolute";
    Canvas.style.float = "right";
    Canvas["EggBox"] = EggBox;
    Canvas["id"] = id;
    var word = document.createElement("div");
    word.style.margin = "10px";
    Canvas.setElement({"Body":word});
    var wordinput = document.createElement("div");
    wordinput.style.display="inline-block";
    word.appendChild(wordinput);
    wordinput.innerHTML = "Input Word:";
    var holder = document.createElement("div");
    wordinput.appendChild(holder);
    var text = document.createElement("textarea");
    text.setAttribute("rows","1");
    text.setAttribute("cols","30");
    text.setAttribute("id",'word'+id);
    holder.appendChild(text);

    var wordoutput = document.createElement("div");
    wordoutput.style.display="inline-block";
    wordoutput.style.height = "37px";
    wordoutput.style.verticalAlign = "top";
    wordoutput.setAttribute("id",'wordoutput'+id);
    wordoutput.innerHTML = 'Word image:';
    var holder = document.createElement("div");
    holder.setElement = function(Element)
    {
        this.innerHTML = "";
        this.appendChild(Element);
    }
    wordoutput.appendChild(holder);
    text.addEventListener("keyup", function () {
        sendWordImage(this.value,holder,id);        
        });   
    word.appendChild(wordoutput);
    wordoutput.style.margin = "10px";  
    holder.AjaxFinished = 
    function (){
        try
        {
            toggleselect(holder.SelectedElement);
        }
        catch (e){}
        var error = holder.children[0]["error"];
        if (!error){ 
            var u = holder.children[0].innerHTML; 
            var element = document.getElementById(id+u);
            toggleselect(element);
            holder.SelectedElement = element;                                       
        }
        else{
            holder.SelectedElement = "null";
        }
    };
    Canvas.finishing = function() {
        try
        {
            toggleselect(holder.SelectedElement);
        }
        catch(e){}
        holder.remove();
    };
    return Canvas;

}
function PreimageTool(EggBox,id)
{
    var Canvas = NewCanvas();
    Canvas.style.position = "absolute";
    Canvas.style.float = "right";

    Canvas.AjaxFinished = function () {};
    var preimage = document.createElement("div");
    var holder = document.createElement("div");
    var SelectedElements = []
    preimage.appendChild(holder);
    preimage["SelectedElement"] = SelectedElements;        
    Elements = EggBox["Elements"];
    holder.draw = function () 
    {
        var s = "";           
        for	(index = 0; index < SelectedElements.length; index++)
        {
              s += SelectedElements[index].innerHTML+",";
        }
        
        this.innerHTML = s.substr(0,s.length-1);
        sendPreimageRequest(holder.innerHTML,Canvas,id) 
    }
    
    for	(index = 0; index < Elements.length; index++) {
        Element = Elements[index];
        Element.oldclick = Element.onclick;
        Element.onclick = function ()
        {
            if (SelectedElements.indexOf(this) == -1)
            {
                toggleselect(this);
                SelectedElements.push(this);            
            }
            else
            {
                toggleselect(this);
                SelectedElements.splice(SelectedElements.indexOf(this),1);
            }            
            holder.draw();               
        };
    }
    preimage.finishing = function() {
        for (var i=0;i<SelectedElements.length ;i++)
        {
            toggleselect(SelectedElements[i]);
        }
        for	(index = 0; index < Elements.length; index++) 
        {
            Elements[index].onclick = Elements[index].oldclick ;
        }
        Canvas.remove();
     };
    sendPreimageRequest("",Canvas,id)
    preimage.onremove = function(){ premimage.finishing();};    
    return preimage;
}

function newOptionMenu(Action,ButtonText)
{
    var Option = document.createElement("div");

    Option.style.display="block";
    Option.style.marginTop="30px";
    Option.style.marginBottom="30px";

    Option.style.verticalAlign="top";

    var Header = document.createElement("div");
    Option.appendChild(Header);
    
    var Button = document.createElement("input");
    Option["Button"] = Button;
    var postButtontxt = document.createTextNode("");
    Header.appendChild(Button);   
    Header.appendChild(postButtontxt);
    Button["active"] = true;
    Option.starting = function () {};
    Option.finishing = function () {};
    Button.onclick = function(){ 
        if (Button["active"])
        {
            Header.style.padding="5px";
        
            Button["active"] = false;
            Button.value = "x";
            
            postButtontxt.data = "  "+ButtonText;
            Menu = Action(); 
            Option.starting();
            Option["Menu"] = Menu;

        }
        else
        {
            Header.style.padding= "";

            Button["active"] = true;
            Button.value = ButtonText;
            postButtontxt.data = "";
            Option["Menu"].finishing();
            Option["Menu"].remove();
            Option.finishing();
        }
    };
    Option.close = function(){
        if (!Button["active"])
        {
            Button.onclick();
        }
    };
    Button.setAttribute("value",ButtonText);
    Button.setAttribute("type","submit");
    Option.setAttribute("class","options");
    return Option;
}
