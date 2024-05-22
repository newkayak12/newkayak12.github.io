
---
layout: post
categories: [LINUX]
---
from [Dictionary - SystemInfo](https://github.com/newkayak12/Dictionary/blob/master/linux/SystemInfo.md)



## `cat /proc/cpuinfo`
CPU 정보를 열람할 수 있다.

```
processor       : 0
BogoMIPS        : 108.00
Features        : fp asimd evtstrm crc32 cpuid
CPU implementer : 0x41
CPU architecture: 8
CPU variant     : 0x0
CPU part        : 0xd08
CPU revision    : 3

processor       : 1
BogoMIPS        : 108.00
Features        : fp asimd evtstrm crc32 cpuid
CPU implementer : 0x41
CPU architecture: 8
CPU variant     : 0x0
CPU part        : 0xd08
CPU revision    : 3

processor       : 2
BogoMIPS        : 108.00
Features        : fp asimd evtstrm crc32 cpuid
CPU implementer : 0x41
CPU architecture: 8
CPU variant     : 0x0
CPU part        : 0xd08
CPU revision    : 3

processor       : 3
BogoMIPS        : 108.00
Features        : fp asimd evtstrm crc32 cpuid
CPU implementer : 0x41
CPU architecture: 8
CPU variant     : 0x0
CPU part        : 0xd08
CPU revision    : 3

Hardware        : BCM2835
Revision        : c03114
Serial          : 10000000e19a2b57
Model           : Raspberry Pi 4 Model B Rev 1.4

```

```
ex)

#코어 수
grep -c processor /proc/cpuinfo 

# 물리 CPU 개수
$ grep ^processor /proc/cpuinfo  | wc -l
> 4 # 현재 PC의 물리 CPU 수는 4개.


# CPU 당 물리 코어 개수
$ grep 'cpu cores' /proc/cpuinfo | tail -1
> 4 # 현재 PC의 CPU 당 물리 코어 개수는 4개


# Hyper Threading 여부
$ cat /proc/cpuinfo | egrep 'siblings|cpu cores' | head -2
> siblings     :    4
> cpu cores    :    4

```


## lscpu
/proc/cpu를 더 간단하게 볼 수 있는 명령

## top
```
-n : 지정한 숫자만큼 화면 출력을 갱신한 후 수행
-u : 지정한 사용자의 프로세스를 모니터링
-b : 출력 결과를 파일이나 다른 프로그램으로 전달
-d : 화면 갱신 주기를 초 단위로 설정
-p : 지정한 PID 프로시스를 모니터링
```

## free
전체 메모리(사용하고 있는 메모리, 남은 메모리, 버퍼 메모리)에 대한 상태를 확인
```
-b : byte 단위 표시
-m : mb 단위 표시
-g : gb 단위 표시
-k : kb 단위 표시
-l : 최고/최저 메모리 상황 구분해서 표현
-s N : N초마다 출력
```

## df
디스크 남은 용량(disk free) 확인
```
-k : kb
-m : mb
-h : human(??)
```

## du
현재 디렉토리에서 서브 디렉토리까지 사용량(disk usage) 확인
```
-a : 하위 디렉토리에 포함된 파일까지 모든 파일 사용정보 용량 표시
-s : 지정한 디렉토리 내에 존재하는 모든 파일, 서브 디렉토리의 합 
-h : 깔끔하게

```


## hostname -I
호스트 네임 출력

## ifconfig
== ipconfig
```
[enp0s3] : 네트워크 인터페이스
[flags] : 네트워크 카드의 상태 표시
[mtu] : 네트워크 인터페이스의 최대 전송 단위(Maximum Transfer Unit)
[inet] : 네트워크 인터페이스에 할당된 IP 주소
[netmask] : 네트워크 인터페이스에 할당된 넷마스크 주소
[broadcast] : 네트워크 인터페이스에 할당된 브로드캐스트 주소
[inet6] : 네트워크 인터페이스에 할당된 IPv6 주소
[prefixlen] : IP 주소에서 서브 넷 마스크로 사용될 비트 수
[scopeid] : IPv6의 범위. LOOPBACK / LINKLOCAL / SITELOCAL / COMPATv4 / GLOBAL
[ether] : 네트워크 인터페이스의 하드웨어 주소
[RX packets] : 받은 패킷 정보
[TX packets] : 보낸 패킷 정보
[collision] : 충돌된 패킷 수
[Interrupt] : 네트워크 인터페이스가 사용하는 인터럽트 번호

```

## ip a 
ifconfig와 흡사하지만 UP&DOWN 정보, ip, mac 정보 확인 가능
