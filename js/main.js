var actualSignal=0;
var maxDist=0;
var minDist=0;
var flagOben=false;
var flagUnten=false;
var halfstep=0;
var threshold=20;
var oldSignal;
var step=0;
var ersteSchritt=false;

var client;

$(function(){

  $('#los').click(function(){
       client = mqtt.connect('mqtt://walkwithme:hongkong@broker.shiftr.io', {
          clientId: $('#peer_name').val()
        });
        $("div#login").empty();
        $("div#login").append("<p align=center Stil3>connected</p>");

        client.suscribe('/step');
        client.on('message', function (topic, message) {
          console.log('new message:', topic, message.toString());
    });
  });
});

window.ondevicemotion = function(event) {
  ax = event.accelerationIncludingGravity.x;
  ay = event.accelerationIncludingGravity.y;
  az = event.accelerationIncludingGravity.z;

 $("p.acc").text(ax +  " , " +  ay + " , " +  az);
  rotation = event.rotationRate;
  if (rotation != null) {
    arAlpha = Math.round(rotation.alpha);
    arBeta = Math.round(rotation.beta);
    arGamma = Math.round(rotation.gamma);
  }


  $("p.gyro").text((arAlpha+100) + " ," + arBeta + ", " + arGamma);

    $("p.step").text("step count: " + step);

  $("h1.TITLE").css("color", "#ff00" + arAlpha*10);
  runMovement(arAlpha+100);

}




function runMovement(valueY) {

  actualSignal=valueY;
  onMovement();
}

function onMovement ()
{

  if (actualSignal > maxDist)//SHIFTING MAX DISTANCE
  {
    maxDist = actualSignal;
  }
  if (actualSignal < maxDist-threshold && flagOben==false)//FLIPPING VALUES OBEN
  {
    step++;

    if(client) {
      client.publish("step", $('#peer_name').val()/$('#place').val());
    }

    //HIER WÄRE DER MOMENT EIN KLANG ZU TRIGGERN
    minDist = actualSignal;
    flagOben=true;
    flagUnten = false;
  }
  if (actualSignal < minDist)//SHIFTING MIN DISTANCE
  {
    minDist = actualSignal;
  }
  if (actualSignal > minDist+threshold && flagUnten==false)//FLIPPING VALUES UNTEN
  {
    //DAS PASSIERT AUCH NUR EINMAL
    maxDist = actualSignal;

    flagUnten=true;
    flagOben=false;
  }
}
