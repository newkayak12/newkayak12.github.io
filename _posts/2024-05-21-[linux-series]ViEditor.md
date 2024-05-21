## VI/ VIM
## vi --version
어떤 vi가 설치됐는지 확인할 수 있다.


``````shell
VIM - Vi IMproved 9.0 (2022 Jun 28, compiled Dec 20 2023 18:58:31)
macOS version - arm64
Included patches: 1-2136
Compiled by root@apple.com
Normal version without GUI.  Features included (+) or not (-):
+acl               +file_in_path      +mouse_urxvt       -tag_any_white
-arabic            +find_in_path      +mouse_xterm       -tcl
+autocmd           +float             +multi_byte        +termguicolors
+autochdir         +folding           +multi_lang        +terminal
-autoservername    -footer            -mzscheme          +terminfo
-balloon_eval      +fork()            +netbeans_intg     +termresponse
-balloon_eval_term -gettext           +num64             +textobjects
-browse            -hangul_input      +packages          +textprop
++builtin_terms    +iconv             +path_extra        +timers
+byte_offset       +insert_expand     -perl              +title
+channel           +ipv6              +persistent_undo   -toolbar
+cindent           +job               +popupwin          +user_commands
-clientserver      +jumplist          +postscript        -vartabs
+clipboard         -keymap            +printer           +vertsplit
+cmdline_compl     +lambda            -profile           +vim9script
+cmdline_hist      -langmap           -python            +viminfo
+cmdline_info      +libcall           -python3           +virtualedit
+comments          +linebreak         +quickfix          +visual
+conceal           +lispindent        +reltime           +visualextra
+cryptv            +listcmds          -rightleft         +vreplace
+cscope            +localmap          -ruby              +wildignore
+cursorbind        -lua               +scrollbind        +wildmenu
+cursorshape       +menu              +signs             +windows
+dialog_con        +mksession         +smartindent       +writebackup
+diff              +modify_fname      -sodium            -X11
+digraphs          +mouse             -sound             -xattr
-dnd               -mouseshape        +spell             -xfontset
-ebcdic            +mouse_dec         +startuptime       -xim
-emacs_tags        -mouse_gpm         +statusline        -xpm
+eval              -mouse_jsbterm     -sun_workshop      -xsmp
+ex_extra          +mouse_netterm     +syntax            -xterm_clipboard
+extra_search      +mouse_sgr         +tag_binary        -xterm_save
-farsi             -mouse_sysmouse    -tag_old_static    
   system vimrc file: "$VIM/vimrc"
     user vimrc file: "$HOME/.vimrc"
 2nd user vimrc file: "~/.vim/vimrc"
      user exrc file: "$HOME/.exrc"
       defaults file: "$VIMRUNTIME/defaults.vim"
  fall-back for $VIM: "/usr/share/vim"
Compilation: gcc -c -I. -Iproto -DHAVE_CONFIG_H   -DMACOS_X_UNIX  -g -O2 -U_FORTIFY_SOURCE -D_FORTIFY_SOURCE=1      
Linking: gcc   -L/usr/local/lib -o vim        -lm -lncurses  -liconv -framework Cocoa           
``````
예시로 +clipboard 여부에 따라 vi에서 클립보드 사용이 불가할 수도 있다.
이래서 그냥 대고 복사가 안됐던 것이기도 하다.

## vi 내용 삭제 명령어

|명령어|                 	설명                  |
|:---:|:------------------------------------:|
|x	| 커서가 있는 문자 한글자 삭제 (반대인 del은 윈도우와 똑같다) |
|nx|       	커서가 있는 위치부터 n개의 문자를 삭제        |
|dw|          	현재 커서에 있는 한 단어 삭제          |
|dd|           	커서가 있는 라인(행) 삭제           |
|ndd|        	커서가 있는 라인부터 n개의 라인 삭제        |
|db|        	커서의 위치에서 거꾸로 한 단어 삭제         |
|D|             	커서 오른쪽 행 삭제             |
|:5,10d|             	5~10번째 행 삭제             |


## vi 되돌리기 명령어

|명령어|                 	설명                  |
|:---:|:------------------------------------:|
|u	|이전 명령 취소 (되돌리기)|
|U	|행 변경 사항 취소, 이전의 최종 행 취소|
|.	|이전 최종 명령 반복|

## vi 복붙 및 이동 명령어

