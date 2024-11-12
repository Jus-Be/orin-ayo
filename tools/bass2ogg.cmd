del %1.ogg

.\ffmpeg -i %1/BMAJ_C.wav -i %1/BMAJ_C#.wav -i %1/BMAJ_D.wav -i %1/BMAJ_D#.wav -i %1/BMAJ_E.wav -i %1/BMAJ_F.wav -i %1/BMAJ_F#.wav -i %1/BMAJ_G.wav -i %1/BMAJ_G#.wav -i %1/BMAJ_A.wav -i %1/BMAJ_A#.wav -i %1/BMAJ_B.wav -filter_complex "[0:0][1:0][2:0][3:0][4:0][5:0][6:0][7:0][8:0][9:0][10:0][11:0]concat=n=12:v=0:a=1[out]" -map "[out]" %1_1.wav
.\ffmpeg -i %1/BMIN_C.wav -i %1/BMIN_C#.wav -i %1/BMIN_D.wav -i %1/BMIN_D#.wav -i %1/BMIN_E.wav -i %1/BMIN_F.wav -i %1/BMIN_F#.wav -i %1/BMIN_G.wav -i %1/BMIN_G#.wav -i %1/BMIN_A.wav -i %1/BMIN_A#.wav -i %1/BMIN_B.wav -filter_complex "[0:0][1:0][2:0][3:0][4:0][5:0][6:0][7:0][8:0][9:0][10:0][11:0]concat=n=12:v=0:a=1[out]" -map "[out]" %1_2.wav

.\ffmpeg -i %1_1.wav -i %1_2.wav -filter_complex "[0:0][1:0]concat=n=2:v=0:a=1[out]" -map "[out]" %1.ogg

del %1_1.wav
del %1_2.wav

