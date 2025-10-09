---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---

# For-Each

for가 while보다 낫지만 그래도 너무 지저분하다. for-each(enhanced for statement)을 쓰면 인덱스를 위한 변수와 이를 증감 시키는 코드를 작성하지 않아도
해당 반복자의 요소를 모두 순회할 수 있다.

단, 몇 가지 상황에서 사용하지 못할 수 있다.

1. 파괴적 필터링(destructive filtering) : 컬렉션/배열을 순회하면서 선택 원소를 제거한다면 인덱스의 변화가 생길 수 있다.
2. 변형(transforming) : 리스트/배열에 인덱스로 접근해서 요소를 수행해야 한다면 인덱스가 필요해서 사용하지 못할 수 있다. 
3. 병렬 반복 : 여러 컬렉션/배열을 병렬로 순회해야 한다면 인덱스로 조절하는게 쉬울 수도 있다.
