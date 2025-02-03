# Introduction
Orin Ayo is live music production web application implemented in JavaScript and runs inside a browser as a web page, progressive web app (PWA) or browser extension external window.

# Description
It was originally developed to turn a guitar games controller HID device into a chord based MIDI controller for an arranger keyboard (Yamaha PSR SX-600), module (Ketron SD90), looper (Boss RC600) device or application (Giglad). It lets you play chords and control the hardware arranger or looper with the buttons on a gutar games controller. When combined with RealGuitar or RealLPC from MusicLabs, it becomes a complete live music production system.

Now it can work standalone without depending on an external musical hardware device to create quality backing music to accompany a singer (including yourself) or a solo musician playing a melodic instrument.

- It has an internal smart sampler that can play [audio loops](#audio-loops) like midi styles files. It can be extended with external OGG audio loop files in OrinAyo format.
- It has an internal arranger engine that can play midi style files in Yamaha SFFx, Casio AC7 or Ketron KST format.
- It uses WebAudio to implement the internal arranger synth engine (based on [sf2synth.js by GREE](https://github.com/gree/sf2synth.js/)) that can play the styles using sound font (sf2) files with WebAudio as well as notes from a standrd midi keyboard controller.
- It has internal strumable acoustic and electric guitars using [WebAudioFont by Srgy Surkv](https://github.com/surikov/webaudiofont). It behaves just like RealGuitar does with a guitar hero controller.
- It has a pedalboard for the internal guitar effects using [pedalboard by Trys Mudford](https://github.com/trys/pedalboard)
- It has internal keyboard sampler implemeted with [smplr by danigb](https://github.com/danigb/smplr) that provides multi-layed acoustic and electric pianos with a warm pad synth.
- It supports the [extended ChordPro format proposed by Paul J. Drongowski](https://sandsoftwaresound.net/chordpro-for-yamaha-accompaniment/). 
A ChordPro [editor](https://github.com/Jus-Be/chordpro-pdf-online) based on the chordpro-pdf-online project by [Ruth Wong](https://github.com/woshibiantai) is provided to edit a song and add extra directives for precise timing, section changes, tempo, etc.
- It uses the [Java code provided by Paul J. Drongowski](https://sandsoftwaresound.net/chordpro-auto-accompaniment-midi-messages/) to generate a midi file that can be played on OrinAyo and any compatible Yamaha keyboard like the PSR-SX600 with a different style each time. The song lyrics and chord symbols can be viewed live just like karoke. The user can learn or play along live with the song by muting the recorded chord progression.
- It can record a live perfomanmce as an audio file or as a video with lyrics file when playing a ChordPro generated midi file.

# In use
## Controlling a Boss RC-600 Looper device and playing MusicLab's RealLPC Guitar
This is Orin Ayo in action on a typical Sunday Morning church service. 

The music is played live with a [Logitech Wireless Guitar Controller](https://www.amazon.co.uk/Logitech-Wireless-Guitar-Controller-Premiere/dp/B001MV7D10/ref=sr_1_16?crid=14Y5WHJKI2DVE). The wireless dongle is plugged into a MacAir laptop running Orin Ayo and [Musiclab's Real LPC](https://www.musiclab.com/products/reallpc/info.html). The [Boss RC 600 Loop Station](https://www.boss.info/global/products/rc-600) is connected to the MacAir by MIDI and audio with a USB cable. It sounds like a backing track, but those chord loops (C, F, G & Am) are played live on the Logitech with realtime MIDI messages to the looper and drum machine in the RC 600.

https://github.com/Jus-Be/orinayo/assets/110731/cd309c44-3d11-4fe2-b19d-0ca406c18fa5

## Playing stand alone with WebAudio
The music is played live with the same Logitech Guitar controller, but using the interal smart audio loops which vary depending on what chord is played like a midi arranger. The guitar sound is coming from the internal guitar with effects from the internal pedal board.

https://github.com/user-attachments/assets/12c69505-3887-4a6f-af7a-124bebd15741

# How to use
See [User Guide](USER-GUIDE.md)

# Audio Loops
The audio loops used by the smart sampler for creating music styles are created by recording a demo song I wrote called "Orin Ayo" with arranger styles from various keyboards I used over the years.
I have also provide the tools I used to create the compressed OGG files for OrinAyo in the [tools](./tools) folder.

These loops are limited demos of what can be achieved with these arranger keyboards. You are limited to a fixed tempo, maj, min and sus chord types and advised to acquire these keyboards and additional styles to get the full quality (WAV files) and value of these styles for any serious use.

The keyboard and styles used in the demo audio loops by OrinAyo smart sampler include:

## Ketron
- Ketron SD90 Arranger module internal styles
- Ketron Event Arranger keyboard internal styles

## Yamaha
- PSR SX-600 Arranger keyboard internal styles

## Roland
- Go:Keys 5 Arranger keyboard

## Additional Styles for the Ketron Event
- Realdrum, Realbass and Realchord styles from https://store.sc-multimedia.nl/



