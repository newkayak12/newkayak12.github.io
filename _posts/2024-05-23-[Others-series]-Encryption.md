---
layout: post
categories: [OTHERS]
---
from [Dictionary - Encrypt](https://github.com/newkayak12/Dictionary/blob/master/cs/Encryption.md)



# 암호화

## 단방향 (Hash)
### 1. 종류
- MD5 (Message-Digest algorithm 5)
- SHA-1
- SHA-2(SHA-256)
### 2. 장점
- 빠른 속도
### 3. 단점 
- RainbowTable : 동일한 메시지는 동일한 다이제스트를 갖는다. (BruteForce)

## 양방향
### 대칭키(비공개키)
#### 1. 종류 
- DES
- 3DES
- AES
- SEED
- ARIA

#### 2. 특징 
- 암/복호화에 서로 동일한 키가 상용되는 암호화 방식 (그래서 비공개)
#### 3. 장점 
- 속도가 빠름
#### 4. 단점 
- 키가 탈취되면 문제가 생김

### 비대칭키(공개키)
#### 1. 종류
- RSA
- DSA
- ECC
#### 2. 특징
- 암/복호화에 서로 다른 키가 사용된다. 
#### 3. 장점
- 키가 탈취되도 문제가 적다.
#### 4. 단점
- 느리다.
