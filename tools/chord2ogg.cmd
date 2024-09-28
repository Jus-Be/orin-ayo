del %1.ogg


copy ".\%1\MAJ_C.wav" ".\%1\SUS_C.wav"
copy ".\%1\MAJ_C#.wav" ".\%1\SUS_C#.wav"
copy ".\%1\MAJ_D.wav" ".\%1\SUS_D.wav"
copy ".\%1\MAJ_D#.wav" ".\%1\SUS_D#.wav"
copy ".\%1\MAJ_E.wav" ".\%1\SUS_E.wav"
copy ".\%1\MAJ_F.wav" ".\%1\SUS_F.wav"
copy ".\%1\MAJ_F#.wav" ".\%1\SUS_F#.wav"
copy ".\%1\MAJ_G.wav" ".\%1\SUS_G.wav"
copy ".\%1\MAJ_G#.wav" ".\%1\SUS_G#.wav"
copy ".\%1\MAJ_A.wav" ".\%1\SUS_A.wav"
copy ".\%1\MAJ_A#.wav" ".\%1\SUS_A#.wav"
copy ".\%1\MAJ_B.wav" ".\%1\SUS_B.wav"

.\ffmpeg -i %1/MAJ_C.wav -i %1/MAJ_C#.wav -i %1/MAJ_D.wav -i %1/MAJ_D#.wav -i %1/MAJ_E.wav -i %1/MAJ_F.wav -i %1/MAJ_F#.wav -i %1/MAJ_G.wav -i %1/MAJ_G#.wav -i %1/MAJ_A.wav -i %1/MAJ_A#.wav -i %1/MAJ_B.wav -filter_complex "[0:0][1:0][2:0][3:0][4:0][5:0][6:0][7:0][8:0][9:0][10:0][11:0]concat=n=12:v=0:a=1[out]" -map "[out]" %1_1.wav
.\ffmpeg -i %1/MIN_C.wav -i %1/MIN_C#.wav -i %1/MIN_D.wav -i %1/MIN_D#.wav -i %1/MIN_E.wav -i %1/MIN_F.wav -i %1/MIN_F#.wav -i %1/MIN_G.wav -i %1/MIN_G#.wav -i %1/MIN_A.wav -i %1/MIN_A#.wav -i %1/MIN_B.wav -filter_complex "[0:0][1:0][2:0][3:0][4:0][5:0][6:0][7:0][8:0][9:0][10:0][11:0]concat=n=12:v=0:a=1[out]" -map "[out]" %1_2.wav
.\ffmpeg -i %1/SUS_C.wav -i %1/SUS_C#.wav -i %1/SUS_D.wav -i %1/SUS_D#.wav -i %1/SUS_E.wav -i %1/SUS_F.wav -i %1/SUS_F#.wav -i %1/SUS_G.wav -i %1/SUS_G#.wav -i %1/SUS_A.wav -i %1/SUS_A#.wav -i %1/SUS_B.wav -filter_complex "[0:0][1:0][2:0][3:0][4:0][5:0][6:0][7:0][8:0][9:0][10:0][11:0]concat=n=12:v=0:a=1[out]" -map "[out]" %1_3.wav

.\ffmpeg -i %1_1.wav -i %1_2.wav -i %1_3.wav -filter_complex "[0:0][1:0][2:0]concat=n=3:v=0:a=1[out]" -map "[out]" %1.ogg

del %1_1.wav
del %1_2.wav
del %1_3.wav

