function checkTime(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    // add a zero in front of numbers<10
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('currentTime').innerHTML = h + ':' + m + ':' + s;
    var t = setTimeout(function () {
        startTime()
    }, 500);
}









 /**
  * Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging
  * images to fit into a certain area.
  *
  * @param {Number} srcWidth width of source image
  * @param {Number} srcHeight height of source image
  * @param {Number} maxWidth maximum available width
  * @param {Number} maxHeight maximum available height
  * @return {Object} { width, height }
  */
function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return { width: srcWidth*ratio, height: srcHeight*ratio };
}





function applyWidthAndHeight() {

  const sheetSize = getSize( document.querySelector('.sheet') )
  const calculatedSize = calculateAspectRatioFit(200, 283, sheetSize.width, sheetSize.height); // 595 * 842 = A4 Aspect Ratio

  const elements = document.querySelectorAll('.sheet__ratio');
  for (var i = 0; i < elements.length; i++) {
    //console.log(elements);

    elements[i].style.width = calculatedSize.width + 'px';
    elements[i].style.height = calculatedSize.height + 'px';
  }
}





function handlePublicationBrowsing(event) {
  const currentSheet = event.target.closest('.sheet');
  let nextSheet = currentSheet.nextElementSibling;

  if (typeof nextSheet === 'undefined' || !nextSheet) {
    const parentNode = currentSheet.parentNode;
    nextSheet = parentNode.children[0];
  }

  currentSheet.classList.add('isMovingOffscreen');
  nextSheet.classList.add('isCurrent');
  //currentSheet.addEventListener('transitionend', function(event) {
  setTimeout(function() {
    currentSheet.classList.remove('isCurrent');
    currentSheet.classList.remove('isMovingOffscreen');
  }, 500)

  //}, false);

}


function setupPublicationBtns() {

  const btns = document.querySelectorAll('.js-nextPublication');
  //console.log(btns);
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function(event) {
      handlePublicationBrowsing(event);
    });
  }  

}



function openIndex() {

  const btns = document.querySelectorAll('.btn--index');
  for (var i = 0; i < btns.length; i++) {
    btns[i].classList.toggle('isHidden');

    setTimeout(function () {
      document.querySelector('.js-closeIndex').classList.remove('isNotClickable');
      document.querySelector('.js-openIndex').classList.add('isNotClickable');
    }, 500);
  }



  const sheets = document.querySelectorAll('.sheet--publication');

  for (var i = 0; i < sheets.length; i++) {
    if(!sheets[i].classList.contains('isCurrent')) {
      sheets[i].classList.add('isHidden');
    } else {
      sheets[i].classList.add('isFlipped');
    }
  }
}


function setupOpenIndexBtn() {
  const btns = document.querySelectorAll('.js-openIndex');

  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function(event) {
      openIndex(event);
    });
  }  
}


function closeIndex() {

  const btns = document.querySelectorAll('.btn--index');
  for (var i = 0; i < btns.length; i++) {
    btns[i].classList.toggle('isHidden');

    setTimeout(function () {
      document.querySelector('.js-closeIndex').classList.add('isNotClickable');
      document.querySelector('.js-openIndex').classList.remove('isNotClickable');
    }, 500);
  }

  const sheet = document.querySelector('.sheet--publication.isCurrent');
  sheet.classList.remove('isFlipped');

  //sheet.addEventListener('transitionend', function(event) {
  setTimeout(function () {
    const sheets = document.querySelectorAll('.sheet--publication');

    for (var i = 0; i < sheets.length; i++) {
      sheets[i].classList.remove('isHidden');
    }
  }, 500);

  //}, false);

}

function setupCloseIndexBtn() {
  const btns = document.querySelectorAll('.js-closeIndex');

  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function(event) {
      closeIndex(event);
    });
  }  
}


