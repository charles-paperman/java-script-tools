var LogicList = 
{
    "Forall":      {display: "∀", arity: 1, order:"FO", style: "prefix", type: "Quantifiers", transtype:["Exists","ExistsOne","Forall","FreeVariables"]},
    "Exists":      {display: "∃", arity: 1, order:"FO", style: "prefix", type: "Quantifiers", transtype:["Exists","ExistsOne","Forall","FreeVariables"]},
    "ExistsOne":   {display: "∃!", arity: 1, order:"FO",  style: "prefix", type: "Quantifiers",transtype:["Exists","ExistsOne","Forall","FreeVariables"]},
    "ForallSet":   {display: "∀²", arity: 1, order:"MSO",  style: "prefix", type: "Quantifiers",transtype:["ExistsSet","ForallSet","FreeSetVariables"]},
    "ExistsSet":   {display: "∃²", arity: 1, order:"MSO",  style: "prefix", type: "Quantifiers",transtype:["ExistsSet","ForallSet","FreeSetVariables"]},
    "FreeVariables":   {display: "FV", arity: 1, order:"FO",  style: "prefix", type: "Quantifiers",transtype:["Exists","Forall","ExistsOne","FreeVariables"]},    
    "FreeSetVariables":   {display: "FV²", arity: 1, order:"MSO",  style: "prefix", type: "Quantifiers",transtype:["ExistsSet","ForallSet","FreeSetVariables"]},    
    "And":         {display: "∧", arity: -1, order: "", variable: false,  style: "infix", type: "Connectives",transtype:["Or","And"]},
    "Or":          {display: "∨", arity : -1, order: "", variable: false,  style: "infix", type: "Connectives",transtype:["And","Or"]},
    "Not":         {display: "¬", arity : 1, order:"", variable: false, style: "prefix", type: "Connectives"},
    "Implies":     {display: "→", arity : 2, order:"", variable: false, style: "infix", type: "Connectives",transtype:["Iff","Implies"]},
    "Iff":     {display: "↔", arity : 2, order:"", variable: false, style: "infix", type: "Connectives",transtype:["Implies","Iff"]},
    "Letters":     {display: "Letters", arity: 1, order:"FO", type: "Predicates"},
    "Order":     {display: "Order", arity: 1, order:"FO", type: "Predicates"},
    "In":     {display: "In", arity: 1, order:"both", type: "Predicates"},
    "Set":     {display: "Set", arity: 1, order:"MSO", type: "Predicates"}
}  
var Operations =
{
"⊆":"Subset",
"⊂":"StrictSubset",
"=":"Equal",
"≠":"NotEqual",
"∈":"In",
"∉":"NotIn",
"<":"StrictlyLess",
"=":"Equal",
"≥":"GreaterThan",
"≡":"EquivalentTo"
}




function getFormula()
{
    var res = canvas.f.getClean();
   result.innerHTML = JSON.stringify(res);
}

