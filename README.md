# Summary
<img src=https://jus-be.github.io/orin-ayo/assets/orinayo.png>

Orin Ayo is an Arranger Controller. 

It turns a Guitar Hero game controller HID device into a MIDI controller for an Arranger keyboard, module, device or application. It lets you play chords and control an arranger with the buttons on a Guitar hero games controller. 

Currently, the following arrangers are supported:

- Ketron Event, SD9 Series keyboards and sound module (SD90)
- Yamaha MODX and Montage
- Yamaha QY100
- Korg Micro Arranger
- Giglad (Application)

Orin Ayo can also play some strum/pick patterns for the virtual guitars from Music Labs like RealGuitar, RealLPC, etc.

<img src=https://jus-be.github.io/orin-ayo/assets/guitar_hero.png>

# Chords
The five colored fret buttons generate CHORD midi notes which are send on MIDI channel 4 when the strum bar goes up or down.  The chord mapping in Nashville number format is fixed as follows:

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
3     |    X     |          |   X     |  X      |
4/5   |          |          |   X     |  X      |  X
4/6   |          |          |         |  X      |  X
5sus  |    X     |          |   X     |         |  
5/7   |    X     |   X      |         |         | 
5b    |    X     |   X      |   X     |         | 
6     |          |   X      |   X     |  X      | 
7b    |          |   X      |   X     |         | 

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
Moving the Directonal (logo) knob right or up steps the playing key up ( C -> C#) and moving it left or down steps the playing key down (C -> B)

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

