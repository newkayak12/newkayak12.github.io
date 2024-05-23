---
layout: post
categories: [OTHERS]
---
from [Dictionary - Authentication vs. Authorization](https://github.com/newkayak12/Dictionary/blob/master/cs/AuthenticationAndAuthorization.md)


# Authentication vs. Authorization
- 인증(Authentication) : 본인이 누구인지 확인 (로그인)
- 승인(Authorization) : 특정 리소스에 권한이 있는지 확인 (등급 권한)

| |인증 (Authentication)|인가 (Authorization)|
|:-----:|:---------:|:-------:|
|기능 |자격 증명 확인 |권한 허가/거부|
|진행 방식 |비밀번호, 생체인식, 일회용 핀 또는 앱 |보안 팀에서 관리하는 설정 사용|
|사용자가 볼 수 있는가? |예 |아니오|
|사용자가 직접 변경할 수 있는가? |부분적으로 가능 |불가능|
|데이터 전송 |ID 토큰 사용 |액세스 토큰 사용|