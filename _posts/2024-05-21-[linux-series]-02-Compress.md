---
layout: post
categories: [LINUX]
---
from [Dictionary - Compress](https://github.com/newkayak12/Dictionary/blob/master/linux/Compress.md)

## tar/ Compress/ gzip/ bzip2/ xz/ zip

### 리눅스와 윈도우 파일 압축 방식
리눅스는 윈도우와 다르게 압축과 대상 파일을 묶는 것을 따로 한다. 윈도우는 묶으면서 동시에 압축하는 반면 리눅스는
 압축하거나 관리할 파일들을 먼저 하나의 파일로 묶고(아카이빙) 묶인 파일을 따로 압축한다. 

### 아카이브
linux는 묶는 것과 압축을 따로 한다. 한 파일로 묶는 것을 아카이브(archive)라고 하며 확장자는 `.tar(tape archive)`를 가진다.
그리고 tar를 다시 gzip으로 압축해서 `.tar.gz` 확장자를 볼 수 있다.

### tar(tape archive) 명령어
```dockerfile
tar [OPTION] [ArchiveFileName] [FILE|PATH]
```
| 옵션  |	동작|
|:---:|:---:|
| -f	 |대상파일을 tar 아카이브 지정 (기본 옵션)|
 | -c	 |tar 아카이브 생성. 기존 아카이브 덮어 쓰기 (파일 묶을 때 사용)|
 | -x	 |tar 아카이브에서 파일 추출(파일 풀 때 사용)|
 | -v	 |처리되는 과정(파일 정보)을 자세하게 나열|
 | -z	 |gzip 압축 적용 옵션|
 | -j	 |bzip2 압축 적용 옵션|
 | -t	 |tar 아카이브에 포함된 내용 확인|
 | -C	 |대상 디렉토리 경로 지정|
 | -A	 |아카이브 파일을 tar 아카이브에 추가|
 | -d	 |tar 아카이브와 파일 시스템 간 차이점 검색|
 | -r	 |tar 아카이브 마지막에 파일들 추가|
 | -u	 |tar 아카이브에 새롭게 추가된 파일만 추가|
 | -k	 |tar 아카이브 추출 시, 기존 파일 유지|
 | -U	 |tar 아카이브 추출 전, 기존 파일 삭제|
 | -w	 |모든 진행 과정에 대해 확인 요청. (interactive)|
 | -e	 |첫 번째 에러 발생 시 중지|

![](/assets/img/archive.png)

리눅스 압축 형식

|압축형태|	기본형태|	축약	|간략설명|
|:---:|:---:|:---:|:---:|
|gzip|	.tar.gz|	.tgz|	zip과 같은 압축 알고리즘을 사용하지만 더 용량이 작음.(다른 파일끼리의 중복되는 부분을 하나로 압축이 가능하기 때문)|
|xzip|	.tar.xz|	.txz|	LZMA2 압축 알고리즘을 사용하는 7-zip은 윈도우에서만 제공하는데 유닉스에 제공하기위해 사용됨 압축효율이 가장 좋음.|
|bzip|	.tar.bz2|	.tb2, .tbz, .tbz2|	용량이 클 때, gzip에 비해 압축률은 좋지만 비교적 느림|
|Z	|.tar.Z	|.tZ|	ASCII나 바이너리 파일을 의미|
|lzma|	.tar.lzma|	.tlz|	bzip2보다 더 높은 압축률 제공(최대 4GB)|
|    lzma|    .tar.lz|	-	|LZMA 알고리즘에 기초함 무결성을 확인하기 위한 CRC 체크섬이 지원됨|