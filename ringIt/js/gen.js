//Javascript Document
// this for the general global scripts for ajax actions of the web application

// close the notification box yourself

function clsNotify() {
  document.getElementById("msg_content").innerHTML = " ";
  document.getElementById("shwMsg").style.display = "none";
}

function clrBoard() {
  tinymce.remove();
  //var sect_preview_list = document.getElementById("preview_list");
  var sect_form_area = document.getElementById("form_area");
  sect_form_area.innerHTML = " ";
  return false;
}

function activate(obj) {
  event.preventDefault();
  var id = obj.getAttribute("id");
  var list = document.getElementsByClassName("preview-list");
  // Loop through the buttons and add the active class to the current/clicked button
  for (var i = 0; i < list.length; i++) {
    if (i == id) {
      list[i].className += " active";
    } else {
      list[i].className = list[i].className.replace(" active", "");
    }
  }
}

function postData(url, refurl, vars, data_id) {
  var pData = new XMLHttpRequest();
  var loader = document.getElementById("loader");
  var url = url;
  var refurl = refurl;
  var vars = vars;
  var data_id = data_id;

  pData.open("POST", url, true);

  pData.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  pData.onreadystatechange = function() {
    if (pData.readyState == 4 && pData.status == 200) {
      var returned_data = pData.responseText;
      document.getElementById("shwMsg").style.display = "block";
      document.getElementById("msg_content").innerHTML = returned_data;
      setTimeout(clsNotify, 10000);
      tinymce.remove();
      tinymce.init({
        selector: "textarea",
        menubar: false,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor textcolor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table contextmenu paste code help wordcount"
        ],
        browser_spellcheck: true,
        toolbar:
          "insert | undo redo |  formatselect | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help"
      });
      loader.innerHTML = " ";
      loader.style.display = "none";

      //check if their is a refresh url and do refresh, else do nothing
      if (refurl.length != 0) {
        var refLists = new XMLHttpRequest();
        var url = refurl;
        if (data_id) {
          var ID = data_id;
        } else {
          var ID = 1;
        }
        var vareff = "ID=" + ID;
        refLists.open("POST", url, true);

        // Set content type header information for sending url encoded variables in the request
        refLists.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        // Access the onreadystatechange event for the XMLHttpRequest object
        refLists.onreadystatechange = function() {
          if (refLists.readyState == 4 && refLists.status == 200) {
            var reload_data = refLists.responseText;
            //document.getElementById("form_area").innerHTML = '';
            //document.getElementById("preview_list").innerHTML = reload_data;
            document.getElementById("form_area").innerHTML = reload_data;
            tinymce.remove();
            tinymce.init({
              selector: "textarea",
              menubar: false,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor textcolor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table contextmenu paste code help wordcount"
              ],
              browser_spellcheck: true,
              toolbar:
                "insert | undo redo |  formatselect | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help"
            });
            loader.innerHTML = " ";
            loader.style.display = "none";
          }
        };
        // Send the data to PHP now... and wait for response to update the status div
        refLists.send(vareff); // Actually execute the request
        loader.style.display = "block";
        loader.innerHTML = "<div class='loading'> </div> loading....";
      }
    }
  };
  pData.send(vars);
  loader.style.display = "block";
  loader.innerHTML = "<div class='loading'> </div> loading....";
}

function fetchData(param1, param2, param3) {
  /*
    param1 = url to process data, 
    param2 = variable array used to process data, 
    param3 = id of the page elemet capturing the new set of data
    */

  event.preventDefault();
  clrBoard();
  var FD = new XMLHttpRequest();
  var loader = document.getElementById("loader");
  var url = param1;
  var vars = param2;
  FD.open("POST", url, true);

  //set content type header for sending url encoded variable in the request
  FD.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  //Access the onreadystatechange event for the XMLHttpRequest object
  FD.onreadystatechange = function() {
    if (FD.readyState == 4 && FD.status == 200) {
      var return_data = FD.responseText;
      document.getElementById(param3).style.display = "block";
      document.getElementById(param3).innerHTML = return_data;
      loader.innerHTML = " ";
      loader.style.display = "none";
    }
  };
  FD.send(vars);
  loader.style.display = "block";
  loader.innerHTML = "<div class='loading'> </div> loading....";
}

