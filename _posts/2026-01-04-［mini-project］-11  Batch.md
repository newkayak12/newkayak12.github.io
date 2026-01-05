---
layout: post
title: "[미니 프로젝트] 11 Batch"
tags:
  - MINI_PROJECT
  - BOOK
categories:
  - MINI_PROJECT
  - BOOK
---
> - [일전의 공부한 내용](./rollup-2025-01.firstHalf.html)을 실제로 구현해보면서 공부해보고자 시작한 프로젝트다.
> - [이전 글](https://newkayak12.github.io/mini_project/book/2026/01/03/mini-project-10-featureFlag.html)
> - 아직 공부 중인 개념입니다. 조금 틀려도 너른 이해 부탁드립니다!
> - 이 글은 개인적인 의견을 다룹니다.

# 다루는 내용
- spring batch를 적용하면서

---
# Spring batch를 적용하면서 

## 목차
### 1. 실행을 어떻게 할까?
### 2. 어떻게 쓸까?


---
## 1. 실행을 어떻게 할까?

- 각 매장의 한 달 스케쥴을 생성하기 위해서 매 달 초 스케쥴을 기반으로 Batch 작업을 진행할 필요가 있었다.
- Batch 작업을 Fire 할 방법은 여러 가지가 있었지만 지금 프로젝트에서 가장 적합한, 어느 정도 유연성이 있는 방법을 선택할 필요가 있었다.

###  1. Spring의 @Scheduled 어노테이션  
- 장점
	- cron, fixed delay 등 여러 방법을 선택할 수 있다.
	- Quartz보다 늦게 나왔으며 비교적 단순하게 구성되어 있다.
- 단점
	- \JVM에서 진행되며 재시작 시 스케쥴 정보가 유실된다.
	- 다중 인스턴스 환경에서 중복 위험이 있다.


### 2. Quartz Scheduler + Spring Batch  
- 장점
	- Spring Batch와 연동이 되는 환경이다.
	- 클러스터링 지원으로 다중 인스턴스 환경에서 안전하다.
	- 배치 작업 상태 관리를 영속화하여 진행할 수 있다.
- 단점
	- Quartz를 위한 메타 테이블이 추가로 필요하다.
	- 여러 복잡한 설정이 필요하다.


### 3. 외부 인프라 (Jenkins, Cron, Kubernetes CronJob)
- 장점
	- 인프라 레벨에서 스케쥴링을 관리할 수 있다.
	- 배치 전용 리소스 할당으로 성능 최적화를 할 수 있다.
	- 어느 정도 검증된 안정적인 방식
- 단점
	- 추가 인프라 설정 필요
	- 배치 애플리케이션에 대한 별도 패키징이 필요하다.


> 결과적으로 Jenkins를 선택했다. k8s CronJob 역시 고려할 선택지지만 
> 현재 k8s를 사용하지 않으므로 다음 번에 선택하기로 했다.


## 2. 어떻게 쓸까?

- Jenkins도 여러 가지 방법으로 쓴다.
	1. Jenkins로 Batch application을 실행시켜서 Job을 실행시키고 종료시킨다.
	2. 실행되고 있는 Batch application에 RestAPI를 만들고 call해서 실행시킨다.

> 결과적으로 **2를 선택했다.**  굳이 새로 켰다 끌 필요가 없다는 점, 누락되더라도  바로 확인하고 대응할 수 있다는 점, 더 나아가 이력 등을 조회할 수도 있다는 점이 긍정적인 점으로 보였다.