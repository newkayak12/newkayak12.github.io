# 환경변수
## 0. 환경 변수 확인
```shell
printenv [변수명]
pringenv HOME
```

## 1. 변수 설정
### 1.1 쉘 변수
현재 쉘에만 적용되는 변수
```shell
Test="TestVariables"
set|grep Test
```

### 1.2 환경 변수
시스템 전체에서 사용 가능한 변수이자 자식쉘에도 상속된다.
```shell
export Test="TestVariables"
```

### 1.2.1 /etc/profile
bash 로그인 쉘에 진입할 때 로드
```shell
export JAVA_HOME="/path/to/java/home"
export PATH=$PATH:$JAVA_HOME/bin
```
### 1.2.2 ~/.bashrc
사용자별 쉘 구성 파일 

## 2. 설정 해제
```shell
unset [변수명]
```