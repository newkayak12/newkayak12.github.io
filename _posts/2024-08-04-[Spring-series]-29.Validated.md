---
layout: post

categories: [SPRING]
---


# Validated

> @Valid, @Validated 어노테이션으로 validation을 하던 도중 겪은 일화


Spring에서 Controller 단에서 ArgumentResolver로 넘어올 때 JSR380(Validation)을 통해서
넘어오는 파라미터에 대해서 validation이 가능하다.


```java
@Data
public class UserDto implements JwtEncryptable {
    @NotEmpty(message = "로그아웃 시 UUID는 필수입니다.", groups = {SignOut.class})
    private String uuid;
    @NotEmpty(message = "전화번호는 필수입니다.", groups = {SignUp.class})
    private String phone;
    @NotEmpty(message = "비밀번호는 필수입니다.", groups = {SignUp.class, SignIn.class})
    private String password;
    @NotEmpty(message = "닉네임은 필수입니다.", groups = {SignUp.class})
    private String nickname;
}
```
```java
//markingInterface

public interface User {
    public interface SignUp{};
    public interface SignIn{};
    public interface SignOut{};
}
```

추가로 Spring에서 `org.springframework.validation.annotation.Validated`로 참조 구현이 되어있었다. 이 스펙은 스프링에 특화된 스펙이다.
다만 groups로 그룹별로 validation을 나눠서 할 수 있었다.

스프링 2.xx에서는 
```java
//controller

@PostMapping(value = "/sign/up")
public ResponseEntity signUp(HttpServletResponse response, @Valid @Validated(value = {User.SignUp.class}) @RequestBody UserDto user) {
    return ResponseEntity.ok(service.signUp(response, user));
}
```
와 같이 `@Valid(JSR380)`, `@Validated(Spring)`과 함께 작성해도 spring의 Validated가 작동했었다. (이렇게 썼던게 안일했던거다.)
spring6, 3.x가 되면서 병기하면 group을 못잡고, default만 작동하는 일이 벌어졌다.
```java
//controller

@PostMapping(value = "/sign/up")
public ResponseEntity signUp(HttpServletResponse response, @Validated(value = {User.SignUp.class}) @RequestBody UserDto user) {
    return ResponseEntity.ok(service.signUp(response, user));
}
```
따라서 `@Valid`를 제외한 `@Validated`만 작성하면 원래 알던대로 작동한다.

