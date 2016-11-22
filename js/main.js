"use restrict"; // restrict mode for JavaScript
//namespaces
var CONTACT_ADM = {};
//variables
CONTACT_ADM.key = "stra0165";
CONTACT_ADM.contacts = (localStorage.getItem(CONTACT_ADM.key) != null ? JSON.parse(localStorage.getItem(CONTACT_ADM.key)) : []);
// console.log(CONTACT_ADM.initLocalStorage());
CONTACT_ADM.output = document.querySelector("#output");
CONTACT_ADM.editMode = -1;
//
CONTACT_ADM.setLocalStorage = function () {
    localStorage.setItem(CONTACT_ADM.key, JSON.stringify(CONTACT_ADM.contacts));
    CONTACT_ADM.showStorage();
};
CONTACT_ADM.initLocalStorage = function () {
    console.log(CONTACT_ADM.contacts.length);
    if (CONTACT_ADM.contacts.length == 0) {
        //
        CONTACT_ADM.contacts.push({firstName : "Robson"
                                  ,lastName  : "Miranda"
                                  ,mobile    : "(613) 700-0017"
                                  ,phone     : "(613) 421-8529"
                                  ,email     : "stra0165@algonquinlive.com"
                                  });
        CONTACT_ADM.setLocalStorage();
        //
    };
};
//
CONTACT_ADM.addContact =  function(ev){
    //
    ev.preventDefault();
    // console.log(typeof CONTACT_ADM.contactValidation());
    //
    if (typeof CONTACT_ADM.contactValidation() === 'string') {
        //
        CONTACT_ADM.displayError(CONTACT_ADM.contactValidation());
        //
    }else{
        //
        if  (CONTACT_ADM.editMode == -1) {
            //
            CONTACT_ADM.contacts.push(CONTACT_ADM.contactValidation());
            //
        }else{
            //
            CONTACT_ADM.contacts.splice(CONTACT_ADM.editMode,1,CONTACT_ADM.contactValidation());
            CONTACT_ADM.editMode = -1;
            //
        }
        //
        CONTACT_ADM.setLocalStorage();
        //
    }
};
//
CONTACT_ADM.delContact = function (ev) {
    //
    ev.preventDefault();
    //
    let btnDel = ev.currentTarget.parentElement;
    let position = btnDel.getAttribute("data-id");
    //
    CONTACT_ADM.contacts.splice(position,1);
    btnDel.removeEventListener("click",CONTACT_ADM.delStorage);
    console.log("".concat("Deleting ",CONTACT_ADM.contacts.length));
    if (CONTACT_ADM.contacts.length == 0) {
        localStorage.removeItem(CONTACT_ADM.key);
        CONTACT_ADM.showStorage();
    }else{
        CONTACT_ADM.setLocalStorage();
    }
    //
};
//
CONTACT_ADM.edtContact = function (ev) {
    //
    ev.preventDefault();
    document.querySelector(".contactform").reset();
    //
    let btnDel = ev.currentTarget.parentElement;
    let position = btnDel.getAttribute("data-id");
    //
    for (var i=0; i<document.querySelectorAll("input").length; i++){
        document.querySelectorAll("input")[i].value = CONTACT_ADM.contacts[position][document.querySelectorAll("input")[i].id];
    }
    //
    CONTACT_ADM.editMode =  position;
    CONTACT_ADM.callForm();
};
//
CONTACT_ADM.showStorage = function (){
    CONTACT_ADM.output.innerHTML = "";
    if (CONTACT_ADM.contacts.length > 0) {
        CONTACT_ADM.contacts = CONTACT_ADM.contacts.sort(CONTACT_ADM.sortCompare);
        console.log(CONTACT_ADM.contacts);
        let ul = CONTACT_ADM.createNewDOM("ul","contacts","","");
        for (var i=0; i<CONTACT_ADM.contacts.length; i++){
            // console.log(i);
            // console.log(CONTACT_ADM.contacts[i].firstName);
            let li = CONTACT_ADM.createNewDOM("li","contact","","");
            let del = CONTACT_ADM.createNewDOM("span","delete button icon-user-minus","btnDel","");
            let edt = CONTACT_ADM.createNewDOM("span","edit button icon-pencil","btnEdt","");
            let h3 = CONTACT_ADM.createNewDOM("h3","","",CONTACT_ADM.contacts[i].firstName + " " + CONTACT_ADM.contacts[i].lastName);
            let eml = CONTACT_ADM.createNewDOM("p","email","",CONTACT_ADM.contacts[i].email);
            let mob = CONTACT_ADM.createNewDOM("p","phone","",CONTACT_ADM.formatVal(CONTACT_ADM.contacts[i].mobile,"phone"));
            let tel = CONTACT_ADM.createNewDOM("p","phone","",CONTACT_ADM.formatVal(CONTACT_ADM.contacts[i].phone,"phone"));
            //
            del.addEventListener("click", CONTACT_ADM.delContact);
            edt.addEventListener("click", CONTACT_ADM.edtContact);
            li.setAttribute("data-id",i);
            //
            li.appendChild(edt);
            li.appendChild(del);
            li.appendChild(h3);
            li.appendChild(eml);
            li.appendChild(mob);
            li.appendChild(tel);
            ul.appendChild(li);
        }
        CONTACT_ADM.output.appendChild(ul);
        CONTACT_ADM.hideForm();
    }
};
//
CONTACT_ADM.contactValidation = function () {
    //
    let newPerson = {};
    let formPerson = document.querySelectorAll("input");
    let lablPerson = document.querySelectorAll("label");
    let fieldCheck = ["firstName","email"];
    let emptyCheck = ["",null];
    //
    for (var i=0; i<formPerson.length; i++){
        //
        if (fieldCheck.indexOf(formPerson[i].id) > -1) {
            //
            if (emptyCheck.indexOf(formPerson[i].value) > -1) {
                return "".concat("Field '<u>",lablPerson[i].innerHTML,"</u>' is mandatory.");
            }
            //
        };
        let maskField = null;
        switch (formPerson[i].type.toLowerCase()) {
            case "tel":
                maskField = CONTACT_ADM.formatVal(formPerson[i].value,"tel");
                break;
            case "text":
                maskField = CONTACT_ADM.formatVal(formPerson[i].value,"initCap");
                break;
            case "email":
            {
                if (CONTACT_ADM.validateEmail(formPerson[i].value)) {
                    break;
                }else {
                    return "".concat("Field '<u>",lablPerson[i].innerHTML,"</u>' is invalid.");
                }
            }
            default:
                maskField = null;
        }
        newPerson[formPerson[i].id] = (maskField != null ? maskField : formPerson[i].value);
    }
    return newPerson;
};
//
CONTACT_ADM.validateEmail = function (email) {
    let atpos = email.indexOf("@");
    let dotpos = email.lastIndexOf(".");
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
        return false;
    };
    return true;
};
//
CONTACT_ADM.formatVal = function (string, type) {
    switch (type) {
        case "tel":
            return String(string).replace(/^(\d{3})(\d{3})(\d{4}).*/, '($1) $2-$3');
        case "initCap":
            // return "".concat(String(string).substr(0,1).toUpperCase(),String(string).substr(1,String(string).length).toLowerCase());
            return String(string).initCap();
        default:
            return string;
    }
};
String.prototype.initCap = function () {
    return this.toLowerCase().replace(/(?:^|\s)[a-z]/g, function (m) {
        return m.toUpperCase();
    });
};
//
CONTACT_ADM.displayError = function (err) {
    let errBox = document.getElementById("errWrap");
    if (errBox == null) {
        errBox = CONTACT_ADM.createNewDOM("div","errBox","errWrap",err);
    }else{
        errBox.innerHTML = err;
    }
    let clsBtn = CONTACT_ADM.createNewDOM("span","closebtn","","&times;");
    errBox.appendChild(clsBtn);
    document.querySelector(".contactform").appendChild(errBox);
    clsBtn.addEventListener("click", function () {
        errBox.classList.remove("active");
    });
    errBox.classList.add("active");
};
//
CONTACT_ADM.createNewDOM = function (evType, evClass, evID, evContent) {
    //
    let elem = document.createElement(evType);
    (evClass != "" ? elem.className = evClass : null);
    (evID != "" ? elem.id = evID : null);
    (evContent != "" ? elem.innerHTML = evContent : null);
    return elem;
    //
};
CONTACT_ADM.sortCompare = function (a,b) {
    if (a.firstName.toUpperCase() < b.firstName.toUpperCase())
        return -1;
    if (a.firstName.toUpperCase() > b.firstName.toUpperCase())
        return 1;
    return 0;
};
//
CONTACT_ADM.clearAllStorage = function() {
    localStorage.clear(); //remove everything in localStorage if desired
    CONTACT_ADM.contacts = [];
    CONTACT_ADM.showStorage();
};
//
CONTACT_ADM.callForm = function () {
    if (CONTACT_ADM.editMode > -1) {
        document.querySelector(".btnSave").classList.add("icon-user-check", "edit");
        document.querySelector(".btnSave").classList.remove("icon-user-plus");
    }else{
        document.querySelector(".contactform").reset();
    }
    CONTACT_ADM.overlayToggle("block");
    document.getElementById("email").classList.remove("required","filled");
    document.getElementById("firstName").classList.remove("required","filled");
    document.getElementById("firstName").focus();
};
//
CONTACT_ADM.hideForm = function () {
    if (document.getElementById("errWrap")) {
        document.getElementById("errWrap").remove();
    }
    CONTACT_ADM.editMode =  -1;
    document.querySelector(".btnSave").classList.add("icon-user-plus");
    document.querySelector(".btnSave").classList.remove("icon-user-check", "edit");
    CONTACT_ADM.overlayToggle("none");
};
//
CONTACT_ADM.overlayToggle = function (value) {
    document.querySelector(".overlay").style.display = value;
    document.querySelector(".contactform").style.display = value;
};
//
CONTACT_ADM.init = function () {
    if( localStorage ){
        //add listener to button
        document.querySelector(".btnSave").addEventListener("click", CONTACT_ADM.addContact);
        document.querySelector(".btnCancel").addEventListener("click", CONTACT_ADM.hideForm);
        document.getElementById("firstName").addEventListener("blur",function () {
            if (document.getElementById("firstName").value != "") {
                document.getElementById("firstName").classList.remove("required");
                document.getElementById("firstName").classList.add("filled");
            }else {
                document.getElementById("firstName").classList.add("required");
                document.getElementById("firstName").classList.remove("filled");
            }
        });
        document.getElementById("email").addEventListener("blur",function () {
            if (document.getElementById("email").value != "") {
                document.getElementById("email").classList.remove("required");
                document.getElementById("email").classList.add("filled");
                CONTACT_ADM.validateEmail(document.getElementById("email").value);
            }else {
                document.getElementById("email").classList.add("required");
                document.getElementById("email").classList.remove("filled");
            }
        });
        document.getElementById("mobile").addEventListener("blur",function () {
            document.getElementById("mobile").value = CONTACT_ADM.formatVal(document.getElementById("mobile").value,"tel")
        });
        document.getElementById("phone").addEventListener("blur",function () {
            document.getElementById("phone").value = CONTACT_ADM.formatVal(document.getElementById("phone").value,"tel")
        });
        // document.getElementById("btnClearAll").addEventListener("click", CONTACT_ADM.clearAllStorage);
        document.querySelector(".fab").addEventListener("click",CONTACT_ADM.callForm);
        //
        CONTACT_ADM.initLocalStorage();
        CONTACT_ADM.showStorage();
        CONTACT_ADM.hideForm();
        //
    }else{
        CONTACT_ADM.output.innerHTML = "Sorry but your browser does not support localStorage";
    }
};

document.addEventListener("DOMContentLoaded",CONTACT_ADM.init);
    // console.log(CONTACT_ADM.contacts);

// localStorage.setItem(name, value)
// localStorage.getItem(name)
// localStorage.removeItem(name)
// localStorage.clear()
// localStorage.keys
// JSON.stringify()
// JSON.parse()