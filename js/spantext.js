/* <Span>Text - version 1.6.5
*
* May, 2017
*/

(function SpanText () {
"use strict";

// Function to create the internal Controller object. 
function Controller (id, lastsetting, initialsetting, L, R, direction, speed, min, max ) {
    this.id = id;
    this.lastsetting = lastsetting;
    this.initialsetting = initialsetting;
    this.attrL = L;
    this.attrR = R;
    this.direction = direction;
    this.speed = speed;
    this.min = min;
    this.max = max;
}

// Array to hold the sliders on any given page.
var Slider = [],

// internal constants
      right = 1,      
	  left = -1;
   
// Main loops to initialize spanText on a page with a controller. 
jQuery(document).ready(function () {   
  
  // Create the internal array of controllers. 
  var PageSliders = document.getElementsByClassName("spantextslider");
    
    // For every controller in the controller array
    for (var i=0, len=PageSliders.length; i<len ; i=i+1) {

    Slider[i] = new Controller(
        PageSliders[i].id, 
        Number(PageSliders[i].dataset.spantextinit), 
        Number(PageSliders[i].dataset.spantextinit), 
        PageSliders[i].dataset.spantextattrl, 
        PageSliders[i].dataset.spantextattrr,
        'horizontal', 
        Number(PageSliders[i].dataset.spantextspeed),
        Number(PageSliders[i].dataset.spantextmin),
        Number(PageSliders[i].dataset.spantextmax)
      );
  
      /* Initially hide or show all classes according to user-defined initial slider setting.
      * (Loops through 10 possible classes of every controller in the array)
      */

    var initialsetting = Slider[i].initialsetting;
      for (var j = Slider[i].min; j < Slider[i].max; j=j+1) {
    
      if (j < initialsetting) {
            jQuery("."+Slider[i].attrL+j).css('display','none');
      }

            else if (j > initialsetting) {
                jQuery("."+Slider[i].attrR+j).css('display','none'); 
              }

  }
  
  // For the input log, assign both initial and the latest setting to user-defined initial setting.  
  	    initialsetting = Slider[i].initialsetting;  
        Slider[i].lastsetting = initialsetting; 

     // Add noUiSlider event listener to every controller
      noUiSlider.create(document.getElementById(PageSliders[i].id), {
        start: Number(PageSliders[i].dataset.spantextinit), // Handle start position
        direction: 'ltr', // Put '0' at the bottom/left of the slider
        orientation: 'horizontal',
          range: { 
          'min': Number(PageSliders[i].dataset.spantextmin),
          'max': Number(PageSliders[i].dataset.spantextmax),
        },
      height: '500px',

       });
    
      document.getElementById(PageSliders[i].id).noUiSlider.on('change', UpdateSlider); 
   
      }
  
});
  

// Function to return the leftward or rightward classname of a level as specified. 
function GetAttr (slider, level, side) {   
	var classname;
    if (side == left) { classname = Slider[slider].attrL+level; }
    if (side == right) { classname = Slider[slider].attrR+level; }
    return classname;
}

// Function to locate the controller in the internal array based on its unique HTML ID.
function LocateController (ident) {
  for( var f=0, len=Slider.length; f < len; f=f+1) {
    if (Slider[f].id == ident) {return f;}   
  }
  return -1;  
}

// Main function called when sliders receive input :
function UpdateSlider(value, handle, something, somethingelse, thing, id) {

    // Locate the controller in the internal array by ID.
    var number = LocateController(id);

    // Round the slider's value down to an integer.
    var currentlevel = Math.floor(value);
  
    // Get the controller's last setting.
    var lastsetting = Slider[number].lastsetting;

    // If the slider hasn't changed, do nothing.
    if (currentlevel == lastsetting) {return;}
  
    // If slider increased, reveal rightward values and hide leftward values. 
    if ( lastsetting < currentlevel) {
       RemoveLevel (number, lastsetting, currentlevel, left);   
       RevealLevel (number, lastsetting, currentlevel, right);
    
  }
 
    //  If slider decreased, hide rightward values and reveal leftward values.
    else if ( lastsetting > currentlevel) {   
      RemoveLevel (number, lastsetting, currentlevel, right); 
     RevealLevel (number, lastsetting, currentlevel, left);
  }
}

/* Functions to increase or decrease counters according to user-defined number of characters at once,
*  accounting for any remainder, always ending up at a zero value.
*/

function increase(x, max, charactersatonce) {
    if ( (x+charactersatonce) < max) { return x + charactersatonce; } 
    else { return max; }
}

function decrease(x, charactersatonce) {
    if ( (x-charactersatonce) < 0) { return 0; } 
    else { return x - charactersatonce; }
}


/* Function to reveal one level of <span> classes gradually by character(s)
* (the main <span>Text special effect)
*/

function RevealLevel (slidernumber, fromlevel, tolevel, side) {

  var max = Slider[slidernumber].max;

    // Always start by revealing 1 less or more than the current level, since current level is already revealed.
    // Also increments/decrements the level being revealed every time the function calls itself.
    fromlevel = fromlevel + side;  

   // ... but never more than the max or less than 1. 
    if (fromlevel === 0) { fromlevel = 1;}
    if (fromlevel == max) { fromlevel = max-1;}
   
   // Get the <span> class name for this level.
    var classname = GetAttr(slidernumber, fromlevel, side);

  // Calculate the Remove Speed from user settings  
    var speed = Slider[slidernumber].speed;
    var delay = 1 + (300 / speed);
    var charactersatonce = speed; 
    
   // For every element's in the <span> class
    [].forEach.call(jQuery("."+classname), function(el) {
    
  /* If at least one node of the element contains text 
        * (if the element is not just other nested elements) ...   
  */

  var itemlength;
  if ( jQuery(el).contents().filter( function(){ 
       return this.nodeType == 3; 
               }  )[0]  !== undefined)      

       //  ... save the text and its length, set the node itself to an empty string.         
      {    var textoriginal = jQuery(el).contents().filter(function(){ 
              return this.nodeType == 3; 
              })[0].nodeValue;
              itemlength = textoriginal.length; 
          el.childNodes[0].nodeValue = '';
      }
        
  // Otherwise, just set the item length to zero (so the SetTimeout reveal loop will never run)
  else { itemlength = 0; } 
    
        // Show the element. 
        el.style.display = 'inline';  
    
  // Function to add every individual character or group of characters  
        (function addNextCharacter(h) {
 
            setTimeout(function() {
                if (h < itemlength ) {
         		   h = increase(h, itemlength, charactersatonce);
                     // revealcounter = decrease(revealcounter, charactersatonce);              
                      el.childNodes[0].nodeValue = textoriginal.substr(0, h);                                 
                      addNextCharacter(h);
                 }
         
                if (h == itemlength) { 
                    Slider[slidernumber].lastsetting = tolevel;         
    				}
    
            }, delay);    
       })(0); 
    });

// Function continues calling itself until the levels revealed equal the slider's level.        
if (fromlevel != tolevel) { 
    RevealLevel(slidernumber, fromlevel, tolevel, side);
    } 


} 


/* Function to remove one level.
* The inverse function of RevealLevel.
*
*/

function RemoveLevel (slidernumber, fromlevel, tolevel, side) {  

   // Get the <span> class name for this level.
    var classname = GetAttr(slidernumber, fromlevel, side);

   // For every element's in the <span> class
    [].forEach.call(jQuery("."+classname), function(el) {

        var originalContent = el.innerHTML;

		var itemlength;
  // Get just the text content of the element without descendants.
    if ( jQuery(el).contents().filter(function(){ 
      return this.nodeType == 3; 
    })[0]  !== undefined)
      { var textoriginal = jQuery(el).contents().filter(function(){ 
        return this.nodeType == 3; 
      })[0].nodeValue;
      itemlength = textoriginal.length; }
      else { itemlength = 0; } 
 
  // Calculate the Remove Speed from user settings  
        var speed = Slider[slidernumber].speed;
        var delay = 1 + (300 / speed);
        var charactersatonce = speed; 


        // Function to remove every character or group of characters
        (function removeNextCharacter(h) {
            setTimeout(function() { 
                if (h > 0) {                  
                   // removecounter = decrease(removecounter, charactersatonce);
                    h=decrease(h,charactersatonce);
                    el.childNodes[0].nodeValue = textoriginal.substr(0,h);  
                    removeNextCharacter(h);   
                } 
                else if (h === 0) {
                     el.style.display = 'none';
                     el.innerHTML = originalContent; 
                 }
             
                if (h === 0)    {
                Slider[slidernumber].lastsetting = tolevel;
     	   		}
              }, delay);    
         })(itemlength);
    });
  
// Increment/decrement the current level after the function runs, since the 
// currentlevel is not revealed. (Start by removing the current level)
fromlevel = fromlevel - side; 

// Function continues to call itself until the removed levels equal the slider's level.
if ( tolevel != fromlevel) { 
    RemoveLevel(slidernumber, fromlevel, tolevel, side); 
    } 
}

}) ();

 
