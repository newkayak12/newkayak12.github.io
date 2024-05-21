# ShellScript

[Shell 문법 검사기](https://www.shellcheck.net/)

## 쉘 종류
```shell 
#!/usr/bin/bash 
## 어떤 쉘로 스크립트를 실행할지 정의

echo $(which bash)
```

## 실행 방법
1. 권한 주고 실행
```shell
$ vi script.sh
# ... 작성후 종료
$ chmod +x script.sh or chmod 755 script.sh
$ ./script.sh # 쉘 스크립트 실행
```

2. bash로 실행
```shell
$ vi script.sh
# ... 작성후 종료

bash script.sh
```
## Declare variables
변수의 타입에는 로컬변수와 전역변수, 환경변수, 예약변수, 매개변수 등 다양히이 존재한다.

- 변수는 대, 소문자를 구별한다.
- 변수의 이름은 숫자를 포함할 수 있지만, 숫자로 시작할 수 없다.
- 변수에는 모든 값을 문자열로 저장된다.
- 변수에는 자료형을 기입하지 않는다. (int number, char names[10]), 즉 아무런 값을 다 넣을 수 있다.
- 값을 사용할 때는 변수명 앞에 특수문자 "$"를 사용한다. (Ex. echo ${data})
- 값을 대입(삽입)할 때는 특수문자 "$"를 사용하지 않는다. (Ex. data=mac)
- 변수를 생성할 때는 "=" 대입문자 앞뒤로 공백이 없어야 한다. (Ex. data="abcd")

## Local/ Global variables
기본적으로 변수 선언하면 전역이다. 함수 내부에서만 지역변수다. 
```shell
# 기본적으로 전역 변수로 지정
string="hello world"

function string_test() {
    # local을 붙여야 지역변수로 인식. 만일 local을 빼면 전역변수 덮어쓰기가 되버림
    local string="hello local @@"
    echo ${string}
}

# 함수 호출
string_test # > hello local @@
echo ${string} # > hello world

# 변수 초기화
unset string
```

## Type
```shell
# -r 읽기 전용 타입 (상수 const라고 보면 된다)
declare -r var1
readonly var1

# -i 정수형 타입
declare -i number
number=3
echo "number = $number"     # number = 3

# -a 배열 타입
declare -a indices

# -A 연관배열(MAP) 타입
declare -A map

# -f 함수 타입
declare -f

# -x 환경변수(export) 지정
declare -x var3 # 스크립트 외부 환경에서도 이 변수를 쓸 수 있게 해준다.
```

## Environment variables
쉘 스크립트에서 변수 명 앞에 export을 붙여주면 환경 변수(environment variable)로 설정되어 자식 스크립트에서 사용 가능하다.
다만 환경 변수 사용시 시스템에 미리 정의된 [예약 변수(reserved variable)](#reserved-variables)와 변수명이 겹치지 않게 주의하자.


## Parameter
./test($0) a($1) b($2) ...
shell 실행 시 매개변수를 받을 수 있다. `$`와 숫자 조합으로 표현한다. 
- `$0`은 scriptName으로 고정 `$숫자`로 변수를 받을 수 있다.
- `$#`는 변수 개수
- `$*`는 전체 인자
- `$!`는 실행을 백그라운드로 보내진 마지막 프로그램 프로세스 번호
- `$$`는 PID
- `$?`는 리턴 값

## Reserved variables
변수| 설명
:---:|:---:
HOME| 사용자 홈 디렉토리
PATH| 실행 파일의 경로여러분이 chmod, mkdir 등의 명령어들은 /bin이나 /usr/bin, /sbin에 위치하는데, 이 경로들을 PATH 지정하면 여러분들은 굳이 /bin/chmod를 입력하지 않고, chmod 입력만 해주면 된다.
LANG| 프로그램 실행 시 지원되는 언어
UID| 사용자의 UID
SHELL| 사용자가 로그인시 실행되는 쉘
USER| 사용자의 계정 이름
FUNCNAME| 현재 실행되고 있는 함수 이름
TERM| 로그인 터미널

## command
- set : 셸 변수를 출력하는 명령어
- env : 환경 변수를 출력하는 명령어
- export : 특정 변수의 범위를 환경 변수의 데이터 공간으로 전송하여 자식 프로세스에서도 특정 변수를 사용 가능하게 한다. 전역 변수의 개념
- unset : 선언된 변수를 제거한다.


## operation
- expr
- let
- $(())

### expr
- expr는 역따옴표를 반드시 감싸준다. 역따옴표 대신 $(( )) 해줘도 동작은 한다.
- expr을 사용할 때 피연산자와 연산자 사이에 공백이 필요하다.
- 산술 연산할때 우선순위를 지정하기위해 괄호를 사용하려면 \처리를 해줘야 한다.
- 곱셈 문자 *는 \처리를 해주어야 한다.
```shell
#!/bin/bash

number1=10
number2=20

plus=`expr $number1 + $number2` 
minus=`expr $number1 - $number2`
mul=`expr $number1 \* $number2` # 곱셈에는 \* 를 이용한다.
div=`expr $number1 / $number2`
rem=`expr $number1 % $number2`

echo "plus:     ${plus}"
echo "minus:    ${minus}"
echo "mul:      ${mul}"
echo "div:      ${div}"
echo "rem:      ${rem}"
```

### let
```shell
num1=42
num2=9
 
let re=num1+num2 #Add
echo "add:$re"

let re=num1-num2 #Sub
echo "sub:$re"

let re=num1*num2 #Mul
echo "mul:$re"

let re=num1/num2 #Div
echo "div:$re"

let re=num1%num2 #Mod
echo "mod:$re"
```
### $(())
```shell
num1=42
num2=9
 
echo add:$((num1+num2))
echo sub:$((num1-num2))
echo mul:$((num1*num2))
echo div:$((num1/num2))
echo mod:$((num1%num2))
```

## block annotation
```shell
<코드라인>
: << "END"              #주석 시작
echo "여기서부터 "
echo "test_01"
echo "test_02"
echo "test_03"
echo "test_04"
echo "test_05"
echo "test_06"
echo "test_07"
echo "여기까지 주석처리 됨"
END                    #주석 끝

echo "여기는 주석이 안되어 있어 출력 "
```
### vi 에디터로 여러줄 주석 방법
기본 여러줄 주석 문법이 별로라면, vi 단축키를 이용한 주석 처리 방법이 있다.

1. vi 편집기를 열고  ctrl + v를 눌러 비주얼 모드로 진입한다. (비주얼 모드는 vim 이 설치 되어 있어야 한다.)
2. 주석을 처리하고자 하는 라인까지 방향키 또는  vi방향키를 이용하여 이동한다. 
3. shift + i 누르고 #을 입력한다. 
4. esc 키를 여러번 누른다.
5. 주석 처리 됨을 확인한다. 

## if
배쉬의 if문의 특이한 점은 fi 와 대괄호[ ] 이다.
여타 언어와 달리 중괄호를 안쓰기 떄문에 fi로 if문의 끝을 알려주어야 하며,
주의해야 할 점은 if문 뒤에 나오는 대괄호 [ ] 와 조건식 사이에는 반드시 공백이 존재해야 한다.

```shell
if [ 값1 조건식 값2 ]
then
    수행1
else
    수행2
fi


# 가독성 좋기 위해 then을 if [] 와 붙여쓰려면 반드시 세미콜론 ; 을 써야한다.
if [ 값1 조건식 값2 ]; then
    수행1
else
    수행2
fi
```

### 비교 연산
```shell
문자1 = 문자2             # 문자1 과 문자2가 일치 (sql같이 = 하나만 써도 일치로 인식)
문자1 == 문자2            # 문자1 과 문자2가 일치
문자1 != 문자2            # 문자1 과 문자2가 일치하지 않음
-z 문자                   # 문자가 null 이면 참
-n 문자                   # 문자가 null 이 아니면 참
문자 == 패턴              # 문자열이 패턴과 일치
문자 != 패턴              # 문자열이 패턴과 일치하지 않음

값1 -eq 값2             # 값이 같음(equal)
값1 -ne 값2             # 값이 같지 않음(not equal)
값1 -lt 값2             # 값1이 값2보다 작음(less than)
값1 -le 값2             # 값1이 값2보다 작거나 같음(less or equal)
값1 -gt 값2             # 값1이 값2보다 큼(greater than)
값1 -ge 값2             # 값1이 값2보다 크거나 같음(greater or equal)


```
>### 이중 괄호
>(( expression ))expression 에는 수식이나 비교 표현식이 들어갈 수 있다.

수식| 설명
:---:|:---:
`!`|논리 부정
`~`|비트 부정
`**`|지수화
`<<`|비트 왼쪽 쉬프트
`>>`|비트 오른쪽 쉬프트
`&`|비트 단위AND
`|`|비트 단위 OR
`&&` |논리 AND
`||` |논리 OR
`num++` |후위증가
`num--` |후위감소
`++num` |전위증가
`--num` |전위감소
```shell
num1=35
num2=48

# 이중 소괄호를 쓰면 조건문을 문자 대신 기호로 표현 가능하다. 단, 소괄호 안에 따옴표 쓰면 안된다.
if (( ${num1} < ${num2} )); then
    echo "yes"
fi

if (( ($num1 * $num2) - $num2 > 200 )); then
	echo ">200"
else
	echo "<200"
fi
```

### 파일 검사 연산
![img.png](img%2Fimg.png)

> ### 이중 대괄호
> [[ "1.8.3" == 1.7.* ]]&&, ||, = ~ * (정규식 매칭) 과 같은 확장 expression test 기능을 대괄호 내에 사용할 수 있게 한다.그냥 대괄호의 개선버젼 정도로 생각하면 된다.


## switch-case
```shell
case ${var} in
    "linux") echo "리눅스" ;; # 변수var값이 linux라면 실행 
    "unix") echo "유닉스" ;;    
    "windows") echo "윈도우즈" ;;    
    "MacOS") echo "맥OS" ;;    
    *) echo "머야" ;; # default 부분
esac


COUNTRY=korea

case $COUNTRY in
  "korea"|"japan"|"china") # or 연산도 가능하다
    echo "$COUNTRY is Asia"
    ;;
  "USA"|"Canada"|"Mexico")
    echo "$COUNTRY is Ameria"
    ;;
  * )
    echo "I don't know where is $COUNTRY"
    ;;
esac
```


## for statement
### for
```shell
#!/bin/bash
## FOR

# 초기값; 조건값; 증가값을 사용한 정통적인 for문
for ((i=1; i<=4; i++)); do
    echo $i
done
```

### for-in
```shell
#!/bin/bash

# 루프 돌 데이터에 띄어쓰기가 있으면 각각 돌음
for x in 1 2 3 4 5
do
	echo "${x}"
done


# 변수를 사용한 반복문
data="1 2 3 4 5"
for x in $data
do
	echo ${x}
done


# !/bin/bash

# 루프 돌 데이터에 띄어쓰기가 있으면 각각 돌음
for x in 1 2 3 4 5
do
	echo "${x}"
done


# 변수를 사용한 반복문
data="1 2 3 4 5"
for x in $data
do
	echo ${x}
done


# 배열을 사용한 반복문
arr=(1 2 3 4 5)
for i in "${arr[@]}" # arr[@] : 배열 전체 출력
do
	echo "${i}"
done


# sequence를 통한 for문. seq라는 프로세스가 순서대로 숫자를 출력해 주는 역할을 bash에 사용한 것이다.
for num in `seq 1 5`
do
  echo $num
done


# range를 사용한 반복문. {..} 중괄호와 점 두개를 쓰면 range처리가 된다.
for x in {1..5}
do
	echo ${x}
done
# 배열을 사용한 반복문
arr=(1 2 3 4 5)
for i in "${arr[@]}" # arr[@] : 배열 전체 출력
do
	echo "${i}"
done

##FOR-IN
# sequence를 통한 for문. seq라는 프로세스가 순서대로 숫자를 출력해 주는 역할을 bash에 사용한 것이다.
for num in `seq 1 5`
do
  echo $num
done


# range를 사용한 반복문. {..} 중괄호와 점 두개를 쓰면 range처리가 된다.
for x in {1..5}
do
	echo ${x}
done
```

### example
```shell
# 파일 리스트 출력
for line in `ls` # 역따옴표 써서 ls를 문자가 아닌 하나의 명령어로 실행
do
 echo $line # 해당 위치에 파일이나 디렉토리들이 출력
done

# 한줄 문법 (한줄로 쓰면 터미널에서 직접 스크립트를 실행 할 수 있다)
for line in `ls`; do echo $line; done
```


## while
```shell
count=0
while [ ${count} -le 5 ]; 
do
    echo ${count}
    count=$(( ${count}+1 ))
done

count=0
while (( ${count} <= 5 ));  # 이중괄호 사용하면 논리기호 사용 가능
do
    echo ${count}
    count=$(( ${count}+1 ))
done
```

## Array
``` shell
#!/bin/bash

# 배열의 크기 지정없이 배열 변수 선언
# 굳이 'declare -a' 명령으로 선언하지 않아도 바로 배열 변수 사용 가능함
declare -a array

arr=("test1" "test2" "test3") # 배열 선언 및 지정

echo ${arr[0]}  # test1


# 기존 배열에 1개의 배열 값 추가 3가지 방법
arr[3]="test4" 
arr+=("test5")
arr[${#arr[@]}]="test6" # 배열 길이를 인덱스로 사용해 push


echo ${arr[@]}  # arr의 모든 데이터 출력
echo ${arr[*]}  # arr의 모든 데이터 출력
echo ${#arr[@]} # arr 배열 길이 출력

echo ${arr[@]:2:3} # 2부터 3개의 요소
```

## Map
```shell
# 연관배열 생성
declare -A map=([hello]='world' [long]='long long long string' [what is it]=123)

declare -p map # 연관배열 정보 출력
# > declare -A map=([long]="long long long string" ["what is it"]="123" [hello]="world" )

echo "map[hello]=${map[hello]}" 
# > map[hello]=world

key=hello # 변수를 인덱스로 넣어줘도 된다. (MAP의 특성)
echo "map[key]=${map[${key}]}" 
# > map[key]=world
```

## Scanner
```shell
echo -n "String input : "
read [변수명] # <- 터미널에서 입력된 인풋값이 변수에 저장되게 된다.
echo "user input : $변수명 # 입력된 값 출력
```

## function
다른 프로그래밍 언어와 달리 쉘 스크립트에서는 함수명 앞 function은 써주지 않아도 알아서 인식된다. 
또한, 함수를 호출할때는 괄호를 써주지 않고 호출해야한다는 점이 다르다.
그리고 함수 호출 코드는 함수 코드보다 반드시 뒤에 있어야 된다. 함수 코드 보다 앞에서 호출 시 오류가 발생하기 때문이다.
```shell
#!/bin/bash

func(){
	echo "func()"
}

function string_test() {
    echo "string test"
    echo "인자값: ${@}"
}

#함수 호출
func

# 함수에 인자값 전달하기(공백의로 뛰어서 2개의 인자값을 넘김)
string_test "hello" "world"
```

인자는 공백으로 구분하여 하나씩 넣으면 된다. 
```shell
function test3()
{
    param1=$1
    param2=$2
    echo $param1 # a
    echo $param2 # b
    echo $@ # 파라미터 전체 출력
}

test3 "a" "b"
```

## 종료 상태
종료 코드란, exit 명령으로 프로그램을 종료시키면서 사용자에게 프로그램 종료의 이유를 알리기 위하여 반환하는 값이다.
쉘 스크립트 내에서 exit 명령어가 실행되면 스크립트가 종료되며 부모 프로세스에 종료 상태를 전달할 수 있는데 
이 값은 프로그램 내에서 임의로 지정할 수도 있다.
```shell
#!/bin/bash

exit 16 # 강제 종료
echo "wtf" # 실행안됨
```
`0` 은 성공 이외는 모두 오류다.


## Shell command(command substitution)
`$()` 안의 실행문을 실행하고 그 결과를 `$()`으로 리턴한다.
```shell
#!/bin/bash

# 그냥 date 문자열 출력
echo date

# 백틱으로 감싸주면 date 명령어가 실행되게 된다.
echo `date`

# $()도 마찬가지
echo $(date)

# shell execution
echo "I'm in `pwd`"
echo "I'm in $(pwd)"
```


출처: https://inpa.tistory.com/entry/LINUX-쉘-프로그래밍-핵심-문법-총정리 [Inpa Dev 👨‍💻:티스토리]
