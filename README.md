# Audio/Image Processing Demo

This repository is a demo app that automatically records audio from the users microphone for 5 seconds, and then re-plays that audio alongside a dummy image.

On the image side of things, a dummy image is pulled from imgur and loaded into a canvas node. the canvas then outputs the dataURL to the user to be able to upload base64 strings for both audio and image files.