function new_formula(parent)
{
    var formula = {}
    var holder = new_formula_holder(formula);
    formula.firstOrderVariables = [];
    formula.secondOrderVariables = [];
    formula.subFormulas = [];
    formula.unactiveSubFormula = [];      
    formula.parentFormula = parent;     
    formula.type = "empty";
    formula.appendTo = 
    function (canvas)
    {
        canvas.appendChild(this.holder);
        formula.canvas = canvas;
    };
    formula.reset = function()
    {
        var oldHolder = this.holder;
        var parent = oldHolder.parentElement;
        var holder = new_formula_holder(this); 
        this.firstOrderVariables = [];
        this.secondOrderVariables = [];
        this.subFormulas = [];
        this.unactiveSubFormula = [];      
        this.type = "empty";
        this.holder = holder;
        parent.insertBefore(holder,oldHolder)
        holder.style.marginTop = oldHolder.style.marginTop;
        oldHolder.remove();
    }
    if (parent != null)
    {
        parent.subFormulas.push(formula)
        formula.appendTo(parent.holder.body);        
    } 

    formula.oncreate = function (){};    
    formula.onselected = function (){};
    formula.getTopVariables = function ()
    {
        if (this.parentFormula != null)
        {
            var parentsVariables = this.parentFormula.getTopVariables();
            var variables =  {"FO":this.firstOrderVariables.concat(parentsVariables["FO"]), "MSO":this.secondOrderVariables.concat(parentsVariables["MSO"])};
        }
        else
        {
            var variables = {"FO":this.firstOrderVariables, "MSO":this.secondOrderVariables};            
        }    
        return variables
    }    
    formula.getVariables = function ()
    {
        var variables =  {"FO":[], "MSO":[]};
        if (this.subFormulas.length > 0)
        {    
            for (var l in this.subFormulas)
            {
                var botvariables = this.subFormulas[l].getVariables();
                variables = {"FO":variables["FO"].concat(botvariables["FO"]), "MSO":variables["MSO"].concat(botvariables["MSO"])};            
            }
        }
        else
        {
            variables = this.getTopVariables();
        }
        return variables
    };    
    formula.switchHolder = function (newHolder)
    {
        this.holder.parentNode.insertBefore(newHolder,this.holder);
        margTop = this.holder.style.marginTop; 
        margLeft = this.holder.style.marginLeft; 

        this.holder.remove();
        this.holder = newHolder;
        this.holder.style.marginTop = margTop;
        this.holder.style.marginLeft = margLeft;

        newHolder.formula = this;
        this.holder.oncreate();
    };
    formula.getValue = function (){};
    formula.getClean = function ()
    {
        if (this.holder.type == "empty")
        {
            return {"type":"empty"};
        }
        else
        {
            var f = this.getValue();
            if (f.type != "Predicates")
            {
                f.subFormulas = [];
                for (var l in this.subFormulas)
                {
                    g = this.subFormulas[l].getClean();
                    if (g.type != "empty")
                    {
                        f.subFormulas.push(g);
                    }
                }
            }
            return f;
        }
        
    };
    
    formula.setFromObj = function(Obj) 
    {        
    }; 
    return formula;    
}

