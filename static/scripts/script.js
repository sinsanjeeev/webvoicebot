let conversationContext = '';
let recorder;
let context;
let SpeechRecognition;
let recognition
var synth = window.speechSynthesis;
function displayMsgDiv(str, who) {
  const time = new Date();
  let hours = time.getHours();
  let minutes = time.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour "0" should be "12"
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + ':' + minutes + ' ' + ampm;
  let msgHtml = "<div class='msg-card-wide mdl-card " + who + "'><div class='mdl-card__supporting-text'>";
  msgHtml += str;
  msgHtml += "</div><div class='" + who + "-line'>" + strTime + '</div></div>';

  $('#messages').append(msgHtml);
  $('#messages').scrollTop($('#messages')[0].scrollHeight);

  if (who == 'user') {
    $('#q').val('');
    //$('#q').attr('disabled', 'disabled');
    $('#p2').fadeTo(500, 1);
  } else {
   // $('#q').removeAttr('disabled');
    $('#p2').fadeTo(500, 0);
  }
}

$(document).ready(function() {
  //$('#q').attr('disabled', 'disabled');
  $('#q').removeAttr('disabled');
  $('#p2').fadeTo(500, 1);
  $('#h').val('0');



//  $.ajax({
//    url: '/api/conversation',
//    convText: '',
//    context: ''
//  })
//    .done(function(res) {
//      conversationContext = res.results.context;
//      //play(res.results.responseText);
//      play('Welcome to Voice Bot');
//      //displayMsgDiv(res.results.responseText, 'bot');
//      displayMsgDiv('Welcome to Voice Bot', 'bot');
//    })
//    .fail(function(jqXHR, e) {
//      console.log('Error: ' + jqXHR.responseText);
//    })
//    .catch(function(error) {
//      console.log(error);
//    });
 //play('Welcome to Voice Bot');
 displayMsgDiv('Welcome to Voice Bot', 'bot');
 speak('Welcome to Voice Bot')
});

function callConversation(res) {
  //$('#q').attr('disabled', 'disabled');
  if(res=='Internal Server Error' || res=='Sorry, didn\'t get that. please try again!' ){
    console.log(res)
  }else{
      $.post('/api/conversation', {
        convText: res,
        context: JSON.stringify(conversationContext)
      })
        .done(function(res, status) {
          conversationContext = res;
          speak(res);
          displayMsgDiv(res, 'bot');
        })
        .fail(function(jqXHR, e) {
          console.log('Error: ' + jqXHR.responseText);
        });
  }

    //conversationContext = res
    //play(res);
    //displayMsgDiv(res, 'bot');
}

function play(inputText) {
  let buf;

  const url = '/api/text-to-speech';
  const params = 'text=' + inputText;
  const request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(
      request.response,
      function(buffer) {
        buf = buffer;
        play();
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  };
  request.send(params);

  // Play the loaded file
  function play() {
    // Create a source node from the buffer
    const source = context.createBufferSource();
    source.buffer = buf;
    // Connect to the final output node (the speakers)
    source.connect(context.destination);
    // Play immediately
    source.start(0);
  }
}

const recordMic = document.getElementById('stt2');
recordMic.onclick = function() {

  const fullPath = recordMic.src;
  const filename = fullPath.replace(/^.*[\\/]/, '');
  if (filename == 'mic.gif') {
    try {
      recordMic.src = './static/img/mic_active.png';
      startRecording();
      console.log('recorder started');
      $('#q').val('I am listening ...');
    } catch (ex) {
      // console.log("Recognizer error .....");
    }
  } else {
    stopRecording();
    $('#q').val('');
    recordMic.src = './static/img/mic.gif';
  }
};

function startUserMedia(stream) {
  const input = context.createMediaStreamSource(stream);
  console.log('Media stream created.');
  // Uncomment if you want the audio to feedback directly
  // input.connect(audio_context.destination);
  // console.log('Input connected to audio context destination.');

  // eslint-disable-next-line
  recorder = new Recorder(input);
  console.log('Recorder initialised.');
}

function speak(inputTxt){
//speechSynthesis.speak(new SpeechSynthesisUtterance("hello world"));
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    if (inputTxt!== '') {
    var utterThis = new SpeechSynthesisUtterance(inputTxt);
    utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
    }
//    utterThis.onerror = function (event) {
//        console.error('SpeechSynthesisUtterance.onerror');
//    }
//    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
//    for(i = 0; i < voices.length ; i++) {
//      if(voices[i].name === selectedOption) {
//        utterThis.voice = voices[i];
//        break;
//      }
//    }
//utterThis.voice = 'Microsoft Zira Desktop - English (United States)';
    utterThis.pitch = 1;
    utterThis.rate = 1;
    synth.speak(utterThis);
  }
}

