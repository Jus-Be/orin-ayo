# Summary
<img src=https://jus-be.github.io/orin-ayo/assets/orinayo.png>

Orin Ayo is an Arranger/Looper Controller. 

It was originally developed to turn a Guitar Hero game controller HID device into a chord based MIDI controller for an arranger keyboard, module, looper, device or application. It lets you play chords and control the arranger or looper with the buttons on a Guitar Hero games controller.

https://github.com/Jus-Be/orin-ayo/assets/110731/cd309c44-3d11-4fe2-b19d-0ca406c18fa5

This is Orin Ayo in action on a typical Sunday Morning church service. 

The music is played live with a [Logitech Wireless Guitar Controller](https://www.amazon.co.uk/Logitech-Wireless-Guitar-Controller-Premiere/dp/B001MV7D10/ref=sr_1_16?crid=14Y5WHJKI2DVE). The wireless dongle is plugged into a MacAir laptop running Orin Ayo and [Musiclab's Real LPC](https://www.musiclab.com/products/reallpc/info.html). The [Boss RC 600 Loop Station](https://www.boss.info/global/products/rc-600) is connected to the MacAir by MIDI and audio with a USB cable. It sounds like a backing track, but those chord loops (C, F, G & Am) are played live on the logitech with realtime controls to the drum machine in the RC 600.

# How to setup
Orinayo can be setup and accessed as follows:

- Type https://jus-be.github.io/orin-ayo/index.html directly into a Chrome or Edge browser.
- Install it as a browser extension for Google Chrome and Microsoft Edge from https://chromewebstore.google.com/detail/orinayo/mhnemaeacdgnkmoibfeodelijegakklp
- On Windows 10+ desktops, download orinayo.exe and run it directly from a desktop. It loads the above web page using webview2. See https://github.com/jchv/go-webview2. If you are using Windows 10+, the WebView2 runtime should already be installed. If you don't have it installed, you can download and install a copy from Microsoft's website - https://developer.microsoft.com/en-us/microsoft-edge/webview2/

## How to use
Currently, the following devices and applications are supported and confirmed working:

### Arrangers
- Ketron Event 76/61 keyboards, Event-X module, SD9 Series keyboard and SD90 module
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

<img src=https://jus-be.github.io/orin-ayo/assets/guitar_hero.png>

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

# Other Features 
Pressing down on any of the five sections in the slider bar at the same time the strum bar is moved up or down can be used to perform other features.
This includes sending Foot Switch on/off mesages to Ketron Arrangers that can be used to mute arranger parts or perform any custom feature required by the user.

Button | Strum Up     | Strum Down
---    | ---          | ---
Green  | Play BREAK   |  Play FILL
Red    | Ketron FS-9  | Ketron FS-8
Yellow | Ketron FS-11 | Ketron FS-10
Blue   | Ketron FS-13 | Ketron FS-12
Orange | Ketron FS-7  | Ketron FS-6

# Current Version
<img src=https://jus-be.github.io/orin-ayo/assets/orinayo_experimental.png>

It recognises other non-keyboard USB MIDI controllers (like Artiphon Instrument 1 or Chorda) and enables them to be used as an arranger controller as well. Note that only the first five pads are used like a guitar controller. The strum bridge pads are used to provide control (strum, start/stop, fill, next/prev section).

It has an internal arranger engine implemented in JavaScript that can play Yamaha SFFx or Ketron KST files. 

It has an internal synth engine (based on [https://github.com/gree/sf2synth.js/](sf2synth.js)) that can play the styles using sound font (sf2) files with WebAudio.

The internal synth and style engines are experimental and require a bit more work to be usable.


