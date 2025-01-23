# Quick Start
## Install
Orina Ayo work best with in desktop mode with a Logitech Guitar Hero Controlller or a LiberLive C1. If you do not have a guitar controller nor a keyboard midi controller, you can still use a wireless numeric keypad or the numeric keypad of your desktop computer. See supported devices below for more details.

Also note that Gamepad compatible guitar controllers like the PDP Riff Master or the Logitech Guitar hero will only work from a desktop computer. On mobile phones, only Bluetooth midi controllers or guitars like LiberLive C1 amd Lava Genie will work with OrinAyo. 

When OrinAyo works in standalone mode and not controlling an external device, generating all the music from WebAudio, you would need a high spec PC or mobile phone like an Intel iCore 7 or Apple M series laptop or a Samsung S25 spec type mobile phone.

If you are using a Bluetooth guitar controller like LiberLive C1 or Lava Genie, you must first give the web browser (Chrome or Edge) permission to acces these devices. See section on Bluetooth below for more details.

First install OrinAyo as a browser extension or as a progressive web app on your desktop or mobile phone. 

## Desktop View
<img src=https://jus-be.github.io/orinayo/assets/screenshots/orinayo_desktop.svg />

## Mobile view
<img src=https://jus-be.github.io/orinayo/assets/screenshots/orinayo_mobile.svg />

# Features Description
## 1 - The application logo/icon
Clicking on this toggle between mobile view and desktop views as shown above. Mobile view gives you simple straightforward access to live playing of audio loop styles with a guitar controller or a numeric keypad. Desktop view gives you access to evrything else.

## 2 - Guitar Strum
<img align=left src=https://jus-be.github.io/orinayo/assets/screenshots/feature2.png />

Select what type of guitar to play. There is a selection of strumable acoustic and electric guitars. How the guitar plays arpeggios or strums is determined by the guitar controls. See feature #25 below for details.
<br clear="left"/>

## 3 - Arranger Type
<img align=left src=https://jus-be.github.io/orinayo/assets/screenshots/feature3.png />

Select what type of music arranger will generate the accompanying live drums, bass and rhythm sounds from the chords being played by the controller device. 

Three types of arrangers ara available to select from.

- Midi Style Files
- WebAudio Loops (OGG files)
- External Hardware
<br clear="left"/>

