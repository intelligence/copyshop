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
  //console.log(event);

  const currentSheet = event.target.closest('.sheet');
  let nextSheet = currentSheet.nextElementSibling;

  if (typeof nextSheet === 'undefined' || !nextSheet) {
    const parentNode = currentSheet.parentNode;
    nextSheet = parentNode.children[0];
  }

  currentSheet.classList.add('isMovingOffscreen');
  nextSheet.classList.add('isCurrent');

  setTimeout(function() {
    currentSheet.classList.remove('isCurrent');
    currentSheet.classList.remove('isMovingOffscreen');
  }, 500)

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

  setTimeout(function () {
    const sheets = document.querySelectorAll('.sheet--publication');

    for (var i = 0; i < sheets.length; i++) {
      sheets[i].classList.remove('isHidden');
    }
  }, 500);


}

function setupCloseIndexBtn() {
  const btns = document.querySelectorAll('.js-closeIndex');

  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function(event) {
      closeIndex(event);
    });
  }  
}




function getElementIndex(node) {
    var index = 0;
    while ( (node = node.previousElementSibling) ) {
        index++;
    }
    return index;
}


function revealPreview(event) {
  const currentSheet = event.target.closest('.sheet');
  const indexOfSheet = getElementIndex(currentSheet);

  const stack = currentSheet.closest('.stack');
  const totalSheets = stack.children.length

  const publicationID = totalSheets - indexOfSheet;

  //console.log(publicationID);

  const preview = previewObject[publicationID];

  //console.log(preview.type);
  //console.log(preview.content);

  const targetSheet = document.querySelector('.sheet--info');


  const previewDiv = document.createElement('div');
  previewDiv.classList.add('sheet__preview');

  if(preview.type == 'text') {
    previewDiv.innerHTML = preview.content;
    previewDiv.classList.add('isText');
  } else if(preview.type == 'image') {
    //console.log('image!');
    //console.log(preview.content);
    const img = document.createElement('img');
    img.classList.add('img-fluid');
    img.src = preview.content;
    previewDiv.appendChild(img);
    previewDiv.classList.add('isImage');
  }

  targetSheet.querySelector('.sheet__inner').appendChild(previewDiv);
  targetSheet.querySelector('.sheet__content').classList.add('isHidden');
}

function removePreview(event) {
  const targetSheet = document.querySelector('.sheet--info');
  targetSheet.querySelector('.sheet__content').classList.remove('isHidden');

  const preview = targetSheet.querySelector('.sheet__preview');
  preview.parentNode.removeChild(preview);
}


function setupPreviewBtns() {
  const btns = document.querySelectorAll('.js-preview');

  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('mouseenter', function(event) {
      revealPreview(event);
    });

    btns[i].addEventListener('mouseleave', function(event) {
      removePreview(event);
    });
  }  
}




function goToPublication(event) {
  const clickedPublication = event.target.closest('.publication');
  const indexOfPublication = getElementIndex(clickedPublication);

  const currentPublication = document.querySelector('.sheet--publication.isCurrent.isFlipped');
  const sheets = document.querySelectorAll('.sheet--publication');


  if(currentPublication != sheets[indexOfPublication]) {
    sheets[indexOfPublication].classList.add('isCurrent');
    sheets[indexOfPublication].classList.add('isFlipped');
    sheets[indexOfPublication].classList.remove('isHidden');

    currentPublication.classList.add('isHidden');
    currentPublication.classList.remove('isFlipped');
    currentPublication.classList.remove('isCurrent');
  }


  setTimeout(function () {
    closeIndex();
  }, 75);

}

