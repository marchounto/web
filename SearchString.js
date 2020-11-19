function loadBook(filename, displayName){
    let currentBook="";
    document.getElementById("filename").innerHTML = displayName;
    document.getElementById("searchstat").innerHTML = "";
    document.getElementById("keyword").value = "";

    var xhr = new XMLHttpRequest();
    xhr.withCredentials="true"
    xhr.open("GET","./" + filename, true);
    xhr.send();

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            currentBook = xhr.responseText;
            getDocsStats(currentBook);
            
            currentBook = currentBook.replace(/(&:\r\n|\r|\n)/g, '<br>');

            

            document.getElementById("fileContent").innerHTML = currentBook;

            document.getElementById("fileContent").scrollTop =0;
        }
    };
}

function getDocsStats(fileContent){
    var docLength = document.getElementById("docLength");
    var wordCount = document.getElementById("wordCount");
    var charCount = document.getElementById("charCount");

    let content = fileContent.toLowerCase();
    let wordArray = content.match(/\b\S+\b/g);// stock all the worls into an array
    let wordDictionnary = {};
    //count every word in a word array and put them in a dictionnary
    for (let word in wordArray){
        let wordIndex = wordArray[word];
        if(wordDictionnary[wordIndex] > 0){
            wordDictionnary[wordIndex] +=1;
        }
        else{
            wordDictionnary[wordIndex] =1;
        }
    }
      //sorting the dictionnary by values by puting them into an array
      var rtrnArray = []
      
      for (var key in wordDictionnary) {
        rtrnArray.push([ key, wordDictionnary[key] ])
      }
      rtrnArray.sort(function compare(kv1, kv2) {
        return kv2[1] - kv1[1]
      })
    console.log(rtrnArray);
   

    let wordListSorted = rtrnArray

    var top5words = wordListSorted.slice(0,6);
    var last5words = wordListSorted.slice(-6, wordListSorted.length);

    //write results in the html
    writeTemplate(top5words, document.getElementById('mostUsed'));
    writeTemplate(last5words, document.getElementById('leastUsed'));
    docLength.innerText = "Document Length : " + content.length;
    wordCount.innerText = "Word Count : " + wordArray.length;
    

}


function writeTemplate(items, element){
    let rowTempalte = document.getElementById("template-ul-items");
    let templateHTML = rowTempalte.innerHTML;
    let results = ""
    for(i=0 ; i < items.length-1;i++){
        results += templateHTML.replace('{{val}}', " word :" + items[i][0] + "  Occurence : " + items[i][1]+ "  times")
    }

    element.innerHTML = results;
}
//mark the world in search 
function highlightWord(){
    var keyword = document.getElementById("keyword").value;
    var display = document.getElementById('fileContent');
    var newContent = "";
    
    //find all the occurences
    let spans = document.querySelectorAll("mark");

    for (var i=0; i< spans.length; i++){
        spans[i].outerHTML = spans[i].innerHTML;
    }

    var re = new RegExp(keyword, "gi");
    var replaceText = "<mark od ='markMe'>$&</mark>";
    var currentBook = display.innerHTML;
    
    newContent = currentBook.replace(re, replaceText);

    display.innerHTML = newContent;
    var count = document.querySelectorAll("mark");
    document.getElementById("searchstat").innerHTML = "found " + count.length + " occurences";

    if (count > 0){
        var element = document.getElementById("markMe");
        element.scrollIntoView;
    }
}