function new_variable(formula,order,label)
{
    var Variable = {};
    Variable.formula = formula;
    var takenVariables = formula.getVariables()[order];
    var takenVariablesName = []
    for (l in takenVariables)
    {
        takenVariablesName.push(takenVariables[l].label);
    }
    count = 0;
    while (takenVariablesName.indexOf(label+count.toString()) != -1)
    {
        count += 1;        
    }
    label = label+count.toString()
    Variable.label = label;
    Variable.order = order;
    if (order == "FO")
    {
        formula.firstOrderVariables.push(Variable);        
    }
    if (order == "MSO")
    {
        formula.secondOrderVariables.push(Variable);        
    }

    Variable.holder = verticalSlideMenu();
    //Variable.holder.innerHTML = label;    
    Variable.holder.chooseLabel(label);
    Variable.holder.setAttribute("class","");
    Variable.holder.style.float = "left";
    Variable.holder.style.backgroundColor = "white";
    Variable.holder.style.paddingLeft = "5px";
    Variable.holder.style.paddingRight = "5px";

    Variable.holder.style.verticalAlign = "top";
    Variable.holder.style.marginLeft = "5px";

    Variable.holder.label.setAttribute("contenteditable","true");
    Variable.holder.Variable = Variable;   
    dB = Variable.holder.addChoice("✖",function(){});
    dB.setAttribute("title","Delete variable");
    dB.holder = Variable.holder;
    dB.action = function()
    {
        this.holder.Variable.remove();
        this.holder.remove();
    }
    Variable.onremove = function (){};
    Variable.remove = function (){
        if (this.order = "FO")
        {
            array = this.formula.firstOrderVariables;
        }
        else
        {
            array = this.formula.secondOrderVariables;
        }
        for (l in this.toUpdate)
        {
            this.toUpdate[l].slideMenu.style.color = "red";
            this.toUpdate[l].set = false;

        }
        array.splice(array.indexOf(this),1);
    };
    Variable.onkeyup = function () {};
    Variable.toUpdate = [];
    Variable.holder.style.textAlign = "center";
    Variable.holder.label.onkeyup = function() 
    {
        var Variable = this.slideMenu.Variable;
        Variable.label = this.innerHTML;
        for (var x in Variable.toUpdate)
        {
            Variable.toUpdate[x].innerHTML = this.innerHTML;             
        }
        Variable.onkeyup();
    }

    return Variable;
}
function new_formula_holder(formula)
{
    var holder = document.createElement("div");
    holder.setAttribute("class","formula");
    holder.innerHTML = "+";
    formula.holder = holder;
    holder.formula = formula;
    holder.type  = "empty";
    holder.onclick = 
    function (){
        this.innerHTML = "";
        this.setAttribute("class","");
        this.style.display = "inline-block";
        this.onclick = function() {};        
        var choice_list = formula_select(this.formula.getVariables()["FO"],this.formula.getVariables()["MSO"]);        
        this.appendChild(choice_list);
        choice_list.holder = holder;
        this.formula.oncreate();
    }
    return holder;
} 
function formula_select(FOvariables,MSOvariables)
{
   var div = document.createElement("div");
   div.type = "empty";
   var menu = {};
   var displaypredicate = false;
   for (i in LogicList)
   {
        type = LogicList[i].type;
        symb = LogicList[i].display;
        if (menu[type] == undefined)
        {
            menu[type] = verticalSlideMenu();
            menu[type].style.verticalAlign = "top";
            menu[type].style.backgroundColor = "white";
            menu[type].style.margin = "2px";
            menu[type].style.padding = "10px";
            menu[type].style.border = "solid 1px";            
            menu[type].chooseLabel(type);
            div.appendChild(menu[type]);
            menu[type].holder = div;
        }
        if (type != "Predicates")
        {
            choice = menu[type].addChoice(symb,function () {});
            choice.value = i;
            
            choice.action = function ()
            { 
                this.slideMenu.holder.holder.formula.switchHolder(DisplayFormula(this.value,LogicList[this.value]));
                this.slideMenu.holder.holder.formula.onselected();
                this.slideMenu.holder.remove();    
            };     
        }
        else
        {   
            if (FOvariables.length != 0 && LogicList[i].order == "FO") 
            {
                displaypredicate = true;
                menu[type].addChoice(i,function () { 
                    this.slideMenu.holder.holder.formula.switchHolder(DisplayPredicate(this.label,LogicList[this.label]));
                    this.slideMenu.holder.holder.formula.onselected();
                    this.slideMenu.holder.remove();                    
                    });             
            }
            if (MSOvariables.length != 0 && LogicList[i].order == "MSO") 
            {
                displaypredicate = true;
                menu[type].addChoice(i,function () { 
                    this.slideMenu.holder.holder.formula.switchHolder(DisplayPredicate(this.label,LogicList[this.label]));
                    this.slideMenu.holder.holder.formula.onselected();
                    this.slideMenu.holder.remove();                    
                    });             
            }
            if (FOvariables.length*MSOvariables.length != 0 && LogicList[i].order == "both")  
            {
                displaypredicate = true;
                menu[type].addChoice(i,function () { 
                    this.slideMenu.holder.holder.formula.switchHolder(DisplayPredicate(this.label,LogicList[this.label]));
                    this.slideMenu.holder.holder.formula.onselected();
                    this.slideMenu.holder.remove();                    
                    });             
            }

        }
    }
   if (!displaypredicate)
   {
        menu["Predicates"].remove();
   }
   return div;
}