function setupGoToBtns() {
  const btns = document.querySelectorAll('.js-goToPublication');

  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function(event) {
      goToPublication(event);
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

    title = title.innerHTML.replace('<br>', ' ');

    //console.log(title);

    //const br = title.querySelector('br');
    //br.parentNode.removeChild(br);
    //console.log(brs);
    /*for (var i = 0; i < brs.length; i++) {
        //brs[i].parentNode.removeChild(brs[i]);
    }*/

    array.push(number.innerHTML);
    array.push(title);
    if(author) { 
      array.push(author.innerHTML);
    }

    publicationsArray.push(array);
  }


  let publicationDiv = document.createElement('div');
  for (var i = 0; i < publicationsArray.length; i++) {
    const singlePublicationDiv = document.createElement('div');
    singlePublicationDiv.classList.add('publication');
    singlePublicationDiv.classList.add('js-goToPublication');

    const numberSpan = document.createElement('span');
    numberSpan.innerHTML = publicationsArray[i][0] + '. ';
    singlePublicationDiv.appendChild(numberSpan);

    const titleSpan = document.createElement('span');
    titleSpan.innerHTML = publicationsArray[i][1];
    singlePublicationDiv.appendChild(titleSpan);

    if(publicationsArray[i][2]) {
      const authorSpan = document.createElement('span');
      authorSpan.innerHTML = ' – ' + publicationsArray[i][2];
      singlePublicationDiv.appendChild(authorSpan);
    }

    publicationDiv.appendChild(singlePublicationDiv);
  }



  const backsides = document.querySelectorAll('.sheet--publication .sheet__back');
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

    setupGoToBtns();
 
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


function handleInitialLoadFlip() {

  const publicationSheets = document.querySelectorAll('.sheet--publication');


  for (var i = 0; i < publicationSheets.length; i++) {
    publicationSheets[i].classList.add('isHidden');
  }


  const firstPublicationFrontContent = publicationSheets[0].querySelector('.sheet__front .sheet__content');
  const splashSheet = document.querySelector('.sheet--splash');
  const splashSheetBack = splashSheet.querySelector('.sheet__back');
  splashSheetBack.appendChild(firstPublicationFrontContent.cloneNode(true));



  setTimeout(function (){
    //const stack = document.querySelector('.stack');
    const indexBtn = document.querySelector('.js-openIndex');

    const splash = document.querySelector('.sheet--splash');
    splash.classList.add('isFlipped');

    setTimeout(function () {
        indexBtn.classList.remove('isHidden');
        indexBtn.addEventListener('transitionend', function(event) {
          indexBtn.classList.remove('fade');

          for (var i = 0; i < publicationSheets.length; i++) {
            publicationSheets[i].classList.remove('isHidden');
          }

          //splashSheet.getElementById('')
          //var id = e.currentTarget.id.split('_')[1];
          // const id = publicationSheets[0].id.split('_')[1];
          // const clonedObjectCount = document.getElementById('objectCount_' + id);
          // const realObjectCount = publicationSheets[0].querySelector('#objectCount_' + id);

          //console.log(clonedObjectCount.innerHTML);
          // realObjectCount.innerHTML = clonedObjectCount.innerHTML;
          publicationSheets[0].classList.add('isCurrent');

          splash.parentNode.removeChild(splash);

        }, false);
    }, 500);
  }, 2000);

}









function handleCounts(d,resp){
    for (var i=0;i<resp.length;i++){
        var curObject = document.getElementById('objectCount_' + resp[i].item_id);
        if (curObject)
            updateCount(resp[i].item_id,resp[i].count);
    }
}

// check if user already has downloaded piece and update accordingly

/* REMOVE UNTIL AFTER VERNISSAGE*/

// var objects = document.querySelectorAll('.sheet--publication');
// [].forEach.call(objects, function(obj) {
//    if (localStorage.getItem(obj.id.split('_')[1]) !== null) {
//         // document.getElementById('alreadyOwns_' + obj.id.split('_')[1]).removeAttribute('style');
//         document.getElementById('print_' + obj.id.split('_')[1]).setAttribute('data-link', localStorage.getItem(obj.id.split('_')[1]));
//     }
// });



function printBtnListener(e){

    e.preventDefault();
    //all print btn ids should be named print_objectName
    var id = e.currentTarget.id.split('_')[1];
    var _pdf = document.getElementById('hidden-pdf');
    if (_pdf.src) _pdf.src = '';
    
    e.currentTarget.classList.add('preparing');
    //if not already downloaded
    if (!e.currentTarget.hasAttribute('data-link')){
        //console.log('yeow');
        //getRequest('https://r0l405b0oj.execute-api.eu-central-1.amazonaws.com/prod/link?id=' + id, id, handlePDFResponse);
        //getRequest('https://copyshop-pdfs.s3.eu-central-1.amazonaws.com/Mutual+Aid+Copyshop/Mutual+Aid+Document_Swedish.pdf', id, handlePDFResponse);
        handlePDFResponse(id, {link: '/Mutual+Aid+Document_Swedish.pdf'}, false);
    } else 
        //handlePDFResponse(id, {link: e.currentTarget.getAttribute('data-link'), count: (100 - parseInt(document.getElementById('objectCount_'+id).innerText))}, true);
        console.log('error');
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
    //console.log(id);
    //console.log(resp);

    //var pdf = '/pdfs/' + id + '/' + resp.link; //resp.link.split('_')[0] + '/' + resp.link;
    var pdf = resp.link; //resp.link.split('_')[0] + '/' + resp.link;
    //var updatedCount = resp.count;
    document.getElementById('hidden-pdf').addEventListener('load', iframeLoadedListener);
    document.getElementById('hidden-pdf').src = pdf;
    //updateCount(id, updatedCount);
    if (!alreadyOwns) {
        //localStorage.setItem(id, resp.link);
        /* UNCOMMENT WHEN LIVE */
        document.getElementById('print_' + id).setAttribute('data-link', resp.link);
    }
}

function iframeLoadedListener(e){
    if (document.querySelector('.preparing')) document.querySelector('.preparing').classList.remove('preparing');
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
  setupPreviewBtns();

  populateIndex();

  // handleInitialLoad();
  handleInitialLoadFlip();

  var printButtons = document.querySelectorAll('.js-printPublication');
  [].forEach.call(printButtons, function(btn) {
      btn.addEventListener('click', printBtnListener);
  });

  // getRequest('https://r0l405b0oj.execute-api.eu-central-1.amazonaws.com/prod/status',{},handleCounts);
});


window.addEventListener('resize', function(event) {
  applyWidthAndHeight();
});




