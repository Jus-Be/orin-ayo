del %1.ogg

.\ffmpeg -i ./%1/INT1.wav -i ./%1/ARRA.wav -i ./%1/FILA.wav -i ./%1/ARRB.wav -i ./%1/FILB.wav -i ./%1/ARRC.wav -i ./%1/FILC.wav -i ./%1/ARRD.wav -i ./%1/FILD.wav -i ./%1/BRKA.wav -i ./%1/END1.wav -filter_complex "[0:0][1:0][2:0][3:0][4:0][5:0][6:0][7:0][8:0][9:0][10:0]concat=n=11:v=0:a=1[out]" -map "[out]" %1.ogg
