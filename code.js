var title = document.querySelector("h1");
var button_pressme = document.querySelector("button");
var button_hm = document.querySelector("#hm");


            title.innerHTML= "This is the title from code.js!";
            button_pressme.addEventListener("click", pressme);
            button_hm.addEventListener("click", hobbit);
            
            var mynode = document.createElement("div");
            mynode.id = "work1_intro";
            mynode.innerHTML = "This work is an exhibition";
            mynode.style.color = "blue";

            //add event listener
            mynode.addEventListener("click", welcomeToWork1);
            document.querySelector("#w1").appendChild(mynode);
            

function pressme(){
alert("Let me tell you more about me!");

}
function hobbit(){
alert("Let me tell you more my hobbit!");

}
function welcomeToWork1(){
mynode.innerHTML =("Thank you for your interest!");

}
