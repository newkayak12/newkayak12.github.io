## vmstat(Virtual Memory STAT)
리눅스의 프로세스, 메모리, 페이징, I/O 블록, CPU 활동 사항 출력
```dockerfile
-n	주기적으로 헤더를 출력하지 말고, 한번만 헤더를 출력
-a (active)	buffer와 cache대신 active/inactivate로 메모리사용량 결과 출력
-t (timestamp)	날짜 + 시간을 출력
-w  (wide)	출력결과의 너비를 맞춤
-d  (disk)	디스크 상태조회
```