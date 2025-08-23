---
layout: post
categories: [LINUX]
---
from [Dictionary - xars vs. pipe](https://github.com/newkayak12/Dictionary/blob/master/linux/xargs_vs_pipe.md)

# xars vs. pipe

## xars
- 기본적인 명령어 뒤에 파이프로 추가하여 사용
- 파이프 이전에 명령을 인자로 받아 명령어를 실행하는 구조

xargs를 사용하는 가장 기본적인 예는 pipe to xargs를 사용하여 공백으로 구분된 여러 문자열을 전달하고 
해당 문자열을 인수로 사용할 명령을 실행하는 것이다.

```shell
# file1 file2 file3 이라는 문자열을 touch 의 인수로 넘겨주어,
# touch file1 file2 file3 명령을 수행한것과 같은 결과를 준다. (빈파일 3개 생성)
echo "file1 file2 file3" | xargs touch
```

### options
|    option     |                                         description                                         |
|:-------------:|:-------------------------------------------------------------------------------------------:|
|      -a       |                                   표준 입력 대신 파일에서 항목을 읽는다.                                    |
|      -O       |                                      공백이나 특수문자 찾을 때 사용                                      |
|    -printO    |                                   파일 사이의 공백을 \O로 분리자로 출력                                    |
|      -d       |                                  입력된 문자를 그대로 사용(따옴표, 백슬래시)                                  |
|      -n       |                                       지정된 숫자만큼 행을 출력                                        |
|      -p       |                         각 명령 행 실행 여부, 터미널에서 행을 읽어들이는 것에 대한 여부를 묻는다.                         |
|      -P       |                                하나의 명령에 프로세스를 지정 (-n과 같이 사용)                                 |
|      -t       |                                xargs를 통해 구성된 명령어를 표준 에러로 출력                                 |
|      -s       | 한 라인에 들어갈 수 있는 문자열 수를 지정(기본적으로 128k 안으로 문자열을 만들어 하나의 명령으로 실행하나 해당 옵션으로 1024k까지 사용 가능하게 한다.) |
|      -x       |                                   -s로 지정한 크기가 초과되면 종료시킨다.                                   |
| --show-limits |                            xargs의 버퍼 크기 선택 및 -s 옵션에 대한 길이 제한 출력                             |
|      -E       |                                     문자열 끝을 eof-str로 설정                                      |
|      -I       |                    xargs에 전달된 라인 전체를 뒤에 나오는 명령어의 인자로 사용 (라인 전체는 {}로 표기)                     |
|      -l       |                         명령어 뒤 공백을 다음 행이 아닌 논리적으로 이어진 명령으로 인식하게 한다.                          |

### 예제
```shell
# /tmp 디랙토리 아래 core라는 파일을 찾아 삭제
$ find /tmp -name core -type f -print | xargs rm -f

# ls를 이용하여 text파일을 모두 읽어와 하나의 파일로 병합
$ ls *.txt | xargs cat >> abc.txt

# 디렉토리에서 txt파일을 우선 찾은 다음 이름에 abcd를 포함하는 파일을 또 찾음
$ find ~/ -type f | grep -H “*.txt$” | xargs grep -H “abcd”

# 파일안에 url이 있을 경우 해당 인자들을 모두 wget으로 넘겨 다운받는다
$ cat url-list.txt | xargs wget -c

# 모든 jpg파일을 찾아 images.tar.gz로 압축
$ find / -name “*.jpg” -type -f -print | xargs tar -cvzf images.tar.gz

# ls 로 출력된 모든 이미지를 하나씩 인자로 받아 외장하드로 복사
$ ls *.jpg | xargs -n1 -I{} cp {} /external-hard-drive/tmp
```
## xargs vs. pipe
> 파이프 '|' 는 앞의 결과를 인자로 받는게 아니다.
> 파이프 '|' 는 앞의 표준출력을 다음 프로그램의 표준입력으로 연결하는 것이다.
> 파이프 '|' 와의 조합으로 표준출력을 다음 프로그램의 '인자'로 넘길려면 xargs 를 사용한다.
> xargs 프로그램은 실행할 대상프로그램을 인자로 받고, xargs 프로그램의 표준입력을 실행 대상프로그램의 인자로 전달하여 실행한다.

### 예시
> `<<<` 뒤에는 문자열이나 변수가 바로 붙는다
> `<` 는 표준입력 리다이렉션이다.

```shell
vi err.txt
err
:wq


echo err.txt | cat ## err.txt
## 파일명 자체를 
echo err.txt | xargs cat ## err
## 파일을

```


 출처: https://inpa.tistory.com/entry/LINUX-📚-xargs-명령-파이프-와-차이점-완벽-정리-표준입력-인자-차이 [Inpa Dev 👨‍💻:티스토리]
