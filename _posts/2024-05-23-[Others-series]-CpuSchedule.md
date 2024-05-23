---
layout: post
categories: [OTHERS]
---

from [Dictionary - CPU scheduling](https://github.com/newkayak12/Dictionary/blob/master/cs/CpuSchedule.md)


# CPU 스케쥴링 알고리즘

![](/assets/img/cpuSchedule.png)

## 1. 비선점(non-preemptive)
프로세스가 스스로 CPU 소유권을 포기하는 방식. 강제로 프로세스를 중지하지 않는다. 따라서 컨텍스트 스위칭으로 인한 부하가 적다.

- FCFS(First Come, First Served) : 가장 먼저 온 것을 가장 먼저 처리하는 알고리즘 -> ready Queue에서 오래 기다리는 현상(Convoy effect)가 발생하는 단점이 있다. 
- SJF(Shortest Job First) : 실행 시간이 가장 짧은 프로세스를 먼저 실행하는 알고리즘 -> 긴 시간을 가진 프로세스가 실행되지 않는 현상(Starvation)이 일어나며, 평균 대기 시간이 가장 짧다. 
- 우선 순위 : SJF는 긴 시간 프로세스가 무한정 밀릴 수 있다. 우선 순위는 '우선 순위를 높이는 방법(aging)'을 사용해서 이를 보완했다. 

## 2. 선점(preemptive)
현대 OS 작동 방식으로 사용하고 있는 프로세스를 알고리즘에 의해 중단시키고 다른 프로세스에 CPU 소유권을 할당하는 방식 

- 라운드 로빈(Round Robin) : 각 프로세스는 동일한 할당 시간을 주고, 그 시간 안에 끝나지 않으면 다시 ready Queue의 뒤로 가는 알고리즘 
- SRF(Shortest Remaining Time First) : SJF는 중간 실행 시간이 더 짧은 작업이 들어오면 기존 작업을 수행하고 넘어가는데, SRF는 더 짧은 작업이 생기면 중간에 종료하고 더 짧은 것을 먼저 수행하는 알고리즘이다.
- 다단계 큐 : 우선순위에 따른 준비 큐를 여러 개 사용하고, 큐마다 라운드 로빈이나 FCFS 등 다른 스케쥴링 알고리즘을 적용한 것을 의미한다. 