function DisplayFormula(name_label,Obj){
    if (Obj.type == "Connectives")
        return DisplayConnective(name_label,Obj);
    else
        return DisplayQuantifier(name_label,Obj);        
}
function DisplayQuantifier(name_label,Obj)
{
    var div = document.createElement("div");
    div.style.display = "inline-block";
    var head = horizontalSlideMenu(100,20);
    head.onmouseenter();    
    head.style.margin = "";
 //    head.style.height = "20px";
    head.style.backgroundColor = "white";
    head.style.border = "solid 1px";
    head.style.padding = "5px";
    
    var body = document.createElement("div");
    body.style.display = "block";
    body.style.borderLeft = "solid 1px";
    body.style.padding = "15px";
    body.style.backgroundColor = "#F2F3F4";
    div.appendChild(head); 
    div.appendChild(body);
    head.holder = div;
    body.holder = div;
    div.head = head;
    div.body = body;
    div.Obj = Obj; 
    div.value = name_label;
    div.headUpdate = function () 
    {
        div.head.style.width = (div.head.clientWidth).toString()+"px";
        div.head.sizeI = div.variables.clientWidth+20;               
    }
    div.variables = document.createElement("div");
    div.variables.style.display = "inline-block";
    div.variablesList = [];
    div.addVariable = function ()    
    {
        if (this.Obj.order == "FO")
        {
            varname = "x";
        }
        else
        {
            varname = "S";
        }
        var newVariable = new_variable(this.formula,this.Obj.order,varname);        
        this.variablesList.push(newVariable);
        newVariable.onkeyup = function ()
        {
            this.holder.holder.headUpdate();
        }
        newVariable.onremove = function ()
        {
            this.holder.holder.headUpdate();      
        }
        newVariable.holder.holder = this;
        this.variables.insertBefore(newVariable.holder,this.addVariableButton)
        this.headUpdate();
    };
    var addVariableButton = document.createElement("div");
    addVariableButton.innerHTML = "+";
    addVariableButton.style.marginLeft = "5px";
    addVariableButton.style.float = "left";
    addVariableButton.holder = div;
    addVariableButton.setAttribute("title","add a new variable");
    addVariableButton.onmouseenter = function()
    {
        this.style.backgroundColor = "lightgreen";
    }
    addVariableButton.onmouseleave = function()
    {
        this.style.backgroundColor = "";
    }

    div.addVariableButton = addVariableButton; 
    addVariableButton.onclick = function ()
    {
        this.holder.addVariable();
    }
    div.variables.appendChild(addVariableButton); 
    transtype = verticalSlideMenu();
//    transtype.setAttribute("class","");
//    transtype.style.float = "left"; 
    transtype.style.display = "inline-block";
    transtype.style.backgroundColor = "white";
//    transtype.style.paddingLeft = "15px";
//    transtype.style.paddingRight = "15px";
    transtype.chooseLabel(Obj.display);
    head.insertBefore(transtype,head.label);
    head.chooseLabel("");
    head.label.remove();
    head.label = transtype;
    for (l in Obj.transtype)
    {
        key = Obj.transtype[l]
        var choice = transtype.addChoice(LogicList[key].display,function(){});
        choice.value = key;
        choice.formulaBody = div;
        choice.action = function ()
        {
            this.formulaBody.Obj = LogicList[this.value];
            this.formulaBody.value = this.value;
            this.slideMenu.chooseLabel(LogicList[this.value].display);
        };
    }    
    head.label.chooseLabel(div.Obj.display); 
    head.appendChild(div.variables)
    closeChoice = head.addChoice("",function(){});
    reduceChoice = head.addChoice("",function(){});
    close = deleteButton();
    closeChoice.appendChild(close);
    close.setAttribute("title","Delete this formula");
    div.close = close;
    reduce = reduceButton();
    reduceChoice.appendChild(reduce);
    reduce.holder = div ;
    
    div.isBodyToggled = true;
    reduce.toggleAction = function()
    {
        this.holder.toggleBody();
    }

    div.toggleBody = function () 
    {
        if (this.isBodyToggled)
        {
            this.body.style.display = "none";
        }
        else
        {
            this.body.style.display = "block";
        }
        this.isBodyToggled = !this.isBodyToggled;
    }
    div.reduce = reduce;
    div.oncreate = function ()
    {
        this.addVariable();    
        var f = new_formula(this.formula);
//        f.holder.style.marginLeft = "40px";
        this.close.formula = this.formula;
        this.close.action = function () {         
            this.formula.reset();
        }; 
        this.formula.getValue = function ()
        {
            var f = {};
            f.value = this.holder.value;
            f.variables = [];
            if (this.holder.Obj.order == "FO")
            {
                for (var x in this.firstOrderVariables){
                    f.variables.push(this.firstOrderVariables[x].label);
                }
            }
            else
            {
                for (var x in this.secondOrderVariables){
                    f.variables.push(this.secondOrderVariables[x].label);
                }
            }
            return f;
        }
    }
    return div;
}
function DisplayConnective(name_label,Obj)
{
    var div = document.createElement("div");
    div.style.display = "inline-block";
    var head = horizontalSlideMenu(30,60);
    head.style.padding = "5px";
    head.style.margin = "0";
    head.chooseLabel("");
    head.style.backgroundColor = "white";   
    head.style.border = "solid 1px";
    var body = document.createElement("div");
    body.style.display = "block";
    body.style.backgroundColor = "#FFFFCC";
    
    body.style.borderLeft = "solid 1px";
    body.style.borderRight = "solid 1px";
    body.style.borderTop = "solid 1px";
    body.style.padding = "10px";
    div.appendChild(head); 
    div.appendChild(body);
    head.holder = div;
    body.holder = div;
    div.head = head;
    div.body = body;
    div.Obj = Obj; 
    div.value = name_label;
    div.addSymbol = function ()
    {
        symb = document.createElement("div");
        symb.style.display = "inline-block";
        symb.innerHTML = this.Obj.display;
        symb.style.border = "solid 1px";
        symb.style.padding = "7px";
        symb.formulaHolder = this;
        symb.style.backgroundColor = "white";
        symb.style.margin = '10px';
        this.body.appendChild(symb); 
        this.symbolList.push(symb);
        return symb;   
    };
    head.transtype = verticalSlideMenu();
    head.transtype.style.float = "left";
    head.transtype.style.paddingLeft = "5px";
    head.transtype.style.paddingRight = "5px";
    head.transtype.style.backgroundColor = "white";

    head.transtype.formulaBody = div;
    head.transtype.onStartActive = function()
    {
        for (l in this.formulaBody.symbolList)
        {
            symb = this.formulaBody.symbolList[l]; 
            symb.style.backgroundColor = "lightgreen";
        }
    }
    head.transtype.onEndActive = function()
    {
        for (l in this.formulaBody.symbolList)
        {
            
            symb = this.formulaBody.symbolList[l];
            symb.style.backgroundColor = "white";
        }
    }
    for (l in Obj.transtype)
    {
        key = Obj.transtype[l]
        var choice = head.transtype.addChoice(LogicList[key].display,function(){});
        choice.value = key;
        choice.formulaBody = div;
        choice.action = function ()
        {
            this.formulaBody.Obj = LogicList[this.value];
            this.formulaBody.head.transtype.chooseLabel(LogicList[this.value].display);
            this.formulaBody.value = this.value;
            for (l in this.formulaBody.symbolList)
            {
                var symb = this.formulaBody.symbolList[l];
                symb.innerHTML = LogicList[this.value].display;                    
            }
        };

    }

    head.insertBefore(head.transtype,head.label);    
    head.transtype.chooseLabel(div.Obj.display); 
    head.transtype.setAttribute("class","");
    closeChoice = head.addChoice("",function(){});
    reduceChoice = head.addChoice("",function(){});
    close = deleteButton();
    closeChoice.appendChild(close);
    close.setAttribute("title","Delete this formula");
    div.close = close;
    reduce = reduceButton();
    reduceChoice.appendChild(reduce);
    div.reduce = reduce;
    reduce.holder = div;
    reduce.toggleAction = function()
    {
        this.holder.toggleBody();
    }
    
    div.isHeadToggled = true;
    div.symbolList = []
    div.toggleHead = function () 
    {
        if (this.isHeadToggled)
        {
            this.head.style.display = "none";
        }
        else
        {
            this.head.style.display = "inline-block";
        }
        this.isHeadToggled = !this.isHeadToggled;
    }
    div.isBodyToggled = true;
    div.toggleBody = function () 
    {
        if (this.isBodyToggled)
        {
            this.body.style.display = "none";
        }
        else
        {
            this.body.style.display = "block";
        }
        this.isBodyToggled = !this.isBodyToggled;
    }

    div.addFormula = function()
    {
         this.addSymbol();
         var f = new_formula(this.formula); 
         f.holder.style.marginTop = "30px";
         f.parentHolder = this;
         f.onselected = function()
         {
            this.parentHolder.addFormula();
         }           
    }
    div.oncreate = function ()
    {
        if (this.Obj.arity == 1)
        {
            //this.addSymbol();
            new_formula(this.formula);            
        }
        if (this.Obj.arity == 2)
        {
            var f = new_formula(this.formula);            
            this.addSymbol();
            var g = new_formula(this.formula);            
            f.holder.style.marginTop = "30px";            
            g.holder.style.marginTop = "30px";            

        }

        if (this.Obj.arity == -1)
        {
            var f = new_formula(this.formula);
            f.holder.style.marginTop = "30px";            
            this.addFormula();
            
        }

        this.close.formula = this.formula;
        this.formula.getValue = function ()
        {
            var f = {};
            f.value = this.holder.value;
            return f;
        }

        this.close.action = function () {         
        this.formula.reset();
        }; 
    }
    return div;
}
function DisplayPredicate(predicate_name,Obj){
    var div = document.createElement("div");
    div.style.display = "inline-block";
    div.style.padding = "5px";
    div.style.margin = "5px";
    div.otherValues = function(){};
    
    if (predicate_name == "Letters")
    {
        letterPredicate(div);
    }
    if (predicate_name == "Order")
    {
        orderPredicate(div);
    }
    if (predicate_name == "Set")
    {
        setPredicate(div);
    }
    if (predicate_name == "In")
    {
        InPredicate(div);
    }

    div.oncreate = function () {
        this.formula.holder = this;        
        this.formula.getValue = function ()
        {
            var f = {}
            f.value = this.holder.value;
            f.variables = {}
            for (var x in this.holder.variables)
            {
                var variable = this.holder.variables[x]
                if (variable.set)
                {
                    f.variables[x] = variable.label.innerHTML;
                }
                else
                {
                    f.variables[x] = false;
                }
            }
            this.holder.otherValues(f);
            return f;
        }
    };

    div.style.backgroundColor = "#d0f0d0";
    var close = document.createElement("div");
    close.style.display = "inline-block";
    close.style.marginLeft = "10px";

    close.style.verticalAlign = "top";
    close.innerHTML = "✖";
    close.holder = div;
    close.onclick = function ()     
    {
        this.holder.formula.reset();
    }
    div.appendChild(close);

    return div;
}
function letterPredicate(div)
{
    div.value = "Letters";
    var word = document.createElement("div");
    word.setAttribute("contenteditable",true);
    word.innerHTML = "word";
    word.style.color = "red";
    word.style.paddingLeft = "5px";
    word.style.paddingRight = "5px";
    word.style.border = "solid 1px";
    word.style.display = 'inline-block';
    word.onclick = function (){
        this.innerHTML = "";
        this.onclick = function (){};
        this.style.color = "green";
        this.wordset = true;
    }
    div.appendChild(word);
    div.word = word;
    var at = document.createElement("div");
    at.innerHTML = "@";
    at.style.display = 'inline-block';
    at.style.marginLeft = "10px";
    div.appendChild(at);
    newVariablesList(div,"FO","variable");
    div.otherValues = function(f)
    {
        if (this.word.wordset)
        {
           f.word = this.word.innerHTML;
        }
        else
        {
           f.word = false;;
        }
    }
}


