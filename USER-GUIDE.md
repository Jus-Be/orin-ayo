# Introduction
Orina Ayo work best with in desktop mode with a Logitech Guitar Hero Controlller or a LiberLive C1. If you do not have a guitar controller nor a keyboard midi controller, you can still use a wireless numeric keypad or the numeric keypad of your desktop computer. See supported devices below for more details.

Also note that Gamepad compatible guitar controllers like the PDP Riff Master or the Logitech Guitar hero have been tested from a desktop computer. On mobile phones, only Bluetooth midi controllers or guitars like LiberLive C1 amd Lava Genie have been tested with OrinAyo. 

When OrinAyo works in standalone mode and not controlling an external arranger device via MIDI and generating all the music internally from WebAudio, you would need a high spec PC or mobile phone like an Intel iCore 7 or Apple M series laptop or a Samsung S25 spec type mobile phone.

If you are using a Bluetooth guitar controller like LiberLive C1 or Lava Genie, you must first give the web browser (Chrome or Edge) permission to acces these devices. See section on Bluetooth below for more details.

# Install
Orinayo can be setup and accessed as follows:

- Type https://jus-be.github.io/orinayo/index.html into a Chrome or Edge browser to use it directly from a web page.
- Install it as a progressive web app from the web page. Click on the "install" or "Add to home page" browser links/buttons.
- Install it as a browser extension for Google Chrome and Microsoft Edge from https://chromewebstore.google.com/detail/orinayo/mhnemaeacdgnkmoibfeodelijegakklp
- On Windows 10+ desktops, download orinayo.exe and run it directly from a desktop. It loads the above web page using webview2. See https://github.com/jchv/go-webview2. If you are using Windows 10+, the WebView2 runtime should already be installed. If you don't have it installed, you can download and install a copy from Microsoft's website - https://developer.microsoft.com/en-us/microsoft-edge/webview2/

# Description
To use the application, you select a number of features you need, click on an action and watch the status display. For example, select web audio as your arranger type, select a web audio chord loop, click on play and watch the chords being displayed as you press the buttons of your guitar controller.

To prevent un-desired results, make sure that unused and uneeded features are set to **NOT USED*

The application views are roughly divided into three sections.
- Feature Selections
- Action buttons
- Status displays

## Desktop View
<img src=https://jus-be.github.io/orinayo/assets/screenshots/orinayo_desktop.svg />

## Mobile view
<img src=https://jus-be.github.io/orinayo/assets/screenshots/orinayo_mobile.svg />

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

