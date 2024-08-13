---
layout: post

categories: [MONGO]
---


# Auth(계정 관리)


기본은 계정 default에 비밀번호가 없다. -> 보안에 취약하다.
따라서 계정 생성 및 비밀번호 지정하는 것이 좋다.

추가로 계정 정보는 `db.system.users` 컬렉션에서 관리된다.

- `db.auth()` : db에 사용자 인증
- `db.createUser()` : 새 사용자 생성
- `db.updateUser()` : 사용자 업데이트
- `db.changeUserPassword()` :  사용자 비밀번호 변경
- `db.dropAllUsers()` : 모든 사용자 삭제
- `db.dropUser()` : 사용자 삭제
- `db.grantRolesToUser()` : 권한 부여
- `db.revokeRolesFromUser()` : 권한 말소
- `db.getUser()` : 사용자 조회
- `db.getUsers()` : db에 관련된 모든 사용자 반환