function orderPredicate(div)
{
    
    div.value = "Order";
    newVariablesList(div,"FO","variable1")
    var operation = verticalSlideMenu();
    operation.chooseLabel("<");
    operation.setAttribute("class","");
    operation.style.display = "inline-block";
    operation.label.style.paddingLeft = "5px";
    operation.label.style.paddingRight = "5px";
    operation.div = div;    
    operation.addChoice("<", function(){  this.slideMenu.chooseLabel("<")});
    operation.addChoice("=", function(){  this.slideMenu.chooseLabel("=")});
    operation.addChoice("≥", function(){  this.slideMenu.chooseLabel("≥")});
    operation.addChoice("≠", function(){  this.slideMenu.chooseLabel("≠")});
    
    div.appendChild(operation);
    operation.style.verticalAlign = "top";
    div.operation = operation
    newVariablesList(div,"FO","variable2")         
    div.otherValues = function(f)
    {
        f.operation = this.operation.label.innerHTML;                     
    }

}


function setPredicate(div)
{
    div.value = "Set";
    newVariablesList(div, "MSO", "variable1")            
    var operation = verticalSlideMenu();
    operation.chooseLabel("⊆");
    operation.setAttribute("class","");
    operation.style.display = "inline-block";
    operation.label.style.paddingLeft = "5px";
    operation.label.style.paddingRight = "5px";
    operation.addChoice("⊆", function(){ this.slideMenu.chooseLabel("⊆")});
    operation.addChoice("⊂", function(){ this.slideMenu.chooseLabel("⊂")});
    operation.addChoice("=", function(){ this.slideMenu.chooseLabel("=")});
    operation.addChoice("≠", function(){ this.slideMenu.chooseLabel("≠")});
    div.appendChild(operation);
    newVariablesList(div, "MSO", "variable2");
    div.otherValues = function(f)
    {
        f.firstConstant= this.int1.value;
        f.secondConstant= this.int2.value;
        f.operation = Operations[operation.label.innerHTML];                     
    }
        
}
function InPredicate(div)
{
    div.value = "In";
    newVariablesList(div, "FO", "variable1")        
    
    var operation = verticalSlideMenu();
    operation.chooseLabel("∈");
    operation.setAttribute("class","");
    operation.style.display = "inline-block";
    operation.label.style.paddingLeft = "5px";
    operation.label.style.paddingRight = "5px";
    choice1 = operation.addChoice("∈", function(){ this.slideMenu.chooseLabel("∈")});
    choice2 = operation.addChoice("∉", function(){ this.slideMenu.chooseLabel("∉")});
    div.appendChild(operation);
    newVariablesList(div, "MSO", "variable2")        
    div.otherValues = function(f)
    {
        f.operation = Operations[operation.label.innerHTML];                     
    }
            
}