function startRecording(button) {
  if(recognition){
   recognition.start()
   console.log('Recording Using Web Speech API...');
   $('#st').attr('style','');
  }else{
    recorder && recorder.record();
    console.log('Recording Using Native Approach...');

  }


}

function endOfSpeechRecognition(event) {
 console.log(event)
}
function errorOfSpeechRecognition(event) {
 console.log(event)
}
function resultOfSpeechRecognition(event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    console.log(transcript)
     var interim_transcript = '';
     var final_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
	console.log(final_transcript+'*****************'+interim_transcript)
    //callConversation(transcript);
//    if(final_transcript!=''){
//      lastmsg=$('#q').val()
//      if(lastmsg!=''){
//      $('#q').val(linebreak(lastmsg+''+final_transcript));
//      }else{
//       $('#q').val(linebreak(final_transcript));
//      }
//
//    }
    $('#q').val(linebreak(final_transcript));
    if(interim_transcript!=''){
     $('#q').val(linebreak(interim_transcript));
    }

    //displayMsgDiv(transcript, 'user');
}
var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}


function stopRecording(button) {
 if(recognition){

  msg=$('#q').val()
  if(msg=='' || msg == 'I am listening ...'){
  displayMsgDiv('Your query is not recorded.Please try again' , 'user');
  speak('Your query is not recorded Please try again')
  return
  }
  displayMsgDiv(msg , 'user');

  callConversation(msg)
  $('#q').val('');
  recognition.stop();
 }else{
 recorder && recorder.stop();
  console.log('Stopped recording.');

  recorder &&
    recorder.exportWAV(function(blob) {
      console.log(blob);
      const url = '/api/speech-to-text';
      const request = new XMLHttpRequest();
      request.open('POST', url, true);
      //request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      // Decode asynchronously
      request.onload = function() {
        callConversation(request.response);
        displayMsgDiv(request.response, 'user');
      };
      context.decodeAudioData(
      blob,
      function(buffer) {
        buf = buffer;
        play();
      })
      request.send(blob);
    });

  recorder.clear();
 }

}

window.onload = function init() {
  try {
    // webkit shim
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    // eslint-disable-next-line
    window.URL = window.URL || window.webkitURL;
    SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(SpeechRecognition) {
      console.log("Your Browser supports speech Recognition");
      recognition = new webkitSpeechRecognition();
      recognition.lang = 'en-IN';
        recognition.continuous = true;
  recognition.interimResults = true;
      recognition.addEventListener("result", resultOfSpeechRecognition)
      recognition.addEventListener("error ", errorOfSpeechRecognition)
      recognition.addEventListener("end ", endOfSpeechRecognition)
    }else{
        console.log("Your Browser does not  supports speech Recognition");
         context = new AudioContext();
    console.log('Audio context set up.');
    console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
        navigator.getUserMedia(
        {
          audio: true
        },
        startUserMedia,
        function(e) {
          console.log('No live audio input: ' + e);
        }
      );
    }

  } catch (e) {
    alert('No web audio support in this browser!');
  }


};
