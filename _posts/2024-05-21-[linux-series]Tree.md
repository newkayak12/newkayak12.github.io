# Linux
![](/assets/img/fileTree.png)

## bin, sbin
- bin : user command binaries -> 커맨드 라인 인터페이스 관련된 명령어 실행 파일을 포함 ( ex. `cat`, `cd`, `ls` ... )
- sbin : system command binaries -> 시스템을 컨트롤하기 위한 파일들 ( ex. `systemctl`, `reboot`)

연관된 디렉토리 종류는 usr/bin, usr/sbin, usr/local/bin, usr/local/sbin

- bin: cd, ls 등의 사용자 커맨드 파일이 위치한 디렉토리 (필수적인 파일만 관리)
- sbin: systemctl 등의 시스템 커맨드 파일이 위치한 디렉토리 (필수적인 파일만 관리)
- usr/bin: 필요에 의해 설치된 사용자 커맨드 파일이 위치한 디렉토리 (yum 등 패키지 관리자가 관리)
- usr/sbin: 필요에 의해 설치된 시스템 커맨드 파일이 위치한 디렉토리 (yum 등 패키지 관리자가 관리)
- usr/local/bin: 기타 사용자 커맨드 파일이 위치한 디렉토리 (사용자 또는 설치 파일이 해당 디렉토리에 파일 설치)
- usr/local/sbin: 기타 시스템 커맨드 파일이 위치한 디렉토리 (사용자 또는 설치 파일이 해당 디렉토리에 파일 설치)

## PATH
OS 어디서든 해당 위치에 접근할 수 있게 만드는 환경변수이다. 위의 6개 디렉토리는 모두 환경 변수에 등록되어 있어서 해당 폴더들 내부에 있다면
바로 명령어로 실행할 수 있다. 


## lib, lib64
lib, lib64는 시스템 부팅이나 bin, sbin 디렉토리에 있는 바이너리 파일들 실행에 필요한 공유 라이브러리 디렉토리다.


## etc
etc는 설정 파일을 관리한다. `.d`를 붙여서 디렉토리인 것을 구별하기도 하는 경우가 있다. 설정 파일은 `.conf`라는 이름의 형식으로 많이 관리 되어 있다.


## var
variable data를 뜻한다. 시스템 로그나 웹 로그 파일들을 포함한다. 

## usr
universal system resource 혹은 user의 약자라고 하기도 한다. 리눅스의 여러 사용자들이 공유하는 파일들을 관리한다. 

## opt
optional을 의미한다. 

## home, root
home은 개별 사용자의 디렉토리를 관리하는 디렉토리다. 만약 ec2-user라는 이름의 사용자를 만들면 `/home/ec2-user`라는 디렉토리가 생성된다.


## FHS( Filesystem Hierarchy Standard ) - 기타 디렉토리

### media, mnt
시스템이 마운팅되는 디렉토리 `media`는 os가 관리하는 디렉토리 `mnt`는 커맨드라인으로 마운트하는 디렉토리

### boot
부팅에 필요한 파일들을 포함하는 디렉토리

### dev
마우스 등 디바이스 관련 파일이 존재하는 디렉토리

### sys
디바이스를 관리하기 위한 가상 파일 시스템 디렉토리

### proc
현재 실행 중인 프로세스에 대한 정보를 관리하는 디렉토리

### run
Run-time variable data를 관리한다. 부팅 후 시스템 정보를 관리하는 디렉토리

### srv
FTP, WWW 또는 CVS(???) 같은 특정 서비스의 데이터 파일 위치를 포함한 디렉토리

### tmp
임시 파일을 저장하기 위한 디렉토리 재부팅 시 삭제, 정기적으로 10일 정도 간격으로 삭제된다. 

### lost+found
파일 시스템의 복구에 사용되는 데이터 조각들을 포함하고 있다. 재부팅이나 파일 시스템 체크 커맨드 등을 이용할 때 참조

-------
https://inpa.tistory.com/entry/LINUX-📚-리눅스-디렉토리-구조#