function newVariablesList(div, order, displayedid)
{
    var divvariable = verticalSlideMenu();
    divvariable.chooseLabel(displayedid);
    divvariable.displayedid = displayedid;
    divvariable.holder = div;
    divvariable.setAttribute("class","");
    divvariable.style.verticalAlign = "top";
    divvariable.style.display = "inline-block";
    divvariable.style.marginLeft = "5px";
    divvariable.style.color = "red";
    divvariable.set = false;
    divvariable.linkedvariable = null;
    divvariable.order = order;
    div.appendChild(divvariable);
    if (div.variables == undefined)
    {
        div.variables = {};
    }
    div.variables[displayedid] = divvariable; 
    
    divvariable.holder = div;
    divvariable.onStartActive = function()
    {
        this.holder.setvariables(this.displayedid); 
    }      
    div.setvariables = function (label) 
    {
        var ListVar = this.formula.getVariables()[this.variables[label].order];
        if (this.variables[label].order == "FO"){        
            ListVar.push({"label":"min","type":"constant"});
            ListVar.push({"label":"max","type":"constant"});
        }
        this.variables[label].variablesList = {};
        this.variables[label].removeAllChoices();
        for (x in ListVar)
        {
            this.variables[label].variablesList[ListVar[x].label] = ListVar[x];
            choice = this.variables[label].addChoice(ListVar[x].label,function (){});
            choice.holder = this.variables[label];
            choice.action = function ()
            {
                if (this.slideMenu.variablesList[this.label].type != "constant")
                {
                    if (this.slideMenu.linkedvariable != null)
                    {
                         this.slideMenu.linkedvariable.toUpdate.splice(this.slideMenu.label,1);
                    }
                    this.slideMenu.linkedvariable = this.slideMenu.variablesList[this.label];
                    this.slideMenu.linkedvariable.toUpdate.push(this.slideMenu.label);
                }
                this.slideMenu.style.color = "green";
                this.holder.set = true;
                this.slideMenu.chooseLabel(this.label);
            };
        }
    }

}
function removeLetter () 
{
    if (isNaN(this.innerHTML))
    {
        this.innerHTML = this.value.toString(); 
    }  
    else
    {
        this.value = parseInt(this.innerHTML);
    }
}

