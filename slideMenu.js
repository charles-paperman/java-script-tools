
function verticalSlideMenu()
{
    var slideMenu = document.createElement("div");
    slideMenu.setAttribute("class","slideHolder");
    slideMenu.style.transition = "height 0.25s";    
    slideMenu.style.height = "20px";      
    slideMenu.expandFactor = "20";
    slideMenu.onStartActive = function (){};
    slideMenu.onEndActive = function (){};    

    var label = document.createElement("div");
    slideMenu.appendChild(label);
    slideMenu.label = label;
    label.slideMenu = slideMenu;
    slideMenu.hideLabel = function(){
        this.label.style.display = "none";
    };
    slideMenu.showLabel = function(){
        this.label.style.display = "";
    };
    slideMenu.choices = [];
    slideMenu.chooseLabel = function(label)
    {
        slideMenu.label.innerHTML = label;
    }
    slideMenu.addChoice = function(label,action){        
        var choice = document.createElement("div");
        choice.innerHTML = label;
        choice.label = label;
        choice.setAttribute("class","slideChoice");
        choice.style.display = "none";
        choice.style.height = "20px";
        choice.slideMenu = this;
        choice.action = action;
        choice.onclick = function ()
        {
            this.action();
            this.slideMenu.closeMenu();
        }
        this.appendChild(choice);   
        this.choices.push(choice);        
        return choice;        
    };    
    slideMenu.removeChoice = function(choice){        
        this.choices.splice(choice,1);
        choice.remove();           
    };    
    slideMenu.removeAllChoices = function(){        
        for (var x in this.choices)
        {
            this.choices[x].remove();
        }
        this.choices = []

    };    

    slideMenu.displayChoices = function()
    {
        this.removeEventListener("transitionend",this.displayChoices);      
        for (var i in this.choices)
        {
            this.choices[i].style.display = "block";
        }
    };
    slideMenu.hideChoices = function()
    {
        for (var i in this.choices)
        {
            this.choices[i].style.display = "none";
        }
        this.showLabel();
    };
    slideMenu.onmouseenter = function()
    {
        this.onStartActive();
        this.style.height = ((this.choices.length+1)*this.expandFactor).toString()+"px";
        this.addEventListener("transitionend",this.displayChoices);      
    };
    slideMenu.onmouseleave = function()
    {
        this.onEndActive();
        this.removeEventListener("transitionend",this.displayChoices);      
        this.style.height = "20px";
        this.hideChoices();                              
    };
    slideMenu.appendTo = function (element)
    {
        element.appendChild(this);
    }
    slideMenu.closeMenu = function(element)
    {
        this.onEndActive();
        this.onmouseenterOld = this.onmouseenter; 
        this.onmouseleaveOld = this.onmouseleave;
        this.onmouseenter = function () {};
        this.onmouseleave = function () {};
        this.removeEventListener("transitionend",this.displayChoices);      
        this.hideChoices();                              
        this.style.height = "20px";
        this.addEventListener("transitionend",function() 
            { 
            this.onmouseenter = this.onmouseenterOld; 
            this.onmouseleave = this.onmouseleaveOld;
            });      
        
    }
    return slideMenu;
}


function horizontalSlideMenu(sizeI,sizeA)
{
    var slideMenu = document.createElement("div");
    slideMenu.setAttribute("class","slideHolder");
    slideMenu.style.transition = "width 0.25s";    
//  slideMenu.style.height = "20px";
    slideMenu.style.width = (sizeI).toString()+"px";
    slideMenu.sizeI = sizeI; 
    slideMenu.sizeA = sizeA;      
    slideMenu.onStartActive = function (){};
    slideMenu.onEndActive = function (){};    
    var label = document.createElement("div");
    slideMenu.appendChild(label);
    label.style.display = "inline-block";
    label.style.textAlign = "center";
    slideMenu.label = label;
    slideMenu.hideLabel = function(){
        this.label.style.display = "none";
    };
    slideMenu.showLabel = function(){
        this.label.style.display = "inline-block";
    };
    slideMenu.choices = [];
    slideMenu.closeOnClick = false;
    slideMenu.lock = false;
    slideMenu.chooseLabel = function(label)
    {
        slideMenu.label.innerHTML = label;
    }
    slideMenu.addChoice = function(label,action){        
        var choice = document.createElement("div");
        choice.innerHTML = label;
        choice.label = label;
        choice.setAttribute("class","slideChoice");
        choice.style.display = "none";
        choice.style.float = "right";
        choice.style.height = "20px";
        choice.style.verticalAlign = "top";
        choice.style.paddingLeft = "5px";        
        choice.style.paddingRight = "5px";
        choice.slideMenu = this;
        choice.action = action;
        choice.onclick = function ()
        {
            this.action();
            if (this.slideMenu.closeOnClick)
            {
                this.slideMenu.closeMenu();
            }
        }
        this.appendChild(choice);   
        this.choices.push(choice);        
        return choice;
    };    
    slideMenu.removeChoice = function(choice){        
        this.choices.splice(choice,1);
        choice.remove();           
    };    
    slideMenu.displayChoices = function()
    {
        this.removeEventListener("transitionend",this.displayChoices);      
        for (var i in this.choices)
        {
            this.choices[i].style.display = "block";
        }
    };
    slideMenu.hideChoices = function()
    {
        for (var i in this.choices)
        {
            this.choices[i].style.display = "none";
        }
        this.showLabel();
    };
    slideMenu.onmouseenter = function()
    {
        this.onStartActive();
        this.style.width = (this.sizeI+(this.sizeA+5)*this.choices.length).toString()+"px";
        this.addEventListener("transitionend",this.displayChoices);      
    };
    slideMenu.onmouseleave = function()
    {
        this.onEndActive();
        this.removeEventListener("transitionend",this.displayChoices);      
        this.hideChoices();                              
        this.style.width = (this.sizeI).toString()+"px";
    };
    slideMenu.appendTo = function (element)
    {
        element.appendChild(this);
    }
    slideMenu.closeMenu = function(element)
    {
        this.onmouseenterOld = this.onmouseenter; 
        this.onmouseleaveOld = this.onmouseleave;
        this.onmouseenter = function () {};
        this.onmouseleave = function () {};
        this.removeEventListener("transitionend",this.displayChoices);      
        this.hideChoices();                              
        this.style.height = "20px";
        this.style.width = (this.sizeI).toString()+"px";

        this.addEventListener("transitionend",function() 
            { 
            this.onmouseenter = this.onmouseenterOld; 
            this.onmouseleave = this.onmouseleaveOld;
            });      
        
    }
    return slideMenu;
}
function deleteButton()
{
    var close = document.createElement("div");
    close.innerHTML = "✖";
    close.style.marginLeft = "auto";
    close.style.marginRight = "0";
    close.style.display = "inline-block";
    close.style.cursor = "pointer";

    close.onclick = function ()     
    {
        this.action();
    }
    return close;
}
function reduceButton()
{
    var reduce = document.createElement("div");
    
    reduce.innerHTML = "↥";
    reduce.style.marginLeft = "auto";
    reduce.style.marginRight = "0";
    reduce.style.display = "inline-block";

    reduce.toggle = function ()
    {
        if (this.innerHTML == "↥")
        {
            this.innerHTML = "↧";
            this.setAttribute("title","Unfold");
        }
        else
        {
            this.innerHTML = "↥";
            this.setAttribute("title","Fold");
        }
        this.toggleAction();
    } 
    reduce.onclick = function ()     
    {
        this.toggle();
    }
    return reduce;
}

