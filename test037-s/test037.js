var obj=document.getElementsByClassName('box')[0];
var wrap=document.getElementsByClassName('wrap')[0];
function hasClass(obj, cls) {  
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
}   
function addClass(obj, cls) {  
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;  
}  
function removeClass(obj, cls) {  
    if (hasClass(obj, cls)) {  
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');  
        obj.className = obj.className.replace(reg, ' ');  
    }  
}  
obj.onclick=function(){
	removeClass(wrap,'hidden');
}
wrap.onclick=function(){
	addClass(this,'hidden');
}