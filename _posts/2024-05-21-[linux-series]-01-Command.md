from [Dictionary - Command](https://github.com/newkayak12/Dictionary/blob/master/linux/Command.md)

## history
이전에 사용했던 명령어들의 내역이 출력됨

## ctrl + s/ ctrl + q
`ctrl + s` : 터미널의 문자 출력을 중단하는 터미널 제어 키
`ctrl + q` : 제어 해제

## tail -f | grep
grep과 함께 사용하면 의미 있는 행만 표시할 수도 있다.

## z-
z를 사용하면 tar, gzip으로 압축된 파일을 그대로 읽을 수 있다.
`zcat`, `zmore`, `zgrep`, `zdiff`

## less
`less`는 파일 크기가 클수록 효과를 발휘한다. `cat`, `vi`보다 좋은 선택이 될 수 있다. 내부에서 검색어 검색, 페이지 이동, 줄 번호 표시 등을 할 수 있다.

## yes | 
`yes | 명령어` 를 사용하면 뒤 명령어에 yes로 자동으로 인식하게 해준다.

## grep -Pri
특정 텍스트가 포함된 파일이 있는지 한번에 확인하려는 경우

## man
`man [명령어]`로 메뉴얼 출력 가능하다.

## touch
파일의 날짜와 시간을 수정하는 명령어
간혹 0바이트 파일을 만들기 위해서 사용하기도 한다.
`-t` 옵션으로 서버 시간이 아닌 시간을 지정해서 날짜를 변경할 수도 있다.
