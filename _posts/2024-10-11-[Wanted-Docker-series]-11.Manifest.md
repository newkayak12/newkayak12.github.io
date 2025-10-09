---
layout: post
categories: [DOCKER, WANTED]
---

# Manifest
- k8s 리소스를 정의하는 템플릿 역할을 한다. 이를 통해 개발자는 어떻게 배포되고 실행되어야 하는지 지시할 수 있다.
- Pod, Deployment, Service, ConfigMap 등 다양한 리소스를 YAML 형식으로 정의하고 `kubectl apply`로 적용할 수 있다.

```yaml
apiVersion: ''#apiVersion (v1: 기본적인 리소스, apps/v1: Deployement와 같은 리소스)
kind: ''#resourceKind (Pod, Deployment, Service, ConfigMap)
metadata:
  name: ''#resourceName (리소스 고유 이름)
  annotations:
    - # (리소스에 추가적인 정보 제공)
spec:
  #detail (어떻게 동작해야 하는지를 정의)
```

## 참고) ConfigMap
### 1. 특징
1. 설정과 코드의 분리
2. Key-Value 쌍으로 구성
3. 다양한 용도로 사용
4. 리소스 경량성

### 2. 사용 이유
1. 유연한 환경 설정 관리:
   - 환경설정을 하드코딩하지 않고 ConfigMap을 통해서 전달
2. 환경에 따른 설정 분리:
   - 개발, 테스트 프로덕션 환경에서 각각 다른 설정을 적용할 때 유용
3. 애플리케이션의 유지보수성 향상
   - 코드와 설증을 분리
4. 공유 설정 관리
   - 여러 Pod나 Deployment에서 동일한 설정을 사용할 수 있다.

## ConfigMap vs. Secret
- configMap: 일반적인 설정 데이터
- secret: 민감한 데이터