### Midi Style Files
The accompaniment music will be generated from MIDI style files used by Yamaha, Ketron and Casio. See features [#4](#4---arranger-group) and [#5](#5---arranger-style) below on how to select and load a style file.

### Web Audio Loops
The accompaniment music will be generated from WebAudio loops that have been played and recorded from a range of arranger keyboards that includes Ketron, Yamaha and Roland. See features #15, #16 and #17 below on how to select and load audio loops for drums, bass and chordal instruments.

### External Hardware
The accompaniment music will be generated from MIDI messages passed live to an arranger keyboard or arranger module or a looper that can be controlled externally with MIDI. The following hardware devices are supported:

- Ketron Event 76/61 keyboards, Event EVM, Event-X module, SD9 Series keyboard and SD90 module
- Yamaha PSR SX-600
- Yamaha MODX and Montage
- Yamaha QY100
- Korg Micro Arranger
- Giglad (Application)
- Boss RC 600 Loop Station
- Aeros Loop Studio

## 4 - Arranger Group
<img align=left src=https://jus-be.github.io/orinayo/assets/screenshots/feature4.png />

Use this dropdown box list to select what group of style files you want to select from.
<br clear="left"/>

## 5 - Arranger Style
This dropdown box list will contain a list of loaded style files for the current selected arranger group.  Select the style you want to use.

To load a new style file use the **Load** button. See feature #27 for more details.
<br clear="left"/>

## 6 - Input Controller
<img align=left src=https://jus-be.github.io/orinayo/assets/screenshots/feature6.png />

Select what device will be controller of the chords and style variations that will orchestrate the live music generation of OrinAyo. 

It recognises chord played from Guitar controllers, MIDI keyboard controllers and other non-keyboard USB MIDI controllers (like Artiphon Instrument 1 or Chorda). 

Select **Keyboard** for remote numpad or MIDI keyboard.
<br clear="left"/>

### Gamepad Guitar Controllers

<img src=https://jus-be.github.io/orinayo/assets/screenshots/guitar_hero.png>

#### Chords
The five coloured fret buttons generate CHORD midi notes which are send on MIDI channel 4 when the strum bar goes up or down.  Twenty chord shapes are supported. There are six basic popular chords (I, IIm, IIIm, IV, V & VIm) playable with a single or two fingers and fourteen other less used chords requiring two, three or even four fingers. The chord mapping in Nashville number format is fixed for now. It will become configurable in a future version.

#### Basic

Chord | Green    | Red      | Yellow  | Blue    |  Orange
---   | ---      | ---      | ---     | ---     | ---
1     |          |          |    X    |         | 
2m    |          |          |         |  X      | 
3m    |   X      |          |         |  X      | 
4     |          |          |         |         |  X
5     |   X      |          |         |         |  
6m    |          |   X      |         |         |  

#### Advanced

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

Please note that the RC-600 Loop Station and Aeros Loop Studio have only six audio tracks. They can only play the basic six chords. However, when played together with the virtual guitars from Music Labs (RealGuitar, RealLPC, etc) in joystick mode as heard in the demo song above, the virtual guitars can handle the advanced mode chords and fill in the missing gaps. Arrangers do not have this limitation but do not sound as realistic as a looper with the exception of the Ketron Event series which can play audio tracks in their styles.

#### Start and Stop
The button on the Directional (logo) knob used with the five coloured buttons determines how the arranger style starts and stops. 

Pressing the button alone toggles start and stop playing the current selected musical style in the arranger.

Pressing the button as well as a coloured fret button starts the style as follows:

Button | Starts  | Stops
---    | ---     | ---
Green  | Intro-2  | End-2
Red    | Intro-3  | End-3
Yellow | Intro-1  | End-1
Blue   | -       | -
Orange | Fade In | Fade Out

#### Style Variations/Sections (A,B,C,D)
The Star-Power button and the START button are used to control the style variations.  

When the Star-Power button is pressed on its own, it will cycles the style variations A-->B-->C-->D-->A.  When a colored fret key is also pressed, then it will play a fill for the current playing variation.
The START button cycles back down from A<--B<--C<--D<--A. 

#### Changing Song Key
Moving the Directonal (logo) knob right or up steps the playing key up ( C -> C#) and moving it left or down steps the playing key down (C -> B). 

Please note that this does nothing with a Looper. You have to preload the Looper with the audio files matching the song key. Both the RC 600 Loop Station and Aeros Loop Studio have memories to preload as many songs in all the needed keys for the live event. 

#### Other Playing Features 
Pressing down on any of the five sections in the slider bar at the same time the strum bar is moved up or down can be used to perform other features.
This includes sending Foot Switch on/off mesages to Ketron Arrangers that can be used to mute arranger parts or perform any custom feature required by the user.

Button | Strum Up     | Strum Down
---    | ---          | ---
Green  | Play BREAK   |  Play FILL
Red    | Ketron FS-9  | Ketron FS-8
Yellow | Ketron FS-11 | Ketron FS-10
Blue   | Ketron FS-13 | Ketron FS-12
Orange | Ketron FS-7  | Ketron FS-6


### LiberLive C1
If you select the LiberLive C1 guitar, it uses a modified 7 chord keys mapping (7b, 6m, 5, 1, 4, 2m, 3m) different from the standard (1, 2m, 3m, 4, 5, 6m, 7m) by LiberLive and much closer to the 5 buttons of a Gamepad  guitar controller.

It will connect to the LiberLive C1 guitar by the Bluetooth connection used by the LiberLive mobile app. You can't use both OrinAyo and the mobile app at the same time.
You can select different drum beats and guitar styles for both paddles and OrinAyo will use the tempo set by LiberLive except for web-audio styles that have fixed tempos.

### Lava Genie

### Artiphon Instrument 1 and Chorda
With Artiphon Instrument 1 and Chorda, only the first five pads are used like a Guitar Hero controller. The strum bridge pads are used to provide control (strum, start/stop, fill, next/previous section).
