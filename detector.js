let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/8-740vK7q/';

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";
var label2 = "";

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  var canvas = createCanvas(1100, 900);
  background(255, 0, 200);
  // Create the video
  video = createCapture(VIDEO);
  video.size(1100, 800);
  video.hide();

  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('detector-holder');

  flippedVideo = ml5.flipImage(video);
  // Start classifying
  classifyVideo();
}

function draw() {
  background(0);
  // Draw the video
  image(flippedVideo, 0, 0);

  // Draw the label
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);
  text(label2, width / 2, height - 50);
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
  flippedVideo.remove();

}

var predVal = ""
var countSameFrame = ""
var finalText = ""

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.

  var oldPredVal = predVal

  predVal = results[0].label
  if (oldPredVal == predVal) {
    countSameFrame += 1;
  } else {
    countSameFrame = 0
  }

  console.log(countSameFrame);

  if (countSameFrame > 30) {
    countSameFrame = 0;
    if (predVal == "Nothing") {
      predVal = ""
    }
    finalText = finalText + predVal;
  }

  // console.log("results[0].label: ", results[0].label);

  label2 = "My name is: " + finalText;
  label = results[0].label;

  // Classifiy again!
  classifyVideo();
}