|    명령어     |                 	설명                  |
|:----------:|:------------------------------------:|
|    yy	     |커서가 위치한 줄 복사|
|     Y	     |행 yank 또는 복사|
|    yh	     |커서의 왼쪽 문자 복사|
|    yl	     |커서에 위치한 문자 복사|
|    yi	     |커서가 위치한 줄과 그 아랫줄 복사|
|    yk	     |커서가 위치한 줄과 그 윗줄 복사|
|     p	     |붙여넣기 (행 위로 삽입)|
|     P	     |붙여넣기 (행 아래에 삽입)|
| :1,2 co 3	 |1~2행을 3행 다음으로 복사|
| :4,5 m 6	  |4~5행을 6행 위로 이동|


```
# 한줄 복사
해당 라인에서 'yy' 누르면 캐시에 저장이 된다.
붙여넣기를 원하는 곳으로 이동하여 'p'를 누르면 커서 다음 라인에 붙여넣기가 된다.

# 블럭 복사
'v'키를 누른 후 커서를 이동하여 블력을 설정한다.
(putty의 경우 블럭이 설정되는 모습이 보이나, ssh의 경우 블럭 모습이 나타나지 않으나 실제로는 설정되고 있다.)
원하는 부분을 블럭으로 설정한 뒤(설정 완료키는 없다) 'y'키를 누르면 캐시에 복사가 된다.
같은 방법으로 원하는 곳으로 이동하여 'p'를 누르면 커서 다음 라인에 붙여넣기가 된다.
```

## vi 행 번호 표시

|          명령어           |                 	설명                  |
|:----------------------:|:------------------------------------:|
| :set nu 또는 :set number |	에디터의 각 행의 좌측에 행 번호 표시.|
|:set nonu	|에디터의 각 행의 좌측 행 번호 숨기기|

## vi 검색 명령어


|          명령어           |                 	설명                  |
|:----------------------:|:------------------------------------:|
|/{검색할 문자열}	|오른쪽 아래 방향으로 문자열 검색|
|?{검색할 문자열}	|왼쪽 위 방향으로 문자열 검색|
|n|	문자열의 다음으로 계속 검색|
|N|	문자열의 이전으로 계속 검색|


## vi 저장 및 종료

| 명령어 |                 	설명                  |
|:---:|:------------------------------------:|
| :w  |	변경사항 저장|
| :w  |{파일명}	변경사항 입력한 파일명으로 저장|
| :wq |	변경사항 보관 후 vi 종료.|
| ZZ  |명령과 같음. :w(기록)과 :q(종료) 를 연속적으로 수행.|
| ZZ  |	변경사항 보관 후 vi 종료.임시 버퍼의 내용을 vi로 호출할때 사용되었던 파일에 기록한 후 vi를 빠져나옴.|
|:q!|	변경 내용을 저장하지 않고 종료|
|:q	|작업한게 없으면 그대로 종료|
|:e!|	마지막으로 저장했던 내용 이후의 수정한 것들을 취소하고 다시 편집상태로|


## vi 내용 바꾸기 명령어

|           명령어            |                 	설명                  |
|:------------------------:|:------------------------------------:|
|   :s/[대상문자열]/[바꿀문자열]	    |커서가 위치한 행에서 첫번째로 나오는 대상문자열을 바꿀문자열로 치환|
   |   :%s[대상문자열]/[바꿀문자열]	    |파일 전체에서 모든 대상문자열을 바꿀문자열로 치환|
  |  :[범위]s[대상문자열]/[바꿀문자열]	  |범위 내 모든 각 행에서 첫번쨰로 나오는 대상문자열을 바꿀문자열로 치환|
 | :[범위]s[대상문자열]/[바꿀문자열]g	  |범위 내 모든 행에서 대상문자열을 바꿀문자열로 치환|
 | :[범위]s[대상문자열]/[바꿀문자열]gc	 |범위 내 모든 행에서 대상문자열을 바꿀문자열로 바꾸되 수정할 지 여부를 묻는다|


## vi 화면 정리

|           명령어            |                 	설명                  |
|:------------------------:|:------------------------------------:|
|Ctrl + l	|불필요한 화면정리 후 다시 표시|

## vi 파일 명령어

|           명령어            |                 	설명                  | ex|
|:------------------------:|:------------------------------------:|:---:|
|:r {파일명}|	커서 다음에 파일 삽입	|:r test.txt|
|:{행번호} r {파일명}|	입력한 파일을 입력한 행번호 다음에 삽입	|:10 r test.txt|

## vi  기타 명령어

|  문자  |                 	설명                  |
|:----:|:------------------------------------:|
|  .	  |현재 line
|  %	  |전체 line
|  $	  |파일 맨끝 line
| 1,$	 |%
| 2,3	 |2 ~ 3 line


https://inpa.tistory.com/entry/LINUX-📚-Vi-Vim-에디터-다루기-명령어-💯-정리#vi_내용_삭제_명령어