function populateIndex() {

  let publicationsArray = [];
  const publications = document.querySelectorAll('.sheet--publication');
  for (var i = 0; i < publications.length; i++) {
    let array = []
    const number = publications[i].querySelector('.publication__number');
    let title = publications[i].querySelector('.publication__title');
    const author = publications[i].querySelector('.publication__author');

    //console.log(number.innerHTML);

    //console.log(title);

    title = title.innerHTML.replace('<br>', '');

    //console.log(title);

    //const br = title.querySelector('br');
    //br.parentNode.removeChild(br);
    //console.log(brs);
    /*for (var i = 0; i < brs.length; i++) {
        //brs[i].parentNode.removeChild(brs[i]);
    }*/

    array.push(number.innerHTML);
    array.push(title);
    array.push(author.innerHTML);

    publicationsArray.push(array);
  }


  let publicationDiv = document.createElement('div');
  for (var i = 0; i < publicationsArray.length; i++) {
    const singlePublicationDiv = document.createElement('div');
    singlePublicationDiv.classList.add('publication');

    const numberSpan = document.createElement('span');
    numberSpan.innerHTML = publicationsArray[i][0] + '. ';
    singlePublicationDiv.appendChild(numberSpan);

    const titleSpan = document.createElement('span');
    titleSpan.innerHTML = publicationsArray[i][1];
    singlePublicationDiv.appendChild(titleSpan);

    const authorSpan = document.createElement('span');
    authorSpan.innerHTML = ' – ' + publicationsArray[i][2];
    singlePublicationDiv.appendChild(authorSpan);

    publicationDiv.appendChild(singlePublicationDiv);
  }



  const backsides = document.querySelectorAll('.sheet__back');
  //console.log(backsides);
  for (var i = 0; i < backsides.length; i++) {
    const content = backsides[i].querySelector('.sheet__content');

    //console.log('hej');

    //console.log(content);

    const indexTitle = document.createElement('span');
    indexTitle.classList.add('heading--index')
    indexTitle.innerHTML = 'Index';

    //console.log(content);
    //console.log(publicationDiv);

    content.appendChild(indexTitle);
    content.appendChild(publicationDiv.cloneNode(true));

  } 
}


function handleInitialLoad() {

  setTimeout(function (){
    const splash = document.querySelector('.sheet--splash');
    const indexBtn = document.querySelector('.js-openIndex');

    const currentSheet = splash.closest('.sheet');
    let nextSheet = currentSheet.nextElementSibling;

    currentSheet.classList.add('isMovingOffscreen');
    nextSheet.classList.add('isCurrent');
    currentSheet.addEventListener('transitionend', function(event) {
      currentSheet.parentNode.removeChild(currentSheet);
      indexBtn.classList.remove('isHidden');
      indexBtn.addEventListener('transitionend', function(event) {
        indexBtn.classList.remove('fade');
      }, false);
    }, false);
  }, 2000);

}









function handleCounts(d,resp){
    for (var i=0;i<resp.length;i++){
        var curObject = document.getElementById('objectCount_' + resp[i].item_id);
        console.log(curObject);
        if (curObject)
            updateCount(resp[i].item_id,resp[i].count);
    }
}

// check if user already has downloaded piece and update accordingly
var objects = document.querySelectorAll('.sheet--publication');
[].forEach.call(objects, function(obj) {
   if (localStorage.getItem(obj.id.split('_')[1]) !== null) {
        document.getElementById('alreadyOwns_' + obj.id.split('_')[1]).removeAttribute('style');
        document.getElementById('print_' + obj.id.split('_')[1]).setAttribute('data-link', localStorage.getItem(obj.id.split('_')[1]));
    }
});



function printBtnListener(e){

    e.preventDefault();
    //all print btn ids should be named print_objectName
    var id = e.currentTarget.id.split('_')[1];
    //if not already downloaded
    if (!e.currentTarget.hasAttribute('data-link'))
        getRequest('https://r0l405b0oj.execute-api.eu-central-1.amazonaws.com/prod/link?id=' + id, id, handlePDFResponse);
    else 
        handlePDFResponse(id, {link: e.currentTarget.getAttribute('data-link'), count: (100 - parseInt(document.getElementById('objectCount_'+id).innerText))}, true);
};


function getRequest( url, data, callback ) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function(e) {
        // Success
        if( 200 === this.status ) {
            var resp = this.response;
            callback(data,resp);
        } else {
            console.log('Error Status: ', this.status);
        }
    };
    xhr.send();
}

function handlePDFResponse(id, resp, alreadyOwns = false){
    var pdf = 'pdf/' + resp.link.split('_')[0] + '/' + resp.link;
    var updatedCount = resp.count;
    document.getElementById('hidden-pdf').addEventListener('load', iframeLoadedListener);
    document.getElementById('hidden-pdf').src = pdf;
    updateCount(id, updatedCount);
    if (!alreadyOwns) {
        localStorage.setItem(id, resp.link);
        document.getElementById('print_' + id).setAttribute('data-link', resp.link);
    }
}

function iframeLoadedListener(e){
    window.frames['hidden-pdf'].print();
     document.getElementById('hidden-pdf').removeEventListener('load',iframeLoadedListener);
}

function updateCount(id,count) {
    document.getElementById('objectCount_' + id).innerText = (100-count) + '';
}








document.addEventListener('DOMContentLoaded', function(event) {
  applyWidthAndHeight();
  startTime();
  setupPublicationBtns();
  setupOpenIndexBtn();
  setupCloseIndexBtn();
  handleInitialLoad();

  populateIndex();

  var printButtons = document.querySelectorAll('.js-printPublication');
  [].forEach.call(printButtons, function(btn) {
      btn.addEventListener('click', printBtnListener);
  });

  getRequest('https://r0l405b0oj.execute-api.eu-central-1.amazonaws.com/prod/status',{},handleCounts);
});


window.addEventListener('resize', function(event) {
  applyWidthAndHeight();
});




