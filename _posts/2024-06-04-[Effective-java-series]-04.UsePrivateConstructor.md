---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---



# 인스턴스화를 막기 위해서 private 생성자를 사용한다.

생성화를 명시하지 않으면 기본 생성자를 만든다. 따라서 이를 막으려면 `private`로 생성자를 만들어줘야 한다. 
혹은 정말로 생성자를 사용하지 못하게 하려면 `AssertionError`를 던지는 것도 방법이다. 