function logOut() {
  event.preventDefault();
  //alert('working...!');
  var url = "engine/logout.php";
  var url2 = "";
  var data = 1;
  var vars = "data=" + data;
  postData(url, url2, vars);

  window.location.replace("index.php");
}

function loadCarModel() {
  var makeId = document.getElementById("carMake").value;
  var url = "carmodel.php";
  var vars = "ID=" + makeId;
  var displayID = "vehModel";
  processData(url, vars, displayID);
}

function getCarMake(ID) {
  var url = "getcarmake.php";
  var vars = "ID=" + ID;
  var displayID = "shwVehMk";
  processData(url, vars, displayID);
}

function getCarModel(ID) {
  var url = "getcarmodel.php";
  var vars = "ID=" + ID;
  var displayID = "shwModVeh";
  processData(url, vars, displayID);
}
function emptyCart() {
  event.preventDefault();
  resetCart();
  localStorage.clear();
  alert("You have dropped all vehicles previously added..");
  window.location.href = "fleet.php";
}

function showCart() {
  var forms = document.querySelectorAll("div.sect-form");
  for (var i = 0; i < forms.length; i++) {
    forms[i].classList.remove("current");
  }
  var i = 5;
  forms[i].classList.add("current");
}

function clearCart() {
  localStorage.clear();
}

function shwInspectionInfo() {
  var ins_state = document.getElementById("ins_state").value;
  var ins_address = document.getElementById("ins_address").value;
  var ins_date = document.getElementById("ins_date").value;
  var ins_person = document.getElementById("ins_person").value;
  var ins_contact = document.getElementById("ins_contact").value;

  var shwInsState = document.getElementById("shwInsState");
  var shwInsAddress = document.getElementById("shwInsAddress");
  var shwInsDate = document.getElementById("shwInsDate");
  var shwInsPerson = document.getElementById("shwInsPerson");
  var shwInsContact = document.getElementById("shwInsContact");

  //display user input instantly
  shwInsState.innerHTML = ins_state;
  shwInsAddress.innerHTML = ins_address;
  shwInsDate.innerHTML = ins_date;
  shwInsPerson.innerHTML = ins_person;
  shwInsContact.innerHTML = ins_contact;
}

function shwVehicleInfo() {
  //calculate the premium charged on each vehicle

  var ins_class = document.getElementById("ins_class").value;
  var carMake = document.getElementById("carMake").value;
  var yearMake = document.getElementById("yearMake").value;
  var vehModel = document.getElementById("vehModel").value;
  var regNo = document.getElementById("regNo").value;
  var engNo = document.getElementById("engNo").value;
  var chasis = document.getElementById("chasis").value;
  var color = document.getElementById("color").value;
  var vehCategory = document.getElementById("vehCategory").value;
  var usage = document.getElementById("usage").value;

  //columns to display output
  var shwInsCls = document.getElementById("shwInsCls");
  var shwVehMk = document.getElementById("shwVehMk");
  var shwYrMake = document.getElementById("shwYrMake");
  var shwModVeh = document.getElementById("shwModVeh");
  var shwRegNo = document.getElementById("shwRegNo");
  var shwEngNo = document.getElementById("shwEngNo");
  var shwChasis = document.getElementById("shwChasis");
  var shwColor = document.getElementById("shwColor");
  var shwVehCat = document.getElementById("shwVehCat");
  var shwUsage = document.getElementById("shwUsage");

  //display user input instantly
  shwInsCls.innerHTML = ins_class;
  shwVehMk.innerHTML = carMake;
  //getCarMake(carMake);
  shwYrMake.innerHTML = yearMake;
  //shwModVeh.innerHTML=
  getCarModel(vehModel);
  shwRegNo.innerHTML = regNo;
  shwEngNo.innerHTML = engNo;
  shwChasis.innerHTML = chasis;
  shwColor.innerHTML = color;
  shwVehCat.innerHTML = vehCategory;
  shwUsage.innerHTML = usage;
}

