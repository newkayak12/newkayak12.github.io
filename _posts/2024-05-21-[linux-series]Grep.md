# Grep

## 참조
[Input/Ouput Redirection](/linux/Input_Output.md)

## 사전 지식
### Regexp

|     메타문자     |                의미                | 예시 | 설명|
|:------------:|:--------------------------------:|:------:|:--------:|
|      ^       |              행의 시작               |$ grep '^linux'|linux로 시작하는 행|
|      $       |               행의 끝               |$ grep 'linux$'|linux로 끝나는 행|
|      ＼<      |              단어의 시작              |$ grep '＼<linux'|linux로 시작하는 단어를 포함하는 행|
|      ＼>      |              단어의 끝               |$ grep 'linux＼>'|linux로 끝나는 단어를 포함하는 행|
|      .       |         임의의 모든 문자 종류 하나          |$ grep 'l...x'|l과 x사이에 세글자만 있을 수 있음|
|      ?       |         문자가 한개가 있거나 없거나          |$ grep 'lin?x'|?에 문자하나가 들어가는 것을 검색|
|      *       |        문자가 여러개 들어가거나 없거나         |$ grep 'linux*'$ grep 'lin*'$ grep 'l*x'$ grep '*linux'|linux를 모두 검색(여러 파일의 이름을 표현할 때 사용하고, 단독으로 * 사용하면 모든 파일을 나타냄)|
|      \|      |or 기호|$ grep 'ab|cd|ef'|ab나 cd나 ef 셋 중 하나라도 들어있으면 검색|
|     ＼(\)     | 특정 기호 or 메타 문자를 무시(문자 그 자체를 나타냄) |$ grep 'lin＼.＼x'|.문자를 대응하는 것이 아니라 lin.x라는 문자를 검색|
|      []      |  []는 안에 내용을 넣어 그 문자들 중 한문자를 의미   |$ grep 'linux[123]'|linux1, linux2, linux3을 검색|
| [0-9], [a-z] |        숫자나 알파벳은 범위로 설정 가능        |$ grep 'linux[0-9]'|linux1부터 linux9까지 검색|
|     [^]      |[]안에 있는 ^는 부정을 의미안에 있는 문자를 제외한다는 뜻|$ grep 'linux[^1-3]'|linux1 부터 linux3까지를 제외한 문자 검색|
|     ＼<＼>     |＼<는 단어의 시작＼>는 단어의 끝(위에 있는 지시자 합친것)|$ grep '＼<linux＼>'|linux로 시작하는 단어, linux로 끝나는 단어 검색예를 들어 alinux2와 같이 중간에 linux가 있는 것은 안됨|
|    a＼{n＼}    |           문자 a를 n번 반복            |$ grep 'a＼{2＼}'|a 문자가 2번 연속 반복되는 것을 검색|
|   a＼{n,＼}    |   문자 a를 적어도 n번 이상 반복 (콤마가 있음)    |$ grep 'a＼{2,＼}'|a 문자가 최소한 2번 이상 반복되는 것을 검색|
|   a＼{m,n＼}   | 문자 a를 m번 이상 n번 이하로 반복 (반복 범위 지정) |$ grep 'a＼{2,4＼}'|a 문자가 2번 이상 4번 이하로 반복되는 부분|
|    ＼(..＼)    | 다음 사용을 위해 태그를 붙이는 역할최대 9개까지 사용가능 |$ grep ＼(linux＼)A＼1B|linuxA에 ＼1이 태그되어linuxAlinuxB로 대응|
  
  
  출처: https://inpa.tistory.com/entry/LINUX-📚-정규표현식-과-grep-명령어-정복하기-패턴-검색-확장브래킷 [Inpa Dev 👨‍💻:티스토리]

