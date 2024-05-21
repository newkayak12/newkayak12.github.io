# Volume

- lsblk : 블록 장치를 나열하는 유틸리티 추가 정보를 보려면 `lsblk -f`
- blkid : 블록 디바이스의 uuid를 출력
- hwinfo: 하드웨어, 특히 스토리지 디스크에 대한 정보를 볼 수 있는 유틸리티이다. `hwinfo --disk | --short | --block`
- mount : mount [-o [옵션]] <partition|disk> <mountPoint> (* 영구 마운트 : /etc/fstab에 추가)
- unmount: umount [-o [옵션]] <mountPoint>


```
Device의 종류

Block Device : Block 단위로 입출력을 하는 Device, Block은 File System의 섹터를 의미
Character Device : Character 단위, 즉 바이트 단위로 입출력을 하는 Device, 데이터 관리 기능을 가진 응용 프로그램
Network Device : 네트워크 층과 연결되어 있음(루프백 장치, 랜카드와 같은...)
```
|           |      blockDevice       |                   characterDevice                    |
|:---------:|:----------------------:|:----------------------------------------------------:|
| 데이터 전송 단위 | Block(File System의 섹터) |                 Character(문자, Byte)                  |
|       전송 버퍼 처리     |    System Buffer 사용    |                    응용 프로그램 Buffer                    |
|       대표 장치     |        HDD, SSD        |                키보드, 마우스, 모니터, 프린터 등..                 |
|         주요 특징  |      File System       | 자체적으로 데이터를 관리하기 위한 기능을 가진 <br/> 응용 프로그램 사용(DBMS....) |


## 블록 디바이스(Block Device) 요청 처리 방식
리눅스 커널은 블록 디바이스를 효율적으로 처리하기 위해 처리할 내용을 큐에 모아두었다가 일정 시간이 지나거나 임계치에 도달하면 블록 디바이스 드라이버에 처리를 요구, 블록 디바이스 드라이버에 요구하는 처리 함수는 두 가지 형식으로 존재(커널 처리에 있어서 두 가지가 동시에 일어나는 경우는 없음)