function getPremRatio(Type) {
  //check vehicle type selected and set a value accordingly
  var vehType = Type;
  var pre = 0.0;
  switch (vehType) {
    case 1:
      pre = 0.03;
      break;
    case 2:
      pre = 0.0;
      break;
    case 3:
      pre = 0.035;
      break;
    case 4:
      pre = 0.04;
      break;
    default:
      //set default value to 0.00
      pre = 0.0;
  }
  return pre;
}

function getVehType(type) {
  var vType;
  switch (type) {
    case 1:
      vType = "Private Vehicle";
      break;
    case 2:
      vType = "Invalid";
      break;
    case 3:
      vType = "Commercial Vehicle";
      break;
    case 4:
      vType = "Motorcycle";
      break;
    default:
      vType = "No selection";
  }
  return vType;
}

function calPremium() {
  //calculate the premium charged on each vehicle

  var bback = document.getElementById("exBuyBack").value;
  var vehValue = document.getElementById("costOfVeh").value;
  var vehType = document.getElementById("vehType").value;
  vehValue = vehValue.replace(/,\s?/g, "");
  vehValue = vehValue * 1;
  //columns to display output
  var shwVehVal = document.getElementById("shwVehVal");
  var shwVehType = document.getElementById("shwVehType");
  var shwVehBback = document.getElementById("shwVehBback");
  var shwVehPrem = document.getElementById("shwVehPrem");
  var shwVehTPrem = document.getElementById("shwVehTPrem");

  if (bback == 1) {
    var buyBack = 0.005;
  } else {
    var buyBack = 0;
  }
  vehType = vehType * 1;
  var vType = getVehType(vehType);
  var vehBuyBack = vehValue * buyBack;
  var vehPreRatio = getPremRatio(vehType);
  var vPremium = vehValue * vehPreRatio;
  var premiumCharged = vPremium + vehBuyBack;

  var SvehBuyBack = vehBuyBack.toLocaleString("en");
  var SpremiumCharged = premiumCharged.toLocaleString("en");
  var SvPremium = vPremium.toLocaleString("en");
  var SvehValue = vehValue.toLocaleString("en");

  shwVehVal.innerHTML = "&#8358; " + SvehValue;
  shwVehType.innerHTML = vType;
  shwVehBback.innerHTML = "&#8358; " + SvehBuyBack;
  shwVehPrem.innerHTML = "&#8358; " + SvPremium;
  shwVehTPrem.innerHTML = "&#8358; " + SpremiumCharged;
  document.getElementById("vehCategory").value = vType;

  //store actual data in hidden form fields for data processing
  document.getElementById("premiumCharge").value = SvPremium;
  document.getElementById("exBuyBackCharge").value = SvehBuyBack;
  document.getElementById("totalPremiumCharged").value = SpremiumCharged;
}

