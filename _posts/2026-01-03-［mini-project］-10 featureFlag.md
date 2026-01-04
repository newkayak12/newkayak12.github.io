---
layout: post
title: "[미니 프로젝트] 10 feature flag"
tags:
  - MINI_PROJECT
  - BOOK
categories:
  - MINI_PROJECT
  - BOOK
---
> - [일전의 공부한 내용](./rollup-2025-01.firstHalf.html)을 실제로 구현해보면서 공부해보고자 시작한 프로젝트다.
> - [이전 글](https://newkayak12.github.io/mini_project/book/2025/08/22/mini-project-09-Port-and-Adapter(Hexagonal)을-적용하면서-고민한-점.html)
> - 아직 공부 중인 개념입니다. 조금 틀려도 너른 이해 부탁드립니다!
> - 이 글은 개인적인 의견을 다룹니다.

# 다루는 내용
- feature flag 적용

---
# feature flag를 적용하면서 
  
## 목차  
### 1. 왜 feature flag를 고민했는가?
### 2. 어떻게 동작하게 할 것인가?
### 3. 반복 호출에 따른 캐싱과 실패 시 전략
### 4.  Resilience4J vs. Spring-Retry
