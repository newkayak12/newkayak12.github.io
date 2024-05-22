---
layout: post
categories: [LINUX]
---
from [Dictionary - Journalctl](https://github.com/newkayak12/Dictionary/blob/master/linux/Journalctl.md)

> 당시 프로젝트 중 oom이 잦아서 아마존 리눅스에서 로그를 보려하는데
> amazonlinux가 /var/log/messages에 로그를 저장을 안해서 찾아본 문서

# AmazonLinux /var/log/messages 에 로그가 없어서

journalctl 이란?
- systemd의 서비스 로그를 확인할 수 있다.
- systemd-journald.service에 의해서 systemd의 정보들을 분석한다.

옵션
- `-a` : 표시할 수 없는 문자가 있거나 매우 긴 경우에도 모든 Log 내용을 출력
- `-b` : 마지막 부팅 후의 Log만 출력
- `-r` : 최신항목이 먼저 표시되도록 역순으로 출력
- `-c` : 커서가 지정한 저널의 위치부터 Log 표시를 시작
- `-f` : 가장 최근 Log만 표시하고 새롭게 추가되는 Log는 계속 출력
- `-k` : 커널 메시지만 출력 (dmesg랑 같음)
- `-q` : 일반 사용자로 실행될 때 접근할 수 없는 시스템 저널에 관한 경고메시지를 표시하지 않음
- `-u` : unit으로 systemctl list-units에서 출력되는 첫번째 항목
- `-p` : 메시지의 우선순위로 log level을 의미
    emerg=0, alert=1, crit=2, err=3, warning=4, notice=5, info=6, debug=7
- `-o` : Log 출력 형식을 설정
  - short : 기본값으로 syslog파일의 형식과 동일하다. 한 행에 하나의 Log만 출력
  - short-iso : short와 비슷하지만 ISO 8601의 시간 형식으로 출력
  - short-precise : short와 비슷하지만 마이크로 초 단위로 시간 출력
  - short-monotonic : short와 비슷하지만 단조로운 시간 형식으로 출력
  - verbose : 전체 Log를 모두 자세하게 출력
  - export : Log내용을 내보낸다. (백업 및 전송에 적합한 바이너리 스트림으로 직렬화)
  - json : 한줄에 하나씩 JSON 데이터 구조로 형식화
  - json-pretty : JSON 데이터 구조로 형식화 하지만 여러줄로 형식을 지정하여 사람이 읽을 수 있게 한다.
  - json-see : JSON 데이터 구조로 형식화 하지만 Server-Sent Events에 적합한 형식으로 한다.
  - cat : 매우 간결한 출력을 생성하며 메타 데이터가 없고 Log만 표시하며 시간은 표시하지 않음
- `-l` : 출력되는 Log의 필드를 줄일때 사용, 기본값은 전체 필드를 표시하여 사용자가 해당 필드를 붙이거나 자를 수 있도록 한다.
- `_UID= 33` : 33번 UID를 가진 프로세스에 대한 Log를 출력
- `--disk-usage` : 저널 파일의 디스크 사용량을 표시 (압춘된 모든 더널 파일과 사용중인 저널 파일의 합계를 표시)

설정파일
# vi /etc/systemd/journald.conf
```java
[Journal]
#Storage=auto
#Compress=yes
#Seal=yes
#SplitMode=uid
#SyncIntervalSec=5m
#RateLimitInterval=30s
#RateLimitBurst=1000
#SystemMaxUse=    -> journal log 파일의 최대 Size를 지정
#SystemKeepFree=
#SystemMaxFileSize=
#RuntimeMaxUse=
#RuntimeKeepFree=
#RuntimeMaxFileSize=
#MaxRetentionSec=
#MaxFileSec=1month  -> journal log 파일의 최대보관일수를 지정
#ForwardToSyslog=yes
#ForwardToKMsg=no
#ForwardToConsole=no
#ForwardToWall=yes
#TTYPath=/dev/console
#MaxLevelStore=debug
#MaxLevelSyslog=debug
#MaxLevelKMsg=notice
#MaxLevelConsole=info
#MaxLevelWall=emerg
```

사용법
1. 마지막 부팅 후 로그 보기
# journalctl -b

2. 오늘 날짜 로그 보기
# journalctl --since=today

3. 특정 기간별 로그 보기
# journalctl --since "2017-05-25 00:00:00" --until "2017-05-30 10:30:00"
# journalctl --since "1 hour ago"
# journalctl --since "2 days ago"

4. 특정 서비스 데몬 로그 보기
# journalctl -u sshd

5. 특정 이벤트 속성 조회
# journalctl -p crit

6. 특정 서비스데몬 및 속성과 날짜 로그 보기
# journalctl -u libvirtd --since=yesterday -p err

7. Error 로그 자세히 보기
# journalctl -p err -o verbose

8. 특정 이벤트 조회
# journalctl /sbin/crond

9. 밑에서부터 로그 보기
# journalctl -f
# journalctl -r -b 

10. UID 로 검색 (id)
journalctl _UID=108


journalctl이 느릴때(btrfs)
1. Log의 크기를 확인
# journalctl --disk-usage

2. 로그를 저장하는 파일 데이터베이스에 단편화를 확인
# filefrag /var/log/journal/*/*

3. 단편화를 제거
# btrfs fi defrag -v -f -clzo /var/log/journal/*/* 