function updateCart() {
  //localStorage.clear();

  var bback = document.getElementById("exBuyBack").value;
  var vehValue = document.getElementById("costOfVeh").value;
  var vehType = document.getElementById("vehType").value;
  var ins_class = document.getElementById("ins_class").value;
  var carMake = document.getElementById("carMake").value;
  var yearMake = document.getElementById("yearMake").value;
  var vehModel = document.getElementById("vehModel").value;
  var regNo = document.getElementById("regNo").value;
  var engNo = document.getElementById("engNo").value;
  var chasis = document.getElementById("chasis").value;
  var color = document.getElementById("color").value;
  var vehCategory = document.getElementById("vehCategory").value;
  var usage = document.getElementById("usage").value;
  var ins_name = document.getElementById("ins_name").value;
  var email = document.getElementById("email").value;
  var mobile = document.getElementById("mobile").value;
  var dob = document.getElementById("dob").value;
  var state = document.getElementById("state").value;
  var address = document.getElementById("address").value;
  var occupy = document.getElementById("occupy").value;
  var p_id = document.getElementById("p_id").value;
  var id_no = document.getElementById("id_no").value;
  var tnx_ref = document.getElementById("tnx_ref").value;
  var premium = document.getElementById("premiumCharge").value;
  var ins_state = document.getElementById("ins_state").value;
  var ins_address = document.getElementById("ins_address").value;
  var ins_date = document.getElementById("ins_date").value;
  var ins_person = document.getElementById("ins_person").value;
  var ins_contact = document.getElementById("ins_contact").value;
  var type = "single";
  premium = premium.replace(/,\s?/g, "");
  var exbuyback = document.getElementById("exBuyBackCharge").value;
  var premiumCharged = document.getElementById("totalPremiumCharged").value;
  premiumCharged = premiumCharged.replace(/,\s?/g, "");

  //var url = "update-order.php";
  //var url2 = "";
  var Total;
  var cartNo;

  var item = {
    bback: bback,
    vehValue: vehValue,
    vehType: vehType,
    ins_class: ins_class,
    carMake: carMake,
    yearMake: yearMake,
    vehModel: vehModel,
    regNo: regNo,
    engNo: engNo,
    chasis: chasis,
    color: color,
    vehCategory: vehCategory,
    usage: usage,
    ins_name: ins_name,
    email: email,
    mobile: mobile,
    dob: dob,
    state: state,
    address: address,
    occupy: occupy,
    p_id: p_id,
    id_no: id_no,
    tnx_ref: tnx_ref,
    premium: premium,
    ins_state: ins_state,
    ins_address: ins_address,
    ins_date: ins_date,
    ins_contact: ins_contact,
    ins_person: ins_person,
    type: type,
    exbuyback: exbuyback,
    premiumCharged: premiumCharged
  };

  localStorage.setItem("myCart", JSON.stringify(item));
  premiumCharged = premiumCharged * 1;

  if (localStorage.getItem("Total") === null) {
    Total = 0;
    cartNo = 0;
  } else {
    Total = localStorage.getItem("Total");
    cartNo = localStorage.getItem("cartNo");
  }
  Total = Total * 1 + premiumCharged * 1;
  cartNo = cartNo * 1 + 1;
  //alert(Total);
  /*var vars =
      "prodName=" +
      prodName +
      "&qty=" +
      qty +
      "&cost=" +
      cost +
      "&subTotal=" +
      subTotal +
      "&Total=" +
      Total;
    postData(url, url2, vars);
    */
  localStorage.setItem("Total", Total);
  localStorage.setItem("cartNo", cartNo);
  document.getElementById("itemsInCart").innerHTML = localStorage.getItem(
    "cartNo"
  ).length;
  //localStorage.clear();
  document.getElementById("totalBilled").innerHTML =
    "&#8358; " + localStorage.getItem("Total");
}