In order to play the GM MIDI notes in the style files, you would need to select a sound font. See feature [#7](#7---sound-font-file) for more details.

### Web Audio Loops
The accompaniment music will be generated from WebAudio loops that have been played and recorded from a range of arranger keyboards that includes Ketron, Yamaha and Roland. See features  [#15](#15---audio-chord), #16 and #17 below on how to select and load audio loops for drums, bass and chordal instruments.

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
OrinAyo will connect to the LiberLive C1 guitar by the Bluetooth connection used by the LiberLive mobile app. You can't use both OrinAyo and the mobile app at the same time.
You can select different drum beats and guitar styles for both paddles and OrinAyo will use the tempo set by LiberLive except for web-audio styles that have fixed tempos.

You can also use both the audio from LiberLive C1 and OrinAyo together in harmony

#### Chords
<img width="250px" align=left src=https://jus-be.github.io/orinayo/assets/screenshots/feature6-1.jpeg />
If you select the LiberLive C1 guitar, it uses a modified 7 basic chord keys mapping (7b, 6m, 5, 1, 4, 2m, 3m) different from the standard (1, 2m, 3m, 4, 5, 6m, 7m) by LiberLive and much closer to the 5 buttons of a Gamepad  guitar controller. There is also support for additional advanced 14 chord key mappings.

As shown here, the LiberL:ive C1 mobile application may not show them correctly. OrinAyo supports the chromatic scale (12 steps) and converts to and from the diatonic scale (7 steps) used by LiberLive C1 capo. See feature #23 for more details.
<br clear="left"/>

#### Start and Stop
Press both paddles to toggle between starting and stopping the arranger feature. Pressing any of the 21 chord keys before doing so will cause the arranger to play an *intro* style variation before starting and an *end* style variation before stopping.

#### Style Variations/Sections (A,B,C,D)
Press either strum paddle alone to control the style variations.  

When the first paddle is moved **down** on its own, OrinAyo will cycles the style variations A-->B-->C-->D-->A.  When it is moved **up**, OrinAyo will cycles back down from A<--B<--C<--D<--A. 

When the second paddle is moved **down**, then it will play a fill for the current playing variation. When it is moved **up**, then it plays a break for  the current playing variation. 


### Lava Genie
The Lava Genie behaves like the LiberLive C1. However, it can only be used as a MIDI controller.  There is currently no support for using the internal sounds with OrinAyo in harmony like the LiberLive C1. 
#### Chords
It also uses the modified 7 basic chord key mapping and the 21 advanced key mapping from LiberLive C1.

#### Start and Stop
Press the Lava Genie Logo to start the OrinAyo arranger and use the Lava Genie rhythm stop button to stop the arranger.

Pressing any of the 21 chord keys before doing so will cause the arranger to play an *intro* style variation before starting and an *end* style variation before stopping.

#### Style Variations/Sections (A,B,C,D)
Press the Lava Genie Logo while the music plays to cycles the style variations A-->B-->C-->D-->A.  

### Artiphon Instrument 1 and Chorda
With Artiphon Instrument 1 and Chorda, only the first five pads are used like a Guitar Hero controller. The strum bridge pads are used to provide control (strum, start/stop, fill, next/previous section).

## 7 - Sound Font File
<img align=left src=https://jus-be.github.io/orinayo/assets/screenshots/feature7.png />

Select a loaded sound font file from the list. If your list is empty or you need a new sound font file, use the *Load* action button to load a sound font file (sf2) from your computer. See #27 for more details.
<br clear="left"/>

## 8 - MIDI In
<img align=left src=https://jus-be.github.io/orinayo/assets/screenshots/feature8.png />

Select an input MIDI device to use with OrinAyo. Only one input device can use at any given time. This excludes the Stream Deck (USB device) that can be used with a MIDI input device. It however includes a MIDI keyboard controller. OrinAyo has only been tested with the Behringer X Touch Mini and the Carry-On Folding Controller 49.

If the [Arranger Type](#3---arranger-type) is set to *keyboard*, the MIDI note on and note off messages will play the *piano* and *pads*  keyboard voices. See feature #24 for more details.
<br clear="left"/>

### Program Change Messages (PC)
With no music style playing, these messages are used to recall application settings saved as slots (1-128). See the Save action button in feature #27 for more details.

Otherwise, they are used to control the playing style as follows:
Value    | Action
---      | ---         
0	 | Mute/unmute lead guitar 
1		 | Mute/unmute drums
2		 | Mute/unmute bass 
3		 | Mute/unmute chords 
4		 | Mute/unmute guitar chorus effect 
5		 | Mute/unmute guitar reverb effect 
6		 | Mute/unmute guitar compression effect
7		 | Mute/unmute guitar delay effect 
8		 | Select style variation A 
9		 | Select style variation B 
10		 | Select style variation C 
11		 | Select style variation D

### Control Change Messages (CC)
These messages are applied anytime

Value    | Action
---      | ---  
12  | Keyboard piano volume
13  | Keyboard pads volume				
1   | All Audio loops volume
14  | Previous style variation
15  | Start/stop arranger
16  | Next style variation

## 9 - MIDI Out
<img align=left src=https://jus-be.github.io/orinayo/assets/screenshots/feature8.png />

Select a device from this list only if you plan to control an external arranger or looper device by OrinAyo. See [*External Hardware*](#external-hardware) above for more details.

You will need to pre-configure the device and enable it to receive MIDI chord note messages on channel 4.
<br clear="left"/>

## 10 - MIDI Synth
<img align=left src=https://jus-be.github.io/orinayo/assets/screenshots/feature8.png />

If you want to use an external MIDI device to play the keyboard pads voice instead of the internal WebAudio sampler voice , then select it from here. The keyboard pads voice is a synth type voice played with the current active chord.  By default it is the GM voice 90 called *warm pads*. For more details. see feature #24 below.
<br clear="left"/>

## 11 - RealGuitar Out
<img align=left src=https://jus-be.github.io/orinayo/assets/screenshots/feature8.png />

If you want to use any of the soft guitar products from MusicLabs like RealGuitar, RealLPC, RealStrat, etc instead of the internal WebAudio guitar in OrinAyo, then you would need a virtual MIDI device like loopMIDI configured for sending the MIDI messages. Select a device from this pulldown list.

<br clear="left"/>

## 12 - RealGuitar Strum
<img align=left src=https://jus-be.github.io/orinayo/assets/screenshots/feature12.png />

If you want to play a MIDI based guitar strum loop pattern with the internal guitar or with an external guitar like RealGuitar or RealLPC, then use this to select on the patterns provided. 

Select *Internal Guitar* to use the internal WebAudio guitar and use the *next* and *previous* style variation controls to cycle through the provided strum patterns. 

Toggle start action button to start and stop the strum pattern loop. The strum will play to the currently set tempo. Please note that this feature cannot be used with a music style. Make sure no style is selected when using this to prevent unexpected results.

<br clear="left"/>

## 13 - Audio Device In
<img align=left src=https://jus-be.github.io/orinayo/assets/screenshots/feature13.png />

Use this feature to mix the output of an external real instrument with Orin Ayo. The drop-down list will show all the input audio devices on your PC that are accessible to the web browser.
Select the device you want and Orin Ayo will play the audio from this device instead of the default internal guitar sound.
<br clear="left"/>

It can be used in the following situations:
- To enable a solo musician to play and mix the sounds from LiberLive C1 guitar with the selected music style in Orin Ayo
- To enable a guitarist to play lead and riff melodies along with another person controlling the selected music style in OrinAyo


## 14 - Audio Device Out
<img align=left src=https://jus-be.github.io/orinayo/assets/screenshots/feature14.png />

By default, all sounds coming out of Orin Ayo are sent by the web browser to the current selected output device by the underlying O/S. To use a different device, use this feature to select a device from the drop-down list
This feature is very useful if you want to stream or sent the live music directly to an external application like a DAW using a virtual audio device like "Virtual Cable".
<br clear="left"/>

## 15 - Audio Chord
<img align=left src=https://jus-be.github.io/orinayo/assets/screenshots/feature15.png />

If you select **Web Audio Files** as your  [*Arranger Type*](#3---arranger-type), then you have to select an audio loop here that OrinAyo will use together with the bass and drums to give the music a style a groove. It could be a rhythmic guitar riff or  a keyboard chordal harmony.

Audio loop styles in OrinAyo have fixed tempo. Orin Ayo will use the selection for the chord loop to pre-select corresponding bass and drum loops that have matching names or tempos.  You can manually change these selections to your taste.
<br clear="left"/>

## 16 - Audio Drum
Select alternative drum loop to play at the current tempo from this drop-down selection list. Please note that mixing different tempos can produce undesirable results as OrinAyo does not stretch audio loops.  The selected loop choice will be saved and recalled when the page is re-opened.

## 17 - Audio Bass
Select alternative bass loops to play at the current tempo from this drop-down selection list. Please note that mixing different tempos can produce undesirable results as OrinAyo does not stretch audio loops. 
The selected loop choice will be saved and recalled when the page is re-opened.

## 18 - Chord Tracker
<img align=left src=https://jus-be.github.io/orinayo/assets/screenshots/feature8.png />

Select an input MIDI device to use with the OrinAyo ChordTraker feature.  This feature is implemented for the Yamaha Sonogenic SHS-500 Keytar and compatible devices.  OrinAyo well send the chords being played as Yamaha midi SYSEX messages to the selected device. The device is then able to ensure that only notes in the current key and in harmony with the current chord will be played by the device.
<br clear="left"/>


