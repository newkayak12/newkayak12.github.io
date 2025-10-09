---
layout: post

categories: [SPRING, BATCH]
---

## Process

### 1.Reader
- DB나 파일 같은 소스에서 데이터를 가져오는 역할
> 1. FlatFileItemReader
> 2. JdbcCursorItemReader
> 3. JpaPagingItemReader
> 4. MultiResourceItemReader
> 5. StaxEventItemReader
> 6. ItemStreamReader
### 2.Writer
- 목적지에 쓰는 역할
> 1. FlatFileItemWriter
> 2. JdbcBatchItemWriter
> 3. JpaItemWriter
> 4. CompositionItemWriter
> 5. StaxEventItemWriter
> 6. ItemStreamWriter

### 3.상호 작용
1. ChunkSize:
    - 청크 크기가 메모리에 한 번에 읽어들여야 하는 사이즈가 되므로 I/O 작업의 오버헤드를 균형있게 유지하여 성능과 직결
2. Read-Process-Write 주기:
    - 얼마나 빨리 읽히고 이후 쓰여지는지에 따라 영향을 받을 수 있다.
    - 각 속도에 따라 병목이 일어날 수도 있다.
3. Trasactional
    - 읽기-처리-쓰기는 Trasactional 하다.
    - 신뢰성, 일관성을 높힐 수는 있지만 성능에 영향을 끼친다.
4. 버퍼링
    -  일부 Writer에는 버퍼링이 있어 성능을 개선할 여지가 있다.

### 4. 실행 및 상태