//scroll to top function
function scrollTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  });
}
//function to move the form pages left and right for easy user access
var slideIndex = 1;
function nextForm() {
  event.preventDefault();

  var i;
  var slides = document.getElementsByClassName("sect-form");
  for (i = 0; i < slides.length; i++) {
    slides[i].classList.remove("current");
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  slides[slideIndex - 1].className += " current upDown";
}

function backForm() {
  event.preventDefault();

  document.getElementById("val1").style.display = "none";
  var i;
  var slides = document.getElementsByClassName("sect-form");
  for (i = 0; i < slides.length; i++) {
    slides[i].classList.remove("current");
  }
  slideIndex--;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  slides[slideIndex - 1].className += " current";
}
/*
var rBtn = document.getElementById("regis-btn");
var lBtn = document.getElementById("login-btn");

lBtn.addEventListener("click", loadLogin, false);
rBtn.addEventListener("click", loadRegis, false);

function loadLogin() {
  var formLogin = document.getElementById("tab1");
  var formReg = document.getElementById("tab2");
  formReg.style.display = "none";
  formLogin.style.display = "block";

  formLogin.className += " active";
  formReg.classList.remove("active");

  lBtn.className += " active";
  rBtn.classList.remove("active");
}

function loadRegis() {
  var formLogin = document.getElementById("tab1");
  var formReg = document.getElementById("tab2");
  formReg.style.display = "block";
  formLogin.style.display = "none";

  formReg.className += " active";
  formLogin.classList.remove("active");

  rBtn.className += " active";
  lBtn.classList.remove("active");
}

function addComma() {
  var Cost = document.getElementById("costOfVeh").value;
  Cost = Cost;
  Cost = Cost.toString().replace(/,/g, "");
  var result = Cost.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  //var result = Cost.toLocaleString('en');
  vehValue.value = result;
}

var bback = document.getElementById("exBuyBack");
var vehValue = document.getElementById("costOfVeh");
var vehType = document.getElementById("vehType");

vehValue.addEventListener(
  "keyup",
  function() {
    calPremium();
    addComma();
  },
  false
);
bback.addEventListener(
  "change",
  function() {
    calPremium();
  },
  false
);
vehType.addEventListener(
  "change",
  function() {
    calPremium();
  },
  false
);
*/

function processData(url, vars, display_id) {
  event.preventDefault();

  var p = new XMLHttpRequest();
  var url = url;
  var vars = vars;
  var data_id = display_id;

  p.open("POST", url, true);

  p.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  p.onreadystatechange = function() {
    if (p.readyState == 4 && p.status == 200) {
      var returned_data = p.responseText;

      document.getElementById(data_id).innerHTML = "";
      document.getElementById(data_id).innerHTML = returned_data;
      document.getElementById("loader").innerHTML = " ";
      document.getElementById("loader").style.display = "none";
    }
  };
  p.send(vars);
  document.getElementById("loader").style.display = "block";
  document.getElementById("loader").innerHTML =
    "<i class='fa fa-spinner fa-spin'></i> loading...";
}

//form validations
function valForm1() {
  event.preventDefault();
  //validate the first form
  var bback = document.getElementById("exBuyBack").value;
  var vehValue = document.getElementById("costOfVeh").value;
  var vehType = document.getElementById("vehType").value;

  var entries = [bback, vehValue, vehType];
  var valid;

  for (var i = 0, len = entries.length; i < len; i++) {
    if (entries[i].length == 0) {
      valid = 0;
      break;
    } else {
      valid = 1;
    }
  }

  if (valid == 0) {
    document.getElementById("val1").style.display = "block";
    if (bback.length == 0) {
      document.getElementById("exBuyBack").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (vehValue.length == 0) {
      document.getElementById("costOfVeh").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (vehType.length == 0) {
      document.getElementById("vehType").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    scrollTop();
    return;
  } else {
    document.getElementById("val1").style.display = "none";
    document.getElementById("totalBilled").innerHTML =
      "&#8358; " + document.getElementById("totalPremiumCharged").value;
    slideIndex = 2;
    nextForm();
  }
}

function valForm2() {
  event.preventDefault();
  //validate the second form

  var ins_class = document.getElementById("ins_class").value;
  var carMake = document.getElementById("carMake").value;
  var yearMake = document.getElementById("yearMake").value;
  var vehModel = document.getElementById("vehModel").value;
  var regNo = document.getElementById("regNo").value;
  var engNo = document.getElementById("engNo").value;
  var chasis = document.getElementById("chasis").value;
  var color = document.getElementById("color").value;
  var vehCategory = document.getElementById("vehCategory").value;
  var usage = document.getElementById("usage").value;
  //var agree = document.getElementById("agree2");

  var entries = [
    ins_class,
    carMake,
    yearMake,
    vehModel,
    regNo,
    engNo,
    chasis,
    color,
    vehCategory,
    usage
  ];
  var valid;

  for (var i = 0, len = entries.length; i < len; i++) {
    if (entries[i].length == 0) {
      valid = 0;
      break;
    } else {
      valid = 1;
    }
  }

  if (valid == 0) {
    document.getElementById("val1").style.display = "block";
    if (ins_class.length == 0) {
      document.getElementById("ins_class").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (carMake.length == 0) {
      document.getElementById("carMake").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (yearMake.length == 0) {
      document.getElementById("yearMake").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (vehModel.length == 0) {
      document.getElementById("vehModel").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (regNo.length == 0) {
      document.getElementById("regNo").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (engNo.length == 0) {
      document.getElementById("engNo").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (chasis.length == 0) {
      document.getElementById("chasis").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (vehCategory.length == 0) {
      document.getElementById("vehCategory").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (usage.length == 0) {
      document.getElementById("usage").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    scrollTop();
    return;
  } else {
    document.getElementById("val1").style.display = "none";
    nextForm();
  }
}

function registerAcct() {
  event.preventDefault();

  function postDataLoc(url, vars) {
    var pData = new XMLHttpRequest();
    var url = url;
    var vars = vars;

    pData.open("POST", url, true);

    pData.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    pData.onreadystatechange = function() {
      if (pData.readyState == 4 && pData.status == 200) {
        var returned_data = pData.responseText;
        if (returned_data == "100") {
          alert("Your registration was successful..");
          window.location.href = "single.php";
        } else {
          alert(returned_data);
        }
        loader.innerHTML = " ";
        loader.style.display = "none";
      }
    };
    pData.send(vars);
    loader.style.display = "block";
    loader.innerHTML = "<i class='fa fa-spinner fa-spin'></i> loading...";
  }

  var url = "register.php";

  var ins_name = document.getElementById("ins_name").value;
  var email = document.getElementById("email").value;
  var mobile = document.getElementById("mobile").value;
  var dob = document.getElementById("dob").value;
  var state = document.getElementById("state").value;
  var address = document.getElementById("address").value;
  var occupy = document.getElementById("occupy").value;
  var p_id = document.getElementById("p_id").value;
  var id_no = document.getElementById("id_no").value;
  var password = document.getElementById("password").value;
  var password2 = document.getElementById("password2").value;
  var user_type = document.getElementById("reg_user_type").value;
  var user_id = document.getElementById("user_id").value;
  var product_id = document.getElementById("product_id").value;

  var vars =
    "ins_name=" +
    ins_name +
    "&email=" +
    email +
    "&mobile=" +
    mobile +
    "&dob=" +
    dob +
    "&state=" +
    state +
    "&address=" +
    address +
    "&occupy=" +
    occupy +
    "&p_id=" +
    p_id +
    "&id_no=" +
    id_no +
    "&user_type=" +
    user_type +
    "&user_id=" +
    user_id +
    "&product_id=" +
    product_id +
    "&password=" +
    password +
    "&password2=" +
    password2;

  postDataLoc(url, vars);
}

function logAcctIn() {
  event.preventDefault();

  function postDataLoc(url, vars) {
    var pData = new XMLHttpRequest();
    var url = url;
    var vars = vars;

    pData.open("POST", url, true);

    pData.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    pData.onreadystatechange = function() {
      if (pData.readyState == 4 && pData.status == 200) {
        var returned_data = pData.responseText;
        if (returned_data == "Your login was successful, please proceed...") {
          //alert("Congratulations, Your registeration was successful...");
          alert(returned_data);
          window.location.href = "single.php";
        } else {
          alert(returned_data);
        }
        loader.innerHTML = " ";
        loader.style.display = "none";
      }
    };
    pData.send(vars);
    loader.style.display = "block";
    loader.innerHTML = "<i class='fa fa-spinner fa-spin'></i> loading...";
  }
  var url = "login-process.php";

  var user_email = document.getElementById("login_email").value;
  var user_pass = document.getElementById("login_password").value;
  var user_type = document.getElementById("user_type").value;
  var vars =
    "user_email=" +
    user_email +
    "&user_pass=" +
    user_pass +
    "&user_type=" +
    user_type;

  postDataLoc(url, vars);
}

function valForm3() {
  event.preventDefault();
  //validate the second form

  var ins_name = document.getElementById("ins_name").value;
  var email = document.getElementById("email").value;
  var mobile = document.getElementById("mobile").value;
  var dob = document.getElementById("dob").value;
  var state = document.getElementById("state").value;
  var address = document.getElementById("address").value;
  var occupy = document.getElementById("occupy").value;
  var p_id = document.getElementById("p_id").value;
  var id_no = document.getElementById("id_no").value;
  var password = document.getElementById("password").value;
  var password2 = document.getElementById("password2").value;
  var user_type = document.getElementById("reg_user_type").value;

  var entries = [
    ins_name,
    email,
    mobile,
    dob,
    state,
    address,
    occupy,
    p_id,
    id_no,
    password,
    password2,
    user_type
  ];
  var valid;

  for (var i = 0, len = entries.length; i < len; i++) {
    if (entries[i].length == 0) {
      valid = 0;
      break;
    } else {
      if (password === password2) {
        if (user_type === "Individual") {
          valid = 1;
        } else if (user_type !== "Individual") {
          if (document.getElementById("user_id").value.length > 0) {
            valid = 1;
          } else {
            valid = 0;
          }
        }
      } else {
        valid = 300;
      }
    }
  }

  if (valid == 0) {
    document.getElementById("val1").style.display = "block";
    if (ins_name.length == 0) {
      document.getElementById("ins_name").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (email.length == 0) {
      document.getElementById("email").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (mobile.length == 0) {
      document.getElementById("mobile").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (dob.length == 0) {
      document.getElementById("dob").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (state.length == 0) {
      document.getElementById("state").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (address.length == 0) {
      document.getElementById("address").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (occupy.length == 0) {
      document.getElementById("occupy").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (p_id.length == 0) {
      document.getElementById("p_id").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (id_no.length == 0) {
      document.getElementById("id_no").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (password.length == 0) {
      document.getElementById("password").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (password2.length == 0) {
      document.getElementById("password2").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (user_type.length == 0) {
      document.getElementById("user_type").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (document.getElementById("user_id").value.length == 0) {
      document.getElementById("user_id").style.background =
        "rgba(226, 184, 184, 0.50)";
    }

    scrollTop();
    return;
  } else if (valid == 300) {
    alert("Passwords do not match...!");
    scrollTop();
    return;
  } else if (valid == 1) {
    document.getElementById("val1").style.display = "none";
    registerAcct();
    //nextForm();
    //window.location.href = "single.php";
  }
}

var ins_state = document.getElementById("ins_state");
var ins_address = document.getElementById("ins_address");
var ins_date = document.getElementById("ins_date");
var ins_person = document.getElementById("ins_person");
var ins_contact = document.getElementById("ins_contact");

ins_state.addEventListener(
  "change",
  function() {
    shwInspectionInfo();
  },
  false
);
ins_address.addEventListener(
  "keyup",
  function() {
    shwInspectionInfo();
  },
  false
);
ins_date.addEventListener(
  "keyup",
  function() {
    shwInspectionInfo();
  },
  false
);

ins_date.addEventListener(
  "change",
  function() {
    shwInspectionInfo();
  },
  false
);

ins_person.addEventListener(
  "keyup",
  function() {
    shwInspectionInfo();
  },
  false
);
ins_contact.addEventListener(
  "keyup",
  function() {
    shwInspectionInfo();
  },
  false
);

function recordsDisplay() {
  var vehMake = document.getElementById("carMake").value;
  var yearMake = document.getElementById("yearMake").value;
  var regNo = document.getElementById("regNo").value;
  var engNo = document.getElementById("engNo").value;
  var chasis = document.getElementById("chasis").value;
  var ins_address = document.getElementById("ins_address").value;
  var ins_date = document.getElementById("ins_date").value;
  var totalPremiumCharged = document.getElementById("totalPremiumCharged")
    .value;

  //set display params
  var shwDtVehMake = document.getElementById("shwDtVehMake");
  var shwDtVehYear = document.getElementById("shwDtVehYear");
  var shwDtVehReg = document.getElementById("shwDtVehReg");
  var shwDtVehEng = document.getElementById("shwDtVehEng");
  var shwDtVehChasis = document.getElementById("shwDtVehChasis");
  var shwDtVehInsDate = document.getElementById("shwDtVehInsDate");
  var shwDtVehInsAddress = document.getElementById("shwDtVehInsAddress");
  var shwDtVehTOTAL = document.getElementById("shwDtVehTOTAL");

  shwDtVehMake.innerHTML = vehMake;
  shwDtVehYear.innerHTML = yearMake;
  shwDtVehReg.innerHTML = regNo;
  shwDtVehEng.innerHTML = engNo;
  shwDtVehChasis.innerHTML = chasis;
  shwDtVehInsDate.innerHTML = ins_address;
  shwDtVehInsAddress.innerHTML = ins_date;
  shwDtVehTOTAL.innerHTML = totalPremiumCharged;

  //set the amount to be sent to the checkout page
  document.getElementById("sumTotal").value = totalPremiumCharged;
}

function valForm4() {
  event.preventDefault();
  //validate the second form

  var ins_state = document.getElementById("ins_state").value;
  var ins_address = document.getElementById("ins_address").value;
  var ins_date = document.getElementById("ins_date").value;
  var ins_person = document.getElementById("ins_person").value;
  var ins_contact = document.getElementById("ins_contact").value;

  var entries = [ins_state, ins_address, ins_date, ins_person, ins_contact];
  var valid;

  for (var i = 0, len = entries.length; i < len; i++) {
    if (entries[i].length == 0) {
      valid = 0;
      break;
    } else {
      valid = 1;
    }
  }

  if (valid == 0) {
    document.getElementById("val1").style.display = "block";
    if (ins_state.length == 0) {
      document.getElementById("ins_state").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (ins_address.length == 0) {
      document.getElementById("ins_address").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (ins_date.length == 0) {
      document.getElementById("ins_date").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (ins_person.length == 0) {
      document.getElementById("ins_person").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (ins_contact.length == 0) {
      document.getElementById("ins_contact").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    scrollTop();
    return;
  } else {
    function formatDate(date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    }
    function formatDateLocal(date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, day, month].join("-");
    }
    var GivenDate = formatDateLocal(ins_date);
    GivenDate = new Date(GivenDate);
    var CurrentDate = new Date();
    console.log(GivenDate);
    console.log(CurrentDate);
    if (GivenDate < CurrentDate) {
      document.getElementById("ins_date").style.background =
        "rgba(226, 184, 184, 0.50)";
      alert("Please note that you cannot enter a date lesser than today..");
      document.getElementById("val1").style.display = "block";
      scrollTop();
      return;
    } else if (GivenDate >= CurrentDate) {
      document.getElementById("val1").style.display = "none";
      updateCart();
      nextForm();
      recordsDisplay();
    }
  }
}

function loginUser() {
  event.preventDefault();
  //validate the second form

  var email = document.getElementById("login_email").value;
  var password = document.getElementById("login_password").value;
  var type = document.getElementById("user_type").value;
  //var agree = document.getElementById("agree2");

  var entries = [email, password, type];
  var valid;

  for (var i = 0, len = entries.length; i < len; i++) {
    if (entries[i].length == 0) {
      valid = 0;
      break;
    } else {
      valid = 1;
    }
  }

  if (valid == 0) {
    document.getElementById("val1").style.display = "block";
    if (email.length == 0) {
      document.getElementById("login_email").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (password.length == 0) {
      document.getElementById("login_password").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    if (type.length == 0) {
      document.getElementById("user_type").style.background =
        "rgba(226, 184, 184, 0.50)";
    }
    scrollTop();
    return;
  } else {
    document.getElementById("val1").style.display = "none";
    logAcctIn();
  }
}
