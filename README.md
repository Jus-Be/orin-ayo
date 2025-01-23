# Introduction
Orin Ayo is live music production web application implemented in JavaScript and runs inside a browser as a web page, progressive web app (PWA) or browser extension external window.

# Screenshots
## Progressive Web App (PWA)
Only live music playing is accesible from this application mode.

<img width=512 src=https://jus-be.github.io/orinayo/assets/screenshots/orinayo_mobile.jpeg>

## Browser Extension/Web Page/Desktop App View
The full application features to create, extend and play live music is available from this application mode.

<img src=https://jus-be.github.io/orinayo/assets/screenshots/orinayo.png>

# Description
It was originally developed to turn a guitar games controller HID device into a chord based MIDI controller for an arranger keyboard (Yamaha PSR SX-600), module (Ketron SD90), looper (Boss RC600) device or application (Giglad). It lets you play chords and control the hardware arranger or looper with the buttons on a gutar games controller. When combined with RealGuitar or RealLPC from MusicLabs, it becomes a complete live music production system.

Now it can work standalone without depending on an external musical hardware device to create quality backing music to accompany a singer (including yourself) or a solo musician playing a melodic instrument.

- It has an internal smart sampler that can play audio loops in like midi styles files. It can be extended with external OGG audio loop files in OrinAyo format.
- It has an internal arranger engine that can play midi style files in Yamaha SFFx, Casio AC7 or Ketron KST format.
- It uses WebAudio to implement an internal synth engine (based on [sf2synth.js by GREE](https://github.com/gree/sf2synth.js/)) that can play the styles using sound font (sf2) files with WebAudio as well as notes from a standrd midi keyboard controller.
- It has internal strumable acoustic and electric guitars using [WebAudioFont by Srgy Surkv](https://github.com/surikov/webaudiofont). It behaves just like RealGuitar does with a guitar hero controller.
- It has a pedalboard for the internal guitar effects using [pedalboard by Trys Mudford](https://github.com/trys/pedalboard)
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

# How to setup
To use OrinAyo in standalone mode, generating all the music from WebAudio, you would need a high spec PC or mobile phone like an Intel iCore 7 or Apple M series laptop or a Samsung S24 mobile phone.
To use it as a midi controller on external hardware, a standard laptop should work fine.

Orinayo can be setup and accessed as follows:

- Type https://jus-be.github.io/orinayo/index.html into a Chrome or Edge browser to use it directly from a web page.
- Install it as a progressive web app from the web page. Click on the "install" or "Add to home page" browser links/buttons.
- Install it as a browser extension for Google Chrome and Microsoft Edge from https://chromewebstore.google.com/detail/orinayo/mhnemaeacdgnkmoibfeodelijegakklp
- On Windows 10+ desktops, download orinayo.exe and run it directly from a desktop. It loads the above web page using webview2. See https://github.com/jchv/go-webview2. If you are using Windows 10+, the WebView2 runtime should already be installed. If you don't have it installed, you can download and install a copy from Microsoft's website - https://developer.microsoft.com/en-us/microsoft-edge/webview2/

## How to use
Currently, the following devices and applications are supported and confirmed working:

### Guitar Controllers
- Logitech Guitar Hero Controller
- PDP Riff Master Guitar Controller (PS4/PS5)
- LiberLive C1 Guitar
- Lava Genie Guitar

### Arrangers
- Ketron Event 76/61 keyboards, Event EVM, Event-X module, SD9 Series keyboard and SD90 module
- Yamaha PSR SX-600
- Yamaha MODX and Montage
- Yamaha QY100
- Korg Micro Arranger
- Giglad (Application)

The Yamaha MODX and Montage are not really arrangers, but have arpeggios that can be triggeresd via MIDI making them suitable for Orin Ayo. The high-end Yamaha PSR arrangers can be controlled by MIDI and only PSR SX-600 has been tested. If your Yamaha PSR  uses the same sysex messages like the SX-600 or QR100, it should work. The same applies for Korg. It has been tested with the Micro Arranger, but not with the high-end PA series. The new Korg I3 was promising as it has same engine as a Micro Arranger, but midi control of styles was dropped like Yamaha PSR E series arrangers (aarrgh!!).

### Loopers
- Boss RC 600 Loop Station
- Aeros Loop Studio

### MIDI Controllers
- Artiphon Instrument 1
- Artiphon Chorda (wireless bluetooth mode only)

Orin Ayo can also play the strum/pick patterns for the virtual guitars from Music Labs like RealGuitar, RealLPC, etc in joystick mode along with the arranger or looper patterns.

<img src=https://jus-be.github.io/orinayo/assets/screenshots/guitar_hero.png>

# Chords
The five colored fret buttons generate CHORD midi notes which are send on MIDI channel 4 when the strum bar goes up or down.  Twenty chord shapes are supported. There are six basic popular chords (I, IIm, IIIm, IV, V & VIm) playable with a single or two fingers and fourteen other less used chords requring two, three or even four fingers. The chord mapping in Nashville number format is fixed for now. It will become configureable in a future version.

## Basic

Chord | Green    | Red      | Yellow  | Blue    |  Orange
---   | ---      | ---      | ---     | ---     | ---
1     |          |          |    X    |         | 
2m    |          |          |         |  X      | 
3m    |   X      |          |         |  X      | 
4     |          |          |         |         |  X
5     |   X      |          |         |         |  
6m    |          |   X      |         |         |  

## Advanced

Chord | Green    | Red      | Yellow  | Blue    |  Orange
---   | ---      | ---      | ---     | ---     | ---
1sus  |          |          |   X     |         |  X
1/3   |          |          |   X     |  X      |  
2     |          |   X      |         |  X      | 
3b    |          |   X      |         |  X      |  X
3     |    X     |          |   X     |  X      |
4min  |          |   X      |   X     |  X      |  X
4/5   |          |          |   X     |  X      |  X
4/6   |          |          |         |  X      |  X
5sus  |    X     |          |   X     |         |  
5min  |    X     |          |         |         |  X
5/7   |    X     |   X      |         |         | 
5b    |    X     |   X      |   X     |         | 
6     |          |   X      |   X     |  X      | 
7b    |          |   X      |   X     |         | 

Please note that the RC-600 Loop Station and Aeros Loop Studio have only six audio tracks. They can only play the basic six chords. However, when played together with the virtual guitars from Music Labs (RealGuitar, RealLPC, etc) in joystick mode as heard in the demo song above, the virtual guitars can handle the advanced mode chords and fill in the missing gaps. Arrangers do not have ths limitation but do not sound as realistic as a looper with the exception of the Ketron Event series which can play audio tracks in their styles.

# Start and Stop
The button on the Directonal (logo) knob used with the five colored buttons determines how the arranger style starts and stops. 

Pressing the button alone toggles start and stop playing the current selected musical style in the arranger.

Pressing the button as well as a colored fret button starts the style as follows:

Button | Starts  | Stops
---    | ---     | ---
Green  | Intro-2  | End-2
Red    | Intro-3  | End-3
Yellow | Intro-1  | End-1
Blue   | -       | -
Orange | Fade In | Fade Out

# Style Variations/Sections (A,B,C,D)
The Star-Power button and the START button are used to control the style variations.  

When the Star-Power button is pressed on its own, it will cycles the style variations A-->B-->C-->D-->A.  When a colored fret key is also pressed, then it will play a fill for the current playing variation.
The START button cycles back down from A<--B<--C<--D<--A. 

# Changing Song Key
Moving the Directonal (logo) knob right or up steps the playing key up ( C -> C#) and moving it left or down steps the playing key down (C -> B). 

Please note that this does nothing with a Looper. You have to preload the Looper with the audio files matching the song key. Both the RC 600 Loop Station and Aeros Loop Studio have memories to preload as many songs in all the needed keys for the live event. 

# Other Playing Features 
Pressing down on any of the five sections in the slider bar at the same time the strum bar is moved up or down can be used to perform other features.
This includes sending Foot Switch on/off mesages to Ketron Arrangers that can be used to mute arranger parts or perform any custom feature required by the user.

Button | Strum Up     | Strum Down
---    | ---          | ---
Green  | Play BREAK   |  Play FILL
Red    | Ketron FS-9  | Ketron FS-8
Yellow | Ketron FS-11 | Ketron FS-10
Blue   | Ketron FS-13 | Ketron FS-12
Orange | Ketron FS-7  | Ketron FS-6

# Notes
It recognises other non-keyboard USB MIDI controllers (like LiberLive C1, Artiphon Instrument 1 or Chorda) and enables them to be used as an arranger controller as well. 

When using LiberLive C1 guitar, it uses a modified 7 chord keys mapping (7b, 6m, 5, 1, 4, 2m, 3m) different from the standard (1, 2m, 3m, 4, 5, 6m, 7m) by LiberLive.
It will connect to the LiberLive C1 guitar by the Bluetooth connection used by the LiberLive mobile app. You can't use both OrinAyo and the mobile app at the same time.
You can select different drum beats and guitar styles for both paddles and OrinAyo will use the tempo set by LiberLive except for web-audio styles that have fixed tempos.

With Artiphon Instrument 1 and Chorda, only the first five pads are used like a Guitar Hero controller. The strum bridge pads are used to provide control (strum, start/stop, fill, next/prev section).