function numericPredicate(div)
{
    div.value = "Numeric";
    newVariablesList(div,"FO","variable1")
    var plus1 = document.createElement("div");
    div.appendChild(plus1);
    plus1.innerHTML = "+";
    plus1.style.marginLeft = "5px";
    plus1.style.marginRight = "5px";
    plus1.style.display = "inline-block";

    plus1.style.verticalAlign = "top";
    var int1 = document.createElement("div");
    div.appendChild(int1);
    int1.innerHTML = "0";
    int1.style.marginLeft = "5px";
    int1.style.marginRight = "5px";
    int1.style.display = "inline-block";
    int1.style.color = "green";
    int1.setAttribute("contenteditable",true);
    div.int1 = int1;
    
    var operation = verticalSlideMenu();
    operation.chooseLabel("<");
    operation.setAttribute("class","");
    operation.style.display = "inline-block";
    operation.label.style.paddingLeft = "5px";
    operation.label.style.paddingRight = "5px";
    
    operation.addChoice("<", function(){ this.slideMenu.div.unDisplayMod(); this.slideMenu.chooseLabel("<")});
    operation.addChoice("=", function(){ this.slideMenu.div.unDisplayMod(); this.slideMenu.chooseLabel("=")});
    operation.addChoice("≥", function(){ this.slideMenu.div.unDisplayMod(); this.slideMenu.chooseLabel("≥")});
    operation.addChoice("≡", function(){ this.slideMenu.chooseLabel("≡"); this.slideMenu.div.displayMod();});
    operation.addChoice("≠", function(){ this.slideMenu.div.unDisplayMod(); this.slideMenu.chooseLabel("≠")});
    
    div.appendChild(operation);
    operation.style.verticalAlign = "top";

    newVariablesList(div,"FO","variable2")         
    var plus2 = document.createElement("div");
    div.appendChild(plus2);
    plus2.innerHTML = "+";
    plus2.style.marginLeft = "5px";
    plus2.style.marginRight = "5px"
    plus2.style.display = "inline-block";
    plus2.style.verticalAlign = "top";
    div.plus2 = plus2;
    var int2 = document.createElement("div");
    div.appendChild(int2);
    int2.setAttribute("contenteditable",true);
    int2.innerHTML = "0";
    int2.value = 0;
    int2.style.marginLeft = "5px";
    int2.style.marginRight = "5px";
    int2.style.display = "inline-block";
    int2.style.color = "green";
    div.int2 = int2;
    div.displayMod = function ()
    {
        this.mod.style.display = "inline-block";
        this.variables["variable2"].style.display = "none";
        this.plus2.style.display = "none";
    }
    div.unDisplayMod = function ()
    {
        this.mod.style.display = "none";
        this.variables["variable2"].style.display = "inline-block";
        this.plus2.style.display = "inline-block";
    }

    var mod = document.createElement("div");
    div.appendChild(mod);
    div.mod = mod;
    operation.div = div;
    var modleft = document.createElement("div");
    mod.appendChild(modleft);
    modleft.innerHTML = "( mod"    
    var int3 = document.createElement("div");
    mod.appendChild(int3);
    mod.int = int3;
    int3.setAttribute("contenteditable",true);
    int3.innerHTML = "2";
    int3.value = 0;
    int3.style.marginLeft = "5px";
    int3.style.marginRight = "5px";

    int3.style.display = "inline-block";
    int3.style.color = "green";
    var modright = document.createElement("div");
    mod.appendChild(modright);
    modright.innerHTML = ")"    
    modright.style.display = "inline-block";
    modleft.style.display = "inline-block";
    mod.style.display = "none";
    mod.style.verticalAlign = "top";

    int1.onkeyup = removeLetter;
    int2.onkeyup = removeLetter;
    int3.onkeyup = removeLetter;
    div.otherValues = function(f)
    {
        f.firstConstant= this.int1.value;
        f.secondConstant= this.int2.value;
        f.thirdConstant= this.int2.value;
        f.operation = Operations[operation.label.innerHTML];                     
    };

}
