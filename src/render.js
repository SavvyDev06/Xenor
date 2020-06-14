//Buttons
const videoElement = document.querySelector('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoSelectBtn = document.getElementById('videoSelectBtn');
const copyToClipboardBtn = document.getElementById('copyToClipboardBtn');
videoSelectBtn.onclick = getVideoSources;

const { desktopCapturer, remote } = require('electron');
const { dialog, Menu } = remote;
const { clipboard } = require('electron');

var copyFilePathToClipboardToggle = true;

copyToClipboardBtn.onclick = temp => {
    if (copyFilePathToClipboardToggle == true) {
        copyToClipboardBtn.classList.add('is-danger');
        copyFilePathToClipboardToggle = false;
        copyToClipboardBtn.innerText = 'Copy Path to Clipboard: No';
    }
    else {
        copyToClipboardBtn.classList.remove('is-danger');
        copyFilePathToClipboardToggle = true;
        copyToClipboardBtn.innerText = 'Copy Path to Clipboard: Yes';
    }
};


//Get the available video sources
async function getVideoSources () {
    //Get the desktopCapturer from the main process to return it's input sources
    const inputSources = await desktopCapturer.getSources({
        types: ['window', 'screen']
    });

    //Display the sources in a menu
    const videoOptionsMenu = Menu.buildFromTemplate(
        inputSources.map(source => {
            return {
                label: source.name,
                click: () => selectSource(source)
            };
        })
    );

    //Pop-up the video options menu when the function is called (when the text is clicked)
    videoOptionsMenu.popup();

}

let mediaRecorder; //MediaRecorder instance to capture footage

startBtn.onclick = e => {
    mediaRecorder.start();
    startBtn.classList.add('is-danger');
    startBtn.innerText = 'Recording';
};

stopBtn.onclick = e => {
    mediaRecorder.stop();
    startBtn.classList.remove('is-danger');
    startBtn.innerText = 'Start';
};

const recordedChunks = [];

//Change the videoSource window to record
async function selectSource(source) {
    videoSelectBtn.innerText = source.name;

    const constraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id
            }
        }
    };

    //Create a Stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    //Preview the source in a video element
    videoElement.srcObject = stream;
    videoElement.play();

    //Create the Media Recorder
    const options = { mimeType: 'video/webm; codecs=vp9' };
    mediaRecorder = new MediaRecorder(stream);

    //Register Event Handlers
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;
}

//Captures all recorded chunks
function handleDataAvailable(e) {
    console.log('Video Data Available!');
    recordedChunks.push(e.data);
}

const { writeFile } = require('fs');

//Saves the video file on stop
async function handleStop(e) {
    const blob = new Blob(recordedChunks, {
        type: 'video/webm; codecs=vp9'
    });

    const buffer = Buffer.from(await blob.arrayBuffer());

    const { filePath } = await dialog.showSaveDialog({
        buttonLabel: 'Save Video',
        defaultPath: `XenorVideo - ${Date.now()}.webm`
    });

    //Log the chosen file path
    console.log(filePath);

    //Write the file using fs
    writeFile(filePath, buffer, () => console.log('Video Saved Successfully!'));
    
    if (copyFilePathToClipboardToggle == true) {
        clipboard.writeText(filePath);
    }
}