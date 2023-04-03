const stackView = [];
const stackKey  = [];

// static event listeners
document.getElementById("btnPrev").addEventListener("click", drawViewPrev);

function uploadJson() {
  const [file] = document.getElementById("btnUpload").files;
  const reader = new FileReader();
  reader.addEventListener("load", () => { parseInput(reader); }, false);
  if (file) {
    reader.readAsText(file);
  }
}

function parseInput(reader) {
  const pUploadResult = document.getElementById("pUploadResult");
  // clear view
  document.getElementById("jsonView").innerHTML = "";
  stackView.length = 0; 
  stackKey.length = 0; 

  try {
    jsonData = JSON.parse(reader.result); 
  } catch (e) {
    pUploadResult.innerHTML = `Parse FAILED: ${e}. <br>`;
    pUploadResult.innerHTML += "Please upload a valid JSON file.";
    return;
  }
  pUploadResult.textContent = "Parse SUCCESS";
  drawView(jsonData)
}

function drawView(data) {
  const jsonUl  = document.getElementById("jsonView");
  const btnPrev = document.getElementById("btnPrev");
  const navView = document.getElementById("navView");

  jsonUl.innerHTML = ""; // clear json view
  appendJsonLi(jsonUl, data);

  // update navigation
  if (stackView.length === 0) {
    btnPrev.hidden = true;
    navView.innerHTML = "";
  } else {
    btnPrev.hidden = false;
    navView.innerHTML = stackKey.join(" > ");
  }
}

function appendJsonLi(jsonUl, data) {
  if (data === null) {
    jsonUl.innerHTML = "Object is empty.";
    return;
  }
  keys = Object.keys(data);
  for (let i=0; i<keys.length; i++) {
    const val = data[keys[i]];
    const li = document.createElement("li");
    li.setAttribute("id", keys[i]);
    if (Array.isArray(val)) {
      // val is array
      li.innerHTML = `${keys[i]}`;
      const ulArr = document.createElement("ul");
      for (let [val_idx, x] in val.entries()) {
        const liArr = document.createElement("li");
        if ((!Array.isArray(x)) && typeof(x) === "object") {
          // element in val is an object
          const href = document.createElement("a");
          href.setAttribute("href", "#");
          viewName = `${keys[i]} ${val_idx}`;
          href.innerHTML = viewName;
          liArr.appendChild(href);
          liArr.addEventListener("click", drawViewNext.bind(this, data, data[keys[i]][val_idx], viewName));
        } else {
          liArr.innerHTML = x;
        }
        ulArr.appendChild(liArr);
        li.appendChild(ulArr);
      }
    } else if (typeof(val) === "object" && val !== null) {
      // val is json object
      const href = document.createElement("a");
      href.setAttribute("href", "#");
      href.innerHTML = keys[i];
      li.appendChild(href);
      li.addEventListener("click", drawViewNext.bind(this, data, data[keys[i]], keys[i]));
    } else {
      // is regular value e.g. int, bool, etc.
      li.innerHTML = `${keys[i]}: ${val}`;
    }
    jsonUl.appendChild(li);
  }
}

function drawViewNext(data, dataNext, keyView) {
  stackView.push(data);
  stackKey.push(keyView);
  drawView(dataNext);
}

function drawViewPrev() {
  const dataPrev = stackView.pop();
  stackKey.pop()
  drawView(dataPrev);
}