### Bracket
브래킷|의미
:---:|:---:
[:alnum:]|A-Z, a-z, 0-9 알파벳 문자와 숫자로 이루어진 문자열
[:alpha:]|A-Z, a-z 알파벳 문자
[:blank:]|\x09 스페이스와 탭
[:cntrl:]|컨트롤 제어 문자
[:digit:]|0-9 숫자
[:graph:]|!-~ 공백이 아닌 문자(스페이스, 제어 문자들을 제외한 문자)
[:lower:]|a-z 소문자
[:print:]|graph와 유사하지만 스페이스 문자를 포함
[:punct:]|!-/:-@[-'{-~ 문장 부호 문자
[:space:]|\t\v\f 모든 공백 문자(newline 줄바꿈, 스페이스, 탭)
[:upper:]|A-Z 대문자
[:xdigit:]|16진수에서 사용할 수 있는 숫자

### vi 에서 정규표현식으로 검색
```shell
/없이$ # 없이로 끝나는 문자열 검색
/...세 # 4개 문자로 구성된 문자열 중 마지막 문자가 “세”로 끝나는 문자열 검색
/o*ve # o로 시작되는 문자부터 ve로 끝나는 모든 문자열 검색
/[Ll]ove # Love, love
```

## grep
`grep` 은 입력으로 전달된 파일의 내용 혹은 디렉토리에서, 파일 내용이나 파일 이름의 특정 문자열 패턴을 찾고자 할 때 사용하는 명령어다.
> grep 은 global / regular expression / print에서 각각의 머릿 글자를 따 온 것이며, find와 함께 리눅스에서 가장 많이 사용되는 명령어 중 하나이다.

|      명령어       |     설명     | 정규 표현식 사용 유무 |
|:--------------:|:----------:|:------------:|
|      grep      |   다중 패턴    |      O       |
| egrep(grep -e) | 정규 표현식 패턴  |      O       |
| fgrep(grep -f  | 문자열 표현식 패턴 |      X       |

```shell
$ grep [OPTION...] PATTERN [FILE...]
#    -E        : PATTERN을 확장 정규 표현식(Extended RegEx)으로 해석.
#    -F        : PATTERN을 정규 표현식(RegEx)이 아닌 일반 문자열로 해석.
#    -G        : PATTERN을 기본 정규 표현식(Basic RegEx)으로 해석.
#    -P        : PATTERN을 Perl 정규 표현식(Perl RegEx)으로 해석.
#    -e        : 매칭을 위한 PATTERN 전달.
#    -f        : 파일에 기록된 내용을 PATTERN으로 사용.
#    -i        : 대/소문자 무시.
#    -v        : 매칭되는 PATTERN이 존재하지 않는 라인 선택.
#    -w        : 단어(word) 단위로 매칭.
#    -x        : 라인(line) 단위로 매칭.
#    -z        : 라인을 newline(\n)이 아닌 NULL(\0)로 구분.
#    -m        : 최대 검색 결과 갯수 제한.
#    -b        : 패턴이 매치된 각 라인(-o 사용 시 문자열)의 바이트 옵셋 출력.
#    -n        : 검색 결과 출력 라인 앞에 라인 번호 출력.
#    -H        : 검색 결과 출력 라인 앞에 파일 이름 표시.
#    -h        : 검색 결과 출력 시, 파일 이름 무시.
#    -o        : 매치되는 문자열만 표시.
#    -q        : 검색 결과 출력하지 않음.
#    -a        : 바이너리 파일을 텍스트 파일처럼 처리.
#    -I        : 바이너리 파일은 검사하지 않음.
#    -d        : 디렉토리 처리 방식 지정. (read, recurse, skip)
#    -D        : 장치 파일 처리 방식 지정. (read, skip)
#    -r        : 하위 디렉토리 탐색.
#    -R        : 심볼릭 링크를 따라가며 모든 하위 디렉토리 탐색.
#    -L        : PATTERN이 존재하지 않는 파일 이름만 표시.
#    -l        : 패턴이 존재하는 파일 이름만 표시.
#    -c        : 파일 당 패턴이 일치하는 라인의 갯수 출력.
```

### 예시
```shell
# 날짜 기준이 생성일이라고  할 때, 첫 날짜는 검색하고자 하는 날짜, 두번째는 검색하고자 하는 다음날 날짜
$ find . -name *.log -newerct yyyy-MM-dd ! -newerct yyyy-MM-dd -exec grep -Hni '검색어' {} \;
```

#### pipe와 사용
```shell
# 현재 프로세스를 출력에서 "java"라는 문자열을 포함하는 라인만 표시 
$ ps -ef | grep "java"

# 어플리케이션의 로그를 tail 하면서 "error" 문자열을 포함하는 라인 표시
$ tail -f application.log | grep -i "error"

# netstat명령어로 네트워크 상태를 모니터링하는데 그중 tcp만 확인
$ netstat | grep "tcp"

# 어플리케이션 로그중 "error" 문자열을 포함하는 라인을 한 화면씩 표시
$ grep "error" application.log | more

# mylog.txt 파일에서 Apple과 Banana이 있는 문자열들을 탐색
$ cat mylog.txt | grep 'Apple' | grep 'Banana'
```
#### find와 사용
```shell
$ find . -name "찾고 싶은 파일이름" | xargs grep -n "찾고 싶은 글자"
```

> #### [xargs 의미](/linux/xargs_vs_pipe.md)
> 파이프 다음에 쓰이는 xargs는 파이프를 통해 넘어온 결과물을 다음 명령어에 매개변수로 던져주는 역할을 한다.

출처: https://inpa.tistory.com/entry/LINUX-📚-정규표현식-과-grep-명령어-정복하기-패턴-검색-확장브래킷 [Inpa Dev 👨‍💻:티스토리]
