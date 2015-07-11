document.addEventListener("DOMContentLoaded", function(){
  var csvRequest = new Request({
      url:"articles/first.txt",
      onSuccess:function(response){
          //The response text is available in the 'response' variable
          //Set the value of the textarea with the id 'csvResponse' to the response
          $("csvResponse").value = response;
      }
  }).send(); //Don't forget to send our request!
},false);
